var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

// ZONAS DE RISCO
var BIORISKSchema = new Schema({
    mapid: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    }, 
    country: String,
    state: String,
    city: String,   
    district:  {
        type: String,
        index: true
    },
    zone:  {
        type: String,
        index: true
    },
    risk:  {
        type: String,
        index: false
    },    
    points: Number,
    active:Boolean
},
{
    timestamps:true
}
)

BIORISKSchema.plugin(mongooseLogs, {
    schemaName: "biorisk",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
  })
  

module.exports =  mongoose.model('do_bio_m00', BIORISKSchema)