import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
      url: configService.get<string>(
        'DATABASE_URL',
        'mongodb://localhost:27017/prac',
      ),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

/**
 * Глобальный модуль конфигурации: делает провайдер 'CONFIG'
 * доступным во всех модулях приложения (в т.ч. в MongooseModule).
 * Значения переменных среды читаются через ConfigService из ConfigModule.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [configProvider],
  exports: ['CONFIG'],
})
export class AppConfigModule {}
