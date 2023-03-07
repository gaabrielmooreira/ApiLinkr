import joi from "joi";

export const loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "br"] } }).required(),
    password: joi.string().required()
  });