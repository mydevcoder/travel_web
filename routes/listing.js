const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const sampleListings = require("../init/data.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("./middleware.js");
// const Listing = require("../models/listing.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({storage})



router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route to render all listings
  .post(
    isLoggedIn,
    upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing) //create route to add new listing
  );



//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing) //update route
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  ); //delete route

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
