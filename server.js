

// Using express: http://expressjs.com/
var express = require('express');
var cors = require('cors');
const axios = require('axios');
//const { request } = require('express');
//var requestIp = require('request-ip');
const schedule = require('node-schedule');
const { get } = require('express/lib/request');
// const fs = require('fs');
const { MongoClient } = require('mongodb');
const winston = require('winston');
var tty = require("tty");

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
app.get('/api/TBO/cancel/Cancellation_Charges', Cancellation_Charges);
app.get('/api/TBO/cancel/ticketed', SEND_CHANGE_REQUEST);
app.get('/api/TBO/cancel/hold_bookings', RELEASE_PNR_REQUEST);
app.get('/api/TBO/cancel/Cancellation_status', Cancellation_status);

// This is what happens when any user requests '/'
const job = schedule.scheduleJob({ hour: 00, minute: 01 }, (async function () {
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
async function Cancellation_status(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await cancel_Cancellation_status(req.body);
  res.send(get_details_info_of_cancellation);
}
async function Cancellation_Charges(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await cancel_Cancellation_Charges(req.body);
  res.send(get_details_info_of_cancellation);
}
async function RELEASE_PNR_REQUEST(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await cancel_hold_bookings(req.body);
  res.send(get_details_info_of_cancellation);
}
async function SEND_CHANGE_REQUEST(req, res) {
  console.log(req.body);
  var get_details_info_of_cancellation = await cancel_ticketed(req.body);
  res.send(get_details_info_of_cancellation);

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
  console.log("booking_lcc---->\n", req.body);
  Ticket_details = req.body;
  var Ticket_details_info = await Ticket_lcc(Ticket_details);
  console.log("send-data", Ticket_details_info);
  res.send(Ticket_details_info);

}
async function get_FareRule(req, res) {
  getfare_data = req.body;
  var get_FareRule = await get_FareRule_data(getfare_data);
  res.send(get_FareRule);
}
async function getfare(req, res) {
  //console.log(req.body);
  getfare_data = req.body;
  console.log(getfare_data);
  var get_FareRule = await get_FareRule_data(getfare_data);
  console.log(get_FareRule);
  try{
  if (get_FareRule.Response.Error.ErrorCode == 0 ) {
    var get_FareQuote = await get_FareQuote_data(getfare_data);
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
  var ssr_no_lcc = await ssr_no_lcc_req(ssr_no_lcc_data);
  res.send(ssr_no_lcc);

}
// Checking SSR (Special Service Reques) for lcc flight  
async function ssr_lcc(req, res) {
  //console.log("<------ssr_lcc----->");
  ssr_lcc_data = req.body;
  //console.log();
  var ssr_lcc = await ssr_lcc_req(ssr_lcc_data);
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
      "EndUserIp": "192.168.1.111"
    })

    process.env['TokenId'] = res.data.TokenId;
    process.env['TokenAgencyId'] = res.data.Member.AgencyId;
    process.env['TokenMemberId'] = res.data.Member.MemberId;
    console.log(process.env.TokenId);
    return (process.env.TokenId);
  }
  catch (error) {
    console.error("Authenticate issue in side authenticate", error);
    try {
      if (process.env.TokenId != 0 && process.env.TokenAgencyId != 0 && process.env.TokenMemberId != 0) {
        logout();
      }
    }
    catch (error) {
      console.error(error);
    }
    return (error);
  }
}
//Get data from TBO API
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
    // logger.info("Search Request body",{
    //   "EndUserIp": "192.168.1.111",
    //   "TokenId": process.env.TokenId,
    //   "AdultCount": search_data.AdultCount,
    //   "ChildCount": search_data.ChildCount,
    //   "InfantCount": search_data.InfantCount,
    //   "DirectFlight": "false",
    //   "OneStopFlight": "false",
    //   "JourneyType": search_data.JourneyType,
    //   "PreferredAirlines": null,
    //   "Segments": search_data.Segments,
    //   "Sources": null
    // });
    // console.timeEnd('test_time')
    console.log(res.data.Response);
    //logger.info("Search Response body",res.data.Response);
    return (res.data.Response);

  } catch (error) {
    console.error("search problem time issue in side search result", error);
    return ("search problem time issue in side search result");
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }


}
//Get FARE Rule from TBO API
async function get_FareRule_data(booking_data) {
  console.log(booking_data);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareRule';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.11",
      "TokenId": process.env.TokenId,
      "TraceId": booking_data.TraceId,
      "ResultIndex": booking_data.ResultIndex
    })
    // logger.info("FareRule ",{
    //   "EndUserIp": "192.168.1.11",
    //   "TokenId": process.env.TokenId,
    //   "TraceId": booking_data.TraceId,
    //   "ResultIndex": booking_data.ResultIndex
    // });

    console.log("FareRule->", res.data);
    // logger.info("FareRule Response",res.data);
    return (res.data);
  }
  catch (error) {
    console.error("FareRule error-->");
    return ("FareRule error");
  }
}
//Get FARE from TBO API it contain both fare_rule + fareQuote
async function get_FareQuote_data(booking_data) {
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "TraceId": booking_data.TraceId,
      "ResultIndex": booking_data.ResultIndex
    })
    // logger.info("FareQuote Request ",{
    //   "EndUserIp": "192.168.1.11",
    //   "TokenId": process.env.TokenId,
    //   "TraceId": booking_data.TraceId,
    //   "ResultIndex": booking_data.ResultIndex
    // });
      console.log("--> Fare Quote",res.data);
    // logger.info("FareQuote Response ",res.data);
    return (res.data);

  }
  catch (error) {
    console.error("Fare Quote error", error);
    return ("Fare Quote error");
  }
}
//Getting SSR req from TBO API from no_lcc
async function ssr_no_lcc_req(ssr_req_no_lcc) {
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "TraceId": ssr_req_no_lcc.TraceId,
      "ResultIndex": ssr_req_no_lcc.ResultIndex
    })

    console.log(res.data);
    return (res.data);
  }
  catch (error) {
    console.error("ssr error");
    return ("ssr error");
  }

}
//Getting SSR req from TBO API from lcc
async function ssr_lcc_req(ssr_lcc_data) {
  console.log(ssr_lcc_data);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SSR';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "TraceId": ssr_lcc_data.TraceId,
      "ResultIndex": ssr_lcc_data.ResultIndex
    })

    console.log(res.data);
    return (res.data);
  }
  catch (error) {
    console.error("ssr error", error);
    return ("ssr error");
  }
}
//hold ticket for no lcc calling TBO API
async function Booking_no_lcc(no_lcc_booking) {
  console.log(no_lcc_booking);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Book';
  try {
    const res = await axios.post(api_url, {
      "ResultIndex": no_lcc_booking.ResultIndex,
      "Passengers": no_lcc_booking.Passengers,
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "TraceId": no_lcc_booking.TraceId
    })

    console.log("pnr details", res.data);
    console.log("data add in json--->>>>>", res.data.Response.Response.PNR, res.data.Response.Response.BookingId);
    // save_PNR_booking_ID(res.data.Response.PNR,res.data.Response.BookingId);
    mogo_pnr_info(res.data.Response.Response.PNR, res.data.Response.Response.BookingId,res.data.Response.Response.FlightItinerary);
    return (res.data);
  }
  catch (error) {
    console.error("error while booking");
    return ("error while booking");
  }

}
//ticketing lcc flight calling TBO API
async function Ticket_lcc(Ticket_lcc_data) {
  var Ticket_info = {};
  console.log("ticket for lcc --> \n", Ticket_lcc_data);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket';
  try {
    const res = await axios.post(api_url, {
      "PreferredCurrency": Ticket_lcc_data.PreferredCurrency,
      "AgentReferenceNo": "wowRooms",
      "ResultIndex": Ticket_lcc_data.ResultIndex,
      "Passengers": Ticket_lcc_data.Passengers,
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "TraceId": Ticket_lcc_data.TraceId
    })
    // logger.info("Ticket_lcc Request ",{
    //   "PreferredCurrency": Ticket_lcc_data.PreferredCurrency,
    //   "AgentReferenceNo": "wowRooms",
    //   "ResultIndex": Ticket_lcc_data.ResultIndex,
    //   "Passengers": Ticket_lcc_data.Passengers,
    //   "EndUserIp": "192.168.1.111",
    //   "TokenId": process.env.TokenId,
    //   "TraceId": Ticket_lcc_data.TraceId
    // })
    console.log("Ticket of lcc details", res.data);

    //logger.info("Ticket_lcc Response ",res.data);
    console.log("data add in json--->>>>>", res.data.Response.Response.PNR, res.data.Response.Response.BookingId);
    // save_PNR_booking_ID(res.data.Response.PNR,res.data.Response.BookingId);
    console.log(res.data);
    if ((res.data.Response.Response.PNR) != null && (res.data.Response.Response.BookingId) != null) {
      console.log("inside", (res.data.Response.Response.FlightItinerary.Passenger).length);
      Ticket_info.Passenger_info = res.data.Response.Response.FlightItinerary;
      console.log(Ticket_info);
      mogo_pnr_info(res.data.Response.Response.PNR, res.data.Response.Response.BookingId, Ticket_info);
    }
    return (res.data);
  }
  catch (error) {
    console.error("error while booking", error);
    return ("error while booking contact to customer support");
  }
}
//ticketing  no_lcc flight after booking hold 
async function Ticket_no_lcc(Ticket_no_lcc_data) {
  console.log("ticket in process", Ticket_no_lcc_data);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Ticket';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "TraceId": Ticket_no_lcc_data.TraceId,
      "PNR": Ticket_no_lcc_data.PNR,
      "BookingId": Ticket_no_lcc_data.BookingId
    })

    console.log("pnr details", res.data);
    await mogo_Ticket_Id_info(res.data.Response.Response.BookingId,res.data.Response.Response.FlightItinerary.Passenger);
    return (res.data);
  }
  catch (error) {
    console.error("error while booking");
    return ("error while booking");
  }

}
//get ticket details 
async function get_booking_details(search_booking_details) {
  console.log("we goo data-->", search_booking_details);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetBookingDetails';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "PNR": search_booking_details.PNR,
      "BookingId": search_booking_details.BookingId
    })

    console.log("ticket details", res.data);
    return (res.data);
  }
  catch (error) {
    console.error("error while fatching");
    return ("error while fatching");
  }
}
//Cancellation Part
async function cancel_Cancellation_Charges(booking_details) {
  console.log(" cancellation data-->", booking_details);
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetCancellationCharges';
  try {
    const res = await axios.post(api_url, {
      "EndUserIp": "192.168.1.111",
      "TokenId": process.env.TokenId,
      "BookingId": booking_details.BookingId,
      "RequestType": booking_details.RequestType

    })

    console.log("cancellation charges  details", res.data);
    return (res.data);
  }
  catch (error) {
    console.error("error while fatching");
    return ("error while fatching");
  }
}
async function cancel_hold_bookings(booking_details) {

}
async function cancel_ticketed(booking_details) {
  var find = 0;
  console.log("<-->", find);
  console.log(" cancellation data-->", booking_details);
  var find = await mogo_find_req(booking_details.BookingId);
  console.log("outside if-->", find);

  if (find == 1) {
    console.log("inside if -->", find);
    const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/SendChangeRequest';
    try {
      const res = await axios.post(api_url, {
        "BookingId": booking_details.BookingId,
        "RequestType": booking_details.RequestType,
        "CancellationType": booking_details.CancellationType,
        "Sectors": booking_details.Sectors,
        "TicketId": booking_details.TicketId,
        "Remarks": booking_details.Remarks,
        "EndUserIp": "192.168.1.111",
        "TokenId": process.env.TokenId
      })

      console.log("cancellation status", res.data);
      mogo_cancellation_request(booking_details.BookingId, res.data.Response.TicketCRInfo);

      return (res.data);
    }
    catch (error) {
      console.error("error while fatching", error);
      return ("error while fatching");
    }
  }
  else {
    console.log("Booking Derails no found");
    return ("Booking Derails no found")
  }
}
async function cancel_Cancellation_status(booking_details) {
  console.log(" cancellation_status data-->", booking_details);
  var full_details_cancellation = [];
  const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/GetChangeRequestStatus';
  if (await mogo_find_req(booking_details.BookingId) == 1) {
    try {
      const cancellation_data = await mongo_get_data(booking_details.BookingId);
      console.log("cancellation_data from DB",cancellation_data);
      if (cancellation_data != null && cancellation_data[0].TicketCRInfo != null) {
        for (let i = 0; i < (cancellation_data[0].TicketCRInfo).length; i++) {
          const res = await axios.post(api_url, {

            "ChangeRequestId": cancellation_data[0].TicketCRInfo[i].ChangeRequestId,
            "EndUserIp": "192.168.1.111",
            "TokenId": process.env.TokenId
          })
          console.log("-->print data",i,res.data);
          full_details_cancellation.push(res.data.Response);
          console.log("details-->",full_details_cancellation);
        }
        if(full_details_cancellation.length != 0){await mongo_update_status(booking_details.BookingId,full_details_cancellation);}
        return (full_details_cancellation);
      }
      else {
        return ("Problem while fatching data");
      }
    } catch (error) {
      console.error("error while fatching", error);
      return ("error while fatching");
    }
  }
  else {
    return ("Data not found");
  }
}


//Database Working 
async function mogo_pnr_info(pnr, booking_id, Ticket_info) {
  var url = "mongodb://localhost:27017/";
  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");
    var customer = { PNR: pnr, Booking_ID: booking_id, Ticket_info };

    var results = await Collection.insertOne(customer);
  }
  catch (e) {
    console.error(e);
  }
}
async function mogo_cancellation_request(booking_id, ticket_info) {
  var url = "mongodb://localhost:27017/";

  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");

    const results = await Collection.findOneAndUpdate({ Booking_ID: booking_id }, { $set: { Remarks: "cancellation_request", TicketCRInfo: ticket_info } })

  }
  catch (error) {
    console.error(error);
  }
}
async function mogo_find_req(booking_id) {
  //var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/";
  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");
    const data = Collection.find({ Booking_ID: booking_id });
    const results = await data.toArray();
    console.log(results);
    if (results.length > 0) {
      return (1);
    }
    else {
      return (0);
    }

  } catch (e) {
    console.error(e);
  }
}
async function mongo_get_data(booking_id) {
  //var mongoClient = mongodb.MongoClient;
  var url = "mongodb://localhost:27017/";
  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");
    const data = Collection.find({ Booking_ID: booking_id });
    const results = await data.toArray();
    console.log(results);
    if (results.length > 0) {
      console.log("get data result--->", results);
      return (results);
    }
    else {
      return (null);
    }

  } catch (e) {
    console.error(e);
  }
}
async function mongo_update_status(booking_id, ticket_info){
  var url = "mongodb://localhost:27017/";

  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");

    const results = await Collection.findOneAndUpdate({ Booking_ID: booking_id }, { $set: { Remarks: "cancellation_update", TicketCRInfo: ticket_info } })

  }
  catch (e) {
    console.error(e);
  }
}
async function mogo_Ticket_Id_info(booking_id, ticket_info) {
  var url = "mongodb://localhost:27017/";

  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");

    const results = await Collection.findOneAndUpdate({ Booking_ID: booking_id }, { $set: {Ticket_Id_info: ticket_info } })

  }
  catch (error) {
    console.error(error);
  }
}

async function mogo_add_user(Passenger){
  var url = "mongodb://localhost:27017/";
  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const Collection = client.db("flight_pnr_info").collection("user_info");
    var customer = {UserName:"",Mobile_no:"",Password:"",};

    var results = await Collection.insertOne(customer);
  }
  catch (e) {
    console.error(e);
  }
}
//Ctrl+C handel
process.on('SIGINT', async function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  await logout();
  console.log("bye");
  // some other closing procedures go here
  process.exit(0);
});

//Log out
async function logout() {
  if (process.env.TokenId != 0) {
    const api_url = 'http://api.tektravels.com/SharedServices/SharedData.svc/rest/Logout';
    try {
      const res = await axios.post(api_url, {
        "ClientId": process.env.ClientId,
        "TokenAgencyId": process.env.TokenAgencyId,
        "TokenMemberId": process.env.TokenMemberId,
        "EndUserIp": "192.168.1.111",
        "TokenId": process.env.TokenId
      })


      console.log("log out TokenId", process.env.TokenId);
      process.exit(0);
    }
    catch (error) {
      console.error("Authenticate issue while log out", error);
    }
    process.env['TokenId'] = 0;
    console.log(process.env.TokenId);
  }
  else {
    console.log("Create a Token Id First");
  }
}


