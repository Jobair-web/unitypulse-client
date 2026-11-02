// All remote photos live here, so you can swap them in one place.
// If an image fails to load the UI shows a branded gradient instead (see SafeImage).
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const HERO_IMAGE = u("photo-1593113598332-cd288d649433");

export const GALLERY = [
  { src: u("photo-1593113598332-cd288d649433"), caption: "Volunteers packing winter kits" },
  { src: u("photo-1488521787991-ed7bbaae773c"), caption: "Warm blankets for cold nights" },
  { src: u("photo-1618477461853-cf6ed80faba5"), caption: "Morning beach cleanup crew" },
  { src: u("photo-1469571486292-0ba58a3f068b"), caption: "Planting saplings together" },
  { src: u("photo-1559027615-cd4628902d4a"), caption: "Hot meals for neighbours" },
  { src: u("photo-1532629345422-7515f3d16bb6"), caption: "Neighbours lending a hand" },
  { src: u("photo-1469571486292-0ba58a3f068b"), caption: "Park restoration day" },
  { src: u("photo-1488521787991-ed7bbaae773c"), caption: "Storytime for little ones" },
];
