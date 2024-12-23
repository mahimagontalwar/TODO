"use strict";

var Joi = require('joi');

var validateTask = function validateTask(req, res, next) {
  var schema = Joi.object({
    title: Joi.string().max(10),
    description: Joi.string().max(20),
    status: Joi.string().max(10).required(),
    user: Joi.string().hex().length(24).required(),
    projectId: Joi.string().hex().length(24).required()
  });

  var _schema$validate = schema.validate(req.body),
      error = _schema$validate.error;

  if (error) return res.status(400).json({
    error: error.details[0].message
  });
  next();
};

module.exports = {
  validateTask: validateTask
};