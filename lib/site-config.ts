export const siteConfig = {
  name: "ZAHID AUTOS",
  tagline: "Good parts. Great journeys.",
  email: "hello@zahidautos.example",
  phone: "+92 300 000 0000",
  whatsapp: "923000000000",
  currency: "PKR",
  address: "Demo showroom · Shahrah-e-Faisal, Karachi, Pakistan",
  bank: "Demo Bank — do not transfer funds",
  holder: "Zahid Autos (Demo)",
  account: "DEMO-0000-1048",
  iban: "PK00 DEMO 0000 0000 0000 0000",
};
export const money = (n: number) =>
  `Rs. ${Math.round(n).toLocaleString("en-PK")}`;
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const photo = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
