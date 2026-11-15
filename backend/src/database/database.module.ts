import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from '../app.config.provider';
import { Film } from '../entity/film.entity';
import { Schedule } from '../entity/schedule.entity';

/**
 * Модуль слоя данных: настраивает подключение к PostgreSQL через TypeORM
 * (параметры берутся из переменных окружения через провайдер 'CONFIG')
 * и регистрирует репозитории сущностей Film и Schedule.
 * Репозитории реэкспортируются, чтобы их могли использовать другие модули.
 *
 * Хост, порт и имя базы разбираются из DATABASE_URL, а логин и пароль
 * подставляются из DATABASE_USERNAME / DATABASE_PASSWORD — поэтому строка
 * подключения может не содержать учётных данных.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: ['CONFIG'],
      useFactory: (config: AppConfig) => {
        const url = new URL(config.database.url);
        return {
          // Драйвер подключения берём из DATABASE_DRIVER (значение postgres)
          type: config.database.driver as 'postgres',
          host: url.hostname,
          port: Number(url.port) || 5432,
          database: url.pathname.replace(/^\//, ''),
          username: config.database.username,
          password: config.database.password,
          entities: [Film, Schedule],
          // Схема создаётся SQL-скриптами (backend/test/prac.init.sql),
          // автосинхронизация не нужна
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
