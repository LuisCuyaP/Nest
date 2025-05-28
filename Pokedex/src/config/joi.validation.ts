import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3005),
    //NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    DEFAULT_LIMIT: Joi.number().default(6),
})
;