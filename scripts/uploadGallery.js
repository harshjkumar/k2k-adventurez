const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: "dc0oduvyz",
  api_key: "199867224837536",
  api_secret: "cCnKBnY2VW7bDxVeZEAf4JkR2tc",
});

const uploadImages = async () => {
  const directoryPath = path.join(__dirname, "../public/tt");
  try {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const filePath = path.join(directoryPath, file);
        console.log(`Uploading ${file}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "k2k/gallery/homepage",
          use_filename: true,
          unique_filename: false,
        });
        console.log(`Uploaded ${file} to ${result.secure_url}`);
      }
    }
    console.log("All uploaded successfully.");
  } catch (err) {
    console.error("Error:", err);
  }
};

uploadImages();
