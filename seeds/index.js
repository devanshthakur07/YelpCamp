const mongoose = require('mongoose');
const cities=require('./cities')
const {places,descriptors}=require('./seedhelpers');
const Campground=require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("Connection Open");
    })
    .catch((err) => {
        console.log(err);    
    })

const sample=(array)=>{
    return array[Math.floor(Math.random()*array.length)];
}    
const seedDb=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000)+1;
        const price=Math.floor(Math.random()*1000)+1
        const camp=new Campground({
            author:"6214acccca359dc7ce4fdd00",
            title:`${sample(descriptors)} ${sample(places)}`,
            geometry:{type:"Point",coordinates:[cities[random1000].longitude,cities[random1000].latitude]},
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            images:[{  
                url:'https://source.unsplash.com/collection/483251'
            }],
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam aperiam repellat, eveniet molestiae dolorem neque unde corrupti provident odio laborum facilis aut adipisci consequatur, alias debitis ipsum sint cupiditate, suscipitratione doloremque aliquam esse fugiat corporis voluptatibus! Ducimus, adipisci animi",
            price:price        
        })
        await camp.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})