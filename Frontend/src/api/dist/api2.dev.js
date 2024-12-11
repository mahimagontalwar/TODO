"use strict";

var handleImport = function handleImport() {
  var formData, response;
  return regeneratorRuntime.async(function handleImport$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", alert('Please upload a file first!'));

        case 2:
          formData = new FormData();
          formData.append('file', file);
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(axios.post('/api/todos/import', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }));

        case 7:
          response = _context.sent;
          alert(response.data.message);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          console.error('Error importing todos:', _context.t0.response.data);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
};