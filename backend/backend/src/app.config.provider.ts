import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: {
      driver: process.env.DATABASE_DRIVER || 'mongodb',
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/prac',
    },
  },
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
 */
@Global()
@Module({
  providers: [configProvider],
  exports: ['CONFIG'],
})
export class AppConfigModule {}
