import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { ListResponse } from '../common/dto/list-response.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  /** Список фильмов */
  async findAll(): Promise<ListResponse<FilmDto>> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  /** Расписание конкретного фильма */
  async findSchedule(id: string): Promise<ListResponse<ScheduleDto>> {
    const items = await this.filmsRepository.findScheduleByFilmId(id);
    if (items === null) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }
    return { total: items.length, items };
  }
}
