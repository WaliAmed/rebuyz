"use client";
import { productPhotos } from "@/lib/product-photos";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Menu,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  X,
  Plus,
  Minus,
  Settings2,
  Gauge,
  Zap,
  Wrench,
  Car,
  Droplets,
  CircleDot,
  Lightbulb,
  Battery,
  Box,
  Eye,
  MapPin,
  Check,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import {
  categories,
  Product,
  Vehicle,
  images,
  faqs,
  articles,
} from "@/lib/data";
import { money, siteConfig, slugify } from "@/lib/site-config";
import { Button } from "./ui/button";
import { Badge, Empty, Modal } from "./ui/shared";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Zahid Autos home">
      <img src="/logo.png" alt="Zahid Autos" width={780} height={307} />
    </Link>
  );
}
const nav = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Auto Parts", "/shop/used-parts"],
  ["Oils & Fluids", "/shop/oils-fluids"],
  ["Used Cars", "/shop/used-cars"],
  ["Marketplace", "/marketplace"],
  ["Our Story", "/about"],
];
export function Header() {
  const { state } = useDemo();
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const count = state.cart.reduce((n, r) => n + r.quantity, 0);
  return (
    <>
      <div className="announcement">
        <div className="container announcement-inner">
          <span>
            <Phone size={12} />
            {state.settings.phone}
            <Mail size={12} />
            {state.settings.email}
          </span>
          <span>
            Built for better journeys.{" "}
            <b>
              Up to 20% off selected essentials <ArrowUpRight size={13} />
            </b>
          </span>
          <Link href="/track-order">
            Track your order <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      <header>
        <div className="container main-header">
          <Logo />
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/search?q=" + encodeURIComponent(search));
              setSearch("");
            }}
          >
            <select
              aria-label="Search category"
              onChange={(e) => {
                if (e.target.value) router.push("/shop/" + e.target.value);
              }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option value={slugify(c)} key={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              aria-label="Search products"
              placeholder="Find parts, fluids, or your next car…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button aria-label="Search" className="search-submit">
              <Search size={20} />
            </button>
            {search && (
              <div className="search-suggestions">
                {state.products
                  .filter((p) =>
                    p.title.toLowerCase().includes(search.toLowerCase()),
                  )
                  .slice(0, 4)
                  .map((p) => (
                    <Link
                      key={p.id}
                      onClick={() => setSearch("")}
                      href={"/product/" + p.slug}
                    >
                      <img src={p.image} alt="" />
                      {p.title}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                <button type="submit">See all results for “{search}”</button>
              </div>
            )}
          </form>
          <Button asChild className="sell-header">
            <Link href="/sell">
              Sell your car <ArrowUpRight size={17} />
            </Link>
          </Button>
          <button
            className="icon-button mobile-only"
            onClick={() => setMenu(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
        <div className="nav-band">
          <div className="container nav-inner">
            <details className="category-menu">
              <summary>
                <Menu size={17} /> Shop by category <ChevronDown size={15} />
              </summary>
              <div>
                {categories.map((c) => (
                  <Link key={c} href={"/shop/" + slugify(c)}>
                    {c}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </details>
            <nav>
              {nav.map(([n, h]) => (
                <Link key={h} href={h}>
                  {n}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              <Link
                aria-label="My account"
                href={
                  state.role === "visitor"
                    ? "/auth/sign-in"
                    : state.role === "admin"
                      ? "/admin"
                      : "/account"
                }
              >
                <UserRound size={20} />
              </Link>
              <Link aria-label="Favorites" href="/account/favorites">
                <Heart size={20} />
              </Link>
              <button
                aria-label={`Open cart, ${count} items`}
                onClick={() => setCart(true)}
              >
                <ShoppingBag size={20} />
                <span className="count">{count}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <Modal
        open={menu}
        onClose={() => setMenu(false)}
        title="Explore Zahid Autos"
        drawer
      >
        <nav className="mobile-nav">
          {[
            ...nav,
            ["Sell your car", "/sell"],
            ["My account", "/account"],
            ["Contact", "/contact"],
          ].map(([n, h]) => (
            <Link key={h} href={h} onClick={() => setMenu(false)}>
              {n}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      </Modal>
      <Modal
        open={cart}
        onClose={() => setCart(false)}
        title={`Your bag (${count})`}
        drawer
      >
        <CartLines compact />
        <div className="actions">
          <Button asChild>
            <Link href="/cart" onClick={() => setCart(false)}>
              View bag
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/checkout" onClick={() => setCart(false)}>
              Checkout <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function DemoControl() {
  const { state, switchRole, scenario, setScenario, reset } = useDemo();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="demo-trigger" onClick={() => setOpen(true)}>
        <Settings2 size={14} /> Demo
        <span className="live-dot" />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Your demo, your scenario"
      >
        <p>
          Everything runs in this browser. Changes persist locally and stay
          connected across the store, account, and admin.
        </p>
        <label>
          Preview as
          <select
            value={
              state.role === "visitor"
                ? "visitor"
                : state.role === "admin"
                  ? "admin"
                  : "customer"
            }
            onChange={(e) => switchRole(e.target.value)}
          >
            <option value="visitor">Signed out visitor</option>
            <option value="customer">Customer</option>
            <option value="admin">Super admin</option>
          </select>
        </label>
        <label>
          Request state
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="loading">Loading skeletons</option>
            <option value="empty">Empty collections</option>
            <option value="error">Simulated request error</option>
            <option value="permission">Permission denied</option>
          </select>
        </label>
        <div className="actions">
          <Button asChild>
            <Link
              href={state.role === "admin" ? "/admin" : "/account"}
              onClick={() => setOpen(false)}
            >
              Open dashboard <ArrowUpRight size={16} />
            </Link>
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw size={15} /> Reset demo
          </Button>
        </div>
        <p className="small muted">
          Demo only. No real accounts, messages, payments, or uploads leave this
          app.
        </p>
      </Modal>
    </>
  );
}
export function CartLines({ compact = false }: { compact?: boolean }) {
  const { state, update } = useDemo();
  return (
    <>
      {state.cart.length === 0 ? (
        <Empty
          title="Your bag is taking a pit stop"
          text="Find the right parts and we’ll keep them here."
        />
      ) : (
        state.cart.map((row) => {
          const p = state.products.find((p) => p.id === row.id);
          if (!p) return null;
          return (
            <div className={`cart-line ${compact ? "compact" : ""}`} key={p.id}>
              <img src={p.image} alt={p.title} />
              <div>
                <Link href={"/product/" + p.slug}>
                  <b>{p.title}</b>
                </Link>
                <p className="small muted">
                  {p.condition} · {p.sku}
                </p>
                <strong>{money(p.price)}</strong>
              </div>
              <div className="quantity">
                <button
                  aria-label={`Decrease ${p.title}`}
                  onClick={() =>
                    update((s) => {
                      const r = s.cart.find((r) => r.id === p.id);
                      if (r) r.quantity = Math.max(1, r.quantity - 1);
                    })
                  }
                >
                  <Minus size={14} />
                </button>
                <span>{row.quantity}</span>
                <button
                  aria-label={`Increase ${p.title}`}
                  disabled={row.quantity >= p.stock}
                  onClick={() =>
                    update((s) => {
                      const r = s.cart.find((r) => r.id === p.id);
                      if (r) r.quantity = Math.min(p.stock, r.quantity + 1);
                    })
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                className="icon-button"
                aria-label={`Remove ${p.title}`}
                onClick={() =>
                  update((s) => {
                    s.cart = s.cart.filter((r) => r.id !== p.id);
                  }, "Item removed")
                }
              >
                <X size={16} />
              </button>
            </div>
          );
        })
      )}
    </>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const { state, favorite, addCart } = useDemo();
  const [quick, setQuick] = useState(false);
  return (
    <>
      <article className="product-card">
        <div className="product-image">
          <Link href={"/product/" + p.slug}>
            <img src={p.image} alt={p.title} loading="lazy" />
          </Link>
          <span className="discount">
            −{Math.round((1 - p.price / p.oldPrice) * 100)}%
          </span>
          <button
            className={`card-heart ${state.favorites.includes(p.id) ? "saved" : ""}`}
            onClick={() => favorite(p.id)}
            aria-label={`Save ${p.title}`}
          >
            <Heart size={17} />
          </button>
          <button className="quick-view" onClick={() => setQuick(true)}>
            <Eye size={15} /> Quick view
          </button>
        </div>
        <div className="product-body">
          <div className="card-meta">
            <span>{p.category}</span>
            <Badge>{p.condition}</Badge>
          </div>
          <Link href={"/product/" + p.slug}>
            <h3>{p.title}</h3>
          </Link>
          <div className="rating">
            ★★★★★{" "}
            <span>
              4.9 <span className="muted">({24 + Number(p.id.slice(1))})</span>
            </span>
          </div>
          <div className="price-line">
            <div>
              <b>{money(p.price)}</b>
              <del>{money(p.oldPrice)}</del>
            </div>
            <button
              aria-label={`Add ${p.title} to cart`}
              disabled={!p.stock}
              onClick={() => addCart(p.id)}
              className="add-button"
            >
              <Plus size={20} />
            </button>
          </div>
          {!p.stock && (
            <small className="error-text">Currently out of stock</small>
          )}
        </div>
      </article>
      <Modal open={quick} onClose={() => setQuick(false)} title={p.title}>
        <img className="quick-image" src={p.image} alt={p.title} />
        <p>{p.description}</p>
        <h3>{money(p.price)}</h3>
        <div className="actions">
          <Button disabled={!p.stock} onClick={() => addCart(p.id)}>
            Add to bag
          </Button>
          <Button asChild variant="outline">
            <Link href={"/product/" + p.slug}>
              Full details <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  const { state, favorite } = useDemo();
  return (
    <article className="vehicle-card">
      <div className="vehicle-image">
        <Link href={"/marketplace/" + v.slug}>
          <img src={v.images[0]} alt={v.title} loading="lazy" />
        </Link>
        <Badge>{v.featured ? "Featured" : "Community listing"}</Badge>
        <button
          className={`card-heart ${state.favorites.includes(v.id) ? "saved" : ""}`}
          onClick={() => favorite(v.id)}
          aria-label={`Save ${v.title}`}
        >
          <Heart size={17} />
        </button>
      </div>
      <div className="product-body">
        <div className="vehicle-price">{money(v.price)}</div>
        <Link href={"/marketplace/" + v.slug}>
          <h3>{v.title}</h3>
        </Link>
        <p className="vehicle-specs">
          {v.year}
          <span />
          {v.mileage.toLocaleString()} km
          <span />
          {v.transmission}
        </p>
        <div className="vehicle-footer">
          <span>
            <MapPin size={13} />
            {v.city}
          </span>
          <span>1 day ago</span>
        </div>
      </div>
    </article>
  );
}
const categoryIcons = [
  Droplets,
  Wrench,
  CircleDot,
  Gauge,
  Lightbulb,
  Car,
  Battery,
  Car,
  Zap,
];
export function CategoryStrip({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? "category-grid" : "category-strip"}>
      {categories.map((c, i) => {
        const Icon = categoryIcons[i];
        return (
          <Link key={c} href={"/shop/" + slugify(c)}>
            <span className="category-icon">
              <Icon size={large ? 34 : 25} strokeWidth={1.4} />
            </span>
            <span>{c}</span>
            {large && (
              <small>
                Explore collection <ArrowUpRight size={12} />
              </small>
            )}
          </Link>
        );
      })}
    </div>
  );
}
export function FAQ() {
  const { state } = useDemo();
  const rows = state.records.home.filter(
    (r) => r.id.startsWith("faq") && r.status === "Active",
  );
  return (
    <div className="faq-list">
      {rows.map((r, i) => (
        <details key={r.id}>
          <summary>
            <span>
              <small>0{i + 1}</small>
              {r.title}
            </span>
            <Plus size={20} />
          </summary>
          <p>{r.detail}</p>
        </details>
      ))}
    </div>
  );
}
function ProductSection({
  title,
  eyebrow,
  featured = false,
}: {
  title: string;
  eyebrow: string;
  featured?: boolean;
}) {
  const { state } = useDemo();
  const [tab, setTab] = useState("All products");
  const rows = state.products
    .filter(
      (p) =>
        p.published &&
        (tab === "All products" ||
          tab === "Best selling" ||
          (tab === "Featured" && p.featured) ||
          (tab === "Hot deals" && p.oldPrice / p.price > 1.12) ||
          (tab === "Oils & fluids" && p.category === "Oils & Fluids") ||
          (tab === "Used parts" && p.condition === "Used")),
    )
    .slice(0, featured ? 4 : 8);
  return (
    <section className="section container">
      <div className="section-heading">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" href="/shop">
          Shop all products <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="tabs">
        {(featured
          ? ["All products", "Hot deals", "Used parts", "Oils & fluids"]
          : ["Best selling", "Featured", "All products"]
        ).map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {rows.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
function Countdown() {
  const [seconds, setSeconds] = useState(2 * 86400 + 11 * 3600 + 42 * 60 + 18);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="countdown">
      {[
        Math.floor(seconds / 86400),
        Math.floor(seconds / 3600) % 24,
        Math.floor(seconds / 60) % 60,
        seconds % 60,
      ].map((n, i) => (
        <div key={i}>
          <b>{String(n).padStart(2, "0")}</b>
          <small>{["DAYS", "HOURS", "MINS", "SECS"][i]}</small>
        </div>
      ))}
    </div>
  );
}
export function Home() {
  const { state } = useDemo();
  const [slide, setSlide] = useState(0);
  const [testimonial, setTestimonial] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || hovered || reduced) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % 3), 6500);
    return () => clearInterval(t);
  }, [paused, hovered, reduced]);
  const hero = state.records.home.find((r) => r.id === "hero");
  const slides = [
    {
      tag: "THE NEXT CHAPTER OF YOUR DRIVE",
      title: hero?.title || "Built for the road ahead.",
      text: hero?.detail || "",
      image: images.hero,
      cta: "Explore the collection",
      href: "/shop",
    },
    {
      tag: "GENUINE CARE. EVERY KILOMETRE.",
      title:
        state.records.home.find((r) => r.id === "hero2")?.title ||
        "Smooth shifts. Stronger journeys.",
      text:
        state.records.home.find((r) => r.id === "hero2")?.detail ||
        "The right ATF and CVT fluids, selected for the way you drive.",
      image: images.workshop,
      cta: "Shop oils & fluids",
      href: "/shop/oils-fluids",
    },
    {
      tag: "A SECOND LIFE. A FIRST-CLASS DRIVE.",
      title:
        state.records.home.find((r) => r.id === "hero3")?.title ||
        "Great parts. A fresh start.",
      text:
        state.records.home.find((r) => r.id === "hero3")?.detail ||
        "Inspected used parts and remarkable vehicles, ready for their next chapter.",
      image: images.car,
      cta: "Discover used parts",
      href: "/shop/used-parts",
    },
  ];
  const current = slides[slide];
  return (
    <>
      <div className="container">
        <CategoryStrip />
        <section
          className="hero"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide}
              className="hero-slide"
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                backgroundImage: `linear-gradient(90deg,rgba(20,18,20,.95) 0%,rgba(20,18,20,.7) 40%,rgba(20,18,20,.08) 100%),url(${current.image})`,
              }}
            >
              <div className="hero-content">
                <span className="hero-tag">
                  <span /> {current.tag}
                </span>
                <h1>{current.title}</h1>
                <p>{current.text}</p>
                <div className="actions">
                  <Button asChild>
                    <Link href={current.href}>
                      {current.cta}
                      <ArrowUpRight size={18} />
                    </Link>
                  </Button>
                  <Link className="hero-secondary" href="/sell">
                    Sell your car <ArrowUpRight size={16} />
                  </Link>
                </div>
                <div className="hero-proof">
                  <span className="avatar-stack">
                    <i>AR</i>
                    <i>SK</i>
                    <i>ZA</i>
                  </span>
                  <span>
                    <b>Built on trust.</b>
                    <small>For people who love the drive.</small>
                  </span>
                </div>
              </div>
              <div className="hero-side">
                CURATED FOR EVERY JOURNEY · EST. 2026
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="slider-controls">
            <button
              aria-label="Previous hero slide"
              onClick={() => setSlide((slide + 2) % 3)}
            >
              ←
            </button>
            <span>
              0{slide + 1} <i>/ 03</i>
            </span>
            <button
              aria-label="Next hero slide"
              onClick={() => setSlide((slide + 1) % 3)}
            >
              →
            </button>
            <button
              aria-label={paused ? "Play carousel" : "Pause carousel"}
              onClick={() => setPaused(!paused)}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
          </div>
        </section>
        <div className="trust-strip">
          {[
            [
              ShieldCheck,
              "Quality you can trust",
              "Inspected. Selected. Ready.",
            ],
            [Truck, "Delivered to your door", "Nationwide delivery"],
            [RotateCcw, "Shop with confidence", "Clear conditions & returns"],
            [
              Headphones,
              "Real people. Real support.",
              "Here for your next journey",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Truck;
            return (
              <div key={String(title)}>
                <I size={26} strokeWidth={1.4} />
                <span>
                  <b>{String(title)}</b>
                  <small>{String(text)}</small>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <ProductSection
        title="Good parts. Great prices."
        eyebrow="THE ZAHID AUTOS COLLECTION"
        featured
      />
      <section className="editorial container">
        <div className="editorial-word">ZAHID AUTOS</div>
        <img
          src={images.workshop}
          alt="Mechanic carefully maintaining an engine"
        />
        <div>
          <div className="eyebrow">CARE THAT GOES THE DISTANCE</div>
          <h2>{state.records.home.find((r) => r.id === "promo")?.title}</h2>
          <p>
            {state.records.home.find((r) => r.id === "promo")?.detail} Give your
            car the quality it deserves, with essentials chosen by people who
            know the road.
          </p>
          <Button asChild>
            <Link href="/shop/oils-fluids">
              Find your essentials <ArrowUpRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
      <ProductSection
        title="A few things you’ll love."
        eyebrow="RECOMMENDED FOR YOUR GARAGE"
      />
      <div className="ticker">
        <div>
          GENUINE FLUIDS. SMOOTHER DRIVES. <span>✳</span> INSPECTED PARTS.
          SECOND CHANCES. <span>✳</span> YOUR NEXT JOURNEY STARTS HERE.{" "}
          <span>✳</span> GENUINE FLUIDS. SMOOTHER DRIVES. <span>✳</span>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">LESS SPEND. MORE MILES.</div>
            <h2>The weekend pit stop.</h2>
            <p>Limited-time prices on your everyday essentials.</p>
          </div>
          <Countdown />
        </div>
        <div className="sale-grid">
          <div className="sale-banner">
            <span className="eyebrow">THE SERVICE EVENT</span>
            <h3>
              A little care.
              <br />A lot more drive.
            </h3>
            <p>
              Save up to <strong>20%</strong>
            </p>
            <Button asChild>
              <Link href="/shop/oils-fluids">
                Shop the offers <ArrowUpRight size={16} />
              </Link>
            </Button>
            <img src={productPhotos.p1.image} alt="Transmission fluid" />
          </div>
          {state.products.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">FIND YOUR FIT</div>
              <h2>Every part of your journey.</h2>
            </div>
            <p>From a smoother shift to a fresh start.</p>
          </div>
          <CategoryStrip large />
        </div>
      </section>
      <section className="section container promo-grid">
        <div
          style={{
            backgroundImage: `linear-gradient(90deg,#181618dd,#18161822),url(${images.car})`,
          }}
        >
          <span className="eyebrow">BUSINESS-OWNED. CAREFULLY SELECTED.</span>
          <h2>
            Your next car.
            <br />
            Our seal of confidence.
          </h2>
          <Button asChild>
            <Link href="/shop/used-cars">
              Explore our vehicles <ArrowUpRight size={16} />
            </Link>
          </Button>
        </div>
        <div className="light-promo">
          <span className="eyebrow">A NEW CHAPTER FOR YOUR CAR</span>
          <h2>
            Good cars deserve
            <br />
            great new owners.
          </h2>
          <p>List it. Meet buyers. Make your next move.</p>
          <Button asChild variant="outline">
            <Link href="/sell">
              Sell your car <ArrowUpRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">FROM OUR COMMUNITY</div>
            <h2>One owner’s pride. Your next ride.</h2>
            <p>Real cars. Real people. A whole new road ahead.</p>
          </div>
          <Link className="text-link" href="/marketplace">
            Explore the marketplace <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="vehicle-grid">
          {state.vehicles
            .filter((v) => v.status === "Live")
            .slice(0, 3)
            .map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
        </div>
      </section>
      <section className="testimonial-section">
        <div className="container testimonial">
          <div>
            <div className="eyebrow">GOOD PEOPLE. GREAT JOURNEYS.</div>
            <h2>
              A little trust
              <br />
              goes a long way.
            </h2>
            <div className="rating">
              ★★★★★ <span>Made for drivers, by drivers.</span>
            </div>
          </div>
          <div>
            <span className="quote-mark">“</span>
            <blockquote>
              {testimonial === 0
                ? state.records.home.find((r) => r.id === "testimonial")?.detail
                : "Listing my car was refreshingly simple. The messages kept everything in one place, and I found a serious buyer without the usual back and forth."}
            </blockquote>
            <div className="section-heading">
              <span>
                <b>{testimonial === 0 ? "Ahmed Raza" : "Sara Malik"}</b>
                <small className="block muted">
                  {testimonial === 0
                    ? "Toyota owner · Karachi"
                    : "Community seller · Lahore"}
                </small>
              </span>
              <div className="actions">
                <button
                  className="circle-button"
                  aria-label="Previous testimonial"
                  onClick={() => setTestimonial(1 - testimonial)}
                >
                  ←
                </button>
                <button
                  className="circle-button"
                  aria-label="Next testimonial"
                  onClick={() => setTestimonial(1 - testimonial)}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section container faq-section">
        <div>
          <div className="eyebrow">A LITTLE CLARITY</div>
          <h2>
            Good questions.
            <br />
            Straight answers.
          </h2>
          <p>Everything you need to get moving.</p>
          <Link className="text-link" href="/contact">
            Talk to our team <ArrowUpRight size={17} />
          </Link>
        </div>
        <FAQ />
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE ZAHID AUTOS JOURNAL</div>
            <h2>For the love of the drive.</h2>
          </div>
          <Link className="text-link" href="/blog">
            All stories <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="vehicle-grid">
          {articles.map((a) => (
            <Link
              href={"/blog/" + a.slug}
              key={a.slug}
              className="article-card"
            >
              <img src={a.image} alt={a.title} />
              <div className="eyebrow">
                {a.category} <span> · 5 MIN READ</span>
              </div>
              <h3>{a.title}</h3>
              <span className="text-link">
                Read the story <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <div>
          <Logo />
          <p>
            Good parts. Great journeys.
            <br />A better way to keep moving.
          </p>
          <span className="footer-country">
            <MapPin size={14} /> Made for the roads of Pakistan.
          </span>
        </div>
        <div>
          <h4>Find your fit</h4>
          {[
            ["Shop all", "/shop"],
            ["Oils & fluids", "/shop/oils-fluids"],
            ["Used parts", "/shop/used-parts"],
            ["Used cars", "/shop/used-cars"],
            ["Damaged cars", "/shop/damaged-cars"],
          ].map(([t, h]) => (
            <Link href={h} key={h}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h4>Keep moving</h4>
          {[
            ["Marketplace", "/marketplace"],
            ["Sell your car", "/sell"],
            ["Our story", "/about"],
            ["The journal", "/blog"],
            ["Contact us", "/contact"],
          ].map(([t, h]) => (
            <Link href={h} key={h}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h4>We’re here to help</h4>
          {[
            ["Track an order", "/track-order"],
            ["Delivery", "/shipping-delivery"],
            ["Returns & refunds", "/returns-refunds"],
            ["Marketplace rules", "/marketplace-rules"],
            ["FAQs", "/faqs"],
          ].map(([t, h]) => (
            <Link href={h} key={h}>
              {t}
            </Link>
          ))}
        </div>
        <div className="newsletter">
          <h4>A little Zahid Autos in your inbox.</h4>
          <p>Fresh finds, useful advice, and the occasional good deal.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("You’re on the demo list. No email was sent.");
              e.currentTarget.reset();
            }}
          >
            <input
              required
              type="email"
              aria-label="Newsletter email"
              placeholder="Your email address"
            />
            <button aria-label="Subscribe">
              <ArrowRight size={20} />
            </button>
          </form>
          <small>Just the good stuff. Unsubscribe anytime.</small>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Zahid Autos. Frontend demo.</span>
        <div>
          <Link href="/terms">Terms of service</Link>
          <Link href="/privacy">Privacy policy</Link>
          <span>PKR · Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
