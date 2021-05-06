var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')
const { stringify } = require('uuid')

var DO_SCORESchema = new Schema({
    vehicleId: String,
    overall: Number,    
    slot: String,
    indice: String,
    refdate: String,
    value: Number
},
{
    timestamps:true
})

DO_SCORESchema.plugin(mongooseLogs, {
  schemaName: "score",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('do_score_all', DO_SCORESchema)