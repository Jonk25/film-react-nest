import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDocument } from '../repository/films.schema';
import { CreateOrderDto, OrderResultDto, TicketDto } from './dto/order.dto';
import { ListResponse } from '../common/dto/list-response.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  /**
   * Бронирование билетов.
   * Место идентифицируется строкой `${row}:${seat}` в массиве taken сеанса.
   * Одно и то же кресло нельзя занять дважды.
   */
  async create(order: CreateOrderDto): Promise<ListResponse<OrderResultDto>> {
    if (!order.tickets || order.tickets.length === 0) {
      throw new BadRequestException('Список билетов пуст');
    }

    // Документы фильмов, затронутых заказом: filmId -> документ mongoose
    const films = new Map<string, FilmDocument>();
    // Места, забронированные в рамках этого же запроса: filmId:sessionId -> Set
    const bookedInRequest = new Map<string, Set<string>>();

    // Шаг 1. Проверяем все билеты, ничего не меняя в БД
    for (const ticket of order.tickets) {
      const film = await this.getFilm(ticket, films);
      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(
          `Сеанс ${ticket.session} у фильма ${ticket.film} не найден`,
        );
      }

      if (
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} не существует в зале ` +
            `(${session.rows} рядов × ${session.seats} мест)`,
        );
      }

      const placeKey = `${ticket.row}:${ticket.seat}`;
      const sessionKey = `${ticket.film}:${ticket.session}`;
      const booked = bookedInRequest.get(sessionKey) ?? new Set<string>();

      if (session.taken.includes(placeKey) || booked.has(placeKey)) {
        throw new BadRequestException(
          `Место ${ticket.row}:${ticket.seat} уже занято`,
        );
      }
      booked.add(placeKey);
      bookedInRequest.set(sessionKey, booked);
    }

    // Шаг 2. Все билеты валидны — отмечаем места занятыми и сохраняем
    for (const ticket of order.tickets) {
      const film = films.get(ticket.film);
      const session = film.schedule.find((s) => s.id === ticket.session);
      session.taken.push(`${ticket.row}:${ticket.seat}`);
    }
    for (const film of films.values()) {
      await this.filmsRepository.save(film);
    }

    // Шаг 3. Формируем подтверждение: те же данные + id билета
    const items: OrderResultDto[] = order.tickets.map((ticket) => ({
      id: randomUUID(),
      film: ticket.film,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
    }));
    return { total: items.length, items };
  }

  /** Загружает документ фильма (один раз на заказ) и кэширует его в Map */
  private async getFilm(
    ticket: TicketDto,
    films: Map<string, FilmDocument>,
  ): Promise<FilmDocument> {
    let film = films.get(ticket.film);
    if (!film) {
      film = await this.filmsRepository.findFilmDocument(ticket.film);
      if (!film) {
        throw new NotFoundException(`Фильм с id ${ticket.film} не найден`);
      }
      films.set(ticket.film, film);
    }
    return film;
  }
}
