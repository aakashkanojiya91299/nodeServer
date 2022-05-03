const axios = require('axios');
const res = require('express/lib/response');
const DBA = require('../Database/DB.js')
var alert = require('alert');
const winston = require('winston');

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

async function search(search_data) {
    var errordata = 0;
    logger.info("Search Request body", {
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
    });
    const api_url = 'https://apitest.tripjack.com/fms/v1/air-search-all';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

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
    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("search Response body", error.response.data);

        }
        if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log("Data request->",error.request.data);


        }
    });

    try {

        if (res.data.status.success == true) {
            console.log("---->", res.data);
            logger.info("Search Response body", res.data);
            return (res.data);
        }
        //logger.info("Search Response body", res.data);
        return (res.data);
    }
    catch (e) {
        console.log(e);
        return ("error at server side Check the Search data and Try Again", errordata);
    }
}
async function review(Priceid) {
    logger.info("Review Request body", {
        "priceIds": Priceid.id
    });
    console.log(Priceid.Id)
    const api_url = 'https://apitest.tripjack.com/fms/v1/review';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }
    const res = await axios.post(api_url,
        {
            "priceIds": Priceid.id
        }
        , { headers }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("data-->", error.response.data);
                errordata = error.response.data;
                console.log("status", error.response.status);
                console.log("header--->", error.response.headers);
                logger.info("Review Response body", error.response.data);

            }
            if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                //console.log("Data request->",error.request.data);


            }
        })
    // .then(function(response) {
    //     console.log("--->",response.data);
    //  }).finally((response) => {
    //     console.log("--->",response);
    //     return(response);
    //   });
    try {

        console.log("send data-->", res.data);
        logger.info("Review Response body", res.data);
        return (res.data);
    } catch (e) {
        return ("error while getting data", errordata);
    }



}
async function farerule_search(Fare_Rule_data) {
    var errordata = 0;
    console.log(Fare_Rule_data)
    const api_url = 'https://apitest.tripjack.com/fms/v1/farerule';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    const res = await axios.post(api_url, {

        "id": Fare_Rule_data.id,
        "flowType": Fare_Rule_data.flowType

    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            //logger.info("Review Response body", error.response.data);

        }
        if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log("Data request->",error.request.data);


        }
    });

    try {
        if (res.data.status.success == true) {
            return (res.data);
        }
    }
    catch (e) {
        console.log(e);
        return ("review Error while getting data", errordata);
    }
}

async function Booking_Instant_Ticket(Passenger_info) {
    logger.info("booking Request body", {
        "bookingId": Passenger_info.ID,
        "paymentInfos": Passenger_info.paymentInfo,
        "travellerInfo": Passenger_info.TravellerInfo,
        "deliveryInfo": Passenger_info.DeliveryInfo,
        "gstInfo": Passenger_info.GSTInfo
    })
    var Passenger = {};
    var errordata = 0;
    console.log("----->", Passenger_info);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/book';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    //alert('Start of try runs');
    const res = await axios.post(api_url, {
        "bookingId": Passenger_info.ID,
        "paymentInfos": Passenger_info.paymentInfo,
        "travellerInfo": Passenger_info.TravellerInfo,
        "deliveryInfo": Passenger_info.DeliveryInfo,
        "gstInfo": Passenger_info.GSTInfo
    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("booking Response body", error.response.data);

        }
        if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log("Data request->",error.request.data);


        }
    });
    try {
        console.log("----->", res.data);
        if (res.data.status.success == true) {
            logger.info("booking Response body", res.data);
            Passenger["Email"] = res.data.order.deliveryInfo.emails[0];
            Passenger["Mobile_no"] = res.data.order.deliveryInfo.contacts[0];
            await DBA.add_user(Passenger);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while booking", errordata);
    }

}
async function Booking_Hold() { }
async function Confirm_Fare_Before_Ticket() { }
async function Book_Service_Confirm_Hold_Book() { }
async function Booking_Details(ID) {
    logger.info("booking Request body", {
        "bookingId": ID.id
    })
    var errordata = 0;
    console.log("----->", ID);
    const api_url = 'https://apitest.tripjack.com/oms/v1/booking-details';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    //alert('Start of try runs');
    const res = await axios.post(api_url, {
        "bookingId": ID.id

    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("getting booking Response body", error.response.data);

        }
        if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log("Data request->",error.request.data);


        }
    });
    try {
        console.log("----->", res.data);
        if (res.data.status.success == true) {
            logger.info("getting booking Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while booking details", errordata);
    }
}
async function Seat_Service() { }
async function Get_Amendment_Charges() { }
async function Submit_Amendment() { }
async function Amendment_Details() { }
async function Release_PNR_Hold() { }

module.exports.search = search;
module.exports.getPrice = review;
module.exports.FareRule_search = farerule_search;
module.exports.BIT = Booking_Instant_Ticket;
module.exports.BHD = Booking_Hold;
module.exports.CFBT = Confirm_Fare_Before_Ticket;
module.exports.BSCHB = Book_Service_Confirm_Hold_Book;
module.exports.BD = Booking_Details;
module.exports.SAS = Seat_Service;
module.exports.GAC = Get_Amendment_Charges;
module.exports.SA = Submit_Amendment;
module.exports.AD = Amendment_Details;
module.exports.RPH = Release_PNR_Hold;
