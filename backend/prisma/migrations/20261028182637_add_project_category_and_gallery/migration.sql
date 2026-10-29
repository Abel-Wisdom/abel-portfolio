-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Full-Stack Web Application',
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
