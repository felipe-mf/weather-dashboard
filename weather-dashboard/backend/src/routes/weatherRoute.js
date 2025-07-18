const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController')
const apicache = require('apicache');

let cache = apicache.middleware('5 minutes', (req, res) => {
    return res.statusCode === 200;
});

router.get('/weather', cache, weatherController.get_weather)

module.exports = router;
