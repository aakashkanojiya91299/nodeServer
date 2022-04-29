

// Using express: http://expressjs.com/
var express = require('express');
var cors = require('cors');
//const { request } = require('express');
//var requestIp = require('request-ip');
const schedule = require('node-schedule');
const { get } = require('express/lib/request');
// const fs = require('fs');

const winston = require('winston');
var tty = require("tty");
const TBO = require("./Route/TB_functions.js");
const TJ = require("./Route/TJ_functions.js");
const TVP = require("./Route/TVP_functions");


// Create the app
var app = express();
app.use(cors({
  origin: '*'
}));
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'all_reqandres.log' }),
  ]
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// config env 
require("dotenv").config();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);
// This call back just tells us that the server has started

//server status 
async function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
  await TBO.login();
}

// Set the route for the root directory
//TBO
    app.post('/api/TBO/search', search);
    app.get('/api/TBO/get_FareRule', get_FareRule);
    app.get('/api/TBO/getfare', getfare);
    app.get('/api/TBO/get_FareQuote', get_FareQuote);
    app.get('/api/TBO/ssr_no_lcc', ssr_no_lcc);
    app.get('/api/TBO/ssr_lcc', ssr_lcc);
    app.get('/api/TBO/booknow_no_lcc', booknow_no_lcc);
    app.get('/api/TBO/ticket_no_lcc', Ticketing_no_lcc);
    app.get('/api/TBO/booknow_lcc', booknow_lcc);
    app.get('/api/TBO/getTicket', getTicket);
    app.get('/api/TBO/cancel/Cancellation_Charges', Cancellation_Charges);
    app.get('/api/TBO/cancel/ticketed', SEND_CHANGE_REQUEST);
    app.get('/api/TBO/cancel/hold_bookings', RELEASE_PNR_REQUEST);
    app.get('/api/TBO/cancel/Cancellation_status', Cancellation_status);

//TRIPJACK 
    app.post('/api/TJ/search',search_tj);
    app.get('/api/TJ/review',review_tj);
    app.get('/api/TJ/get_FareRule',TJ_FareRule_search);
    app.get('/api/TJ/Booking_Instant_Ticket',Booking_Instant_Ticket);
    app.get('/api/TJ/Booking_Hold',Booking_Hold);
    app.get('/api/TJ/Confirm_Fare_Before_Ticket',Confirm_Fare_Before_Ticket);
    app.get('/api/TJ/Book_Service_Confirm_Hold_Book',Book_Service_Confirm_Hold_Book);
    app.get('/api/TJ/Booking_Details',Booking_Details);
    app.get('/api/TJ/Seat_Service',Seat_Service);
    app.get('/api/TJ/Get_Amendment_Charges',Get_Amendment_Charges);
    app.get('/api/TJ/Submit_Amendment',Submit_Amendment);
    app.get('/api/TJ/Amendment_Details',Amendment_Details);
    app.get('/api/TJ/Release_PNR_Hold',Release_PNR_Hold);

//TRAVELPORT
    app.post('/api/TVP/search');
    app.get('/api/TVP/');
    app.get('/api/TVP/');
    app.get('/api/TVP/');




// This is what happens when any user requests '/'
const job = schedule.scheduleJob({ hour: 00, minute: 01 }, (async function () {
  try {
    console.log("New ID----> ");
    await (TBO.login());
  }
  catch (err) {
    console.log(err);
  }
}));
async function getTicket(req, res) {
  console.log(req.body);
  search_booking_details = req.body;
  getTicket_data = await TBO.get_booking_info(search_booking_details);
  res.send(getTicket_data);

}
async function Cancellation_status(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await TBO.cancel_Cancellation_status(req.body);
  res.send(get_details_info_of_cancellation);
}
async function Cancellation_Charges(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await TBO.cancel_Cancellation_Charges(req.body);
  res.send(get_details_info_of_cancellation);
}
async function RELEASE_PNR_REQUEST(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await TBO.cancel_hold_bookings(req.body);
  res.send(get_details_info_of_cancellation);
}
async function SEND_CHANGE_REQUEST(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await TBO.cancel_ticketed(req.body);
  res.send(get_details_info_of_cancellation);

}
async function Ticketing_no_lcc(req, res) {
  booking_info = req.body;
  var Ticket_details = await TBO.Ticket_nolcc(booking_info);
  res.send(Ticket_details);

}
async function booknow_no_lcc(req, res) {
  booking_info = req.body;
  var booking_details = await TBO.Booking_nolcc(booking_info);
  res.send(booking_details);

}
async function booknow_lcc(req, res) {
  console.log("booking_lcc---->\n", req.body);
  Ticket_details = req.body;
  var Ticket_details_info = await TBO.Ticket_lcc(Ticket_details);
  console.log("send-data", Ticket_details_info);
  res.send(Ticket_details_info);

}
async function get_FareRule(req, res) {
  getfare_data = req.body;
  var get_FareRule = await TBO.get_FareRule(getfare_data);
  res.send(get_FareRule);
}
async function get_FareQuote(req, res) {
  getfare_data = req.body;
  console.log(getfare_data);
  var get_FareQuote = await TBO.get_FareQuote(getfare_data);
  res.send(get_FareQuote);
}
async function getfare(req, res) {
  //console.log(req.body);
  getfare_data = req.body;
  console.log(getfare_data);
  var get_FareRule = await TBO.get_FareRule(getfare_data);
  console.log(get_FareRule);
  try{
  if (get_FareRule.Response.Error.ErrorCode == 0 ) {
    var get_FareQuote = await TBO.get_FareQuote(getfare_data);
    //console.log("get_FareQuote",get_FareQuote);
    res.send(get_FareQuote);
  }
  else {
    res.send(get_FareRule);
  }
}
catch(error)
{
  console.error("contact to support");
  res.send("contact to support");
}
}
async function ssr_no_lcc(req, res) {
  console.log(req.body);
  ssr_no_lcc_data = req.body;
  //console.log();
  var ssr_no_lcc = await TBO.ssr_nolcc_req(ssr_no_lcc_data);
  res.send(ssr_no_lcc);

}
// Checking SSR (Special Service Reques) for lcc flight  
async function ssr_lcc(req, res) {
  //console.log("<------ssr_lcc----->");
  ssr_lcc_data = req.body;
  //console.log();
  var ssr_lcc = await TBO.ssr_lcc_req(ssr_lcc_data);
  res.send(ssr_lcc);

}
//Search Flight from TBO API
async function search(req, res) {
  // Just send back "Hello World!"
  // Later we'll see how we might send back JSON
  console.log(req.body)
  search_data = req.body;

  //Token creation 
  try {
    if (process.env.TokenId == 0) {
      id = await TBO.login();

      // console.log("after authenticate--->", id, typeof (id));
    }


    //id = ;
    if (process.env.TokenId != null) {
      search_req = await TBO.search(search_data);
      if (search_req != null) {

        res.send(search_req);

      }
      else {
        res.send("search problem time issue");
      }

    }
    else {
      res.send("Authenticate issue");
    }


  } catch (error) {
    console.log("something went wrong");
    console.log(error);
  }
}



// working on tripjack API
async function search_tj(req,res){
  console.log("search data-->",req.body);
  search_data = req.body;
  result_data = await TJ.search(search_data);
  console.log("respond-->",result_data);
  res.send(result_data);
}
async function review_tj(req,res){
  console.log("Review__Data --> ",req.body);
  review_data = req.body;
  result_data = await TJ.getPrice(review_data);
  console.log("respond---->",result_data);
  res.send(result_data);
}

async function TJ_FareRule_search(req,res){
  console.log("Review__Data --> ",req.body);
  Fare_rule_data = req.body;
  result_data = await TJ.FareRule_search(Fare_rule_data);
  console.log("respond---->",result_data);
  res.send(result_data);
}
async function Booking_Instant_Ticket(req,res){
  console.log(req.body);
  result_data = await TJ.BIT(req.body);
  res.send(result_data);

}
async function Booking_Hold(req,res){}
async function Confirm_Fare_Before_Ticket(req,res){}
async function Book_Service_Confirm_Hold_Book(req,res){}
async function Booking_Details(req,res){}
async function Seat_Service(req,res){}
async function Get_Amendment_Charges(req,res){}
async function Submit_Amendment(req,res){}
async function Amendment_Details(req,res){}
async function Release_PNR_Hold(req,res){}     

//Ctrl+C handel
process.on('SIGINT', async function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  await TBO.logout();
  console.log("bye");
  // some other closing procedures go here
  process.exit(0);
});


