/**
 * Shared by the client Navbar and the server Footer, so it lives in a plain
 * module with no "use client" on it. Exporting an array from a client component
 * and importing it into a server one hands the server a client *reference*
 * rather than an array, and the prerender dies on `.map is not a function`.
 */
export const navLinks = [
  { id: "left-half", num: "01", label: "The left half", inNav: false },
  { id: "how", num: "02", label: "How it works", inNav: true },
  { id: "collapse", num: "03", label: "The collapse", inNav: true },
  { id: "facts", num: "04", label: "Ownership facts", inNav: true },
  { id: "integrity", num: "05", label: "Integrity", inNav: false },
  { id: "listings", num: "06", label: "Listings", inNav: false },
  { id: "shelf", num: "07", label: "Your shelf", inNav: true },
  { id: "tiers", num: "08", label: "Tiers", inNav: false },
  { id: "questions", num: "09", label: "Questions", inNav: true },
] as const;
