import { createConsola } from "consola";

export const logger = createConsola({
  level: process.env.NODE_ENV === "development" ? 4 : 3, // Debug in dev, Info in prod
  formatOptions: {
    colors: true,
    compact: false,
    date: true,
  },
});
