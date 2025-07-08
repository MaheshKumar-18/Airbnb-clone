const express=require("express");
const router= express.Router({mergeParams:true});
const {islogged,isOwner} = require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudsetup.js");
const upload=multer({storage});
const controllersListing=require("../controllers/listings.js")
const {listingValidation}= require("../middleware.js");


router.route("/")
  .get(controllersListing.index)
  .post(islogged,upload.single("listing[image]"),listingValidation,controllersListing.newListing);


router.get("/new",islogged,controllersListing.getNewListingForm);


router.route("/:id")
  .put(islogged,isOwner,upload.single("image"),controllersListing.listingEdited)
  .delete(islogged,isOwner,controllersListing.deleteListing)
  .get(controllersListing.showListing);


router.get("/:id/edit",islogged,isOwner,controllersListing.getEditForm);


module.exports=router;