const url = require('url')
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;


exports.get_forecast = async (req, res) => {
    
    const x = url.parse(req.url, true).query;
    console.log('----forecast----');
    console.log(x);

    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query,
            [API_KEY_NAME]: API_KEY_VALUE,
        })

        const apiRes = await axios.get(`${API_BASE_URL}forecast?${params}`)
        const data = apiRes.data

        console.log(`REQUEST FORECAST: ${API_BASE_URL}forecast?${params}`)

        res.status(200).json(data)
    } catch (error) {
        console.error('Error fetching forecast:', error);
        if (error.response) {
            const status = error.response.status
            const data = error.response.data
            
            switch (status) {
                case 404:
                    res.status(404).json({ 
                        error: 'City not found',
                        type: 'CITY_NOT_FOUND' 
                    });
                    break
                case 401:
                    res.status(401).json({ 
                        error: 'API authentication failed',
                        type: 'AUTH_ERROR' 
                    });
                    break
                case 429:
                    res.status(429).json({ 
                        error: 'External API rate limit exceeded',
                        type: 'EXTERNAL_RATE_LIMIT' 
                    });
                    break
                default:
                    res.status(status).json({ 
                        error: data.message || 'Failed to fetch weather data',
                        type: 'EXTERNAL_API_ERROR' 
                    });
            }
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch weather data',
                type: 'NETWORK_ERROR' 
            });
        }
    }
   
}