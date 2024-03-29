// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Vehicle         = require('../models/Vehicle')
var Device          = require('../models/Device')
var Customer        = require('../models/Customer')
var User            = require('../models/User')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')

var vehicleController = {}

/**
 * CRUD
 */ 
 vehicleController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Vehicle
        .find()
        // .populate({
        //   path:'do_dev_m00', 
        //   select:'device',
        //   match:{ active: true },
        //   options: { sort: { device: -1 }}
        // })
        .populate({
          path:'customer', 
          select:'fullname',
          match:{ active: true },
          options: { sort: { fullname: -1 }}
        })
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, vehicles){
          console.log('logo:' + vehicles)
          Vehicle.count().exec(function(err, count){
              if (count > 0) {
                    res.render('vehicles/index',
                    { title: 'DriveOn Integrator | Veiculo', 
                        list: vehicles,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    Device
                          .find({active: true}).exec(function(err, device){
                            if (err) {
                              switch (err.code)
                              {
                                case 11000: 
                                    req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                                    break;        
                                default: 
                                    req.flash('alert-danger', "Erro ao carregar os perfis de devices:"+ err)  
                                    break;
                              }   
                            }else{  
                                Customer
                                  .find({active: true}).exec(function(err, customer){
                                    if (err) {
                                      switch (err.code)
                                      {
                                        case 11000: 
                                            req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                                            break;        
                                        default: 
                                            req.flash('alert-danger', "Erro ao carregar as autoridades de usuário:"+ err)  
                                            break;
                                      }   
                                    }else{                                    
                                              res.render('vehicles/new.jade', { title: 'DriveOn | Novo Veiculo',
                                                  baseuri: baseurl,
                                                  devices: device,
                                                  customers: customer
                                                })
                                    } 
                                })  
                            }
                          })  

                  }     
            })      
        })  
  }

 vehicleController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    
    Device
    .find({active: true}).exec(function(err, device){
      if (err) {
        switch (err.code)
        {
          case 11000: 
              req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
              break;        
          default: 
              req.flash('alert-danger', "Erro ao carregar os perfis de devices:"+ err)  
              break;
        }   
      }else{  
          Customer
            .find({active: true}).exec(function(err, customer){
              if (err) {
                switch (err.code)
                {
                  case 11000: 
                      req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                      break;        
                  default: 
                      req.flash('alert-danger', "Erro ao carregar as autoridades de usuário:"+ err)  
                      break;
                }   
              }else{                                    
                        res.render('vehicles/new.jade', { title: 'DriveOn | Novo Veiculo',
                            baseuri: baseurl,
                            devices: device,
                            customers: customer
                          })
              } 
          })  
      }
    })  


  } 
 
 vehicleController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
  Vehicle.findOne({_id: req.params.id})
  .populate({
    path:'device', 
    select:'device',
    match:{ active: true},
    options: { sort: { device: -1 }}
  })
  .populate({
    path:'customer', 
    select:'fullname',
    match:{ active: true },
    options: { sort: { fullname: -1 }}
  })
  .exec(function (err, vehicle) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao exibir:"+ err)  
                 break;
          }   
        } else {     
          req.flash('alert-info', 'Dados salvos com sucesso!')   
          console.log(vehicle)  
          res.render('vehicles/show', {vehicles: vehicle, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
  }
  }    

 vehicleController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Vehicle.findOne({_id: req.params.id})
  .populate({
    path:'device', 
    select:'device',
    match:{ active: true},
    options: { sort: { device: -1 }}
  })
  .populate({
    path:'customer', 
    select:'fullname',
    match:{ active: true },
    options: { sort: { fullname: -1 }}
  })
  .exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {   
          
          Device
                          .find({active: true}).exec(function(err, device){
                            if (err) {
                              switch (err.code)
                              {
                                case 11000: 
                                    req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                                    break;        
                                default: 
                                    req.flash('alert-danger', "Erro ao carregar os perfis de devices:"+ err)  
                                    break;
                              }   
                            }else{  
                                Customer
                                  .find({active: true}).exec(function(err, customer){
                                    if (err) {
                                      switch (err.code)
                                      {
                                        case 11000: 
                                            req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                                            break;        
                                        default: 
                                            req.flash('alert-danger', "Erro ao carregar as autoridades de usuário:"+ err)  
                                            break;
                                      }   
                                    }else{                                    
                                              res.render('vehicles/edit', { title: 'DriveOn | Novo Veiculo',
                                                  baseuri: baseurl,
                                                  devices: device,
                                                  customers: customer,
                                                  vehicles: uprofile
                                                })
                                    } 
                                })  
                            }
                          })  


          // res.render('vehicles/edit', {vehicles: uprofile, baseuri:baseurl});
        }
      })
  }

 vehicleController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Vehicle.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                plate: req.body.plate,
                device: req.body.device,
                vin: req.body.vin,
                model: req.body.model,
                color: req.body.color,
                state: req.body.state,
                customer: req.body.customer,
                motor: req.body.motor,
                fueltype: req.body.fueltype, 
                manufYear: req.body.manufYear,               
                active: req.body.active,
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err)  
                 break;
          }   
          res.render("vehicles/edit", {vehicles: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/vehicles/show/"+profile._id)
        }
      })
  }  

 vehicleController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    // if(req.user) {           
    //   // console.log('Check req.user data:'+ JSON.stringify(req.user))
    //   payload.modifiedBy = req.user.email
    // }  
    
    var vehicle = new Vehicle(payload)      
    vehicle.save(function(err) {
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
            Device.find({active: true}).exec(function(err, device){
                      if (err) {
                        switch (err.code)
                        {
                          case 11000: 
                              req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                              break;        
                          default: 
                              req.flash('alert-danger', "Erro ao carregar os perfis de devices:"+ err)  
                              break;
                        }   
                      }else{  
                          Customer
                            .find({active: true}).exec(function(err, customer){
                              if (err) {
                                switch (err.code)
                                {
                                  case 11000: 
                                      req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                                      break;        
                                  default: 
                                      req.flash('alert-danger', "Erro ao carregar as autoridades de usuário:"+ err)  
                                      break;
                                }   
                              }else{                                    
                                        res.render('vehicles/new.jade', { title: 'DriveOn | Novo Veiculo',
                                            baseuri: baseurl,
                                            devices: device,
                                            customers: customer
                                          })
                              } 
                          })  
                      }
                    })  

      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/vehicles/show/'+vehicle._id)
      }
    })
  }

 vehicleController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Vehicle.remove({_id: req.params.id}, function(err) {
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
          res.redirect("/vehicles");
        }
      });
  };


 vehicleController.listbyUser = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
     
    User
      .findOne({email:req.user.email}).exec(function(err, user){ 
          Vehicle
              .find({customer:user.customer})             
              .exec(function(err, vehicles){
                Vehicle.count().exec(function(err, count){                    
                          res.render('vehicles/alarms',
                          { title: 'DriveOn Integrator | Alarmes', 
                              list: vehicles,
                              user_info: req.user,
                              baseuri: baseurl,
                              page: page + 1,
                              pages: Math.ceil(count / limit)}
                          )
                           
                  })      
              })  
      })        
  }
 vehicleController.analyticsbyUser = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
     
    User
      .findOne({email:req.user.email}).exec(function(err, user){ 
          Vehicle
              .find({customer:user.customer})
              .limit(limit)
              .skip(limit * page)
              .exec(function(err, vehicles){
                Vehicle.count().exec(function(err, count){                    
                          res.render('analytics',
                          { title: 'DriveOn Integrator', 
                              list: vehicles,
                              user_info: req.user,
                              baseuri: baseurl,
                              page: page + 1,
                              pages: Math.ceil(count / limit)}
                          )
                           
                  })      
              })  
      })        
  }

module.exports = vehicleController