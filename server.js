

// Using express: http://expressjs.com/
var express = require('express');
const axios = require('axios');
const { request } = require('express');
var requestIp = require('request-ip');
const schedule = require('node-schedule');

// Create the app
var app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// config env 
require("dotenv").config();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);
// This call back just tells us that the server has started


async function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
  await Authenticate();
}

// Set the route for the root directory
app.get('/api/search/TBO', search);
app.get('/api/get_FareRule/TBO', get_FareRule);
app.get('/api/getfare/TBO', getfare);
app.get('/api/ssr_no_lcc/TBO', ssr_no_lcc);
app.get('/api/ssr_lcc/TBO', ssr_lcc);
app.get('/api/booknow_no_lcc/TBO', booknow_no_lcc);
app.get('/api/booknow_lcc/TBO', booknow_lcc);
app.get('/api/getTicket/TBO', getTicket);
// This is what happens when any user requests '/'
const job = schedule.scheduleJob({ hour: 00, minute: 45 }, (async function () {
  try {
    console.log("New ID----> ");
    await (Authenticate());
  }
  catch (err) {
    console.log(err);
  }
}));
async function getTicket(req, res) {


}
async function booknow_no_lcc(req, res) {


}
async function booknow_lcc(req, res) {


}
async function get_FareRule(req,res){
  getfare_data = req.body;
  var get_FareRule = await get_FareRule_data(getfare_data);
  res.send(get_FareRule);
}
async function getfare(req, res) {
  //console.log(req.body);
  getfare_data = req.body;
  //console.log();
  var get_FareRule = await get_FareRule_data(getfare_data);
  var get_FareQuote = await get_FareQuote_data(getfare_data);
  //console.log("get_FareQuote",get_FareQuote);
  res.send(get_FareQuote);
}
async function ssr_no_lcc(req,res){
  console.log(req.body);
  ssr_no_lcc_data = req.body;
  //console.log();
  var ssr_no_lcc = await ssr_no_lcc_req(ssr_no_lcc_data);
  res.send(ssr_no_lcc);

}
async function ssr_lcc(req,res){
  //console.log("<------ssr_lcc----->");
  ssr_lcc_data = req.body;
  //console.log();
  var ssr_lcc = await ssr_lcc_req(ssr_lcc_data);
  res.send(ssr_lcc);

}
async function search(req, res) {
  // Just send back "Hello World!"
  // Later we'll see how we might send back JSON
  console.log(req.body)
  search_data = req.body;

  //Token creation 
  try {
    if (process.env.TokenId == 0) {
      id = await Authenticate();

      // console.log("after authenticate--->", id, typeof (id));
    }


    //id = ;
    if (process.env.TokenId != null) {
      search_req = await search_result(search_data);
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
//authenticate 
async function Authenticate() {

  const api_url = 'http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate';
  // console.log("client id-->",process.env.ClientId,process.env.UserNameId,process.env.Password);
  try {
    const res = await axios.post(api_url, {
      "ClientId": process.env.ClientId,
      "UserName": process.env.UserNameId,
      "Password": process.env.Password,
      "EndUserIp": "0.0.0.0"
    })

    process.env['TokenId'] = res.data.TokenId;
    console.log(process.env.TokenId);
    return (process.env.TokenId);
  }
  catch (error) {
    console.error("Authenticate issue in side authenticate");
    return (null);
  }
}
//Segments
async function search_result(search_data) {
  try {
    const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search';
    // console.log(search_data.EndUserIp);
    console.time('test_time');
    const res = await axios.post(api_url, {
      "EndUserIp": search_data.EndUserIp,
      "TokenId": process.env.TokenId,
      "AdultCount": search_data.AdultCount,
      "ChildCount": search_data.ChildCount,
      "InfantCount": search_data.InfantCount,
      "DirectFlight": "false",
      "OneStopFlight": "false",
      "JourneyType": search_data.JourneyType,
      "PreferredAirlines": null,
      "Segments": [
        {
          "Origin": search_data.Origin,
          "Destination": search_data.Destination,
          "FlightCabinClass": search_data.FlightCabinClass,
          "PreferredDepartureTime": search_data.PreferredDepartureTime,
          "PreferredArrivalTime": search_data.PreferredArrivalTime
        }
      ],
      "Sources": null
    })
    console.timeEnd('test_time')

    return (res.data.Response);

  } catch (error) {
    console.error("search problem time issue in side search result");
    return (null);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }


}
async function get_FareRule_data(booking_data) {
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "0.0.0.0",
      "TokenId": process.env.TokenId,
      "TraceId": booking_data.TraceId,
      "ResultIndex": booking_data.ResultIndex
    })

    console.log("FareRule->",res.data);
    return (res.data);
  }
  catch (error) {
    console.error("FareRule error");
    return (null);
  }
}
async function get_FareQuote_data(booking_data) {
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "0.0.0.0",
      "TokenId": process.env.TokenId,
      "TraceId": booking_data.TraceId,
      "ResultIndex": booking_data.ResultIndex
    })

    //console.log(res.data);
    return (res.data);
  }
  catch (error) {
    console.error("FareRule error");
    return (null);
  }
}
async function ssr_no_lcc_req(ssr_req_no_lcc) {
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "0.0.0.0",
      "TokenId": process.env.TokenId,
      "TraceId": ssr_req_no_lcc.TraceId,
      "ResultIndex": ssr_req_no_lcc.ResultIndex
    })

    console.log(res.data);
    return (res.data);
  }
  catch (error) {
    console.error("ssr error");
    return (null);
  }
  
}
async function ssr_lcc_req(ssr_lcc_data) {
  console.log(ssr_lcc_data);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "0.0.0.0",
      "TokenId": process.env.TokenId,
      "TraceId": ssr_lcc_data.TraceId,
      "ResultIndex": ssr_lcc_data.ResultIndex
    })

    console.log(res.data);
    return (res.data);
  }
  catch (error) {
    console.error("ssr error",error);
    return (null);
  }
}

async function Booking_no_lcc(no_lcc_booking) {

}
async function Ticket_lcc(Ticket_lcc_data) {

}
async function Ticket_no_lcc(Ticket_no_lcc_data) {

}
async function get_booking_details(booking_details) {

}

