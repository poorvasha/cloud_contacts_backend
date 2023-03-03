const Joi = require("joi");

const registerValidation = (validationData) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(validationData);
};

const loginValidation = (validationData) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(validationData);
};

module.exports = {
  registerValidation: registerValidation,
  loginValidation: loginValidation,
};
