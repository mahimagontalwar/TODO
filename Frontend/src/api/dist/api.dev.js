"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var api = _axios["default"].create({
  baseURL: 'http://localhost:5000/api',
  // Backend API base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(function (config) {
  var token = localStorage.getItem('token');
  if (token) config.headers.Authorization = "Bearer ".concat(token);
  console.log(config);
  return config;
});
var _default = api;
exports["default"] = _default;