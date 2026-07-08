const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const upload = require("../middleware/upload");
const Media = require("../models/Media");

router.post(
  "/upload",
  upload.array("files", 20),
  async (req, res) => {
    try {
      const media = [];

      for (const file of req.files) {

        const result = await new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "sweet-asouzu",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          streamifier
            .createReadStream(file.buffer)
            .pipe(stream);

        });

        const item = await Media.create({
          url: result.secure_url,
          publicId: result.public_id,
          type:
            result.resource_type === "video"
              ? "video"
              : "image",
          category:
            req.body.category || "general",
        });

        media.push(item);
      }

      res.json(media);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }
  }
);

router.get("/", async (req, res) => {
  const media = await Media.find().sort({ order: 1 });

  res.json(media);
});

router.get("/:category", async (req, res) => {
  const media = await Media.find({
    category: req.params.category,
  }).sort({ order: 1 });

  res.json(media);
});

module.exports = router;