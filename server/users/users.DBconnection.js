const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        //  To change DBname
        //  MONGO_URI = mongodb+srv://name:password@next.txdcl.mongodb.net/(ADD NAME DB)?retryWrites=true&w=majority
        const con = await mongoose.connect(process.env.COMPANY_DB_URI, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;