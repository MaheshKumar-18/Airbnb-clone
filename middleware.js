const listing=require("./models/index.js");
const review=require("./models/reviews.js");
const {reviewSchema,joiSchema}=require("./jio.js");
const AppError=require("./error.js");



// Checking Whether the User is Logged or Not
module.exports.islogged=function(req,res,next){
     if(!req.isAuthenticated()){ 
          req.session.Redirect=req.originalUrl;
          req.flash("error","You must be logged to Create Listing! ")
          return res.redirect("/login");
     }
     next();
}



module.exports.redirectTo=function(req,res,next){
     if(req.session.Redirect){
          res.locals.Redirect= req.session.Redirect;
     }
     next();    
}


// Checking Whether the User is Owner ot Not
module.exports.isOwner= async function(req,res,next){
     let {id}=req.params;
     let post=await listing.findById(id);
     if(!post.owner.equals(req.user._id)){
          req.flash("error","You don't have permission to Edit or Delete");
          return res.redirect("/listing");
     }
     next();
}



// Checking Whether the User is Author or Not
module.exports.isReviewAuthor= async function(req,res,next){
     let {id,reviewId}=req.params;
     let currReview =await review.findById(reviewId);
     if(!currReview.author._id.equals(req.user._id)){
          req.flash("error","You Are not having Permission to Delete The Review");
          return res.redirect(`/listing/${id}`);
     }
     next();
}



// Serverside validation for review
module.exports.reviewRating = (req, res, next) => {
  const { error} = reviewSchema.validate(req.body); 
  if (error) {
    throw new AppError(error, 400);
  }
  next();
};



// Serverside Validation for Listings
module.exports.listingValidation= (req, res, next) => {
  const { error} = joiSchema.validate(req.body); 
  if (error) {
    throw new AppError(error, 400);
  }
  next();
};