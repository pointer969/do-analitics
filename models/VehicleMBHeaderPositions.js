var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_GPSSchema = new Schema({
    id: String,
    inoid: String,
    FBID: String,
    VehicleID: String,
    DriverID: String,
    ServerTimestamp: String,
    VehicleTimestamp: String,
    Long : Number,
    Lat: Number,
    PosText : String,
    Course : String,
    Speed : String,
    KM : String,
    GPSStatus: String,
    timestamp: String  
},
{
    timestamps:true
})

DO_CAR_GPSSchema.plugin(mongooseLogs, {
  schemaName: "vehicleMBHeaderPosition",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('do_car_gps', DO_CAR_GPSSchema)