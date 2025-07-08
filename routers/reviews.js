const express=require("express");
const router= express.Router({mergeParams:true});
const {islogged,isReviewAuthor} = require("../middleware.js");
const controllersListing=require("../controllers/reviews.js");
const {reviewRating} =require("../middleware.js");


// For new Review
router.post("/",reviewRating,controllersListing.newReview);


// to delete Review
router.delete("/:reviewId",islogged,isReviewAuthor,controllersListing.deleteReview);

module.exports=router;