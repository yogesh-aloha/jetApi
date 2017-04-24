var express = require('express');
var router = express.Router();

/**
 * @api {get} /index Get Index Page
 * @apiGroup Index
 * @apiSuccess {String} Index Page title
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [
          Title : Express
      ]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
