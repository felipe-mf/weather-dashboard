const express = require('express');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const PORT = process.env.PORT || 5000;

const app = express()
app.use(cors())

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: '10 minutes'
    },
    handler: (req, res) => {
        console.log('Rate limit exceeded')
        res.status(429).json({
            error: 'Too many requests, please try again later.',
            retryAfter: '10 minutes',
            type: 'RATE_LIMIT_EXCEEDED'
        });
    }
})

app.use(limiter)

app.use('/api', require('./routes/weatherRoute'))
app.use('/api', require('./routes/forecastRoute'))


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))