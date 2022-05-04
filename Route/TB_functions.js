const axios = require('axios');
const DBA = require('../Database/DB.js')
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
      console.log("--new id->",process.env.TokenId);
      return (process.env.TokenId);
    }
    catch (error) {
      console.error("Authenticate issue in side authenticate while log in", error);
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
        "PreferredAirlines": search_data.PreferredAirlines,
        "Segments": search_data.Segments,
        "Sources": search_data.Source
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
    var Ticket_info = {};
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
     if(res.data.Response.Response.IsPriceChanged == false && res.data.Response.Response.IsTimeChanged == false){
      Ticket_info.Passenger_info = res.data.Response.Response.FlightItinerary;
          console.log(Ticket_info);
      DBA.pnr_info(res.data.Response.Response.PNR, res.data.Response.Response.BookingId,Ticket_info);
      return (res.data);
    }
    else{
      var IsPriceChanged_data ={"ResultIndex": Ticket_lcc_data.ResultIndex,"TraceId": Ticket_lcc_data.TraceId}
      var updated_price = await get_FareQuote_data(IsPriceChanged_data);
      updated_price["IsPriceChanged"] = true;
      return(updated_price);
    }
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
        "TraceId": Ticket_lcc_data.TraceId,
        "IsPriceChangeAccepted": Ticket_lcc_data.IsPriceChangeAccepted

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
      if (res.data.Response.Response.IsPriceChanged == false && res.data.Response.Response.IsTimeChanged == false) {
        if ((res.data.Response.Response.PNR) != null && (res.data.Response.Response.BookingId) != null) {
          console.log("inside", (res.data.Response.Response.FlightItinerary.Passenger).length);
          Ticket_info.Passenger_info = res.data.Response.Response.FlightItinerary;
          console.log(Ticket_info);
          DBA.pnr_info(res.data.Response.Response.PNR, res.data.Response.Response.BookingId, Ticket_info);
          var Passenger = {};
          Passenger["Email"] = res.data.Response.Response.FlightItinerary.Passenger[0].Email;
          Passenger["Mobile_no"] = res.data.Response.Response.FlightItinerary.Passenger[0].ContactNo;
          await DBA.add_user(Passenger);
          return (res.data);
        }
        else {
          return (res.data);
        }
      }
      else{
        var IsPriceChanged_data ={"ResultIndex": Ticket_lcc_data.ResultIndex,"TraceId": Ticket_lcc_data.TraceId}
        var updated_price = await get_FareQuote_data(IsPriceChanged_data);
        updated_price["IsPriceChanged"] = true;
        return(updated_price);
      }
      
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
        "BookingId": Ticket_no_lcc_data.BookingId,
        "IsPriceChangeAccepted": Ticket_lcc_data.IsPriceChangeAccepted
        
      })
      console.log("pnr details", res.data);
      await DBA.Ticket_Id_info(res.data.Response.Response.BookingId,res.data.Response.Response.FlightItinerary.Passenger);
      var Passenger = {};
      Passenger["Email"] = res.data.Response.Response.FlightItinerary.Passenger[0].Email;
      Passenger["Mobile_no"] = res.data.Response.Response.FlightItinerary.Passenger[0].ContactNo;
      await DBA.add_user(Passenger);
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
    console.log(" cancel hold PNR-->", booking_details);
    var find = 0;
    console.log("<-->", find);
    console.log(" cancellation data-->", booking_details);
    var find = await DBA.find_req(booking_details.BookingId);
    console.log("outside if-->", find);
  
    if (find == 1) {
      console.log("inside if -->", find);
      const Source_data = await DBA.get_data(booking_details.BookingId);
      console.log(Source_data);
      const api_url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/ReleasePNRRequest';
      try {
        const res = await axios.post(api_url, {
          "BookingId": booking_details.BookingId,
          "Source": Source_data[0].Ticket_info.Source,
          "EndUserIp": "192.168.1.111",
          "TokenId": process.env.TokenId
        })
  
        console.log("cancellation status", res.data);
        await DBA.Release_PNR(booking_details.BookingId, res.data.Response.ResponseStatus);
  
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
  async function cancel_ticketed(booking_details) {
    var find = 0;
    console.log("<-->", find);
    console.log(" cancellation data-->", booking_details);
    var find = await DBA.find_req(booking_details.BookingId);
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
        await DBA.cancellation_request(booking_details.BookingId, res.data.Response.TicketCRInfo);
  
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
    if (await DBA.find_req(booking_details.BookingId) == 1) {
      try {
        const cancellation_data = await DBA.get_data(booking_details.BookingId);
        console.log("cancellation_data from DBA",cancellation_data);
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
          if(full_details_cancellation.length != 0){await DBA.update_status(booking_details.BookingId,full_details_cancellation);}
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
  module.exports.login = Authenticate;
  module.exports.search = search_result;
  module.exports.get_FareRule = get_FareRule_data;
  module.exports.get_FareQuote = get_FareQuote_data;
  module.exports.ssr_nolcc_req = ssr_no_lcc_req;
  module.exports.ssr_lcc_req = ssr_lcc_req;
  module.exports.Booking_nolcc = Booking_no_lcc;
  module.exports.Ticket_lcc = Ticket_lcc;
  module.exports.Ticket_nolcc = Ticket_no_lcc;
  module.exports.get_booking_info = get_booking_details;
  module.exports.cancel_Cancellation_Charges = cancel_Cancellation_Charges;
  module.exports.cancel_hold_bookings = cancel_hold_bookings;
  module.exports.cancel_ticketed = cancel_ticketed;
  module.exports.cancel_Cancellation_status = cancel_Cancellation_status;
  module.exports.logout = logout;
