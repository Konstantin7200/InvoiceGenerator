import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Type } from '@nestjs/common';
import { UnrecoverableError } from 'bullmq';

export class BullMqValidationPipe {
  async validate<T extends object>(
    data: object,
    dtoClass: Type<T>,
  ): Promise<T> {
    const instance = plainToInstance(dtoClass, data);
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new UnrecoverableError(
        errors
          .map((e) => Object.values(e.constraints || {}))
          .flat()
          .join(' '),
      );
    }

    return instance;
  }
}
