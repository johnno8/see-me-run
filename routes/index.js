const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`req.user: ${JSON.stringify(req.user, null, 2)}`)
  res.render('index', { title: 'Express', user: req.user.displayName })
});

module.exports = router
