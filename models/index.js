const mongoose = require("mongoose");
const data=require("../init/data.js");
const Review=require("./reviews.js");


const listingSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
    filename:String,
    url:{
      type: String,
      required:true
    }},
    price: Number,
    location: String,
    country: String,
    reviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category:{
      type:String,
      enum:["trending","rooms","iconic cities","mountains","castles","amazing pools","camping","farms","arctic"],
      required:true,
      default:"trending"
    },
    geolocation:{
      latitude:Number,
      longitude:Number,
    }
  }); 
  

//  if Listing Deleted all the Reviews of listing will be deleted from Review Schema

 listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
    }    
 });

const Listing = mongoose.model("Listing", listingSchema);

async function calling(){
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
}

module.exports=Listing;
  


