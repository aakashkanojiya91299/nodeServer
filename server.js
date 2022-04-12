

// Using express: http://expressjs.com/
var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { request } = require('express');
var requestIp = require('request-ip');
const schedule = require('node-schedule');
const { get } = require('express/lib/request');

// Create the app
var app = express();
app.use(cors({
  origin: '*'
}));
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
app.post('/api/TBO/search', search);
app.get('/api/TBO/get_FareRule', get_FareRule);
app.get('/api/TBO/getfare', getfare);
app.get('/api/TBO/ssr_no_lcc', ssr_no_lcc);
app.get('/api/TBO/ssr_lcc', ssr_lcc);
app.get('/api/TBO/booknow_no_lcc', booknow_no_lcc);
app.get('/api/TBO/ticket_no_lcc', Ticketing_no_lcc);
app.get('/api/TBO/booknow_lcc', booknow_lcc);
app.get('/api/TBO/getTicket', getTicket);
app.get('/api/TBO/cancel', cancel_booking);
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
console.log(req.body);
search_booking_details = req.body;
getTicket_data = await get_booking_details(search_booking_details);
res.send(getTicket_data);

}
async function cancel_booking(req, res) {


}
async function Ticketing_no_lcc(req, res) {
   booking_info = req.body;
  var Ticket_details = await Ticket_no_lcc(booking_info);
  res.send(Ticket_details);

}
async function booknow_no_lcc(req, res) {
   booking_info = req.body;
  var booking_details = await Booking_no_lcc(booking_info);
  res.send(booking_details);

}
async function booknow_lcc(req, res) {
  console.log("booking_lcc---->\n",req.body);
  Ticket_details = req.body;
  var  Ticket_details_info = await Ticket_lcc(Ticket_details);
  console.log("send-data",Ticket_details_info);
  res.send(Ticket_details_info);

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
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "AdultCount": search_data.AdultCount,
      "ChildCount": search_data.ChildCount,
      "InfantCount": search_data.InfantCount,
      "DirectFlight": "false",
      "OneStopFlight": "false",
      "JourneyType": search_data.JourneyType,
      "PreferredAirlines": null,
      "Segments": search_data.Segments,
      "Sources": null
    })
    console.timeEnd('test_time')
    console.log(res.data.Response);
    return (res.data.Response);

  } catch (error) {
    console.error("search problem time issue in side search result",error);
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
    console.log(no_lcc_booking);
    const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book';
    try {
      const res = await axios.post(api_url, {
        "ResultIndex": no_lcc_booking.ResultIndex,
        "Passengers": no_lcc_booking.Passengers,
        "EndUserIp": "192.168.11.58",
        "TokenId": process.env.TokenId,
        "TraceId": no_lcc_booking.TraceId
      })
  
      console.log("pnr details",res.data);
      return (res.data);
    }
    catch (error) {
      console.error("error while booking");
      return (null);
    }

}
async function Ticket_lcc(Ticket_lcc_data) {
console.log("ticket for lcc --> \n",Ticket_lcc_data);
const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket';
    try {
      const res = await axios.post(api_url, {
        "PreferredCurrency": Ticket_lcc_data.PreferredCurrency,
        "AgentReferenceNo": "wowRooms",
        "ResultIndex": Ticket_lcc_data.ResultIndex,
        "Passengers": Ticket_lcc_data.Passengers,
        "EndUserIp": "192.168.11.58",
        "TokenId": process.env.TokenId,
        "TraceId": Ticket_lcc_data.TraceId
      })
  
      console.log("Ticket of lcc details",res.data);
      return (res.data);
    }
    catch (error) {
      console.error("error while booking");
      return (null);
    }
}
async function Ticket_no_lcc(Ticket_no_lcc_data) {
  console.log("ticket in process",Ticket_no_lcc_data);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket';
  try {
    const res = await axios.post(api_url, {
        "EndUserIp": "192.168.10.10",
        "TokenId": process.env.TokenId,
        "TraceId": Ticket_no_lcc_data.TraceId,
        "PNR": Ticket_no_lcc_data.PNR,
        "BookingId": Ticket_no_lcc_data.BookingId
    })

    console.log("pnr details",res.data);
    return (res.data);
  }
  catch (error) {
    console.error("error while booking");
    return (null);
  }

}
async function get_booking_details(search_booking_details) {
console.log("we goo data-->",search_booking_details);
const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails';
  try {
    const res = await axios.post(api_url, {
        "EndUserIp": "192.168.10.10",
        "TokenId": process.env.TokenId,
        "PNR": search_booking_details.PNR,
        "BookingId": search_booking_details.BookingId
    })

    console.log("ticket details",res.data);
    return (res.data);
  }
  catch (error) {
    console.error("error while fatching");
    return (null);
  }
}
async function cancel_booking(booking_details) {

}

