const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =require("./review.js");
const { required } = require("joi");


const listingSchema = new Schema({
    title:{
     type: String,
     required:true,
    } ,
    description: String,
    image: {
         url: String,
         filename:String,


    //  filename: {
    //    type: String,
    //    default: "listingimage"
    //  },
    //  url: {
    //  type: String,
    //  default: "https://plus.unsplash.com/premium_photo-1684508638760-72ad80c0055f"
    //     } 
    },
    price: Number,
    location:String,
    country: String,

    category: {
    type: String,
    enum: [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic",
        "Domes",
        "Boats"
    ],
    default: "Trending",
    },

    reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",
      },
    ],
    
    owner:{     
      type:Schema.Types.ObjectId,
      ref:"User",
    },

    geometry: {
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
},

});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
  await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;