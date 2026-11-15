import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../entity/film.entity';
import { Schedule } from '../entity/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

/**
 * Репозиторий фильмов в PostgreSQL (TypeORM).
 * Инкапсулирует работу с БД и конвертацию сущностей в DTO.
 */
@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  /** Конвертер: сущность сеанса → ScheduleDto */
  private toScheduleDto(schedule: Schedule): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: [...(schedule.taken ?? [])],
    };
  }

  /** Конвертер: сущность фильма → FilmDto */
  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: [...(film.tags ?? [])],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: (film.schedule ?? []).map((session) =>
        this.toScheduleDto(session),
      ),
    };
  }

  /** Все фильмы вместе с расписанием сеансов */
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      relations: { schedule: true },
    });
    return films.map((film) => this.toFilmDto(film));
  }

  /** Расписание одного фильма по его id */
  async findScheduleByFilmId(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.findById(id);
    if (!film) return null;
    return film.schedule.map((session) => this.toScheduleDto(session));
  }

  /**
   * Сущность фильма вместе с расписанием — нужна сервису заказов
   * для проверки и обновления занятых мест.
   */
  async findById(id: string): Promise<Film | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
  }

  /**
   * Сохранить изменения сеансов фильма
   * (например, обновлённый список занятых мест).
   */
  async save(film: Film): Promise<void> {
    await this.scheduleRepository.save(film.schedule);
  }
}
