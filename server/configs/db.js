import mongoose from "mongoose";

async function connectDb(){
  try {
    await mongoose.connect(process.env.MONGODB_URL,{
      autoIndex: false
    });
    console.log("MongoDb connected!!")
    // console.log(mongoose.connection.host);
  } catch (error) {
    console.log("[MongoDB connection error]: ", error.message);
    throw error;
  }
}

export default connectDb;

// '0': 'disconnected',
// '1': 'connected',
// '2': 'connecting',
// '3': 'disconnecting',
// '99': 'uninitialized',
// console.log("------------")
//console.log(conn.STATES);