// import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose';

mongoose.connect(import.meta.env.VITE_MONGODB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
	db.dropCollection('rooms');
});

export default mongoose;
