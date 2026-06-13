const { analyzeVent, getHelpline } = require('../services/foundryService')
const express = require('express')
const router = express.Router()
const Confession = require('../models/Confession')

router.post('/', async (req, res) => {
    try{
    const {veggieName,flavor,text,sessionId,country} = req.body

    const analysis = await analyzeVent(text)
    const { status, copingSuggestion } = analysis

    if (status === "dangerous") {
      return res.status(200).json({ 
        status: "dangerous", 
        message: "This space is not enough for what you are carrying. Please reach out for real help.",
        helpline: getHelpline(country)
      })
    }

    const newConfession = new Confession({veggieName,flavor,text,sessionId})
    await newConfession.save()
    
    if(status === 'disturbing'){
      return res.status(201).json({ 
        status: "disturbing", 
        message: copingSuggestion || "We sense you're going through a tough time. You're not alone.",
        confession: newConfession,
        helpline: getHelpline(country)
      })
    }

    res.status(201).json({ status: "safe", confession: newConfession })
  }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

// GET /api/confessions/mine/:sessionId
router.get('/mine/:sessionId', async (req, res) => {
  try {
    const confession = await Confession.findOne({
      sessionId: req.params.sessionId,
    })
    res.json(confession)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/random', async (req, res) => {
    try {
        const { sessionId } = req.query
        
        const count = await Confession.countDocuments({ 
            removedFromPot: false,
            sessionId: { $ne: sessionId } 
        })
        
        if (count === 0) {
            return res.status(404).json({ message: "pot is empty" })
        }
        
        const randomIndex = Math.floor(Math.random() * count)
        
        const confession = await Confession.findOne({ 
            removedFromPot: false, 
            sessionId: { $ne: sessionId } 
        }).skip(randomIndex)
        
        res.json(confession)
        
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/all', async (req, res) => {
    const all = await Confession.find({})
    res.json(all)
})

module.exports = router