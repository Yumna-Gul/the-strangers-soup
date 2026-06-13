const {checkKindness}= require('../services/foundryService')
const express = require('express')
const router= express.Router()
const ResponseModel = require('../models/Response')
const Confession = require('../models/Confession')

console.log('Response import:', ResponseModel) // Debugging line to check the import
console.log('Confession import:', Confession) // Debugging line to check the import

router.post('/', async (req, res) => {

    try{
    const {confessionId,sessionId,text} = req.body
    console.log('Response body:', { confessionId, sessionId, text })
     
    const status = await checkKindness(text)

  const kindnessCheck = await checkKindness(text)

if(kindnessCheck.tone === "unkind"){
  return res.status(200).json({
    status: "unkind", 
    message: "This space is for healing. Your words could hurt someone who's already struggling.",
    suggestion: kindnessCheck.rewrite
  })
}

    const newResponse = new ResponseModel({confessionId,sessionId,text})
    await newResponse.save()
    const confession = await Confession.findByIdAndUpdate(confessionId, { $inc: { responseCount: 1 } }, {new: true})

    if (confession.responseCount >= 3) {
        await Confession.findByIdAndUpdate(confessionId, { 
        removedFromPot: true 
        })
       return res.status(200).json({ melted: true })
}
    res.status(201).json(newResponse)
    }
   catch(error){
    console.error('Response error details:', error.message)
    console.error('Full error:', error)
    res.status(500).json({error:error.message})
}
})

router.get('/my/:sessionId', async (req, res) => {
  try {
    // find ALL confessions by this user that have at least 1 response
    const confessions = await Confession.find({
      sessionId: req.params.sessionId,
      responseCount: { $gt: 0 }
    }).sort({ createdAt: 1 })

    // for each confession, fetch its responses
    const results = await Promise.all(
      confessions.map(async (confession) => {
        const responses = await ResponseModel.find({ 
          confessionId: confession._id 
        })
        return { confession, responses }
      })
    )

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// DELETE /api/responses/my/:sessionId — writer has read, now wipe everything
router.delete('/my/:confessionId', async (req, res) => {
  try {
    const confessionId = req.params.confessionId

    const confession = await Confession.findOne({
      _id: confessionId,
      removedFromPot: true
    })

    if (!confession) {
      return res.status(400).json({ message: 'Not ready to melt' })
    }

    await ResponseModel.deleteMany({ confessionId })
    await Confession.findByIdAndDelete(confessionId)

    res.json({ message: 'Melted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
module.exports = router
