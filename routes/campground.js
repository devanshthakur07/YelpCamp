const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const router = express.Router();
const {isLoggedIn}=require('../middleware.js');
const {validateCamp}=require('../middleware.js')
const {isAuthor}=require('../middleware.js')
const campgrounds=require('../controllers/campgrounds');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});



router.get('', catchAsync(campgrounds.index));


router.get('/new',isLoggedIn,campgrounds.newForm)
router.post('',upload.array('image'),isLoggedIn,validateCamp, catchAsync(campgrounds.CreateNew))
// router.post('',upload.array('image'),(req,res)=>{
//     res.send(req,body,req.files);
// })


router.get('/:id', catchAsync(campgrounds.show))


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.editForm))
router.put('/:id',upload.array('image'),isLoggedIn,validateCamp,isAuthor, catchAsync(campgrounds.edit))


router.delete('/:id',isLoggedIn,catchAsync(campgrounds.delete))

module.exports = router;