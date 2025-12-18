const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect(process.env.DB_URI, {
        serverSelectionTimeoutMS: 5000,
        dbName: process.env.DB_NAME
    });

    mongoose.connection.on("connected", () => {
        console.info("============= Database is connected =============")
    });
}

module.exports = {
    connect
}