import mongoose, { ConnectOptions } from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGO_URI) {
    throw new Error(
      'Please define the MONGO_URI environment variable inside .env.local'
    );
  }

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: 'twitter-xx',
      autoCreate: true,
    };
    await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;

    console.log('MongoDB connected ✔✔✔✔');
  } catch (error) {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ',
      error
    );
  }
};
