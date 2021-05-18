var mongoose        = require('mongoose')
var passport        = require('passport')
var Georisk       = require('../models/Biorisk')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')

var bioriskController = {}

/**
 * CRUD
 */ 
bioriskController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };


    Georisk
        .find({}, function(err, biorisks){
          Georisk.count().exec(function(err, count){
              if (count > 0) {
                    res.render('biorisks/index',
                    { title: 'DriveOn Integrator | Zonas de Risco Ambiental', 
                        list: biorisks,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('biorisks/new.jade', { title: 'DriveOn | Nova Zona',baseuri:baseurl});
                  }     
            });        
        })        
        .limit(limit)
        .skip(limit * page)
  }

bioriskController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('biorisks/new.jade', { title: 'DriveOn | Nova Zona',baseuri:baseurl});
 }   
 
bioriskController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Georisk.findOne({_id: req.params.id}).exec(function (err, device) {
        if (err) {         
          req.flash('alert-danger', "Erro ao exibir:"+ err)                
        } else {     
          req.flash('alert-info', 'Dados salvos com sucesso!')       
          res.render('biorisks/show', {biorisks: device, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
  }
 }    

bioriskController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Georisk.findOne({_id: req.params.id}).exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de biorisks.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {          
          res.render('biorisks/edit', {biorisks: uprofile, baseuri:baseurl});
        }
      })
 }

bioriskController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Georisk.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                mapid 	:req.body.mapid,
                country   :req.body.country,
                state :req.body.state,
                city     :req.body.city,
                district    :req.body.district,
                zone     :req.body.zone, 
                risk:req.body.risk,
                points :req.body.points,
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de biorisks.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err)  
                 break;
          }   
          res.render("biorisks/edit", {biorisks: req.body, baseuri:baseurl})
        }else{
          // req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/biorisks/show/"+profile._id)
        }
      })
 }  

bioriskController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    // if(req.user) {           
    //   // console.log('Check req.user data:'+ JSON.stringify(req.user))
    //   payload.modifiedBy = req.user.email
    //   // payload.active = false
    // }  
    
    var device = new Georisk(payload)      
    
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
        // res.render('biorisks/new.jade', { title: 'DriveOn | Novo Device',baseuri:baseurl});
      } else {          
        // req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/biorisks/show/'+device._id)
      }
      res.render('biorisks/new.jade', { title: 'DriveOn | Novo Device', baseuri:baseurl});
    })
 }

bioriskController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Georisk.remove({_id: req.params.id}, function(err) {
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
          res.redirect("/biorisks")
        }
      })
  }

module.exports = bioriskController  