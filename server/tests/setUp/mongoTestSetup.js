import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo;

async function connectTestDB(){
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
}

/*
 * Clear all collections after each test
 */
async function clearTestDB() {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

/*
 * Disconnect and stop MongoDB
 */
async function disconnectTestDB() {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
}

export {connectTestDB , clearTestDB, disconnectTestDB};