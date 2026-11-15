import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * DTO одного билета в заказе.
 * Соответствует схеме Ticket из film.yml.
 */
export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsDateString()
  daytime: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

/**
 * DTO запроса на бронирование: контакты и список билетов.
 */
export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

/**
 * DTO подтверждённого билета: те же данные + идентификатор.
 */
export class OrderResultDto extends TicketDto {
  @IsUUID()
  id: string;
}
