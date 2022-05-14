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
        else{
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
        else{
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
    var Passenger = {}
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
            const Type = "TBO";
            await DBA.BandT(res.data.bookingId, Type);
            Passenger["Email"] = Passenger_info.DeliveryInfo.emails[0];
            Passenger["Mobile_no"] = Passenger_info.DeliveryInfo.contacts[0];
            await DBA.add_user(Passenger);

            return (res.data);
        }
        else{
            logger.info("booking Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while booking", errordata);
    }

}
async function Booking_Hold(Passenger_info) { 
    logger.info("booking hold Request body", {
        "bookingId": Passenger_info.ID,
        "travellerInfo": Passenger_info.TravellerInfo,
        "deliveryInfo": Passenger_info.DeliveryInfo,
        "gstInfo": Passenger_info.GSTInfo
    })
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
            logger.info("hold booking Response body", error.response.data);

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
            logger.info("hold booking Response body", res.data);
            const Type = "TBO";
            await DBA.BandT(res.data.bookingId, Type);
            Passenger["Email"] = Passenger_info.DeliveryInfo.emails[0];
            Passenger["Mobile_no"] = Passenger_info.DeliveryInfo.contacts[0];
            await DBA.add_user(Passenger);
            return (res.data);
        }
        else{
            logger.info("hold booking  Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while hold booking", errordata);
    }
}
async function Confirm_Fare_Before_Ticket(ID) {
    logger.info("Fare Conformtion Before Ticketting Request body", {
        "bookingId": ID.id
    })
    var errordata = 0;
    console.log("----->", ID);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/fare-validate';
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
            logger.info("Fare Conformtion Response body", error.response.data);

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
            logger.info("Fare Conformtion body", res.data);
            return (res.data);
        }
        else{
            logger.info("Fare Conformtion Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while Getting Fare Conformtion", errordata);
    }
 }
async function Book_Service_Confirm_Hold_Book(Passenger_info) { 
    logger.info("booking Request body", {
        "bookingId": Passenger_info.ID,
        "paymentInfos": Passenger_info.paymentInfo
    })
    var errordata = 0;
    console.log("----->", Passenger_info);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/confirm-book';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    //alert('Start of try runs');
    const res = await axios.post(api_url, {
        "bookingId": Passenger_info.ID,
        "paymentInfos": Passenger_info.paymentInfo
    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("hold booking Response body", error.response.data);

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
            logger.info("hold booking Response body", res.data);
            return (res.data);
        }
        else{
            logger.info("hold booking Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while hold booking", errordata);
    }

}
async function Booking_Details(ID) {
    logger.info("booking Details Request body", {
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
        else{
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
async function Seat_Service(ID) {
    logger.info("Seat_Service Request body", {
        "bookingId": ID.id
    })
    var errordata = 0;
    console.log("----->", ID);
    const api_url = 'https://apitest.tripjack.com/fms/v1/seat';
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
            logger.info("Seat_Service Response body", error.response.data);

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
            logger.info("Seat_Service Response body", res.data);
            return (res.data);
        }
        else{
            logger.info("Seat_Service Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while Seat_Service", errordata);
    }
 }

async function Get_Amendment_Charges(Tripe_ID) { 
    logger.info("Get_Amendment_Charges Request body", {
        
            "bookingId": Tripe_ID.id,
            "type": Tripe_ID.type,
            "trips": Tripe_ID.trips
    })
    var errordata = 0;
    console.log("----->", Tripe_ID);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/amendment/amendment-charges';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    //alert('Start of try runs');
    const res = await axios.post(api_url, {
        "bookingId": Tripe_ID.id,
        "type": Tripe_ID.type,
        "trips": Tripe_ID.trips

    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("Get_Amendment_Charges Response body", error.response.data);

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
            logger.info("Get_Amendment_Charges Response body", res.data);
            return (res.data);
        }
        else{
            logger.info("Get_Amendment_Charges Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while Getting_Amendment_Charges", errordata);
    }
}
async function Submit_Amendment(Cancellation_info) { 
    logger.info("Submit_Amendment Request body", {
        
            "bookingId": Cancellation_info.id,
            "type": Cancellation_info.type,
            "remarks":Cancellation_info.remarks,
            "trips":Cancellation_info.trips
    })
    var errordata = 0;
    console.log("----->", Cancellation_info);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/amendment/submit-amendment';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    //alert('Start of try runs');
    const res = await axios.post(api_url, {
        "bookingId": Cancellation_info.id,
        "type": Cancellation_info.type,
        "remarks":Cancellation_info.remarks,
        "trips":Cancellation_info.trips

    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("Submit_Amendment Response body", error.response.data);

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
            logger.info("Submit_Amendment Response body", res.data);
            return (res.data);
        }
        else{
            logger.info("Submit_Amendment Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while Submit_Amendment", errordata);
    }
}
async function Amendment_Details(Cancellation_Details) {
    logger.info("Amendment_Details Request body", {
        "amendmentId": Cancellation_Details.id
})
var errordata = 0;
console.log("----->", Cancellation_Details);
const api_url = 'https://apitest.tripjack.com/oms/v1/air/amendment/amendment-details';
const headers = {
    'apikey': process.env.APK_Key,
    'Content-Type': 'application/json'
}

//alert('Start of try runs');
const res = await axios.post(api_url, {
        "amendmentId": Cancellation_Details.id
}, { headers }).catch(function (error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("data-->", error.response.data);
        errordata = error.response.data;
        console.log("status", error.response.status);
        console.log("header--->", error.response.headers);
        logger.info("Amendment_Details Response body", error.response.data);

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
        logger.info("Amendment_Details Response body", res.data);
        return (res.data);
    }
    else{
        logger.info("Amendment_Details Response body", res.data);
        return (res.data);
    }
    // alert('End of try (never reached)');
}
catch (e) {
    console.log(e);
    return ("Error while Amendment_Details", errordata);
}
 }

async function Release_PNR_Hold(PNR_info) {
    logger.info("Releasing PNR Request body", {
        "bookingId": PNR_info.id,
        "pnrs": PNR_info.PNRS
    })
    var errordata = 0;
    console.log("----->", PNR_info);
    const api_url = 'https://apitest.tripjack.com/oms/v1/air/unhold';
    const headers = {
        'apikey': process.env.APK_Key,
        'Content-Type': 'application/json'
    }

    //alert('Start of try runs');
    const res = await axios.post(api_url, {
        "bookingId": PNR_info.id,
        "pnrs": PNR_info.PNRS

    }, { headers }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("data-->", error.response.data);
            errordata = error.response.data;
            console.log("status", error.response.status);
            console.log("header--->", error.response.headers);
            logger.info("Releasing PNR Response body", error.response.data);

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
            logger.info("Releasing PNR Response body", res.data);
            return (res.data);
        }
        else{
            logger.info("Releasing PNR Response body", res.data);
            return (res.data);
        }
        // alert('End of try (never reached)');
    }
    catch (e) {
        console.log(e);
        return ("Error while Releasing PNR", errordata);
    }
 }

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

