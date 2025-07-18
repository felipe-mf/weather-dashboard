const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController')
const apicache = require('apicache');

let cache = apicache.middleware('5 minutes', (req, res) => {
    return res.statusCode === 200;
});


router.get('/forecast', cache, forecastController.get_forecast)

module.exports = router;