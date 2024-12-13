"use strict";

var express = require('express');

var _require = require('../controllers/orderController'),
    createOrder = _require.createOrder;

var router = express.Router();
router.post('/', createOrder);
module.exports = router;