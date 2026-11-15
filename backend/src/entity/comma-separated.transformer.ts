import { ValueTransformer } from 'typeorm';

/**
 * Трансформер для текстовых колонок со значениями через запятую.
 * В базе — строка вида '3:3,1:4,1:5' (теги фильма или занятые места сеанса),
 * в приложении — массив строк. Пустая строка трактуется как пустой массив.
 */
export class CommaSeparatedTransformer implements ValueTransformer {
  /** Из приложения в базу: string[] -> 'a,b,c' */
  to(value: string[] | null | undefined): string {
    return (value ?? []).join(',');
  }

  /** Из базы в приложение: 'a,b,c' -> string[] */
  from(value: string | null | undefined): string[] {
    return value ? value.split(',') : [];
  }
}
