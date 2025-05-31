import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadFile = async (path: string) => {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };
  const result = await cloudinary.uploader.upload(path, options);
  return result?.secure_url;
};

export default uploadFile;
