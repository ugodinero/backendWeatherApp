require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const frontendPath = path.join(__dirname, '..', 'frontend')
app.use(express.json())
app.use(express.static(frontendPath))

const API_KEY = process.env.OPEN_WEATHER_API_KEY

const PORT = process.env.PORT || 5000

if (!API_KEY) {
    console.error(`please Provide API KEY`)
    process.exit(1)
}

app.get('/api/weather', async (req, res) => {

    const city = req.query.city
    if (!city) {
        return res.json({ message: 'provide a city' })
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        const weatherURl = await fetch(url)
        const data = await weatherURl.json()

        console.log(data)

        if (weatherURl.status === 404) {
            return res.status(404).json({ message: `${city} not found` })
        }
        if (!weatherURl.ok) {
            return res.status(502).json({ error: `Server is down` })
        }
        res.json(data)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'can\'t fetch weather' })
    }

})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})