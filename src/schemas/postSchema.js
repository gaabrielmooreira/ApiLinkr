import joi from 'joi';

export const postSchema = joi.object({
    description: joi.string(),
    link: joi.string().uri().required()
})