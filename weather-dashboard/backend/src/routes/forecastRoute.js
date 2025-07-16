const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController')
const apicache = require('apicache');

let cache = apicache.middleware;


router.get('/forecast', cache('5 minutes'), forecastController.get_forecast)

module.exports = router;