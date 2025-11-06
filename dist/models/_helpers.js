// src/models/_helpers.ts
export const initialsFromName = (name) => name
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join("")
    .replace(/[^A-Z0-9]/g, "");
