
import { Router } from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

const cleanString = (value) =>
  typeof value === "string" ? value.trim() : "";

const nullableString = (value) => cleanString(value) || null;

function validateTestimonial(body) {
  if (!cleanString(body.name)) {
    return "Reviewer name is required.";
  }

  if (!cleanString(body.quote)) {
    return "Testimonial text is required.";
  }

  if (
    body.published !== undefined &&
    typeof body.published !== "boolean"
  ) {
    return "Published must be true or false.";
  }

  if (
    body.photoUrl !== undefined &&
    body.photoUrl !== null &&
    typeof body.photoUrl !== "string"
  ) {
    return "Photo URL must be a string.";
  }

  return null;
}

function testimonialData(body) {
  return {
    name: cleanString(body.name),
    role: cleanString(body.role),
    company: cleanString(body.company),
    quote: cleanString(body.quote),
    photoUrl: nullableString(body.photoUrl),
    published: body.published === true,
  };
}

// Public: return published testimonials only
router.get("/", async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error("Fetch public testimonials error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials.",
    });
  }
});

// Admin: return all testimonials, including drafts
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error("Fetch admin testimonials error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials.",
    });
  }
});

// Admin: create a testimonial
router.post("/", authMiddleware, async (req, res) => {
  const validationError = validateTestimonial(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: testimonialData(req.body),
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Create testimonial error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial.",
    });
  }
});

// Admin: update a testimonial
router.put("/:id", authMiddleware, async (req, res) => {
  const validationError = validateTestimonial(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const existing = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: testimonialData(req.body),
    });

    return res.json({
      success: true,
      message: "Testimonial updated successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial.",
    });
  }
});

// Admin: delete a testimonial
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    await prisma.testimonial.delete({
      where: { id: req.params.id },
    });

    return res.json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete testimonial.",
    });
  }
});

export default router;
