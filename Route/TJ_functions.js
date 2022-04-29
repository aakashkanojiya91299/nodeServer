const axios = require('axios');
const res = require('express/lib/response');
const DBA = require('../Database/DB.js')
var alert = require('alert');

async function search(search_data) {

    const api_url = 'https://apitest.tripjack.com/fms/v1/air-search-all';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }
    try {
        const res = await axios.post(api_url, {
            "searchQuery":
            {
                "cabinClass": search_data.cabinClass,
                "paxInfo":
                {
                    "ADULT": search_data.AdultCount,
                    "CHILD": search_data.ChildCount,
                    "INFANT": search_data.InfantCount
                },
                "routeInfos": search_data.routeInfos,
                "searchModifiers": {
                    "isDirectFlight": false,
                    "isConnectingFlight": false
                },
                "preferredAirline": search_data.preferredAirline
            }
        }, { headers })
        if (res.data.status.success == true) {
            return (res.data);
        }

    }
    catch (e) {
        console.log(e);
        return ("error at server side Check the Search data and Try Again");
    }
}
async function review(Priceid) {
    console.log(Priceid.Id)
    const api_url = 'https://apitest.tripjack.com/fms/v1/review';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }
    try {
        
        //alert('Start of try runs');
        const res = await axios.post(api_url, {

            "priceIds": Priceid.Id

        },{ headers });
        
        console.log("----->",res.data);
        
          if (res.data.status.success == true) {
            return (res.data);
          
        }
        
        
        //alert('End of try (never reached)');
        
    }
    catch (e) {
        console.log(e);
        return("review Error while getting data");
    }
    
}
async function farerule_search(Fare_Rule_data){
    console.log(Fare_Rule_data)
    const api_url = 'https://apitest.tripjack.com/fms/v1/farerule';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }
    try {
        const res = await axios.post(api_url, {

            "id": Fare_Rule_data.id,
            "flowType": Fare_Rule_data.flowType

        },{ headers });
          if (res.data.status.success == true) {
            return (res.data);
        }
    }
    catch (e) {
        console.log(e);
        return("review Error while getting data");
    }
}

async function Booking_Instant_Ticket(Passenger_info){
    console.log("----->",Passenger_info);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/book';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }
    // try {
        //alert('Start of try runs');
        const res = await axios.post(api_url, {
                "bookingId": Passenger_info.ID,
                "paymentInfos":Passenger_info.paymentInfo,
                "travellerInfo":Passenger_info.TravellerInfo,
                "deliveryInfo": Passenger_info.DeliveryInfo,
                "gstInfo":Passenger_info.GSTInfo,
                "contacts":Passenger_info.ContactInfo    
        },{ headers });
        
        console.log("----->",res.data);
          if (res.data.status.success == true) {
            return (res.data);
        }
        //alert('End of try (never reached)');
    // }
    // catch (e) {
    //     console.log(e);
    //     return("Error while booking");
    // }
     
}
async function Booking_Hold(){}
async function Confirm_Fare_Before_Ticket(){}
async function Book_Service_Confirm_Hold_Book(){}
async function Booking_Details(){}
async function Seat_Service(){}
async function Get_Amendment_Charges(){}
async function Submit_Amendment(){}
async function Amendment_Details(){}
async function Release_PNR_Hold(){}

module.exports.search = search;
module.exports.getPrice = review;
module.exports.FareRule_search = farerule_search;
module.exports.BIT = Booking_Instant_Ticket;
module.exports.BHD =  Booking_Hold ;
module.exports.CFBT =  Confirm_Fare_Before_Ticket;
module.exports.BSCHB =  Book_Service_Confirm_Hold_Book;
module.exports.BD =  Booking_Details;
module.exports.SAS =  Seat_Service;
module.exports.GAC =  Get_Amendment_Charges;
module.exports.SA = Submit_Amendment;
module.exports.AD = Amendment_Details;
module.exports.RPH = Release_PNR_Hold;
