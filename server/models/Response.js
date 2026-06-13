const mongoose = require('mongoose')

const responseSchema = new mongoose.Schema({
  confessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Confession', 
    required: true 
  },
  sessionId:  { type: String, required: true },
  text:       { type: String, required: true, maxlength: 500 },
  createdAt:  { type: Date, default: Date.now }
})

module.exports = mongoose.models.Response || mongoose.model('Response', responseSchema)