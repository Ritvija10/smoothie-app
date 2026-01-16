const user=require("../models/user");
const jwt =require("jsonwebtoken");
// import dotenv from "dotenv";
// dotenv.config();
const dotenv=require("dotenv").config();
const secret=process.env.JWT_SECRET;

//handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code);
    let error={email:'',password:''};
    //duplicate error code
    if(err.code===11000){
        error.email='this email is already registered';
        return error;
    }
    
    //validation error
    if(err.message.includes('validation failed')){
     
        Object.values(err.errors).forEach(({properties})=>{
          
            error[properties.path]=properties.message;
        });
    }
    
    return error;
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"2m"});
}

module.exports.signup_get=(req,res)=>{
res.render("signup");
};

module.exports.signup_post=async(req,res)=>{
    
const {email,password}=req.body;
try{
 
    const users=await user.create({
        email,
        password,
        
    });
    const token = createToken(users._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    });
  
    

    res.status(201).json({
      message: "Signup successful. Please check your email to verify your account."
});
}
catch(err){
   const errors=handleErrors(err);
    res.status(400).json({errors});
}

};

module.exports.login_get=(req,res)=>{
res.render("login");
};

module.exports.login_post=async(req,res)=>{
    
  const {email,password}=req.body;

try{
const users=await user.login(email,password);

    
    const token = createToken(users._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    });
res.status(200).json({users:users._id});
}
catch(err){
  res.cookie("jwt", "", { maxAge: 1 });
res.status(400).json({
    message:"invalid email or password"
});
}
};
