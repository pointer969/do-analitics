var mongoose        = require('mongoose')
var passport        = require('passport')
var Device          = require('../models/Device')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')
var http            = require('https')
var fetch           = require('node-fetch')
var FormData        = require('form-data')
var Messages        = require('../models/Message')
var Vehicle         = require('../models/Vehicle')
var moment          = require('moment')
var deviceController = {}

/**
 * CRUD
 */ 
deviceController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };


    Device
        .find({}, function(err, devices){
          Device.count().exec(function(err, count){
              if (count > 0) {
                    res.render('devices/index',
                    { title: 'DriveOn Integrator | Devices', 
                        list: devices,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('devices/new.jade', { title: 'DriveOn | Novo Device',baseuri:baseurl});
                  }     
            });        
        })        
        .limit(limit)
        .skip(limit * page)
  }

deviceController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('devices/new.jade', { title: 'DriveOn | Novo Device',baseuri:baseurl});
 }   
 
deviceController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Device.findOne({_id: req.params.id}).exec(function (err, device) {
        if (err) {         
          req.flash('alert-danger', "Erro ao exibir:"+ err)                
        } else {     
          req.flash('alert-info', 'Dados salvos com sucesso!')       
          res.render('devices/show', {devices: device, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
  }
 }    

deviceController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Device.findOne({_id: req.params.id}).exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {          
          res.render('devices/edit', {devices: uprofile, baseuri:baseurl});
        }
      })
 }

deviceController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Device.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                device 	:req.body.device,
                supplier   :req.body.supplier,
                description :req.body.description,
                active     :req.body.active,
                firmware    :req.body.firmware,
                version     :req.body.version, 
                simnumber :req.body.simnumber,
                sms_srv_addr:req.body.sms_srv_addr,
                sms_srv_key :req.body.sms_srv_key,
                sms_apn     :req.body.sms_apn,
                sms_user    :req.body.sms_user,
                sms_password:req.body.sms_password,
                sms_set_ip  :req.body.sms_set_ip,
                sms_set_port:req.body.sms_set_port,
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err)  
                 break;
          }   
          res.render("devices/edit", {devices: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/devices/show/"+profile._id)
        }
      })
 }  

deviceController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    if(req.user) {           
      // console.log('Check req.user data:'+ JSON.stringify(req.user))
      payload.modifiedBy = req.user.email
      payload.active = false
    }  
    
    var device = new Device(payload)      
    
    device.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }       
        // res.render('devices/new.jade', { title: 'DriveOn | Novo Device',baseuri:baseurl});
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        // res.redirect('/devices/show/'+device._id)
      }
      res.render('devices/new.jade', { title: 'DriveOn | Novo Device',baseuri:baseurl});
    })
 }

deviceController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Device.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/devices");
        }
      })
  }

deviceController.connecteds = function(req, res){
  var custid = req.params.customer 
  var tmz = req.user.timezone 
  // Define current date for Regex
  var recenttime = moment().minute(-1).utc().format("YYYY-MM-DD HH:mm:ss")
  
  Vehicle
      .find({customer:custid, active:true})
      .populate({
        path: 'device',
        select: 'device -_id',
      })
      .exec(function(err, cars){  
        if(err){
          console.log('err:'+err) 
        }else{
          
          devices = []
          for(var i=0;i < cars.length; i++){
            var devid = cars[i].device
            devices.push(devid)
          }
          
          var dongles = []
          for(var k=0;k<devices.length;k++){
            dongles.push(devices[k].device)
          }
          
          var retval = 0
          // console.log('dateReceived='+recenttime + ' dongles=>'+dongles)
          Messages
            .distinct('dongleCode',{dateReceived: new RegExp(recenttime, "i"),dongleCode:{$in: dongles}})                  
            .exec(function(err, msg){     
                if (err) {
                    console.log("Error:", err);
                }else {                   
                    if (msg.length > 0 ){
                      // console.log('msg = '+ JSON.stringify(msg))
                      retval = msg.length
                    }                                   
                    res.json({total:retval}) 
                }          
            })
      }
    }) 
  }

deviceController.disconneteds = function(req, res){
  var custid = req.params.customer 
  var tmz = req.user.timezone 
  // Define current date for Regex
  var recenttime = moment().minute(-1).utc().format("YYYY-MM-DD HH:mm:ss")
  
  Vehicle
      .find({customer:custid, active:true})
      .populate({
        path: 'device',
        select: 'device -_id',
      })
      .exec(function(err, cars){  
        if(err){
          console.log('err:'+err) 
        }else{
          
          devices = []
          for(var i=0;i < cars.length; i++){
            var devid = cars[i].device
            devices.push(devid)
          }
          
          var dongles = []
          for(var k=0;k<devices.length;k++){
            dongles.push(devices[k].device)
          }
          
          var retval = dongles.length
          // console.log('dateReceived='+recenttime + ' dongles=>'+dongles)
          Messages
            .distinct('dongleCode',{dateReceived: new RegExp(recenttime, "i"),dongleCode:{$in: dongles}})                  
            .exec(function(err, msg){     
                if (err) {
                    console.log("Error:", err);
                }else {                   
                    if (msg.length > 0 ){
                      // console.log('msg = '+ JSON.stringify(msg))
                      for(var i=0;i<msg.length;i++){
                        for(var k=0;k<msg.length;k++){
                          if(dongles[k]==msg[i].dongleCode)
                            retval--
                        } 
                      }
                    }                                   
                    res.json({total:retval}) 
                }          
            })
      }
    }) 
  }

deviceController.setuplist = function(req, res){
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;

  Device
      .find({active:true}, function(err, devices){
        Device.count().exec(function(err, count){            
                  res.render('devices/setup',
                  { title: 'DriveOn Integrator | Setup Devices', 
                      list: devices,
                      user_info: req.user,
                      baseuri: baseurl,
                      page: page + 1,
                      pages: Math.ceil(count / limit)}
                  )                    
          })        
      })        
      .limit(limit)
      .skip(limit * page)
  }

deviceController.callttvapi = function(req, res){
 
  var dvc = req.params.id
  var tk  = config.TTVKEY
  
    Device
      .findOne({_id:dvc}).exec(function(err, device){
            var mobilenumber  = device.simnumber
            var smssrvadd     = device.sms_srv_addr
            var smssrvkey     = device.sms_srv_key
            var smsapn        = device.sms_apn
            var smsuser       = device.sms_user  
            var smspassword   = device.sms_password
            var smssetip      = device.sms_set_ip
            var smssetport  = device.sms_set_port
            var smsmsg =  '*'+smssrvkey+'#set gprs#' +smsapn+ ',' +smsuser+','+smspassword+','+smssetip+','+smssetport+'*'        
                        
            fetch('https://api.totalvoice.com.br/sms', {
              headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Access-Token': tk
                },
              method: 'POST',     
              body: JSON.stringify({
                'numero_destino':mobilenumber,
                'mensagem':smsmsg,
                'resposta_usuario':false,
                'multi_sms':false
              })               
            }).then(function(res) {
              return res.json()
            }).then(function(json) {
              //  var arrayMessage = []
              //   var message0 =  { "return": id, "dreceived": dreceived, "temperatura": tempera }
              //  arrayMessage.push(message0)
               res.json(json)
            })            
          
      })       

  }

module.exports = deviceController  