const mongoose =require('mongoose')

const confessionSchema = new mongoose.Schema({
    veggieName:{type:String, required:true},
    flavor:{type:String, required:true},
    text:{type:String, required:true,maxlength:500},
    sessionId:{type:String, required:true},
    responseCount:{type:Number, default:0},
    createdAt:{type:Date, default:Date.now},
    removedFromPot: { type: Boolean, default: false }
})

module.exports = mongoose.models.Confession || mongoose.model('Confession', confessionSchema)