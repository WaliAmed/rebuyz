import { productPhotos } from "./product-photos";
import { photo, siteConfig, slugify } from "./site-config";
export type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number;
  stock: number;
  condition: string;
  image: string;
  sku: string;
  description: string;
  compatibility: string;
  featured: boolean;
  published: boolean;
  specs: Record<string, string>;
};
export type Vehicle = {
  id: string;
  slug: string;
  title: string;
  sellerId: string;
  seller: string;
  price: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  city: string;
  transmission: string;
  fuel: string;
  body: string;
  condition: string;
  engine: string;
  color: string;
  registration: string;
  description: string;
  damage: string;
  images: string[];
  phone: string;
  showPhone: boolean;
  allowChat: boolean;
  status: string;
  featured: boolean;
  note: string;
  date: string;
};
export type Order = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: { product: Product; quantity: number }[];
  total: number;
  delivery: number;
  payment: string;
  status: string;
  date: string;
  tracking: string;
  courier: string;
  note: string;
  history: string[];
};
export type RecordItem = {
  id: string;
  title: string;
  detail: string;
  status: string;
  image?: string;
};
export type ChatMessage = {
  text: string;
  own: boolean;
  time: string;
  senderId?: string;
};
export const categories = [
  "Oils & Fluids",
  "Engine Parts",
  "Suspension",
  "Steering",
  "Lights",
  "Body Parts",
  "Electrical",
  "Used Cars",
  "Damaged Cars",
];
export const images = {
  hero: photo("photo-1492144534655-ae79c964c9d7", 1800),
  workshop: photo("photo-1486262715619-67b85e0b08d3"),
  engine: photo("photo-1632823471565-1ecdf5c12b88"),
  car: photo("photo-1503376780353-7e6692767b70"),
  interior: photo("photo-1507136566006-cfc505b114fc"),
  road: photo("photo-1449965408869-eaa3f722e40d"),
};
const catalog: [string, string, number, number, string, string][] = [
  ["Toyota Genuine ATF WS 4L", "Oils & Fluids", 12500, 14500, "New", "oil-red"],
  [
    "Honda HCF-2 CVT Fluid 4L",
    "Oils & Fluids",
    13800,
    15500,
    "New",
    "oil-silver",
  ],
  [
    "Nissan NS-3 CVT Fluid 4L",
    "Oils & Fluids",
    14200,
    16000,
    "New",
    "oil-blue",
  ],
  [
    "Toyota Corolla 2018 LED Headlight",
    "Lights",
    28500,
    32000,
    "Used",
    "headlight",
  ],
  [
    "Prius 2016 Inverter Assembly",
    "Electrical",
    78000,
    85000,
    "Used",
    "engine",
  ],
  ["Honda Civic Steering Rack", "Steering", 45000, 49000, "Used", "steering"],
  ["Toyota Aqua ABS Pump", "Electrical", 62000, 68000, "Used", "engine"],
  ["Brembo Front Brake Pad Set", "Suspension", 8500, 10000, "New", "brakes"],
  [
    "Toyota 1NZ-FE Engine Assembly",
    "Engine Parts",
    185000,
    199000,
    "Used",
    "engine",
  ],
  ["Toyota Vitz Tail Light Pair", "Lights", 18500, 22000, "Used", "headlight"],
  [
    "Toyota Aqua 2018 — Business Stock",
    "Used Cars",
    3850000,
    3990000,
    "Used",
    "car",
  ],
  [
    "Honda Vezel 2017 — Business Stock",
    "Used Cars",
    5650000,
    5900000,
    "Used",
    "car",
  ],
  [
    "Toyota Prius 2020 — Repairable",
    "Damaged Cars",
    4200000,
    4500000,
    "Damaged",
    "car",
  ],
  [
    "Corolla Front Bumper Assembly",
    "Body Parts",
    22500,
    26000,
    "Used",
    "brakes",
  ],
];
export const products: Product[] = catalog.map<Product>(
  ([title, category, price, oldPrice, condition, asset], i) => ({
    id: `p${i + 1}`,
    slug: slugify(title),
    title,
    category,
    brand: title.split(" ")[0],
    price,
    oldPrice,
    stock: i === 6 ? 0 : i === 3 ? 3 : 16 + i,
    condition,
    image: productPhotos[`p${i + 1}`]?.image ?? images.car,
    sku: `TQ-${1001 + i}`,
    description:
      category === "Oils & Fluids"
        ? "Sealed transmission fluid for smooth shifting and consistent protection. Check the specification in your vehicle manual before ordering. Supplied with a tamper-evident seal."
        : "Carefully sourced automotive inventory, visually inspected by our team. Condition and compatibility are documented so you can choose with confidence.",
    compatibility: title.includes("Honda")
      ? "Honda Civic / City · 2016–2022"
      : title.includes("Nissan")
        ? "Nissan Note / Serena · 2015–2022"
        : "Toyota Corolla / Aqua / Vitz · 2014–2021",
    featured: i < 5,
    published: true,
    specs: (category === "Oils & Fluids"
      ? {
          "Fluid type": title.includes("ATF")
            ? "Automatic transmission"
            : "CVT",
          Specification: title.includes("Honda")
            ? "HCF-2"
            : title.includes("Nissan")
              ? "NS-3"
              : "ATF WS",
          "Pack size": "4 litres",
          Origin: "Japan",
        }
      : category.includes("Cars")
        ? {
            Year: "2018",
            Mileage: "68,000 km",
            Engine: "1.5L",
            Registration: "Karachi",
          }
        : {
            "Donor vehicle": title.split(" ").slice(0, 3).join(" "),
            "Part number": `OEM-${84320 + i}`,
            Inspection: "Bench tested",
            Wear: "Light cosmetic marks; see photos",
          }) as Record<string, string>,
  }),
);
const vehicleNames = [
  "Suzuki Alto VXL 2022",
  "Toyota Corolla Altis 2019",
  "Honda Civic Oriel 2020",
  "Kia Sportage AWD 2021",
  "Toyota Yaris ATIV 2021",
  "Honda City Aspire 2018",
  "Toyota Prado TX 2016",
  "Daihatsu Mira 2020",
];
const carPhotos = [
  "photo-1549317661-bd32c8ce0db2",
  "photo-1621007947382-bb3c3994e3fb",
  "photo-1533473359331-0135ef1b58bf",
  "photo-1519641471654-76ce0107ad1b",
  "photo-1494976388531-d1058494cdd8",
  "photo-1503376780353-7e6692767b70",
];
export const vehicles: Vehicle[] = vehicleNames.map((title, i) => ({
  id: `v${i + 1}`,
  slug: slugify(title),
  title,
  sellerId: i < 2 ? "seller" : "u" + i,
  seller: [
    "Ahmed Raza",
    "Ahmed Raza",
    "Sara Malik",
    "Usman Ali",
    "Bilal Khan",
    "Ayesha Noor",
    "Hamza Shah",
    "Ali Hassan",
  ][i],
  price: [
    2850000, 4950000, 6750000, 8900000, 4350000, 3550000, 18500000, 3250000,
  ][i],
  make: title.split(" ")[0],
  model: title.split(" ")[1],
  year: Number(title.slice(-4)),
  mileage: 28000 + i * 7100,
  city: ["Karachi", "Lahore", "Islamabad"][i % 3],
  transmission: i === 5 ? "Manual" : "Automatic",
  fuel: i === 7 ? "Hybrid" : "Petrol",
  body: i === 3 || i === 6 ? "SUV" : "Sedan",
  condition: "Used",
  engine: i === 0 ? "660cc" : "1.8L",
  color: ["Pearl white", "Silver", "Graphite"][i % 3],
  registration: "Registered · original documents",
  description:
    "A well-maintained family car with a complete service history. Original interior, chilled AC, and smooth drive. Inspection welcome by appointment. Price is slightly negotiable for a serious buyer.",
  damage:
    i === 4
      ? "Rear bumper repainted; no structural damage reported."
      : "No major accident reported. Minor age-related cosmetic wear.",
  images: [photo(carPhotos[i % 6]), images.interior, images.road],
  phone: "+92 300 000 0000",
  showPhone: i !== 1,
  allowChat: true,
  status: i === 6 ? "Pending Review" : i === 7 ? "Changes Required" : "Live",
  featured: i === 0,
  note: i === 7 ? "Please upload a clear registration photo." : "",
  date: "2026-10-01",
}));
export const orderStatuses = [
  "Pending Payment",
  "Payment Under Review",
  "Preparing",
  "Shipped",
  "Delivered",
  "Needs Attention",
  "Cancelled",
];
export const orders: Order[] = orderStatuses.map((status, i) => ({
  id: `ORD-${1048 - i}`,
  userId: "buyer",
  name: "wali Ahmed",
  email: "wali@example.com",
  phone: "0300 0000000",
  address: "House 24, Block 5, Gulshan-e-Iqbal",
  city: "Karachi",
  items: [{ product: products[i % 4], quantity: 1 }],
  total: products[i % 4].price + 350,
  delivery: 350,
  payment: [
    "Pending Payment",
    "Payment Under Review",
    "Verified",
    "Verified",
    "Verified",
    "Needs Attention",
    "Not Verified",
  ][i],
  status,
  date: `2026-09-${29 - i}`,
  tracking: i === 3 || i === 4 ? "TCS-DEMO-48192" : "",
  courier: i === 3 || i === 4 ? "TCS" : "",
  note: "Please call before delivery.",
  history: [
    "Order placed",
    ...(i > 1 && i < 5 ? ["Payment verified", status] : [status]),
  ],
}));
export const faqs = [
  [
    "How do manual payments work?",
    "Place your order, then use the bank details on the confirmation screen. Send your payment screenshot through WhatsApp with the order reference. This prototype uses demo details only.",
  ],
  [
    "How long does verification take?",
    "Our demo team reviews proof within one business day. You can simulate verification immediately in the admin dashboard.",
  ],
  [
    "Can I return a used part?",
    "Eligible unused and uninstalled parts may be returned within 7 days. Disclosed wear and damaged or repairable vehicles are excluded. Contact support before shipping.",
  ],
  [
    "How do I list my car?",
    "Sign in, choose Sell Your Car, complete the six steps and submit. The listing appears publicly after moderation.",
  ],
  [
    "Do you collect payment for community cars?",
    "No. Community listings connect buyers and sellers directly through chat. There is no marketplace checkout or escrow.",
  ],
  [
    "Can I hide my phone number?",
    "Yes. Turn off phone visibility when creating or editing a listing. Buyers can still use in-app chat.",
  ],
];
export const articles = [
  {
    slug: "choosing-the-right-atf",
    title: "The right fluid. A smoother journey.",
    category: "MAINTENANCE",
    image: images.workshop,
    text: "Transmission fluids are not interchangeable. Start with the specification listed in your owner’s manual, then match the exact standard on the bottle. ATF WS, HCF-2 and NS-3 serve different transmissions. Never choose by colour alone. Check the service history and ask a qualified workshop to verify compatibility before changing fluid.",
  },
  {
    slug: "cvt-service-signs",
    title: "Five signs your CVT needs a little care.",
    category: "EXPERT ADVICE",
    image: images.engine,
    text: "A new shudder, delayed engagement, unusual noise, warning light or inconsistent acceleration deserves attention. Record when the symptoms happen and arrange a workshop inspection. A diagnostic scan and correct fluid-level check help identify the cause before replacing parts.",
  },
  {
    slug: "used-car-checklist",
    title: "Your next car, without the guesswork.",
    category: "BUYING GUIDE",
    image: images.car,
    text: "Meet in daylight and inspect a cold engine. Check service records, registration documents and the chassis number. Look for mismatched paint, uneven tyre wear and fluid leaks. Test every switch, arrange an independent inspection, and agree the paperwork before exchanging funds.",
  },
];
export const initialRecords: Record<string, RecordItem[]> = {
  categories: categories.map((title, i) => ({
    id: `cat${i}`,
    title,
    detail:
      i === 0 ? "ATF Oil, CVT Oil" : i < 7 ? "Used Parts" : "Business vehicles",
    status: "Active",
  })),
  brands: ["Toyota", "Honda", "Nissan", "Brembo", "Suzuki"].map((title, i) => ({
    id: `brand${i}`,
    title,
    detail: "Verified catalogue brand",
    status: "Active",
  })),
  customers: ["wali Ahmed", "Ahmed Raza", "Sara Malik", "Usman Ali"].map(
    (title, i) => ({
      id: ["buyer", "seller", "u2", "u3"][i],
      title,
      detail: `${title.toLowerCase().replace(" ", ".")}@example.com`,
      status: "Active",
    }),
  ),
  team: [
    { id: "t1", title: "Mariam Khan", detail: "Super Admin", status: "Active" },
    {
      id: "t2",
      title: "Hassan Ali",
      detail: "Order Manager",
      status: "Active",
    },
    {
      id: "t3",
      title: "Areeba Shah",
      detail: "Catalogue Manager",
      status: "Active",
    },
    {
      id: "t4",
      title: "Omar Farooq",
      detail: "Marketplace Moderator",
      status: "Active",
    },
  ],
  promotions: [
    {
      id: "promo1",
      title: "The October service event",
      detail: "Up to 20% off selected fluids · 01–31 October 2026",
      status: "Active",
    },
  ],
  pages: [
    "About",
    "Shipping Delivery",
    "Returns Refunds",
    "Terms",
    "Privacy",
    "Marketplace Rules",
  ].map((title, i) => ({
    id: `page${i}`,
    title,
    detail:
      title === "About"
        ? "We believe a better drive starts with the right part. Zahid Autos brings inspected auto parts, trusted fluids and a community vehicle marketplace into one place."
        : "Demo policy: contact our team for help. Store orders use manual payment. Community buyers and sellers arrange their own inspection and transaction. No real purchases or payments are processed in this prototype.",
    status: "Published",
  })),
  home: [
    {
      id: "hero2",
      title: "Smooth shifts. Stronger journeys.",
      detail: "The right ATF and CVT fluids, selected for the way you drive.",
      status: "Active",
    },
    {
      id: "hero3",
      title: "Great parts. A fresh start.",
      detail:
        "Inspected used parts and remarkable vehicles, ready for their next chapter.",
      status: "Active",
    },
    {
      id: "hero",
      title: "Built for the road ahead.",
      detail:
        "Quality parts. Trusted fluids. Your next car. Everything for the drive, all in one place.",
      status: "Active",
    },
    {
      id: "promo",
      title: "Drive better. Maintain smarter.",
      detail: "A little care goes a long way.",
      status: "Active",
    },
    ...faqs.map(([title, detail], i) => ({
      id: `faq${i}`,
      title,
      detail,
      status: "Active",
    })),
    {
      id: "testimonial",
      title: "Ahmed Raza",
      detail:
        "The right part, the first time. Clear condition notes and a genuinely helpful team made the whole experience easy.",
      status: "Active",
    },
  ],
  notifications: [
    "Order placed",
    "Payment instructions",
    "Payment verified",
    "Payment issue",
    "Shipped",
    "Delivered",
    "Listing approved",
    "Listing changes required",
  ].map((title, i) => ({
    id: `template${i}`,
    title,
    detail: `Hello {{customer}}, your {{reference}} has an update: ${title.toLowerCase()}. Visit your Zahid Autos account for details.`,
    status: "Active",
  })),
  media: [
    {
      id: "media1",
      title: "Workshop campaign",
      detail: "image/jpeg",
      status: "Ready",
      image: images.workshop,
    },
    {
      id: "media2",
      title: "Community car",
      detail: "image/jpeg",
      status: "Ready",
      image: images.car,
    },
  ],
};
const originalSeedState = () => ({
  version: 1,
  role: "visitor",
  userId: "buyer",
  profile: {
    name: "wali Ahmed",
    email: "wali@example.com",
    phone: "0300 0000000",
  },
  products: structuredClone(products),
  vehicles: [
    ...structuredClone(vehicles),
    ...[
      "Draft",
      "Pending Review",
      "Changes Required",
      "Paused",
      "Sold",
      "Rejected",
    ].map((status, i) => ({
      ...structuredClone(vehicles[(i + 2) % vehicles.length]),
      id: `demo-listing-${i}`,
      slug: `demo-${slugify(status)}-vehicle`,
      sellerId: "seller",
      seller: "Ahmed Raza",
      status,
      note:
        status === "Changes Required"
          ? "Please add clearer exterior photos."
          : status === "Rejected"
            ? "Duplicate listing — please update your original listing."
            : "",
    })),
  ],
  orders: structuredClone(orders),
  cart: [] as { id: string; quantity: number }[],
  favorites: [] as string[],
  notifications: [
    {
      id: "n1",
      title: "Welcome to Zahid Autos. Your next journey starts here.",
      read: false,
      userId: "buyer",
    },
  ],
  reports: [
    {
      id: "r1",
      listingId: "v2",
      title: "Toyota Corolla Altis 2019",
      reason: "Incorrect information",
      notes: "Please confirm the mileage.",
      status: "Open",
    },
  ],
  messages: [
    {
      id: "c1",
      listingId: "v1",
      userId: "buyer",
      seller: "Ahmed Raza",
      messages: [
        {
          text: "Hi, is the Alto still available?",
          own: true,
          senderId: "buyer",
          time: "10:24 AM",
        },
        {
          text: "Yes, it is. You are welcome to arrange an inspection this weekend.",
          own: false,
          senderId: "seller",
          time: "10:26 AM",
        },
      ] as ChatMessage[],
    },
  ],
  addresses: [
    {
      id: "a1",
      title: "Home",
      detail: "House 24, Block 5, Gulshan-e-Iqbal, Karachi",
      status: "Default",
    },
  ],
  activity: [
    "Payment verified for ORD-1046",
    "Marketplace listing approved: Suzuki Alto VXL 2022",
    "Stock updated: Honda HCF-2 CVT Fluid",
  ],
  settings: {
    ...siteConfig,
    deliveryFee: 350,
    freeThreshold: 20000,
    courier: "TCS",
    zones: "Karachi, Lahore, Islamabad",
    deliveryTime: "2–4 business days",
    pickup: true,
    instructions:
      "Transfer the exact order total and include your order number as the payment reference.",
  },
  records: structuredClone(initialRecords),
});
export type DemoState = ReturnType<typeof originalSeedState>;

// Keep one preview customer while other marketplace participants remain contacts.
export function unifyCustomer(state: DemoState): DemoState {
  state.userId = "buyer";
  for (const vehicle of state.vehicles) {
    if (vehicle.sellerId === "seller") {
      vehicle.sellerId = "buyer";
      vehicle.seller = state.profile.name;
    }
  }
  for (const order of state.orders)
    if (order.userId === "seller") order.userId = "buyer";
  for (const notification of state.notifications)
    if (notification.userId === "seller") notification.userId = "buyer";
  for (const conversation of state.messages) {
    const owned = state.vehicles.some(
      (v) => v.id === conversation.listingId && v.sellerId === "buyer",
    );
    // The former buyer becomes an outside interested customer on owned listings.
    if (owned && conversation.userId === "buyer") {
      conversation.userId = "u2";
      for (const message of conversation.messages) {
        message.senderId =
          message.senderId === "seller" || (!message.senderId && !message.own)
            ? "buyer"
            : "u2";
      }
    } else {
      if (conversation.userId === "seller") conversation.userId = "buyer";
      for (const message of conversation.messages)
        if (message.senderId === "seller") message.senderId = "buyer";
    }
    if (owned) conversation.seller = state.profile.name;
  }
  return state;
}
export const seedState = () => unifyCustomer(originalSeedState());
