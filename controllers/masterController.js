var mongoose        = require("mongoose")
var cars = require("../models/Vehicle")
var carsMB = require("../models/VehicleMB")
var User            = require("../models/User")
var Message         = require('../models/Message')
var intsvc          = require('../models/IntegrationSvc')
var moment          = require('moment')

exports.list = function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/"    

    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const _id = req.query.item;
    const limit = 5;

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    
    var firstday = new Date(curr.setDate(first)).toLocaleDateString('pt-BR');
    var lastday = new Date(curr.setDate(last)).toLocaleDateString('pt-BR');

    const options = {
      limit: 5,
      page: 1
    };
  
    var uavatar = getInitials(req.user.fullname);       

    User
      .findOne({email:req.user.email}).exec(function(err, user){ 
          cars
              .find({ customer: user.customer })
              .limit(limit)
              .skip(limit * page)
              .populate({
                path: 'customer',
                select: 'fullname -_id',
              })              
              .exec(function(err, carss){
                  cars.count().exec(function (err, ccount) {
                    var carList = [];
                      for (var i = 0; i < carss.length; i++) {
                        console.log('carss[i]=' + JSON.stringify(carss[i]));
                        var carStatusInfo = getVehicleScoreData(carss[i]);
                        var carInfo = {
                            plate: carss[i].plate,
                            vin: carss[i].vin,
                            status: 'on'
                          }
                          console.log('carInfo =>' + JSON.stringify(carInfo))
                        carList.push(carInfo)
                    }
                    // intsvc
                    //     .find()
                    //     .limit(limit)
                    //     .skip(limit * page)
                    //     .exec(function(err,svcs){
                    //         intsvc.count().exec(function(err, count){    
                                res.render('index',
                                { title: 'DriveOn Safe Score',
                                    params:{CurWStart:firstday, CurWEnd:lastday},  
                                    carros: carList,
                                    // services: svcs,
                                    user: req.user,                              
                                    ulogo: uavatar,
                                    baseuri: baseurl,
                                    cntcars: ccount,
                                    page: page + 1,
                                    pages: Math.ceil(ccount / limit)}
                                )
                        //     })    
                        // })                 
                         
                           
                  })      
              })  
      })       
 }


 exports.carlist = function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/"    

    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const _id = req.query.item;
    const limit = 10;

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    
    var firstday = new Date(curr.setDate(first)).toLocaleDateString('pt-BR');
    var lastday = new Date(curr.setDate(last)).toLocaleDateString('pt-BR');

    const options = {
      limit: limit,
      page: page
    };
  
    
    cars
        .find({'active': true}, function(err, car){
            cars.count().exec(function(err, count){
                    res.render('vehicles/lasttrips',
                    { title: 'DriveOn', 
                        params:{CurWStart:firstday, CurWEnd:lastday}, 
                        carros: car,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
            });        
        })
        .limit(limit)
        .skip(limit * page)
  } 

var getInitials = function (string) {
    var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }else{
        initials = names.substring(0, 1).toUpperCase();
    }   
    return initials;
 };

var getWeekVehicleDurations = function(dongles){
    var curr = new Date // get current date
    var first = curr.getDate() - curr.getDay() // First day is the day of the month - the day of the week
    var last = first + 6 // last day is the first day + 6
    var tduration = 0
    var d1 = moment(first).format("YYYY-MM-DD")
    var d2 = moment(first).format("YYYY-MM-DD").day(1)
    var d3 = moment(first).format("YYYY-MM-DD").day(2)
    var d4 = moment(first).format("YYYY-MM-DD").day(3)
    var d5 = moment(first).format("YYYY-MM-DD").day(4)
    var d6 = moment(first).format("YYYY-MM-DD").day(5)
    var d7 = moment(first).format("YYYY-MM-DD").day(6)

    Message
        .find({dateReceived: new RegExp(d1, "i"),dongleCode:dongles})
        .sort({$natural:-1})
        .exec(function(err, msg){
            if (err){
                console.log('Erro:' + err)
            }else{
                if (msg.length > 0){
                    var maxduration = 0
                    for(var i=0;i<msg.length;i++){
                        
                    }
                }
            }
        })

        
}


function getVehicleScoreData (vehicleData) {
    var returnValue = '';
    carsMB
            .find({ CHASSIS: vehicleData.vin })
            .exec(function (err, vehicleInfo) {
              var carId = vehicleInfo[0].inoid;
              console.log('carId=>' + carId);
              mongoose.connection.db.collection('do_sco_bha', function (err, collection) {
                if (!err) {
                  collection.distinct('Date', { vehicleID: carId }, function (err, daysLine) {
                    mongoose.connection.db.collection('do_score_all', function (err, collectionScore) {
                      if (!err) {
                        collectionScore.find({ vehicleId: carId }).toArray(function (err, scoresinfo) {
                            console.log('scoresinfo size=>' + (scoresinfo.length))
                            //if (scoresinfo) {
                                if (scoresinfo.length > 0) {
                                    returnValue =  'on';
                                } else {
                                     returnValue =  'off';
                                }
                            // } else {
                            //     return 'off';
                            // }
                          
                        })
                      } else {
                          console.log('Falha na busca pela collection do_score_all');
                          returnValue =  'off';
                      }
                      
                    })
                    
                    
                  })
                } else {
                    console.log('Falha na busca pela collection do_sco_bha');
                    returnValue =  'off';
                }
                
              })
            })
    
    
    return new Promise(result => {
        result = returnValue 
    });
}