import type { ValidationError } from 'class-validator';
import type { ErrorDetail } from '../exceptions/error-detail.js';

export function mapValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ErrorDetail[] {
  return errors.flatMap((error) => {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const ownDetails = Object.values(error.constraints ?? {}).map(
      (message) => ({ field, message }),
    );
    const childDetails = mapValidationErrors(error.children ?? [], field);
    return [...ownDetails, ...childDetails];
  });
}
