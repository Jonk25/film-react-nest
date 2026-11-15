import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './films.schema';
import { FilmsRepository } from './films.repository';

/**
 * Модуль хранилища: регистрирует mongoose-схему фильма
 * и предоставляет репозиторий остальным модулям.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
