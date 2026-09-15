const captainServices = require("../services/captain.service")
const captainModel = require("../models/captain.model");
const { validationResult } = require('express-validator');
const blackListTokenModel = require("../models/blacklistToken.model")


module.exports.registerCaptain = async(req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }

    let {fullname,email,password,vehicle} = req.body;

    let isEmail = await captainModel.findOne({email})
    if(isEmail){
        return res.status(400).json({message:"User already exist"})
    }

    let hashPassword =await captainModel.hashPassword(password);

    let captain = await captainServices.createCaptain({
        firstname:fullname.firstname,
         lastname:fullname.lastname,
        email,
        password:hashPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    })

    let token = captain.generateAuthToken();

    res.status(200).json({token:token})


}


module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.profileCaptain = async (req,res,next)=>{
    res.status(200).json({captain: req.captain})

}

module.exports.logoutCaptain = async(req,res,next)=>{
    let token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];;
    await  blackListTokenModel.create({token});

    res.clearCookie('token');
    res.status(200).json({message:"Logout succefully"})

}