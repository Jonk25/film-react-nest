import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument, Schedule } from './films.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

/**
 * Репозиторий фильмов в MongoDB.
 * Инкапсулирует работу с mongoose и конвертацию сущностей в DTO.
 */
@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  /** Конвертер: mongoose-документ сеанса → ScheduleDto */
  private toScheduleDto(schedule: Schedule): ScheduleDto {
    return {
      id: schedule.id,
      daytime:
        schedule.daytime instanceof Date
          ? schedule.daytime.toISOString()
          : String(schedule.daytime),
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: [...(schedule.taken ?? [])],
    };
  }

  /** Конвертер: mongoose-документ фильма → FilmDto */
  private toFilmDto(film: FilmDocument): FilmDto {
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
    };
  }

  /** Все фильмы (без расписания) */
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.toFilmDto(film));
  }

  /** Расписание одного фильма по его id */
  async findScheduleByFilmId(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) return null;
    return film.schedule.map((session) => this.toScheduleDto(session));
  }

  /**
   * Сырой документ фильма — нужен сервису заказов
   * для проверки и обновления занятых мест.
   */
  async findFilmDocument(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  /** Сохранить изменения документа (например, обновлённый список занятых мест) */
  async save(film: FilmDocument): Promise<void> {
    await film.save();
  }
}
