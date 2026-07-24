const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dbURL = process.env.ATLASDB_URL;

console.log(process.env.ATLASDB_URL);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = [];

  for (let obj of initData.data) {
    const response = await geocodingClient
      .forwardGeocode({
        query: `${obj.location}, ${obj.country}`,
        limit: 1,
      })
      .send();

    listings.push({
      ...obj,
      owner: "6a61eb8ac71c1fe31c68bc48",
      geometry:
  response.body.features.length > 0
    ? response.body.features[0].geometry
    : {
        type: "Point",
        coordinates: [0, 0],
      },
    });
  }

  await Listing.insertMany(listings);
  console.log("Data was initialized");
};

initDB();