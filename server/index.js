const express = require("express");
const cors = require("cors");
const jimp = require("jimp");
const lens = require("@alxcube/lens");
require("@alxcube/lens-jimp");  // For Jimp support in Lens

const app = express();
app.use(cors());

app.post("/process-image", async (req, res) => {
  const image = await jimp.read("path/to/image.png"); // Replace with image path
  const distortion = await lens.distort(image, "Arc", [180]);

  res.status(200).json({ success: true, distortedImage: distortion.image });
});

app.listen(4000, () => {
  console.log("Server running on port 5000");
});
