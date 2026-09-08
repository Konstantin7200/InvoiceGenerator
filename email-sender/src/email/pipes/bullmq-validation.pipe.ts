import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Type } from '@nestjs/common';

export class BullMqValidationPipe {
  async validate<T extends object>(
    data: object,
    dtoClass: Type<T>,
  ): Promise<T> {
    const instance = plainToInstance(dtoClass, data);
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints || {})).flat(),
      );
    }

    return instance;
  }
}
