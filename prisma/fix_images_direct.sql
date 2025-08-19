-- Direct SQL to fix the remaining projects
-- Using proper PostgreSQL array syntax

UPDATE "Project" 
SET images = '{"/projects/project-marcstampfli-website.jpg","/projects/project-marcstampfli-ui.jpg"}'
WHERE title = 'Marc Stämpfli Portfolio';

UPDATE "Project" 
SET images = '{"/projects/project-roma-ui.jpg","/projects/project-roma-ui2.jpg"}'
WHERE title = 'ROMA Restaurant Design';
