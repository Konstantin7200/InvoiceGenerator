import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidJobs(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidJobs',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
          ) {
            return false;
          }
          const values = Object.values(value as Record<string, unknown>);
          return values.every(
            (v) => typeof v === 'number' && !isNaN(v) && v >= 0,
          );
        },
        defaultMessage() {
          return 'each value in jobs must be a number >= 0';
        },
      },
    });
  };
}
