-- Drop columns if they exist
ALTER TABLE "Project" 
DROP COLUMN IF EXISTS "tech_stack",
DROP COLUMN IF EXISTS "project_type";