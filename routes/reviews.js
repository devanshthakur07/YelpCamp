const express=require('express');
const Campground=require('../models/campground');
const Review = require('../models/review');
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn}=require('../middleware.js');
const {validateReview,isReviewAuthor}=require('../middleware')
const router=express.Router({mergeParams:true});
const reviews=require('../controllers/reviews');

router.post('/',validateReview,isLoggedIn,catchAsync(reviews.newReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.delete))

module.exports=router;