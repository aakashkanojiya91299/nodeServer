const axios = require('axios');
//const res = require('express/lib/response');
const DBA = require('../Database/DB.js');
//var request = require('request');
const xml2js = require('xml2js');
const util = require('util');
const fs = require('fs');
//console.time('test');
//var json2xml = require('json2xml');
// var dataconjson;
// const parser = new xml2js.Parser({
// 	async: true
// });
var convert = require('xml-js');

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
    console.log("tvp--data",search_data);
    var res = 0;
if(search_data.JourneyType == 1){
    try{
    var Return_Journey = `<air:SearchAirLeg>\r\n\t\t\t\t<air:SearchOrigin>\r\n\t\t\t\t\t
    <common:CityOrAirport Code="`+ search_data.ReturnSegment.Origin+`"/>\r\n\t\t\t\t
    </air:SearchOrigin>\r\n\t\t\t\t
    <air:SearchDestination>\r\n\t\t\t\t\t<common:CityOrAirport Code="`+search_data.ReturnSegment.Destination+`"/>
    \r\n\t\t\t\t</air:SearchDestination>\r\n\t\t\t\t
    <air:SearchDepTime PreferredTime="`+ search_data.ReturnSegment.DepartureDate+`"/>\r\n\t\t\t
    </air:SearchAirLeg>\r\n\t\t\t`
    }
    catch(e){
        return("error check return segment ");
    }
}
    var source = `<air:PreferredProviders>\r\n\t\t\t\t\t<common:Provider Code="1G"/>\r\n\t\t\t\t </air:PreferredProviders>\r\n\t\t\t`

    if(search_data.ChildAge!=0 && search_data.ChildAge!= undefined && search_data.ChildCount == ((search_data.ChildAge.CnAge).length))
    {
        var child = ``
        for(let i = 0 ; i < (search_data.ChildAge.CnAge).length;i++){
            child = child+`<common:SearchPassenger Code="CNN" Age="`+search_data.ChildAge.CnAge[i]+`" BookingTravelerRef="IAmvmlf5SO+ZVfy5o8VPuA==`+i+`"/>\r\n\t\t\t`
        //console.log(child);
        
        }
    }
    else{
        return({
            "error":"Please Check Child info"
        })
    }
    if(search_data.InfantAge != 0 && search_data.InfantAge != undefined && search_data.InfantCount == ((search_data.InfantAge.InAge).length)){
        var infant = ``
        for(let i = 0 ; i < (search_data.InfantAge.InAge).length;i++){
        infant = infant + `<common:SearchPassenger Code="INF" Age="`+search_data.InfantAge.InAge[i]+`" PricePTCOnly="true" BookingTravelerRef="8hLudMvaTjOj4QViG7Dz2A==`+i+`"/>\r\n\t\t\t`
        //console.log(infant);
        }
    }
    else{
        return({
            "error":"Please Check Infant info"
        })
    }
    var Adult = ``
    for(let i = 0;i < (search_data.AdultCount);i++){
    Adult = Adult+`<common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw==`+i+`"/>\r\n\t\t\t`
    }
    console.log("--inside TVP---", search_data);

    var data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\r\n\t<soapenv:Header/>
    \r\n\t<soapenv:Body>\r\n\t\t<air:LowFareSearchReq AuthorizedBy="uAPI5393466565-37810389" SolutionResult="false" TargetBranch="P7182092" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39053" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd">
    \r\n\t\t\t<common:BillingPointOfSaleInfo OriginApplication="uAPI"/>\r\n\t\t\t
    <air:SearchAirLeg>\r\n\t\t\t\t
    <air:SearchOrigin>\r\n\t\t\t\t\t<common:CityOrAirport Code="`+ search_data.Segments.Origin+ `"/>\r\n\t\t\t\t
    </air:SearchOrigin>\r\n\t\t\t\t<air:SearchDestination>\r\n\t\t\t\t\t
    <common:CityOrAirport Code="`+ search_data.Segments.Destination+ `"/>\r\n\t\t\t\t
    </air:SearchDestination>\r\n\t\t\t\t
    <air:SearchDepTime PreferredTime="`+ search_data.Segments.DepartureDate +`"/>\r\n\t\t\t
    </air:SearchAirLeg>\r\n\t\t\t<air:AirSearchModifiers>\r\n\t\t\t\t`+source+`
    </air:AirSearchModifiers>\r\n\t\t\t`+Adult+`
    \r\n\t\t\t
    `+child+infant+`\r\n\t\t\t<air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" CurrencyType="INR"/>\r\n\t\t\t<air:FareRulesFilterCategory>\r\n\t\t\t\t
    <air:CategoryCode>CHG</air:CategoryCode>\r\n\t\t\t</air:FareRulesFilterCategory>\r\n\t\t</air:LowFareSearchReq>\r\n\t</soapenv:Body>\r\n</soapenv:Envelope> 
`
fs.writeFile("xml.txt", data, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("xml.txt", "utf8"));
    }
  });
    var config = {
        method: 'post',
        url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
        headers: {
            // 'Authorization': 'Basic VW5pdmVyc2FsIEFQSS91QVBJNTM5MzQ2NjU2NS0zNzgxMDM4OTprUyY0QzVjX2JH',
            'Authorization': 'Basic ' + Buffer.from(process.env.Username + ':' + process.env.Password_TVP).toString('base64'),
            'Content-Type': 'application/xml'
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            //console.log(response.data);
            res = response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
    try {
        var result2 = convert.xml2js(res, { compact: true, spaces: 4, attributesKey: 'attributes', nativeTypeAttributes: true, elementNameFn: function (val) { return val.replace('SOAP:', ''); }, elementNameFn: function (val) { return val.replace('air:', ''); }, nativeType: true });
        //console.log(result2);
        console.log("tvp data ", result2);
        var values = Object.values(result2)
        var final = Object.values(values[0]);
        return (final[1]);
    }
    catch (e) {
        console.log(e);
        return ("sorry api wrongs");
    }



}

module.exports.search = search;