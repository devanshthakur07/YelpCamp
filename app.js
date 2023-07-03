if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require('express');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const session=require('express-session');
const flash=require('connect-flash');

const ExpressError=require('./utils/ExpressError');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const sanitize=require('express-mongo-sanitize');
const helmet=require('helmet');

const app = express();
const MongoStore = require("connect-mongo");
const campgroundRoutes=require('./routes/campground')
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');
const cors = require("cors");



// const dbUrl=process.env.DB_URL;
// mongodb://localhost:27017/yelp-camp
const dbUrl= process.env.DB_URL||'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connection Open");
    })
    .catch((err) => {
        console.log(err);
    })

    
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




app.use(cors());
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
// process.env.SECRET || 
const sessionOptions = {
    store:MongoStore.create({mongoUrl:dbUrl,touchAfter:24*3600,secret}),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{

    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})

app.get('/',(req,res)=>{
    res.render('home');
})
app.use('/',userRoutes);

//Campground Route
app.use('/campgrounds',campgroundRoutes);
//Review Route
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/bagga117/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(sanitize());
app.use(sanitize({
    replaceWith:'_'
}))

app.all('*',(req,res,next)=>{
    // res.status(404).send("404 Error");
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
    const {status=500}=err;
    if(!err.message) err.message="Page Not Found blah blah "
    res.status(status).render('error',{err});
    // res.send("Error Error");
})
const port=process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})