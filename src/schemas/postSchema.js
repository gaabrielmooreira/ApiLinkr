import joi from 'joi';

export const postSchema = joi.object({
    link: joi.string(),
    description: joi.string().uri().required()
})