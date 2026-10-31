/**
 * DTO сеанса (расписания) фильма.
 * Соответствует схеме Shedule из film.yml.
 */
export class ScheduleDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

/**
 * DTO фильма.
 * Соответствует схеме Film из film.yml.
 */
export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}
