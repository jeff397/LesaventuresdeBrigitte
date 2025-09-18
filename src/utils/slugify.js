// Transforme un texte en slug pour les URLs
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .replace(/['’]/g, "") // supprime les apostrophes
    .replace(/\s+/g, "-"); // espaces => tirets
}

// Convertit un slug en vrai nom de blog
export function deslugify(slug) {
  if (slug === "villers-sur-authie") return "Villers-sur-Authie";
  if (slug === "dhier-aujourdhui") return "D'hier et d'aujourd'hui";
  if (slug === "somme-photos") return "Somme-photos";
  return slug;
}
