const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController')
const apicache = require('apicache');

let cache = apicache.middleware;


router.get('/weather', cache('5 minutes'), weatherController.get_weather)

module.exports = router;
