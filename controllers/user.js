const express=require("express");
const router= express.Router({mergeParams:true});
const User=require("../models/user.js");


module.exports.getSignupForm=(req,res)=>{
    res.render("signup.ejs");
}


module.exports.userRegisted=async (req,res,next)=>{
  try{
    let {username,gmail,password}=req.body;
    let newUser=await new User({gmail,username});
    let Registered=await User.register(newUser,password);
    req.login(Registered,(err)=>{
      if(err){
        next(err);
      }
      req.flash("success","Welcome to Wanderlust");
      res.redirect("/listing");
    })  
  }
  catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
  }    
}


module.exports.getLoginForm=(req,res)=>{
    res.render("login.ejs");
}


module.exports.userLogged=(req,res)=>{
    req.flash("success","Logged Successfully");
    let previous=res.locals.Redirect || "/listing";
    res.redirect(previous);
}


module.exports.userLogout=(req,res)=>{
    req.logout((err)=>{
    if(err){
      req.flash("error",err.message);
    }
    req.flash("success","You are logged out");
    res.redirect("/listing");
    })
}