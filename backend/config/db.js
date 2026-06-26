const mongoose = require('mongoose');
const seedDB = require('./seed');

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        if (process.env.NODE_ENV !== 'production') {
            await seedDB();
        }
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Exit process with failure code if connection fails locally
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1); 
        }
    }
};

module.exports = connectDB;