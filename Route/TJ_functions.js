const axios = require('axios');
const res = require('express/lib/response');
const DBA = require('../Database/DB.js')

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
        const res = await axios.post(api_url, {

            "priceIds": Priceid.Id

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

module.exports.search = search;
module.exports.getPrice = review;
module.exports.FareRule_search = farerule_search;