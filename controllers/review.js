const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { rating, comment } = req.body.Review; // <- destructure correctly
  //   console.log(req.params.id)
  const listing = await Listing.findById(req.params.id);

  const newReview = new Review(req.body.Review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New review created!");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  // await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: { _id: reviewId } },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listing/${id}`);
};
