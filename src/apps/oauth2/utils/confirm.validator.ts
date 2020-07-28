import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({name: 'confirm'})
export class ConfirmValidator implements ValidatorConstraintInterface {

  getFieldToMatch(args: ValidationArguments) {
    const thisProp = args.property;
    const name = args.constraints[0] || `${thisProp}Confirm`;
    const check = args.object[name];
    return {name, check};
  }

  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const { check } = this.getFieldToMatch(validationArguments);

    return value === check;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { name } = this.getFieldToMatch(validationArguments);
    return `${validationArguments.property} and ${name} do not match`;
  }
}

export function Confirm(property?: string, validationOptions?: ValidationOptions) {
  return function(object: object, propertyName: string) { // tslint:disable-line only-arrow-functions
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ConfirmValidator,
    });
  };
}
