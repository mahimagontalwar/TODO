"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var fs = require('fs'); // Import route


router.post('/import', function (req, res) {
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      message: 'No file uploaded'
    });
  }

  var file = req.files.file;
  var filePath = path.join(__dirname, '..', 'uploads', file.name);
  file.mv(filePath, function (err) {
    if (err) return res.status(500).json({
      message: 'Error saving file'
    });
    return res.status(200).json({
      message: 'File imported successfully'
    });
  });
}); // Export route

router.get('/export', function (req, res) {
  var todos = [{
    id: 1,
    task: 'Sample Task 1'
  }, {
    id: 2,
    task: 'Sample Task 2'
  }];
  res.json(todos);
});
module.exports = router;