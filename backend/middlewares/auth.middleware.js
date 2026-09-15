const userModel = require("../models/user.model")
const captainModel = require("../models/captain.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require("../models/blacklistToken.model")

module.exports.authUser = async (req, res, next) => {
   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

   if (!token) {
      return res.status(400).json({ message: "Token is Not Valid" })
   }

   const isBlacklisted = await blackListTokenModel.findOne({ token: token }); // yadi token yha huam mtlb userlogout kar chuka hai 
   if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized' });
   }


   try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET) // yadi kise ne khud ka token banaya or bhej diya server ko agar verify nhi lagaynege to server sochega apna he user hai jane do 
      const user = await userModel.findOne(decode.id);

      req.user = user  //is request ke saath ye user associated hai. hum is req par user ka data lekar frontend par show kra sakte haai
      return next();
   } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
   }
}

module.exports.captainAuth = async (req, res, next) => {
   let token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
   if (!token) {
      return res.status(400).json({ message: "Unauthorized" })
   }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token }); // yadi token yha huam mtlb userlogout kar chuka hai 
   if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized' });
   }

   try {
      const decode =  jwt.verify(token, process.env.JWT_SECRET);
      const captain = await captainModel.findOne(decode.id)
      req.captain = captain;
      return next()
   } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });

   }

}