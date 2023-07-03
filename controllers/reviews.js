const Review = require('../models/review');
const Campground=require('../models/campground');

module.exports.newReview=async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review added')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete=async(req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Review Deleted')
    res.redirect(`/campgrounds/${req.params.id}`);
}