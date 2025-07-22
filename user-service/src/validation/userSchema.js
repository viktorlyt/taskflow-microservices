import Joi from "joi";

export const registrationSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "gov"] },
    })
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),

  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.pattern.base": "First name can only contain letters and spaces",
      "any.required": "First name is required",
    }),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.pattern.base": "Last name can only contain letters and spaces",
      "any.required": "Last name is required",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
