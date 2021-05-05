// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var DriveBehavior   = require('../models/DriveBehavior')
var Device          = require('../models/Device')
var Customer        = require('../models/Customer')
var User            = require('../models/User')
var cars = require("../models/VehicleMB")
var vehicle            = require("../models/Vehicle")
var carMaintenance = require('../models/VehicleMBPrognosis')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')
var Carvars         = require('../models/Calcvar')
var vehiclePosition        = require('../models/VehicleMBHeaderPositions')
var moment          = require("moment");
var unid            = require("uuid/v4");
var drivebehaviorController = {}

 drivebehaviorController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
  
    
  User
    .findOne({email:req.user.email}).exec(function(err, user){  
      cars
      .find({})
      .exec(function(err, carss){    
                Carvars.find({active:true}).exec(function(error, idxvars){ 
                  console.log('Carros:' +  carss);                   
                        res.render('drivebehavior/index',
                        { title: 'DriveOn Safe Score | Overall Score', 
                            veiculos: carss,
                            titles: idxvars,
                            user_info: req.user,
                            baseuri: baseurl
                        }
                        )                    
                    }) 
      })
    })
    
  }

  drivebehaviorController.platedetail = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.params.id;
    var drun = req.params.ddate;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    User
      .findOne({email:req.user.email}).exec(function(err, user){  
        vehicle
          .find({ plate: _id })
          .populate({
            path:'customer'
          })
        .exec(function(err, carss){    

          cars
            .find({ CHASSIS: carss[0].vin })
            .exec(function (err, vehicleInfo) {
              var carId = vehicleInfo[0].inoid;              
              mongoose.connection.db.collection('do_sco_bha', function (err, collection) {
                
                collection.distinct('Date', { vehicleID: carId }, function (err, daysLine) {
                  res.render('drivebehavior/index',
                    {
                      title: 'DriveOn Safe Score | Overall Score',
                      veiculos: carss,
                      timeline: daysLine,
                      user_info: req.user,
                      dSet: drun,
                      baseuri: baseurl
                    })
                })
              })
          })
        })
      })
  }

  drivebehaviorController.timeline = function(req, res){
    position
    .find()
    .exec(function (err, dias) {
      //  console.log("dias: %s", dias)
      if (err) {
        console.log("Error:", err);
      }else {
        var arrayMessage = []
        var olddia="";
         for(var i = 0; i < dias.length; i++) {
            var dia = dias[i].Header.Position.timestamp.substring(0, 10);
            if (olddia != dia){
              var message0 =  { "tDay": dia }
              var iid =  unid();
              var retorno = {  
                  "id": iid,
                  "title": "Dias",                     
                  "content": dia +  
                      ' <span style="color:#4682B4;">Trechos</span>',
                  "start": moment(dia,"YYYY-MM-DD").format("DD-MM-YYYY"),
                  "type": "box"
              };   
              arrayMessage.push(retorno);
            }
            olddia = dia;            
         }
      } 
      res.json(arrayMessage)  
    })
 }
  
  drivebehaviorController.scorehistory =  function(req, res) { 
    
       // Message.find({'dongleCode':dongleCode,'eventcode':{'$ne':'0220'}}).sort({$natural :1}).limit(5).exec(function (err, message) {
    
      // console.log("Message: %s", message)
      // if (err) {
      //   console.log("Error:", err);
      // }else {
        var arrayMessage = []
  
      //   for(var i = 0; i < message.length; i++) {
  
      //     var id             = message[i]._id
      //     var gpsData        = message[i].gpsData
      //     var time           = message[i].time
      //     var dateReceived   = message[i].dateReceived
      //     var eventcode      = message[i].eventcode
      //     var dongleCode     = message[i].dongleCode
  
          var message0 =  { "ScoreDate": "2018-09-11", "ScoreValue": 9.8 }
          arrayMessage.push(message0);

          message0 =  { "ScoreDate": "2018-09-12", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
         
          message0 =  { "ScoreDate": "2018-09-13", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-14", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-15", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-16", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-17", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-18", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-19", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-20", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-21", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-22", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-23", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-24", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-25", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-26", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-27", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-28", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-29", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-30", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
         
        // }        
  
        res.json({data: arrayMessage})
    //   }
    // })
  }

  drivebehaviorController.MaintenanceScorePerDay =  function(req, res) { 

    var scoreDate = req.params.id
    var payload = req.body
    
    
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
  
        
  User
    .findOne({email:req.user.email}).exec(function(err, user){  
      cars
      .find({})
      .exec(function(err, carss){    
            Carvars.find({active:true}).exec(function(error, idxvars){ 
              
                  console.log('Carros:' +  carss);                   
                        res.render('drivebehavior/index',
                        { title: 'DriveOn Integrator | Score', 
                            veiculos: carss,
                            titles: idxvars,
                            user_info: req.user,
                            baseuri: baseurl
                        }
                        )                    
                    }) 
      })
    })
    
  }

drivebehaviorController.OverAllScore = function (req, res) {
    
    mongoose.connection.db.collection('do_sco_bha', function (err, collection) {
      collection.find({ vehicleID: carId }).exec((overllScore) => {
        if (overllScore) {
                 
        } else {
          res.JSON({score: 0.0})
        }
      })
    })
  
  }

drivebehaviorController.slot3RoadDurationScore = function (req, res) {
  var runDate = req.params.setDate;
  var _id = req.params.plateid;
      vehicle
        .find({ plate: _id })
        .populate({
          path: 'customer'
        })
        .exec(function (err, carss) {

          cars
            .find({ CHASSIS: carss[0].vin })
            .exec(function (err, vehicleInfo) {
              var carId = vehicleInfo[0].inoid;
              var dtimestamp = moment(runDate).format("DD/MM/YYYY").toString();
              vehiclePosition.find({ VehicleID: carId, timestamp: { '$regex': dtimestamp, '$options': 'i' } },{ KM : 1}, function (err, carPosition) {
                if (!err) {
                    if (carPosition) {
                      var KMRoad = [];
                      for (var i = 0; i< carPosition.length; i++){
                        if (carPosition[i])
                          KMRoad.push(carPosition[i].KM);
                      }
                      var KmEnd  = Number.NEGATIVE_INFINITY,
                          kmIni = Infinity;

                      KMRoad.forEach(function(item){
                        if (Number(item) > KmEnd) KmEnd = item;
                        if (Number(item) < kmIni) kmIni = item;
                      });
                      var KmRodados = KmEnd - kmIni;
                      res.json({ score: 10, valorBase: KmRodados })
                    } else {
                      res.json({ score: 0 })
                    }
                } else {
                  console.log('Error:' + err)
                }
               
              })
            })
        })
   
}

drivebehaviorController.slot3RoadLongScore = function (req, res) {
  var runDate = req.params.setDate;
  var _id = req.params.plateid;
      vehicle
        .find({ plate: _id })
        .populate({
          path: 'customer'
        })
        .exec(function (err, carss) {

          cars
            .find({ CHASSIS: carss[0].vin })
            .exec(function (err, vehicleInfo) {
              var carId = vehicleInfo[0].inoid;
              var dtimestamp = moment(runDate).format("DD/MM/YYYY").toString();
              vehiclePosition.find({ VehicleID: carId, timestamp: { '$regex': dtimestamp, '$options': 'i' } },{ timestamp : 1}, function (err, carPosition) {
                if (!err) {
                    if (carPosition) {
                      var HoursRoad = [];
                      for (var i = 0; i< carPosition.length; i++){
                        if (carPosition[i])
                          HoursRoad.push(carPosition[i].timestamp);
                      }

                      var dateRoaded = HoursRoad.map(d => moment(d,"dd/mm/yyyy hh24:mi:ss"));
                      var maxDate = moment.max(dateRoaded);
                      var minDate = moment.min(dateRoaded);
                      var duration = moment.duration(maxDate.diff(minDate));
                      res.json({ score: 10, valorBase: duration.asHours() })
                    } else {
                      res.json({ score: 0 })
                    }
                } else {
                  console.log('Error:' + err)
                }
               
              })
            })
        })
   
}

drivebehaviorController.slot3MotorTemperatureScore = function (req, res) {
  
  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.params.plateid;
    var runDate = req.params.setDate;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    User
      .findOne({email:req.user.email}).exec(function(err, user){  
        vehicle
          .find({ plate: _id })
          .populate({
            path:'customer'
          })
        .exec(function(err, carss){    

          cars
            .find({ CHASSIS: carss[0].vin })
            .exec(function (err, vehicleInfo) {
              var carId = vehicleInfo[0].inoid;
              var dtimestamp = moment(runDate,"YYYYMMDD").toDate();
              mongoose.connection.db.collection('do_sco_bha', function (err, collection) {
                if (!err) {
                  console.log('carId=' + carId + ' dtimestamp=>' + dtimestamp + ' runDate=>'+ runDate);
                  collection.find({ vehicleID: carId, Date: { "$gte" : dtimestamp} }).toArray(function (err, slot3MotorTempo) {
                    if (!err) {
                      if (slot3MotorTempo) {
                        
                        var Slot3Result = 0;
                        var Slot3TempDump = [];
                        slot3MotorTempo.forEach((motor, index) =>
                          //Slot3TempDump.push(motor.MechanicalScore.EngineBlockTemp)
                          console.log('motor info:' + motor.MechanicalScore.EngineBlockTemp + ' seq:' + index)
                        );
                        console.log('Slot3TempDump=>' + Slot3TempDump);
                        Slot3Result = Slot3TempDump => Slot3TempDump.reduce((prev, curr) => prev + curr) / Slot3TempDump.length;
                        res.json({ score: 10, valorBase: Slot3Result });
                      } else {
                        res.json({ score: 0 });
                      }  
                    } else {
                      console.log('Error:' + err);
                      res.json({ score: -1 });
                    }
                    
                  })  
                } else {
                  console.log('Error:' + err);
                }               
              })
          })
        })
      })
}
module.exports = drivebehaviorController

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function datesByCar (chassi) {
  cars
      .find({CHASSIS: chassi})
      .exec(function (err, vehicleInfo) {
        var carId = vehicleInfo[0].inoid;
      
        mongoose.connection.db.collection('do_sco_bha', function (err, collection) {
          collection.distinct('Date', { vehicleID: carId }, function (err, daysLine) {
            //console.log('carId=' + carId + ' daysLine=>' + JSON.stringify(daysLine))
            var dateTimeline = []
            for (var i = 0; i < daysLine.length; i++) {
              //console.log('daysLine[i].Date=' + moment(daysLine[i]) + ' Momento Status=>' +  moment(daysLine[i]).isValid())
              if (moment(daysLine[i]).isValid()) {
                var dtime = moment(daysLine[i]).format("DD/MM/YYYY");
                //console.log('dtime=' + dtime)
                dateTimeline.push(dtime)
              }
            }
            return (dateTimeline)
          });
      });
   })
}

function scorebyCar (chassi, dtime) {
  var Slot3 = 0;
  cars
      .find({CHASSIS: chassi})
      .exec(function (err, vehicleInfo) {
        var carId = vehicleInfo[0].inoid;
      
        mongoose.connection.db.collection('do_sco_bha', function (err, collection) {
          collection.find({ vehicleID: carId, Date: dtime }).toArray(function (err, scores) {
            console.log('carId=' + carId + 'scores=>' + JSON.stringify(scores))
            var dateTimeline = []
            /* Slot Mecanico */
            var OilLevelScore = 10;
            var AirFilterConditionScore = 10;
            var FaltyBulbsScore = 10;
            var NightDrivingHoursScore = 10;
            for (var i = 0; i < scores.length; i++) {
              OilLevelScore = (OilLevelScore + scores[i].OilLevelScore) / 2;
              AirFilterConditionScore = (AirFilterConditionScore + scores[i].AirFilterConditionScore) / 2;
              FaltyBulbsScore = (FaltyBulbsScore + scores[i].FaltyBulbsScore) / 2;
              NightDrivingHoursScore = (NightDrivingHoursScore + scores[i].NightDrivingHoursScore) / 2;
            }

            Slot3 = (OilLevelScore + AirFilterConditionScore + FaltyBulbsScore + NightDrivingHoursScore) / 4;

            return (Slot3)
          });
      });
   })
}