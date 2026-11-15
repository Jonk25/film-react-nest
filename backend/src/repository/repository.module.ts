import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FilmsRepository } from './films.repository';

/**
 * Модуль хранилища: предоставляет репозиторий фильмов остальным модулям.
 * Репозитории TypeORM (Film, Schedule) подключены через DatabaseModule.
 */
@Module({
  imports: [DatabaseModule],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
