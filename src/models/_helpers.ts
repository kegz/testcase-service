// src/models/_helpers.ts
export const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join("")
    .replace(/[^A-Z0-9]/g, "");
