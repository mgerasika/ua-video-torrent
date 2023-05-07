import Joi from 'joi';

export function validateSchema<T>(schema: Joi.AnySchema<T>, body: T): [T | undefined, Joi.ValidationError | undefined] {
    const { value, error } = schema.validate(body);

    return [value, error];
}
