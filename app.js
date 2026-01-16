const express = require('express');
const mongoose = require('mongoose');
const authRoutes=require("./routes/authRoute");
const cookieParser=require("cookie-parser");
const app = express();
const auth=require('./middleware/authMiddleware');
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173"
}));

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/smoothDB';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
console.log("auth=",auth);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',auth, (req, res) =>{ res.render('smoothies')});
app.use(authRoutes);

//cookies
app.get('/set-cookies',(req,res)=>{
  // res.setHeader("Set-cookie","newuser=true",);
  res.cookie("ritzuer",false);
  res.cookie("isUser",true,{maxAge:1000*60*60*24,secure:true});
  res.cookie("User1",true,{maxAge:1000*60*60*24,httpOnly:true});

  res.send("you got the cookie");

});

app.get('/read-cookies',(req,res)=>{
  const cookies=req.cookies;
  console.log(cookies);
  
});