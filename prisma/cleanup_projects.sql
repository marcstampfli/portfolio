-- Database cleanup script for portfolio projects
-- This script will help identify and clean up duplicate and problematic projects

-- First, let's see all projects with their images
SELECT 
    id,
    title,
    images,
    CASE 
        WHEN images IS NULL THEN 'NO_IMAGE'
        WHEN images LIKE '%nicholas-story%' THEN 'MISSING_FILE'
        WHEN images LIKE '%iriebites-digitalsignage%' THEN 'MISSING_FILE'
        WHEN images LIKE '%roma-website%' THEN 'MISSING_FILE'
        WHEN images LIKE '%vansvegan%' THEN 'MISSING_FILE'
        WHEN images LIKE '%pierre%' THEN 'MISSING_FILE'
        WHEN images LIKE '%ashton%' THEN 'MISSING_FILE'
        WHEN images LIKE '%vans-flyer%' THEN 'MISSING_FILE'
        WHEN images LIKE '%innovation-flyer%' THEN 'MISSING_FILE'
        WHEN images LIKE '%gamekas-logo%' THEN 'MISSING_FILE'
        WHEN images LIKE '%vv-bizcard%' THEN 'MISSING_FILE'
        WHEN images LIKE '%night%' THEN 'MISSING_FILE'
        WHEN images LIKE '%paidcarwash%' THEN 'MISSING_FILE'
        WHEN images LIKE '%nicholas-card%' THEN 'MISSING_FILE'
        WHEN images LIKE '%marc-card%' THEN 'MISSING_FILE'
        WHEN images LIKE '%gt%' THEN 'MISSING_FILE'
        ELSE 'VALID'
    END as image_status
FROM "Project"
ORDER BY title;

-- Identify duplicates to consolidate
-- 1. Breezy Brands duplicates
SELECT * FROM "Project" WHERE title LIKE '%Breezy Brands%';

-- 2. Marc Stampfli projects that could be consolidated
SELECT * FROM "Project" WHERE title LIKE '%Marc%';

-- 3. Roma projects that could be consolidated  
SELECT * FROM "Project" WHERE title LIKE '%Roma%' OR title LIKE '%ROMA%';

-- Projects with missing image files (to delete)
-- These are projects where the image path points to files that don't exist
DELETE FROM "Project" WHERE images IN (
    '/projects/project-nicholas-story.jpg',
    '/projects/project-iriebites-digitalsignage.jpg',
    '/projects/project-roma-website.jpg',
    '/projects/project-vansvegan.jpg',
    '/projects/project-pierre.jpg',
    '/projects/project-ashton.jpg',
    '/projects/project-vans-flyer.jpg',
    '/projects/project-innovation-flyer.jpg',
    '/projects/project-gamekas-logo.jpg',
    '/projects/project-vv-bizcard.jpg',
    '/projects/project-night.jpg',
    '/projects/project-paidcarwash.jpg',
    '/projects/project-nicholas-card.jpg',
    '/projects/project-marc-card.jpg',
    '/projects/project-gt.jpg'
);

-- Delete the broken Breezy Brands entry (the one without image)
DELETE FROM "Project" WHERE title = 'Breezy Brands Website' AND images IS NULL;

-- Update the fixed Breezy Brands entry to have a cleaner title
UPDATE "Project" 
SET title = 'Breezy Brands Website' 
WHERE title = 'Breezy Brands Website - FIXED';

-- Consolidate Marc Stampfli projects
-- Keep the website project and update it to include both website and UI design info
UPDATE "Project" 
SET 
    title = 'Marc Stämpfli Portfolio',
    description = 'Personal portfolio website and UI design showcase featuring modern web development and user interface design.',
    images = '/projects/project-marcstampfli-website.jpg,/projects/project-marcstampfli-ui.jpg'
WHERE title = 'Marc Stämpfli Website';

-- Delete the separate UI design project since it's now consolidated
DELETE FROM "Project" WHERE title = 'Marc Stämpfli UI Design';

-- Consolidate Roma projects
-- Keep the UI design and update it to be more comprehensive
UPDATE "Project" 
SET 
    title = 'ROMA Restaurant Design',
    description = 'Complete restaurant branding and web design including UI mockups and website development.',
    images = '/projects/project-roma-ui.jpg'
WHERE title = 'Roma UI Design';

-- Delete the separate website project since the image is missing anyway
DELETE FROM "Project" WHERE title = 'ROMA Website';
