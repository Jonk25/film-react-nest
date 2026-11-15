import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CommaSeparatedTransformer } from './comma-separated.transformer';

/**
 * Сущность «Фильм» — таблица films.
 * Связь один-ко-многим с сеансами (Schedule): один фильм — много сеансов.
 * Теги хранятся в колонке tags типа text строкой через запятую,
 * в приложении представлены массивом строк (см. трансформер).
 */
@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision')
  rating: number;

  @Column()
  director: string;

  @Column('text', { transformer: new CommaSeparatedTransformer() })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
