import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { ListResponse } from '../common/dto/list-response.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** POST /api/afisha/order — бронирование билетов */
  @Post('/')
  create(@Body() order: CreateOrderDto): Promise<ListResponse<OrderResultDto>> {
    return this.orderService.create(order);
  }
}
