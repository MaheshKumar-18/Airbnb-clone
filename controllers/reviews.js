const reviews=require("../models/reviews.js");
const listing=require("../models/index.js");


module.exports.newReview=async (req,res)=>{
    let {id}=req.params;
    // let {rating,comment}=req.body.review;
    let newReview= new reviews(req.body.review);
    newReview.author=req.user._id;
    let post=await listing.findById(id);
    await post.reviews.push(newReview._id);
    await post.save();
    await newReview.save();
    req.flash("success","New Review is Added..");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!!");
    res.redirect(`/listing/${id}`);
}