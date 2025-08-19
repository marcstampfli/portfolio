-- Fix the remaining projects without images

-- Update Marc Stämpfli Portfolio project
UPDATE "Project" 
SET images = ARRAY['/projects/project-marcstampfli-website.jpg', '/projects/project-marcstampfli-ui.jpg']
WHERE title = 'Marc Stämpfli Portfolio';

-- Update ROMA Restaurant Design project  
UPDATE "Project" 
SET images = ARRAY['/projects/project-roma-ui.jpg', '/projects/project-roma-ui2.jpg']
WHERE title = 'ROMA Restaurant Design';
