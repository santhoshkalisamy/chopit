import mongoose from 'mongoose';

if(!process.env.MONGODB_URI) {
  throw new Error('Mongo URI is missing');
}

const MONGODB_URI = process.env.MONGODB_URI;


interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function disconnect() {
  if (!connection.isConnected) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    await mongoose.disconnect();
    connection.isConnected = 0;
  }
}

const db = { dbConnect, disconnect };
export default db;
