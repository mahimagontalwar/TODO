const Joi = require('joi');

const validateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().max(10),
    description: Joi.string().max(20),
    status: Joi.string().max(10).required(),
    user:Joi.string().hex().length(24).required(),
    projectId: Joi.string().hex().length(24).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = { validateTask };
