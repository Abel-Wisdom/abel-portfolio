
import { Router } from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

const DEFAULT_SETTINGS_ID = "default";

const editableFields = [
  "fullName",
  "professionalTitle",
  "biography",
  "location",
  "email",
  "phone",
  "githubUrl",
  "linkedinUrl",
  "profileImageUrl",
  "resumeUrl",
];

function cleanSettings(settings) {
  return {
    fullName: settings.fullName,
    professionalTitle: settings.professionalTitle,
    biography: settings.biography,
    location: settings.location,
    email: settings.email,
    phone: settings.phone,
    githubUrl: settings.githubUrl,
    linkedinUrl: settings.linkedinUrl,
    profileImageUrl: settings.profileImageUrl,
    resumeUrl: settings.resumeUrl,
    updatedAt: settings.updatedAt,
  };
}

// Public endpoint: the portfolio website can read published profile details.
router.get("/", async (req, res) => {
  try {
    const settings = await prisma.portfolioSettings.upsert({
      where: { id: DEFAULT_SETTINGS_ID },
      update: {},
      create: { id: DEFAULT_SETTINGS_ID },
    });

    return res.json({
      success: true,
      settings: cleanSettings(settings),
    });
  } catch (error) {
    console.error("Fetch portfolio settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load portfolio settings.",
    });
  }
});

// Protected endpoint: only the authenticated administrator can update settings.
router.put("/", authMiddleware, async (req, res) => {
  try {
    const data = {};

    for (const field of editableFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string.`,
          });
        }

        data[field] = req.body[field].trim();
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No settings were provided to update.",
      });
    }

    const settings = await prisma.portfolioSettings.upsert({
      where: { id: DEFAULT_SETTINGS_ID },
      update: data,
      create: {
        id: DEFAULT_SETTINGS_ID,
        ...data,
      },
    });

    return res.json({
      success: true,
      message: "Portfolio settings saved successfully.",
      settings: cleanSettings(settings),
    });
  } catch (error) {
    console.error("Update portfolio settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save portfolio settings.",
    });
  }
});

export default router;
