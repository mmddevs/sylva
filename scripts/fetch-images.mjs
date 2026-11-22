// Télécharge les photos Unsplash du site et les convertit en WebP dans public/images/.
// Usage : node scripts/fetch-images.mjs [nom ...]   (sans argument : toutes)
// Deux tailles par photo : <nom>.webp (1600 px) et <nom>-sm.webp (1000 px, hero et carousel).
// Pour ajouter une photo : ajouter une ligne dans PHOTOS (vérifier que l'ID répond 200).
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PHOTOS = {
  "sous-bois-lumiere": "photo-1441974231531-c6227db76b6e",
  "lac-aube": "photo-1501785888041-af3ef285b470",
  "foret-brume": "photo-1418065460487-3e41a6c84dc5",
  "collines-brouillard": "photo-1470071459604-3b5ec3a7fe05",
  "cascade": "photo-1433086966358-54859d0ed716",
  "montagnes-aube": "photo-1506905925346-21bda4d32df4",
  "prairie-soleil": "photo-1472214103451-9374bd1c798e",
  "sous-bois-fougeres": "photo-1448375240586-882707db888b",
  "montagne-or": "photo-1469474968028-56623f02e42e",
  "maison-lac": "photo-1470770841072-f978cf4d019e",
  "cimes-vues-du-sol": "photo-1513836279014-a89f7a76ae86",
  "hetraie": "photo-1440581572325-0bea30075d9d",
  "pinede-contre-jour": "photo-1425913397330-cf8af2ff40a1",
  "troncs-sous-bois": "photo-1507041957456-9c397ce39c97",
  "vallee-brumeuse": "photo-1542273917363-3b1817f69a2d",
  "coniferes-brume": "photo-1482192596544-9eb780fc7f66",
  "riviere-sapins": "photo-1473448912268-2022ce9509d8",
  "lac-glaciaire": "photo-1439853949127-fa647821eba0",
  "lac-turquoise": "photo-1493246507139-91e8fad9978e",
  "sapins-lac": "photo-1511497584788-876760111969",
  "crete-rouge": "photo-1508739773434-c26b3d09e071",
  "cretes-couchant": "photo-1500964757637-c85e8a162699",
  "sommets-enneiges": "photo-1454496522488-7a8e488e8606",
  "sommet-nuages": "photo-1505765050516-f72dcac9c60e",
  "arbre-prairie": "photo-1502082553048-f009c37129b9",
  "coquelicots": "photo-1465146344425-f00d5f5c8f07",
  "voie-lactee": "photo-1519681393784-d120267933ba",
  "vallee-alpine": "photo-1464822759023-fed622ff2c3b",
  "falaise-granit": "photo-1426604966848-d7adac402bff",
  "passerelle": "photo-1447752875215-b2761acb3c5d",
  "route-foret": "photo-1476231682828-37e571bc172f",
};

const OUT = path.resolve("public/images");
const only = process.argv.slice(2);
await fs.mkdir(OUT, { recursive: true });

for (const [name, id] of Object.entries(PHOTOS)) {
  if (only.length && !only.includes(name)) continue;
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=90&fm=jpg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} (${id})`);
  const src = Buffer.from(await res.arrayBuffer());
  for (const [suffix, width, quality] of [["", 1600, 68], ["-sm", 1000, 62]]) {
    const file = path.join(OUT, `${name}${suffix}.webp`);
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6, smartSubsample: true }).toFile(file);
  }
  console.log("ok", name);
}
