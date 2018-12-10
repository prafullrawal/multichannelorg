//SPDX-License-Identifier: Apache-2.0

var assests = require('./controller.js');
var IOTAPIs = require('./client/iot/samples/sharedSubscriptionSample');


module.exports = function(app){

  app.get('/get_record/:id', function(req, res){
    assests.get_record(req, res);
  });

  app.get('/add_record/:tuna', function(req, res){
    assests.add_record(req, res);
  });

  app.get('/get_all_record', function(req, res){
    assests.get_all_record(req, res);  
  });

  app.get('/change_status/:record_id', function(req, res){
    assests.change_status(req, res);
  });

  app.get('/sent_item/:record_id', function(req, res){
      assests.sent_item(req,res);
  });

  app.get('/receive_item/:record_id', function(req, res){
      assests.receive_item(req,res);
  });

  app.get('/read_IOT_temp/:record_id', function(req, res){
    IOTAPIs.start_reading_temp(req,res);
  });
}
