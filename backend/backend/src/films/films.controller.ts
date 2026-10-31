import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { ListResponse } from '../common/dto/list-response.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  /** GET /api/afisha/films/ — список фильмов */
  @Get('/')
  findAll(): Promise<ListResponse<FilmDto>> {
    return this.filmsService.findAll();
  }

  /** GET /api/afisha/films/:id/schedule — сеансы фильма */
  @Get(':id/schedule')
  findSchedule(@Param('id') id: string): Promise<ListResponse<ScheduleDto>> {
    return this.filmsService.findSchedule(id);
  }
}
