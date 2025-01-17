export const parseArrayField = (field: string | string[]) => {
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [field];
  } catch {
    return field.split(",").map((item) => item.trim());
  }
};
