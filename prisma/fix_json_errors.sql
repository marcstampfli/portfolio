-- Fix the JSON parsing errors and properly set up images

-- Fix Marc Stämpfli Portfolio images (assuming it's the one with portfolio in title)
UPDATE "Project" 
SET images = '["/projects/project-marcstampfli-website.jpg", "/projects/project-marcstampfli-ui.jpg"]'::jsonb
WHERE id = 'cmehz4t5c001016ebt9bu8s0d';

-- Fix ROMA Restaurant Design images
UPDATE "Project" 
SET images = '["/projects/project-roma-ui.jpg", "/projects/project-roma-ui2.jpg"]'::jsonb
WHERE id = 'cmehz4xee001s16ebu2hfnzma';

-- Now let's also consolidate tech stacks for these merged projects
-- For Marc Stampfli Portfolio, we need to combine web development + UI design tech stacks
-- Current tech should include: Next.js, React, TypeScript, Figma, Adobe XD, UI Design

-- For ROMA Restaurant, combine restaurant/UI design tech stacks
-- Current tech should include: Figma, Adobe XD, UI Design, Branding
