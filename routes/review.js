const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { validateReview, isLoggedIn } = require("./middleware.js");
const reviewController = require("../controllers/review.js");

//Review
// post route for reviews
// app.post("/listing/:id/reviews", async (req, res) => {
//   let listing = await Listing.findById(req.params.id);
//   const { rating, comment } = req.body;
//   const newReview = new Review({ rating, comment });

//   // let newReview =   new Review(req.body);
//   listing.reviews.push(newReview);
//   await newReview.save();
//   await listing.save();
//   console.log(newReview);
//   res.redirect(`/listing/${listing.id}`);
// });

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete review route
router.delete("/:reviewId", wrapAsync(reviewController.deleteReview));

module.exports = router;
