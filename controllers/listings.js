const listing=require("../models/index.js");
const getCoordinates = require('../geocoding.js');



// Display  All Listings
module.exports.index=async (req,res)=>{
  let allListing;
  let searchedQuery=req.query.search;
  if(typeof searchedQuery=="string" && searchedQuery!=="undefined"){ 
    allListing=await listing.find({title:{ $regex:searchedQuery,$options:"i"}});
    if(allListing==""){
      req.flash("error","Your Search did not Match Any Listing");
      return res.redirect("/listing");
    }
  }
  else{
    allListing= await listing.find({}); 
  } 
  res.render("index.ejs",{allListing});
}


// Get New Listing Form
module.exports.getNewListingForm=(req,res)=>{
  res.render("new.ejs");
}


// new listing
module.exports.newListing=async (req,res)=>{
    let url= await req.file.path;
    let filename= await req.file.filename;
    let post =  await new listing(req.body.listing);
    post.owner=req.user._id;
    post.image={url,filename};
    const coords= await getCoordinates(post.location);
    if(coords){
      post.geolocation.latitude=coords.latitude;
      post.geolocation.longitude=coords.longitude;
    }
    await post.save();
    req.flash("success","New Listing is Added..");
    res.redirect("/listing");
}


// to get edit form
module.exports.getEditForm=async (req,res)=>{
    let {id}= req.params;
    let form=await listing.findById(id);
    let previousImage=form.image.url;
    let editedPreviousImage=previousImage.replace("/upload","/upload/e_blur:300");
   res.render("edit.ejs",{form,editedPreviousImage});
}


//updated
module.exports.listingEdited=async (req,res)=>{
    let {id}=req.params;
    let {title,description,image,category,price,location,country}=req.body;
    const coords= await getCoordinates(req.body.location);
    let updated=await listing.findByIdAndUpdate(id,{title:title,description:description,'image.url':image,category:category,price:price,location:location,country:country,'geolocation.latitude':coords.latitude,'geolocation.longitude':coords.longitude});
    if(req.file){
      let url=req.file.path;
      let filename=req.file.filename;
      updated.image={url,filename};
      await updated.save();
    }
    req.flash("success","Edited Successfully");
    res.redirect(`/listing/${id}`);
}


// Deleting the listing
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!!");
    res.redirect("/listing");
}


// show Listing
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const categories = ["trending","rooms","iconic cities","mountains","castles","amazing pools","camping","farms","arctic",];
    if(categories.includes(id)){
      let posts= await listing.find({category:id});
      const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
      return res.render("filter.ejs",{posts,id:capitalizedId});
    }
    let details=await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");

    if(!details){
      req.flash("error","Listing You Requested does not exist");
      return res.redirect("/listing");
    }
    res.render("show.ejs",{details});
}