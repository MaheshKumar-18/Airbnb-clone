const express=require("express");
const router= express.Router({mergeParams:true});
const { redirectTo} = require("../middleware.js");
const passport=require("passport");
const controllersUser=require("../controllers/user.js");


router.route("/signup")
  .get(controllersUser.getSignupForm)
  .post(controllersUser.userRegisted);


router.route("/login")
  .get(controllersUser.getLoginForm)
  .post(redirectTo,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),controllersUser.userLogged)
  

router.get("/logout",controllersUser.userLogout);


module.exports=router;