import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

//Using cloudinary to store the user profile images and the message images and text.

config(); // Load environment variables from .env file.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary; // Export the configured Cloudinary instance for image uploads.
