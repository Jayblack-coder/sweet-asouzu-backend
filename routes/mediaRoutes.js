// const express = require("express");
// const router = express.Router();
// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");
// const upload = require("../middleware/upload");
// const Media = require("../models/Media");


const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadMedia,
  getAllMedia,
  getMediaByCategory,
  getMediaById,
  updateMedia,
  reorderMedia,
  deleteMedia,
  getGalleryMedia,
} = require("../controllers/mediaController");

router.post(
  "/upload",
  upload.array("files", 20),
  uploadMedia
);

router.get("/", getAllMedia);
router.get("/gallery", getGalleryMedia);
// Keep static routes before /:id
router.get(
  "/category/:category",
  getMediaByCategory
);

router.get(
  "/item/:id",
  getMediaById
);

router.put(
  "/reorder",
  reorderMedia
);

router.put(
  "/:id",
  updateMedia
);

router.delete(
  "/:id",
  deleteMedia
);

module.exports = router;