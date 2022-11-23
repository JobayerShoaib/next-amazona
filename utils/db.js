import mongoose from "mongoose";
const connection = {};
async function connect() {
  if (connection.isConneted) {
    console.log("already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConneted = mongoose.connections[0].readyState;
    if (connection.isConneted === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log("new connection");
  connection.isConneted = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConneted) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConneted = false;
    } else {
      console.log("not disconnected");
    }
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect ,convertDocToObj};
export default db;
