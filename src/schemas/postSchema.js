import joi from 'joi';

export const postSchema = joi.object({
    description: joi.string().allow(""),
    link: joi.string().uri().required()
})