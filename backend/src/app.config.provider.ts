import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),
      url: configService.get<string>(
        'DATABASE_URL',
        'postgres://localhost:5432/films',
      ),
      username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}

/**
 * Глобальный модуль конфигурации: делает провайдер 'CONFIG'
 * доступным во всех модулях приложения (в т.ч. в TypeOrmModule).
 * Значения переменных среды читаются через ConfigService из ConfigModule.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [configProvider],
  exports: ['CONFIG'],
})
export class AppConfigModule {}
