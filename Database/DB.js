const { MongoClient } = require('mongodb');
var generator = require('generate-password');
const bcrypt = require('bcrypt');



async function GN_Password(){
  var password = generator.generate({
    length: 8,
    numbers: true
  });
  console.log("GN RM",password);
  const saltRounds = 10;
  var ency_password = await hash_function(password,saltRounds);
  return(ency_password);
}

async function hash_function(myPlaintextPassword,saltRounds){
  var password_data = await bcrypt.hash(myPlaintextPassword, saltRounds);
  console.log(password_data);
  return(password_data);
}

//Database Working 
async function mogo_pnr_info(pnr, booking_id, Ticket_info,Type) {
    var url = "mongodb://localhost:27017/";
    const client = new MongoClient(url);
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");
      var customer = { PNR: pnr, Booking_ID: booking_id, Ticket_info,Type };
  
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
  async function mogo_cancellation_Release_PNR_request(booking_id, ticket_info) {
    var url = "mongodb://localhost:27017/";
  
    const client = new MongoClient(url);
    try {
      // Connect to the MongoDB cluster
      await client.connect();
  
      // Make the appropriate DB calls
      const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");
  
      const results = await Collection.findOneAndUpdate({ Booking_ID: booking_id }, { $set: { Remarks: "cancellation_Hold_booking", TicketCRInfo_Hold_Booking: ticket_info } })
  
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
      var flag = 0;
      flag = await find_user(Passenger);
      if( flag == 1) {
        console.log("user exists");
      }
      else{
        var passdata = await GN_Password();
        console.log("Ready to send password-->",passdata);
        var customer = {UserName:Passenger.Email,Mobile_no:Passenger.Mobile_no,Password:passdata};
        var results = await Collection.insertOne(customer);
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  async function find_user(Passenger){
        //var mongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    const client = new MongoClient(url);
    try {
      // Connect to the MongoDB cluster
      await client.connect();
  
      // Make the appropriate DB calls
      const Collection = client.db("flight_pnr_info").collection("user_info");
      const data = Collection.find({ UserName: Passenger.Email});
      const results = await data.toArray();
      console.log(results);
      if (results.length == 1) {
        return (1);
      }
      else {
        return (0);
      }
  
    } catch (e) {
      console.error(e);
    }
  }

  async function mogo_Booking_id_and_type_for_TJ(booking_id,Type) {
    var url = "mongodb://localhost:27017/";
    const client = new MongoClient(url);
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const Collection = client.db("flight_pnr_info").collection("info_pnr_booking");
      var customer = { Booking_ID: booking_id,Type };
  
      var results = await Collection.insertOne(customer);
    }
    catch (e) {
      console.error(e);
    }
  }

  module.exports.pnr_info = mogo_pnr_info;
  module.exports.Ticket_Id_info = mogo_Ticket_Id_info;
  module.exports.cancellation_request = mogo_cancellation_request;
  module.exports.add_user = mogo_add_user;
  module.exports.find_req = mogo_find_req;
  module.exports.get_data = mongo_get_data;
  module.exports.update_status = mongo_update_status;
  module.exports.Release_PNR = mogo_cancellation_Release_PNR_request;
  module.exports.BandT = mogo_Booking_id_and_type_for_TJ;
