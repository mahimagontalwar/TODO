"use strict";

var jwt = require('jsonwebtoken');

var authenticate = function authenticate(req, res, next) {
  //console.log(req.headers);
  var token = req.headers['authorization']; //console.log(token);

  if (token) {
    token = token.split(' ')[1];
  } //console.log(token);


  if (!token) return res.status(401).json({
    message: 'Access Denied'
  });

  try {
    var verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({
      message: 'Invalid Token'
    });
  }
};

module.exports = authenticate;