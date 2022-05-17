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
    
    // var options = {
    //   'method': 'POST',
    //   'url': 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
    //   'headers': {
    //     'Authorization': 'Basic VW5pdmVyc2FsIEFQSS91QVBJNTM5MzQ2NjU2NS0zNzgxMDM4OTprUyY0QzVjX2JH',
    //     'Content-Type': 'application/xml'
    //   },
    //   body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\r\n	<soapenv:Header/>\r\n	<soapenv:Body>\r\n		<air:LowFareSearchReq AuthorizedBy="uAPI5393466565-37810389" SolutionResult="false" TargetBranch="P7182092" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39053" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd">\r\n			<common:BillingPointOfSaleInfo OriginApplication="uAPI"/>\r\n			<air:SearchAirLeg>\r\n				<air:SearchOrigin>\r\n					<common:CityOrAirport Code="DEL"/>\r\n				</air:SearchOrigin>\r\n				<air:SearchDestination>\r\n					<common:CityOrAirport Code="BOM"/>\r\n				</air:SearchDestination>\r\n				<air:SearchDepTime PreferredTime="2022-12-10"/>\r\n			</air:SearchAirLeg>\r\n			<air:SearchAirLeg>\r\n				<air:SearchOrigin>\r\n					<common:CityOrAirport Code="BOM"/>\r\n				</air:SearchOrigin>\r\n				<air:SearchDestination>\r\n					<common:CityOrAirport Code="DEL"/>\r\n				</air:SearchDestination>\r\n				<air:SearchDepTime PreferredTime="2022-12-18"/>\r\n			</air:SearchAirLeg>\r\n			<air:AirSearchModifiers>\r\n				<air:PreferredProviders>\r\n					<common:Provider Code="1G"/>\r\n				</air:PreferredProviders>\r\n			</air:AirSearchModifiers>\r\n			<common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw=="/>\r\n			<common:SearchPassenger Code="INF" Age="01" PricePTCOnly="true" BookingTravelerRef="8hLudMvaTjOj4QViG7Dz2A=="/>\r\n			<common:SearchPassenger Code="CNN" Age="10" BookingTravelerRef="IAmvmlf5SO+ZVfy5o8VPuA=="/>\r\n			<air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" CurrencyType="INR"/>\r\n			<air:FareRulesFilterCategory>\r\n				<air:CategoryCode>CHG</air:CategoryCode>\r\n			</air:FareRulesFilterCategory>\r\n		</air:LowFareSearchReq>\r\n	</soapenv:Body>\r\n</soapenv:Envelope>'
    
    // };
    // try{
    //      request(options, function (error, response) {
    //         if (error) throw new Error(error);
    //         console.log(response.body);
    //       });
         
    // }
    // catch(e){
    //     console.log(e);
    //     return(e)
    // }
    var res = 0;
    var DEL = "DEL";
    console.log("--inside TVP---",search_data);
    var data = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\r\n\t<soapenv:Header/>
    \r\n\t<soapenv:Body>\r\n\t\t<air:LowFareSearchReq AuthorizedBy="uAPI5393466565-37810389" SolutionResult="false" TargetBranch="P7182092" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39053" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd">
    \r\n\t\t\t<common:BillingPointOfSaleInfo OriginApplication="uAPI"/>\r\n\t\t\t
    <air:SearchAirLeg>\r\n\t\t\t\t
    <air:SearchOrigin>\r\n\t\t\t\t\t<common:CityOrAirport Code="`+DEL+`"/>\r\n\t\t\t\t
    </air:SearchOrigin>\r\n\t\t\t\t<air:SearchDestination>\r\n\t\t\t\t\t
    <common:CityOrAirport Code="BOM"/>\r\n\t\t\t\t
    </air:SearchDestination>\r\n\t\t\t\t
    <air:SearchDepTime PreferredTime="2022-12-10"/>\r\n\t\t\t
    </air:SearchAirLeg>\r\n\t\t\t
    <air:SearchAirLeg>\r\n\t\t\t\t<air:SearchOrigin>\r\n\t\t\t\t\t
    <common:CityOrAirport Code="BOM"/>\r\n\t\t\t\t
    </air:SearchOrigin>\r\n\t\t\t\t
    <air:SearchDestination>\r\n\t\t\t\t\t<common:CityOrAirport Code="DEL"/>
    \r\n\t\t\t\t</air:SearchDestination>\r\n\t\t\t\t
    <air:SearchDepTime PreferredTime="2022-12-18"/>\r\n\t\t\t
    </air:SearchAirLeg>\r\n\t\t\t<air:AirSearchModifiers>\r\n\t\t\t\t
    <air:PreferredProviders>\r\n\t\t\t\t\t<common:Provider Code="1G"/>\r\n\t\t\t\t
    </air:PreferredProviders>\r\n\t\t\t
    </air:AirSearchModifiers>\r\n\t\t\t
    <common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw=="/>\r\n\t\t\t<common:SearchPassenger Code="INF" Age="01" PricePTCOnly="true" BookingTravelerRef="8hLudMvaTjOj4QViG7Dz2A=="/>\r\n\t\t\t
    <common:SearchPassenger Code="CNN" Age="10" BookingTravelerRef="IAmvmlf5SO+ZVfy5o8VPuA=="/>\r\n\t\t\t<air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" CurrencyType="INR"/>\r\n\t\t\t<air:FareRulesFilterCategory>\r\n\t\t\t\t
    <air:CategoryCode>CHG</air:CategoryCode>\r\n\t\t\t</air:FareRulesFilterCategory>\r\n\t\t</air:LowFareSearchReq>\r\n\t</soapenv:Body>\r\n</soapenv:Envelope> 
`
var options = { compact: true, ignoreComment: true, spaces: 4 , attributesKey: 'attributes'};
var result = convert.xml2json(data, options);
fs.writeFile('json.txt', result, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  var options = { compact: true, ignoreComment: true, spaces: 4};
var result3 = convert.json2xml(search_data, options);
  fs.writeFile('xml.txt', result3, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
    var config = {
        method: 'post',
        url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
        headers: {
            // 'Authorization': 'Basic VW5pdmVyc2FsIEFQSS91QVBJNTM5MzQ2NjU2NS0zNzgxMDM4OTprUyY0QzVjX2JH',
            'Authorization':'Basic ' + Buffer.from(process.env.Username + ':' + process.env.Password_TVP).toString('base64'),
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
        try{
        var result2 = convert.xml2js(res, {compact: true, spaces: 4,attributesKey: 'attributes',nativeTypeAttributes:true,elementNameFn: function(val) {return val.replace('SOAP:','');},elementNameFn: function(val) {return val.replace('air:','');},nativeType:true});
            //console.log(result2);
            console.log("tvp data ",result2);
         var values = Object.values(result2)
         var final = Object.values(values[0]);
            return(final[1]);
        }
        catch(e){
            console.log(e);
            return("sorry api wrongs");
        }
    

    
}

module.exports.search = search;