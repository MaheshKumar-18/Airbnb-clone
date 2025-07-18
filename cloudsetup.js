require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const { allow } = require('joi');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wonderlust-listing-images',
    allowerdFormats: ['png','jpg','jpeg'] // supports promises as well
  },
});

module.exports={cloudinary,storage}