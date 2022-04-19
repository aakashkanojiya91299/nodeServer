const { MongoClient } = require('mongodb');
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
  module.exports.pnr_info = mogo_pnr_info;
  module.exports.Ticket_Id_info = mogo_Ticket_Id_info;
  module.exports.cancellation_request = mogo_cancellation_request;
  module.exports.add_user = mogo_add_user;
  module.exports.find_req = mogo_find_req;
  module.exports.get_data = mongo_get_data;
  module.exports.update_status = mongo_update_status;
