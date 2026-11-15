import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Поддокумент расписания: сеанс фильма.
 * Занятые места хранятся строками вида `${row}:${seat}`.
 */
@Schema({ _id: false })
export class Schedule {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: Date;

  @Prop({ required: true })
  hall: number;

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

/**
 * Документ фильма. Расписание хранится в поддокументе schedule.
 */
@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ type: [ScheduleSchema], default: [] })
  schedule: Schedule[];
}

export type FilmDocument = HydratedDocument<Film>;
export const FilmSchema = SchemaFactory.createForClass(Film);
