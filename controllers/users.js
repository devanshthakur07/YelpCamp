const User = require('../models/user');
const passport=require('passport');

module.exports.registerForm= (req, res) => {
    res.render('users/register')
}
module.exports.register=async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const user = await new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser,err=>{
            if(err)return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.loginForm=(req, res) => {
    res.render('users/login');
}
module.exports.login=async(req,res)=>{
    req.flash('success','Welcome Back');
    const redirect=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirect);
}
module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success',"Logged Out");
    res.redirect('/campgrounds');
}
