require('dotenv').config()
const axios = require('axios')
const express= require('express')
const cors= require('cors')
const connectDB= require('./config/db')

const app=express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/confessions', require('./routes/confessions'))
app.use('/api/responses', require('./routes/responses'))

app.get('/api/country', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
    const response = await axios.get(`https://ipapi.co/${ip}/json/`)
    res.json({ country: response.data.country_code || 'US' })
  } catch (err) {
    res.json({ country: 'US' })
  }
})
app.get('/', (req,res)=>{
    res.json({message:"SOUP is Hot"})
})

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})