require("dotenv").config();
const express=require("express");
const app= express();
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const User=require("./models/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const passportLocal=require("passport-local");
const listingRouter=require("./routers/listings.js");
const reviewsRouter=require("./routers/reviews.js");
const userRouter=require("./routers/user.js");
const mongoose = require("mongoose");
const MongoStore=require("connect-mongo")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const mongodbUrl= process.env.MONGODBURL;



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongodbUrl);
}



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,'public')));

const store =MongoStore.create({
  mongoUrl:mongodbUrl,
  crypto:{
       secret:process.env.SECRET,
  },
  touchAfter:24*30*30,
})
app.use(session({
  store,
  secret:process.env.SECRET,
  saveUninitialized:true,
  resave:false,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.use("/",userRouter);
app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewsRouter);


app.use((err, req, res, next) =>{
  res.status(500).render("error.ejs", { err });
});

app.listen(9090,(req,res)=>{
  console.log("Server is listening")
});

