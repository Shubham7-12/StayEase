const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =require("./review.js");


const listingSchema = new Schema({
    title:{
     type: String,
     required:true,
    } ,
    description: String,
    image: {
     filename: {
       type: String,
       default: "listingimage"
     },
     url: {
     type: String,
     default: "https://plus.unsplash.com/premium_photo-1684508638760-72ad80c0055f"
        }
    },
    price: Number,
    location:String,
    country: String,
    reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",
    },
    ],
    
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  await Review.deleteMany({_id : {$in: listing.reviews}});
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;