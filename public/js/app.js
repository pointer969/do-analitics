/*****
* CONFIGURATION
*/
    //Main navigation
    $.navigation = $('nav > ul.nav');

  $.panelIconOpened = 'icon-arrow-up';
  $.panelIconClosed = 'icon-arrow-down';

  //Default colours
  $.brandPrimary =  '#20a8d8';
  $.brandSuccess =  '#4dbd74';
  $.brandInfo =     '#63c2de';
  $.brandWarning =  '#f8cb00';
  $.brandDanger =   '#f86c6b';

  $.grayDark =      '#2a2c36';
  $.gray =          '#55595c';
  $.grayLight =     '#818a91';
  $.grayLighter =   '#d1d4d7';
  $.grayLightest =  '#f8f9fa';

'use strict';

/****
* MAIN NAVIGATION
*/

$(document).ready(function ($) {
  
  /* Ajusta a exibição da lista de datas */
  var Totdates = $('#totTimeline').val();
  for (var i = 0; i <= Totdates; i++) {
    if (i > 9) {
      //$('.time-' + i).hide();
      $('.time-' + i).parent().hide();
    }
      
  }
  /***************************************/
  // Add class .active to current link
  $.navigation.find('a').each(function(){

    var cUrl = String(window.location).split('?')[0];

    if (cUrl.substr(cUrl.length - 1) == '#') {
      cUrl = cUrl.slice(0,-1);
    }

    if ($($(this))[0].href==cUrl) {
      $(this).addClass('active');

      $(this).parents('ul').add(this).each(function(){
        $(this).parent().addClass('open');
      });
    }
  });

  // Dropdown Menu
  $.navigation.on('click', 'a', function(e){

    if ($.ajaxLoad) {
      e.preventDefault();
    }

    if ($(this).hasClass('nav-dropdown-toggle')) {
      $(this).parent().toggleClass('open');
      resizeBroadcast();
    }

  });

  // Aside Populate
  // populateASIDEAlarms();
   
  function resizeBroadcast() {

    var timesRun = 0;
    var interval = setInterval(function(){
      timesRun += 1;
      if(timesRun === 5){
        clearInterval(interval);
      }
      window.dispatchEvent(new Event('resize'));
    }, 62.5);
  }

  // function updateEvents(){    
  //   // var parameters = { companyId: $(this).val() };
  //   var parameters = 2;
    
  //   $.get('/do_car_a00', function(data, status){
  //       console.log("Data: " + data + "\nStatus: " + status);
  //       //  $('#timeline').html(data);
  //   });
  // }   

  /* ---------- Main Menu Open/Close, Min/Full ---------- */
  $('.navbar-toggler').click(function(){

    if ($(this).hasClass('sidebar-toggler')) {
      $('body').toggleClass('sidebar-hidden');
      resizeBroadcast();
    }

    if ($(this).hasClass('sidebar-minimizer')) {
      $('body').toggleClass('sidebar-minimized');
      resizeBroadcast();
    }

    if ($(this).hasClass('aside-menu-toggler')) {
      $('body').toggleClass('aside-menu-hidden');
      resizeBroadcast();
      // updateEvents();
    }

    if ($(this).hasClass('mobile-sidebar-toggler')) {
      $('body').toggleClass('sidebar-mobile-show');
      resizeBroadcast();
    }

  });

  $('.sidebar-close').click(function(){
    $('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');
  });

  /* ---------- Disable moving to top ---------- */
  $('a[href="#"][data-top!=true]').click(function(e){
    e.preventDefault();
  });

  $('.scorereload').click(function () {
    
    getRefreshSlots();

    getRefreshSlo3RoadDuration();
    getRefreshSlo3RoadLong();
    getRefreshSlo3MotorTemp();
    getRefreshSlo3Fuel();
    getRefreshSlo3Oil();
    getRefreshSlo3Battery();
    getRefreshSlo2Geolocation();
    getRefreshSlo2DrivingTime();
    getRefreshSlo2AlnightLong();
    getRefreshSlo1OverSpeed();
  });
});

/****
* CARDS ACTIONS
*/

$(document).on('click', '.card-actions a', function(e){
  e.preventDefault();

  if ($(this).hasClass('btn-close')) {
    $(this).parent().parent().parent().fadeOut();
  } else if ($(this).hasClass('btn-minimize')) {
    var $target = $(this).parent().parent().next('.card-block');
    if (!$(this).hasClass('collapsed')) {
      $('i',$(this)).removeClass($.panelIconOpened).addClass($.panelIconClosed);
    } else {
      $('i',$(this)).removeClass($.panelIconClosed).addClass($.panelIconOpened);
    }

  } else if ($(this).hasClass('btn-setting')) {
    $('#myModal').modal('show');
  }

  // window.addEventListener('resize', 
	// () => map.getViewPort().resize());
  
  // /* Load Score Indicators */
  // var dInfo = $(this).val();
  //   var dplate = $('#VehicleDtl').val();
  //   console.log("dInfo =" + dInfo + " dplate=" + dplate);
  //   $.ajax
  //     ({
  //       type: "get",
  //       url: "/driverbehavior/score/slot3/roadduration/",
  //       data: {
  //         plateid: dplate,
  //         setDate: dInfo
  //       },
  //       dataType: "json",
  //       crossDomain: "false",
  //       contentType: "application/json; charset=UTF-8"                                                             
  //     }).done(function ( data ) {
  //       $('#slot3roadDurationScore').html( data );
  //     })
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {

  /* ---------- Tooltip ---------- */
  $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement":"bottom",delay: { show: 400, hide: 200 }});

  /* ---------- Popover ---------- */
  $('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();

}

function getRefreshSlots() {
  $('#slot2DriveingTimeScore').html( "Processando" );
  $('#slot1OverSpeedScore').html( "Processando" );
  $('#slot2AllnightLongScore').html( "Processando" );
  $('#slot3BatteryScore').html( "Processando" );
  $('#slot3OilScore').html( "Processando" );
  $('#slot3FuelScore').html( "Processando" );
  $('#slot3motorTempScore').html( "Processando" );
  $('#slot3roadLongScore').html( "Processando" );
  $('#slot1roadLongScore').html( "Processando" );
  $('#slot3roadDurationScore').html("Processando");
  $('#slot1roadDurationScore').html( "Processando" );
}

function getRefreshSlo3RoadDuration() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot3/roadduration/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
       
        $('#detailSlot1').css('display','block');
        $('#detailSlot2').css('display','block');
        $('#detailSlot3').css('display','block');
        if (data.score > 0) {
          $('#slot3roadDurationScore').html(Math.round(data.valorBase / 1000, 2) + ' Km');
          $('#slot1roadDurationScore').html( Math.round(data.valorBase/1000,2) + ' Km' );
        } else {
          $('#slot3roadDurationScore').html("-- (Sem dados)");
          $('#slot1roadDurationScore').html( "-- (Sem dados)" );
        }
        
      })
}
function getRefreshSlo3RoadLong() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot3/roadlong/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot3roadLongScore').html(Math.round(data.valorBase, 2) + '  Horas');
          $('#slot1roadLongScore').html( Math.round(data.valorBase,2) + '  Horas' );
        } else {
          $('#slot3roadLongScore').html("-- (Sem dados)");
          $('#slot1roadLongScore').html( "-- (Sem dados)" );
        }
        
      })
  }

  function getRefreshSlo3MotorTemp() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot3/motortemp/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot3motorTempScore').html( Math.round(data.valorBase,2) + '  Celsius' );
        } else {
          $('#slot3motorTempScore').html( "-- (Sem dados)" );
        }
        
      })
  }

  function getRefreshSlo3Fuel() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot3/fuel/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot3FuelScore').html( Math.round(data.valorBase,2) + '  Litros' );
        } else {
          $('#slot3FuelScore').html( "-- (Sem dados)" );
        }
        
      })
}
  
function getRefreshSlo3Oil() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot3/oil/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot3OilScore').html( data.valorBase );
        } else {
          $('#slot3OilScore').html( "-- (Sem dados)" );
        }
        
      })
}
  
function getRefreshSlo3Battery() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot3/battery/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot3BatteryScore').html( Math.round(data.valorBase,2) );
        } else {
          $('#slot3BatteryScore').html( "-- (Sem dados)" );
        }
        
      })
}
  
function getRefreshSlo2Geolocation() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot2/geolocation/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        // return data.positions
        $('#mapContainer').empty();
        feedMap(data.positions);
      })
}

function feedMap (coord) {
  
  var platform = new H.service.Platform({
    app_id: 'YevpXNgekiGoMvb2Wge6',
    app_code: '6jK4ow-mZzPGv8k3_4Yd-A',
    'useHTTPS': true
  });

  var pixelRatio = window.devicePixelRatio || 1;
  var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });

  var map = new H.Map(document.getElementById('mapContainer'),
    defaultLayers.normal.map,{
    center: {lat:-23.6848062, lng:-46.6916117},
    zoom: 6,
    pixelRatio: pixelRatio
  });
  
  window.addEventListener('resize', () => map.getViewPort().resize());

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  var lineString = new H.geo.LineString();
  
  for (var j = 0; j < coord.length; j++){
    lineString.pushPoint(coord[j])
  }
  // console.log('lineString=>' + lineString);
   map.addObject(new H.map.Polyline(
      lineString, { style: { lineWidth: 4 }}
    ));
  
  map.getViewPort().resize();
}

function getRefreshSlo2DrivingTime() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot2/drivingtime/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot2DriveingTimeScore').html( "Diurno : " + data.diurno + ":00:00 / Noturno : " + data.noturno + ":00:00" );
        } else {
          $('#slot2DriveingTimeScore').html( "-- (Sem dados)" );
        }
        
      })
}

function getRefreshSlo2AlnightLong() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot2/allnight/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot2AllnightLongScore').html( (data.pernoite > 8 ? 1 : 0) + ' (' + data.pernoite  + ' horas)' );
        } else {
          $('#slot2AllnightLongScore').html( "-- (Sem dados)" );
        }
        
      })
}

function getRefreshSlo1OverSpeed() {
  
    var dInfo = $('.scorereload').attr("href");
    var dDate = dInfo.toString().replace('#/', '');
    var dplate = $('#VehicleDtl').text().replace('Placa: ','').trim();
    $.ajax
      ({
        type: "get",
        url: "/driverbehavior/score/slot1/overspeed/" + dplate + "/" + dDate,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function (data) {
        if (data.score > 0) {
          $('#slot1OverSpeedScore').html( data.score + ' (' + data.velocidades.length + ' ocorrencias)' );
        } else {
          $('#slot1OverSpeedScore').html( "-- (Sem dados)" );
        }
        
      })
}


function getBeforeDateforBehavior () {
  var datefim = $('#nextTimeline').val();
  var dateini = $('#prevTimeline').val();

  $('.time-' + dateini).parent().hide();
  $('.time-' + (parseInt(datefim) + 1)).parent().show();

  var nvalueIni = parseInt(dateini) +1;
  var nvalueFim = parseInt(datefim) +1;

  $('#prevTimeline').attr('value',nvalueIni);
  $('#nextTimeline').attr('value', nvalueFim);
  
}

function getNextDateforBehavior () {
  var datefim = $('#nextTimeline').val();
  var dateini = $('#prevTimeline').val();
  
  $('.time-' + dateini).parent().hide();
  $('.time-' + (parseInt(datefim) + 1)).parent().show();
  

  var nvalueIni = parseInt(dateini) +1;
  var nvalueFim = parseInt(datefim) + 1;

  $('#prevTimeline').attr('value',nvalueIni);
  $('#nextTimeline').attr('value', nvalueFim);
  
}