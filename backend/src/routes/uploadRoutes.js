
import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 8;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_GALLERY_IMAGES,
  },
});

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary returned no result."));
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

function validateImage(file) {
  return Boolean(file && allowedImageTypes.includes(file.mimetype));
}

async function handleProfileOrResumeUpload(req, res, field) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload.",
      });
    }

    const isProfileImage = field === "profileImageUrl";

    const allowedTypes = isProfileImage
      ? allowedImageTypes
      : ["application/pdf"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: isProfileImage
          ? "Profile pictures must be JPG, PNG, or WebP images."
          : "Your resume must be a PDF file.",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "abel-portfolio",
      public_id: isProfileImage ? "profile-picture" : "resume",
      overwrite: true,
      resource_type: isProfileImage ? "image" : "raw",
      ...(isProfileImage
        ? {
            transformation: [
              { width: 1000, height: 1000, crop: "limit" },
            ],
          }
        : {}),
    });

    const settings = await prisma.portfolioSettings.upsert({
      where: { id: "default" },
      update: { [field]: result.secure_url },
      create: { id: "default", [field]: result.secure_url },
    });

    return res.json({
      success: true,
      message: isProfileImage
        ? "Profile picture uploaded successfully."
        : "Resume uploaded successfully.",
      url: result.secure_url,
      settings: {
        profileImageUrl: settings.profileImageUrl,
        resumeUrl: settings.resumeUrl,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed. Check your Cloudinary configuration and try again.",
    });
  }
}

// Existing profile-picture upload
router.post(
  "/profile-image",
  authMiddleware,
  upload.single("file"),
  (req, res) => handleProfileOrResumeUpload(req, res, "profileImageUrl")
);

// Existing resume upload
router.post(
  "/resume",
  authMiddleware,
  upload.single("file"),
  (req, res) => handleProfileOrResumeUpload(req, res, "resumeUrl")
);

// Upload one project cover image
router.post(
  "/project-image",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a project image.",
        });
      }

      if (!validateImage(req.file)) {
        return res.status(400).json({
          success: false,
          message: "Project images must be JPG, PNG, or WebP files.",
        });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "abel-portfolio/projects",
        resource_type: "image",
        transformation: [
          { width: 1600, height: 1200, crop: "limit" },
        ],
      });

      return res.json({
        success: true,
        message: "Project cover uploaded successfully.",
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Project image upload error:", error);

      return res.status(500).json({
        success: false,
        message: "Project image upload failed. Please try again.",
      });
    }
  }
);

// Upload multiple project gallery screenshots
router.post(
  "/project-gallery",
  authMiddleware,
  upload.array("files", MAX_GALLERY_IMAGES),
  async (req, res) => {
    try {
      const files = req.files || [];

      if (files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please select at least one gallery image.",
        });
      }

      if (files.some((file) => !validateImage(file))) {
        return res.status(400).json({
          success: false,
          message: "Gallery images must be JPG, PNG, or WebP files.",
        });
      }

      const results = await Promise.all(
        files.map((file) =>
          uploadToCloudinary(file.buffer, {
            folder: "abel-portfolio/projects/gallery",
            resource_type: "image",
            transformation: [
              { width: 1600, height: 1200, crop: "limit" },
            ],
          })
        )
      );

      return res.json({
        success: true,
        message: `${results.length} gallery image(s) uploaded successfully.`,
        urls: results.map((result) => result.secure_url),
      });
    } catch (error) {
      console.error("Project gallery upload error:", error);

      return res.status(500).json({
        success: false,
        message: "Gallery upload failed. Please try again.",
      });
    }
  }
);


router.post(
  "/testimonial-photo",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a reviewer photo.",
        });
      }

      if (!validateImage(req.file)) {
        return res.status(400).json({
          success: false,
          message: "Reviewer photos must be JPG, PNG, or WebP files.",
        });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "abel-portfolio/testimonials",
        resource_type: "image",
        transformation: [
          { width: 600, height: 600, crop: "limit" },
        ],
      });

      return res.json({
        success: true,
        message: "Reviewer photo uploaded successfully.",
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Testimonial photo upload error:", error);

      return res.status(500).json({
        success: false,
        message: "Reviewer photo upload failed. Please try again.",
      });
    }
  }
);


export default router;
