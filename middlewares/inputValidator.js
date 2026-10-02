const Joi = require("joi");
const asyncWrapper = require("./asyncWrapper");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(100).required(),
  profile: Joi.string().optional(),
});

const validateInput = asyncWrapper(async (req, res, next) => {
  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  if (!req.file) {
    req.flash("error_msg", "profile is required");
    return res.redirect("auth/sign-up");
  }
  next();
});

module.exports = validateInput;
