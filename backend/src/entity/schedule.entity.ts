import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './film.entity';
import { CommaSeparatedTransformer } from './comma-separated.transformer';

/**
 * Сущность «Сеанс» — таблица schedules.
 * Хранит расписание показа и занятые места.
 * Занятые места хранятся в колонке taken типа text строкой через запятую
 * в формате `${row}:${seat}` (например '3:3,1:4'), в приложении — массивом.
 * Связь многие-к-одному с фильмом: внешний ключ "filmId" -> films.id.
 */
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Дата и время показа в формате ISO 8601 (хранится строкой) */
  @Column()
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('double precision')
  price: number;

  /** Занятые места: ['3:3', '1:4', ...] */
  @Column('text', { transformer: new CommaSeparatedTransformer() })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
