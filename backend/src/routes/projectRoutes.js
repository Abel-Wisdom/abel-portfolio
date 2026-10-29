
import { Router } from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

const cleanString = (value) =>
  typeof value === "string" ? value.trim() : "";

const nullableString = (value) => cleanString(value) || null;

function validateProject(body) {
  const {
    title,
    slug,
    shortDescription,
    description,
    technologies,
  } = body;

  if (
    !cleanString(title) ||
    !cleanString(slug) ||
    !cleanString(shortDescription) ||
    !cleanString(description)
  ) {
    return "Title, slug, short description, and description are required.";
  }

  if (
    technologies !== undefined &&
    (!Array.isArray(technologies) ||
      technologies.some((item) => typeof item !== "string"))
  ) {
    return "Technologies must be an array of strings.";
  }

  if (
    body.gallery !== undefined &&
    (!Array.isArray(body.gallery) ||
      body.gallery.some((item) => typeof item !== "string"))
  ) {
    return "Gallery must be an array of image URLs.";
  }

  if (
    body.caseStudy !== undefined &&
    body.caseStudy !== null &&
    typeof body.caseStudy !== "object"
  ) {
    return "Case study data must be an object.";
  }

  return null;
}

function projectData(body) {
  return {
    title: cleanString(body.title),
    slug: cleanString(body.slug),
    category:
      cleanString(body.category) ||
      "Full-Stack Web Application",
    shortDescription: cleanString(body.shortDescription),
    description: cleanString(body.description),
    thumbnail: nullableString(body.thumbnail),
    gallery: Array.isArray(body.gallery)
      ? body.gallery.map(cleanString).filter(Boolean)
      : [],
    liveUrl: nullableString(body.liveUrl),
    sourceUrl: nullableString(body.sourceUrl),
    featured: body.featured === true,
    published: body.published === true,
    technologies: Array.isArray(body.technologies)
      ? body.technologies.map(cleanString).filter(Boolean)
      : [],
  };
}

async function saveCaseStudy(tx, projectId, caseStudy, description) {
  if (!caseStudy || typeof caseStudy !== "object") {
    return;
  }

  const data = {
    overview: cleanString(caseStudy.overview) || description,
    problem:
      cleanString(caseStudy.problem) ||
      "Problem not yet documented.",
    solution:
      cleanString(caseStudy.solution) ||
      "Solution not yet documented.",
    role: nullableString(caseStudy.role),
    architecture: nullableString(caseStudy.architecture),
    challenges: nullableString(caseStudy.challenges),
    learnings: nullableString(caseStudy.learnings),
  };

  await tx.caseStudy.upsert({
    where: { projectId },
    update: data,
    create: {
      projectId,
      ...data,
    },
  });
}

// Public: published projects only
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { caseStudy: true },
    });

    return res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Fetch published projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
});

// Admin: fetch all projects, including drafts
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { caseStudy: true },
    });

    return res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Fetch admin projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin projects.",
    });
  }
});

// Admin: create project and optionally its case study
router.post("/", authMiddleware, async (req, res) => {
  const validationError = validateProject(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const data = projectData(req.body);
    const { caseStudy } = req.body;

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({ data });

      await saveCaseStudy(
        tx,
        created.id,
        caseStudy,
        created.description
      );

      return tx.project.findUnique({
        where: { id: created.id },
        include: { caseStudy: true },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A project with this slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
});

// Admin: update project and optionally its case study
router.put("/:id", authMiddleware, async (req, res) => {
  const validationError = validateProject(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const existing = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const data = projectData(req.body);
    const { caseStudy } = req.body;

    const project = await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: req.params.id },
        data,
      });

      await saveCaseStudy(
        tx,
        req.params.id,
        caseStudy,
        data.description
      );

      return tx.project.findUnique({
        where: { id: req.params.id },
        include: { caseStudy: true },
      });
    });

    return res.json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A project with this slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
});

// Admin: delete project and its related case study
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    return res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
});

export default router;
