-- Consolidate tech stacks for merged projects

-- Get the project IDs for the consolidated projects
WITH project_ids AS (
  SELECT 
    id,
    title,
    CASE 
      WHEN title = 'Marc Stämpfli Portfolio' THEN 'marc_portfolio'
      WHEN title = 'ROMA Restaurant Design' THEN 'roma_design'
    END as project_key
  FROM "Project" 
  WHERE title IN ('Marc Stämpfli Portfolio', 'ROMA Restaurant Design')
),
tech_ids AS (
  SELECT id, name FROM "TechStack" WHERE name IN (
    'React', 'Figma', 'Web Design', 'Web Development',
    'Illustrator', 'Adobe Photoshop', 'Branding'
  )
)
-- Add missing tech stacks to Marc Stämpfli Portfolio (React, Figma, Web Design, Web Development)
INSERT INTO "_ProjectToTechStack" ("A", "B")
SELECT 
  p.id as "A", 
  t.id as "B"
FROM project_ids p
CROSS JOIN tech_ids t
WHERE p.project_key = 'marc_portfolio'
  AND t.name IN ('React', 'Figma', 'Web Design', 'Web Development')
  AND NOT EXISTS (
    SELECT 1 FROM "_ProjectToTechStack" pts 
    WHERE pts."A" = p.id AND pts."B" = t.id
  );

-- Add missing tech stacks to ROMA Restaurant Design (Illustrator, Adobe Photoshop, Branding)
WITH project_ids AS (
  SELECT 
    id,
    title,
    CASE 
      WHEN title = 'Marc Stämpfli Portfolio' THEN 'marc_portfolio'
      WHEN title = 'ROMA Restaurant Design' THEN 'roma_design'
    END as project_key
  FROM "Project" 
  WHERE title IN ('Marc Stämpfli Portfolio', 'ROMA Restaurant Design')
),
tech_ids AS (
  SELECT id, name FROM "TechStack" WHERE name IN (
    'React', 'Figma', 'Web Design', 'Web Development',
    'Illustrator', 'Adobe Photoshop', 'Branding'
  )
)
INSERT INTO "_ProjectToTechStack" ("A", "B")
SELECT 
  p.id as "A", 
  t.id as "B"
FROM project_ids p
CROSS JOIN tech_ids t
WHERE p.project_key = 'roma_design'
  AND t.name IN ('Illustrator', 'Adobe Photoshop', 'Branding')
  AND NOT EXISTS (
    SELECT 1 FROM "_ProjectToTechStack" pts 
    WHERE pts."A" = p.id AND pts."B" = t.id
  );

-- Verify the consolidation
SELECT 
  p.title,
  STRING_AGG(ts.name, ', ' ORDER BY ts.name) as tech_stacks
FROM "Project" p
JOIN "_ProjectToTechStack" pts ON p.id = pts."A"
JOIN "TechStack" ts ON pts."B" = ts.id
WHERE p.title IN ('Marc Stämpfli Portfolio', 'ROMA Restaurant Design')
GROUP BY p.id, p.title
ORDER BY p.title;
