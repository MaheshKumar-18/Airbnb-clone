const mongoose = require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    gmail:{
        type:String,
        require:true,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema)