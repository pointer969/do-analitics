var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_T01Schema = new Schema({
    EntityId: String,
    ID : String,
    vehicleID: String,
    Timestamp: String,    
    FirstFrontRight: String,
    FirstFrontLeft: String,
    SecondFrontLeft: String,
    SecondFrontRight: String,
    FirstRearLeft: String,
    FirstRearRight: String,
    SecondRearLeft: String,
    SecondRearRight: String
},
{
    timestamps:true
})

DO_CAR_T01Schema.plugin(mongooseLogs, {
  schemaName: "vehicleMBBreakWear",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('do_car_t01', DO_CAR_t00Schema)