-- Remove duplicate Breezy Brands entry without images
DELETE FROM "Project" 
WHERE title = 'Breezy Brands Website' 
AND (images IS NULL OR images = '[]');

-- Fix Marc Stampfli project - it seems the update didn't work as expected
UPDATE "Project" 
SET images = ARRAY['/projects/project-marcstampfli-website.jpg', '/projects/project-marcstampfli-ui.jpg']
WHERE title = 'Marc Stämpfli Portfolio';

-- Remove any projects with empty image arrays
DELETE FROM "Project" 
WHERE images = '[]' OR images IS NULL;
