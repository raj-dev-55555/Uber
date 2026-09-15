const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require("./routes/captain.routes")
const  cookieParser = require("cookie-parser")
const userModel = require('./models/user.model');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes')





main().then(res=>console.log("Mongo db connected"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
//    console.log("DATABASE:", mongoose.connection.name);
//     console.log("COLLECTION:", userModel.collection.name);

}





app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



app.use('/users', userRoutes);
app.use('/captain',captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/ride',rideRoutes)





app.get("/",(req,res)=>{
    res.send("express is running")
});

module.exports = app;