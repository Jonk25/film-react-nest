/**
 * DTO одного билета в заказе.
 * Соответствует схеме Ticket из film.yml.
 */
export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

/**
 * DTO запроса на бронирование: контакты и список билетов.
 */
export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

/**
 * DTO подтверждённого билета: те же данные + идентификатор.
 */
export class OrderResultDto extends TicketDto {
  id: string;
}
