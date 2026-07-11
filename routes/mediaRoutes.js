// const express = require("express");
// const router = express.Router();
// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");
// const upload = require("../middleware/upload");
// const Media = require("../models/Media");

// router.post(
//   "/upload",
//   upload.array("files", 20),
//   async (req, res) => {
//     try {
//       const media = [];

//       for (const file of req.files) {

//         const result = await new Promise((resolve, reject) => {

//           const stream = cloudinary.uploader.upload_stream(
//             {
//               folder: "sweet-asouzu",
//               resource_type: "auto",
//             },
//             (error, result) => {
//               if (error) return reject(error);
//               resolve(result);
//             }
//           );

//           streamifier
//             .createReadStream(file.buffer)
//             .pipe(stream);

//         });

//         const item = await Media.create({
//           url: result.secure_url,
//           publicId: result.public_id,
//           type:
//             result.resource_type === "video"
//               ? "video"
//               : "image",
//           category:
//             req.body.category || "general",
//         });

//         media.push(item);
//       }

//       res.json(media);

//     } catch (error) {

//       console.error(error);

//       res.status(500).json({
//         message: error.message,
//       });

//     }
//   }
// );

// router.get("/", async (req, res) => {
//   const media = await Media.find().sort({ order: 1 });

//   res.json(media);
// });

// router.get("/:category", async (req, res) => {
//   const media = await Media.find({
//     category: req.params.category,
//   }).sort({ order: 1 });

//   res.json(media);
// });

// router.delete("/:id", async (req,res)=>{
//     try{

//         const media = await Media.findById(req.params.id);

//         if(!media){
//             return res.status(404).json({
//                 message:"Media not found"
//             });
//         }

//         await cloudinary.uploader.destroy(
//             media.publicId,
//             {
//                 resource_type:
//                     media.type==="video"
//                     ? "video"
//                     : "image"
//             }
//         );

//         await media.deleteOne();

//         res.json({
//             message:"Deleted successfully"
//         });

//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             message:"Delete failed"
//         });
//     }
// });

// module.exports = router;

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
} = require("../controllers/mediaController");

router.post(
  "/upload",
  upload.array("files", 20),
  uploadMedia
);

router.get("/", getAllMedia);

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