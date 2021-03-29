var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_T00Schema = new Schema({
    EntityId: String,
    vehicleID: String,
    Timestamp: String,
    dataID : String,
    FaultyBulbs: String,
    CurrentMaxBrakeWear: String,
    CoolingWaterLevelWarningCount: String,
    AirFilterCondition: String,
    OilShortFall: String,
    OilShortFallStatus: String,
    AdditionalInformation: String,
    WashingWaterReserve: String,
    OilPressure: String,
    CurrentFuelConsumption: String,
    PowerSteeringOilLevel: String,
    OperatingTime: String,
    Mileage: String,
    AdBlueLevel: String,
    AdBlueSeverity: String,
    DieselParticulateFilterState: String,
    DieselParticulateFilterZone: String
},
{
    timestamps:true
})

DO_CAR_T00Schema.plugin(mongooseLogs, {
  schemaName: "vehicleMBMaintenceData",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('do_car_t00', DO_CAR_t00Schema)