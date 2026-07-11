const Media = require("../models/Media");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Upload a buffer directly to Cloudinary
 */
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sweet-asouzu",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(stream);
  });
};


/**
 * @desc    Upload multiple media files
 * @route   POST /api/media/upload
 */
const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedMedia = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file);

      const media = await Media.create({
        title: req.body.title || "",
        key: req.body.key || undefined,

        type:
          result.resource_type === "video"
            ? "video"
            : "image",

        category:
          req.body.category || "general",

        url: result.secure_url,
        publicId: result.public_id,

        order:
          Number(req.body.order) || 0,
      });

      uploadedMedia.push(media);
    }

    return res.status(201).json({
      success: true,
      count: uploadedMedia.length,
      media: uploadedMedia,
    });
  } catch (error) {
    console.error("UPLOAD MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Get all media
 * @route   GET /api/media
 */
const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find()
      .sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json(media);
  } catch (error) {
    console.error("GET MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get published gallery media
 * @route   GET /api/media/gallery
 */
const getGalleryMedia = async (req, res) => {
  try {
    const media = await Media.find({
      category: "gallery",
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("GET GALLERY MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery media",
    });
  }
};
/**
 * @desc    Get media by category
 * @route   GET /api/media/category/:category
 */
const getMediaByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const media = await Media.find({
      category,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json(media);
  } catch (error) {
    console.error(
      "GET MEDIA BY CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Get a single media item
 * @route   GET /api/media/item/:id
 */
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(
      req.params.id
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    return res.status(200).json(media);
  } catch (error) {
    console.error("GET MEDIA BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Update media metadata
 * @route   PUT /api/media/:id
 */
const updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(
      req.params.id
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const {
      title,
      key,
      category,
      order,
    } = req.body;

    if (title !== undefined) {
      media.title = title;
    }

    if (category !== undefined) {
      media.category = category;
    }

    if (order !== undefined) {
      media.order = Number(order);
    }

    /*
     * Empty key means remove the key completely.
     * This prevents duplicate empty-string errors
     * with sparse unique indexes.
     */
    if (key !== undefined) {
      if (key.trim()) {
        media.key = key.trim();
      } else {
        media.key = undefined;
      }
    }

    const updatedMedia = await media.save();

    return res.status(200).json({
      success: true,
      media: updatedMedia,
    });
  } catch (error) {
    console.error("UPDATE MEDIA ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This media key is already being used.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Update the display order of multiple items
 * @route   PUT /api/media/reorder
 *
 * Expected body:
 *
 * {
 *   "items": [
 *     { "id": "...", "order": 1 },
 *     { "id": "...", "order": 2 }
 *   ]
 * }
 */
const reorderMedia = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items must be an array",
      });
    }

    const operations = items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.id,
        },
        update: {
          $set: {
            order: Number(item.order),
          },
        },
      },
    }));

    if (operations.length > 0) {
      await Media.bulkWrite(operations);
    }

    const media = await Media.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message:
        "Media order updated successfully",
      media,
    });
  } catch (error) {
    console.error("REORDER MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * @desc    Delete media from Cloudinary and MongoDB
 * @route   DELETE /api/media/:id
 */
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(
      req.params.id
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    /*
     * Delete the Cloudinary asset first.
     */
    if (media.publicId) {
      await cloudinary.uploader.destroy(
        media.publicId,
        {
          resource_type:
            media.type === "video"
              ? "video"
              : "image",
        }
      );
    }

    /*
     * Delete the MongoDB record.
     */
    await media.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete media",
      error: error.message,
    });
  }
};


module.exports = {
  uploadMedia,
  getAllMedia,
  getMediaByCategory,
  getMediaById,
  updateMedia,
  reorderMedia,
  deleteMedia,
    getGalleryMedia,
};