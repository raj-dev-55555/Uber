const userModel = require("../models/user.model")
const userService = require('../services/user.servics');
const { validationResult } = require('express-validator');
const blackListTokenModel = require("../models/blacklistToken.model")



module.exports.registerUser = async (req, res, next) => {
      const errors = validationResult(req);//Iska matlab:req ke andar jo validation rules lagaye gaye the, unka result check karo aur errors ko errors variable mein store karo.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });



}

module.exports.loginUser = async(req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    let {email,password} = req.body;
    let user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(500).json({message:"email or password wrong"})
    }

    const isMatch = await user.comparePassword(password);
     if(!isMatch){
        return res.status(500).json({message:"email or password wrong"})
    }
    const token = user.generateAuthToken();
    res.cookie('token',token)
    res.status(200).json({
    token,
    user
})
}

module.exports.profileUser = async(req,res,next)=>{
    res.status(200).json(req.user)
}

module.exports.logoutUser = async (req, res, next) => {
   
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });
     res.clearCookie('token');

    res.status(200).json({ message: 'Logged out' });

}