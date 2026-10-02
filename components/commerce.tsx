"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  ArrowRight,
  ArrowUpRight,
  SlidersHorizontal,
  Search,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Share2,
  MapPin,
  MessageCircle,
  Flag,
  Phone,
  ZoomIn,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDemo, recordActivity } from "@/lib/store";
import {
  checkoutItems,
  changeOrderStatus,
  compatibleYear,
} from "@/lib/demo-actions";
import { categories, Order, Product, Vehicle } from "@/lib/data";
import { money, slugify } from "@/lib/site-config";
import { Button } from "./ui/button";
import { Badge, CopyButton, Empty, Modal, PageTitle } from "./ui/shared";
import { ProductCard, VehicleCard, CartLines } from "./site";
export function Catalog({
  market = false,
  category = "",
  sellerId = "",
}: {
  market?: boolean;
  category?: string;
  sellerId?: string;
}) {
  const { state, scenario } = useDemo();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  useEffect(() => setQ(params.get("q") || ""), [params]);
  const [filters, setFilters] = useState<Record<string, string>>({ category });
  const [sort, setSort] = useState("Recommended");
  const [mobile, setMobile] = useState(false);
  const set = (key: string, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));
  const filterFields: Record<string, string[]> = market
    ? {
        city: ["Karachi", "Lahore", "Islamabad"],
        make: ["Toyota", "Honda", "Suzuki", "Kia", "Daihatsu"],
        transmission: ["Automatic", "Manual"],
        fuel: ["Petrol", "Hybrid", "Diesel"],
        body: ["Sedan", "SUV", "Hatchback"],
        condition: ["Used", "Damaged"],
      }
    : {
        category: categories,
        brand: ["Toyota", "Honda", "Nissan", "Brembo"],
        condition: ["New", "Used", "Damaged"],
        availability: ["In stock", "Out of stock"],
        make: ["Toyota", "Honda", "Nissan"],
        specification: ["ATF WS", "HCF-2", "NS-3"],
      };
  let items: (Product | Vehicle)[] = market
    ? state.vehicles.filter(
        (v) => v.status === "Live" && (!sellerId || v.sellerId === sellerId),
      )
    : state.products.filter((p) => p.published);
  items = items.filter((item) => {
    if (!item.title.toLowerCase().includes(q.toLowerCase())) return false;
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      if (key === "maxPrice" && item.price > Number(value)) return false;
      if (key === "minPrice" && item.price < Number(value)) return false;
      if (key === "year" && "year" in item && item.year < Number(value))
        return false;
      if (
        key === "year" &&
        "compatibility" in item &&
        !compatibleYear(item.compatibility, Number(value))
      )
        return false;
      if (
        key === "mileage" &&
        "mileage" in item &&
        item.mileage > Number(value)
      )
        return false;
      if (
        key === "availability" &&
        "stock" in item &&
        (value === "In stock") !== item.stock > 0
      )
        return false;
      if (
        key === "specification" &&
        "specs" in item &&
        item.specs.Specification !== value
      )
        return false;
      if (
        key === "model" &&
        !item.title.toLowerCase().includes(value.toLowerCase())
      )
        return false;
      if (
        key === "make" &&
        !("make" in item) &&
        !item.title.includes(value) &&
        !("compatibility" in item && item.compatibility.includes(value))
      )
        return false;
      if (
        [
          "category",
          "brand",
          "condition",
          "city",
          "make",
          "transmission",
          "fuel",
          "body",
        ].includes(key) &&
        key in item
      ) {
        const actual = String(item[key as keyof typeof item]);
        if (key === "category" && value === "used-parts") {
          if (actual.includes("Cars") || actual === "Oils & Fluids")
            return false;
        } else if (
          slugify(actual) !== slugify(value) &&
          !(value === "oils-fluids" && actual === "Oils & Fluids")
        )
          return false;
      }
    }
    return true;
  });
  if (sort === "Price: low to high") items.sort((a, b) => a.price - b.price);
  if (sort === "Price: high to low") items.sort((a, b) => b.price - a.price);
  if (sort === "Newest first") items.reverse();
  if (scenario === "empty") items = [];
  const filterContent = (
    <>
      <div className="section-heading">
        <h3>Refine your search</h3>
        <button
          className="text-button"
          onClick={() => {
            setFilters({});
            setQ("");
          }}
        >
          Reset
        </button>
      </div>
      {Object.entries(filterFields).map(([key, options]) => (
        <label key={key}>
          {key.replace(/^./, (c) => c.toUpperCase())}
          <select
            value={filters[key] || ""}
            onChange={(e) => set(key, e.target.value)}
          >
            <option value="">All {key}</option>
            {options.map((v) => (
              <option key={v} value={key === "category" ? slugify(v) : v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      ))}
      <label>
        Minimum price
        <input
          type="number"
          min="0"
          value={filters.minPrice || ""}
          onChange={(e) => set("minPrice", e.target.value)}
          placeholder="Rs. 0"
        />
      </label>
      <label>
        Maximum price
        <input
          type="number"
          min="0"
          value={filters.maxPrice || ""}
          onChange={(e) => set("maxPrice", e.target.value)}
          placeholder="Any budget"
        />
      </label>
      <label>
        Vehicle model
        <input
          value={filters.model || ""}
          onChange={(e) => set("model", e.target.value)}
          placeholder="e.g. Corolla"
        />
      </label>
      <label>
        {market ? "Year from" : "Compatible year"}
        <input
          type="number"
          min="1990"
          max="2026"
          value={filters.year || ""}
          onChange={(e) => set("year", e.target.value)}
          placeholder="Any year"
        />
      </label>
      {market && (
        <label>
          Maximum mileage
          <input
            type="number"
            min="0"
            value={filters.mileage || ""}
            onChange={(e) => set("mileage", e.target.value)}
            placeholder="Any mileage"
          />
        </label>
      )}
    </>
  );
  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / {market ? "Marketplace" : "Shop"}
      </div>
      <div className={`catalog-banner ${market ? "market" : ""}`}>
        <PageTitle
          eyebrow={
            market ? "THE COMMUNITY GARAGE" : "THE ZAHID AUTOS COLLECTION"
          }
          title={
            sellerId
              ? `${state.vehicles.find((v) => v.sellerId === sellerId)?.seller || "Seller"}’s garage`
              : market
                ? "Your next chapter starts here."
                : category
                  ? category.replaceAll("-", " ")
                  : "Find your next great part."
          }
          text={
            market
              ? "Real cars, real owners, and a road full of possibilities."
              : "Quality parts and genuine fluids. A better drive starts here."
          }
        >
          {market && (
            <Button asChild>
              <Link href="/sell">
                Sell your car <ArrowUpRight size={16} />
              </Link>
            </Button>
          )}
        </PageTitle>
      </div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">{filterContent}</aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div className="input-icon">
              <Search size={17} />
              <input
                aria-label={market ? "Search cars" : "Search catalogue"}
                placeholder={
                  market ? "Make, model, or keyword" : "Search the collection"
                }
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button
              className="btn outline mobile-only"
              onClick={() => setMobile(true)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select
              aria-label="Sort results"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {[
                "Recommended",
                "Newest first",
                "Price: low to high",
                "Price: high to low",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="active-filters">
            <span>
              {items.length} {market ? "cars" : "products"} found
            </span>
            {Object.entries(filters)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <button key={k} onClick={() => set(k, "")}>
                  {v.replaceAll("-", " ")} ×
                </button>
              ))}
          </div>
          {items.length ? (
            <div
              className={
                market
                  ? "vehicle-grid catalog-grid"
                  : "product-grid catalog-grid"
              }
            >
              {items.map((p) =>
                "sellerId" in p ? (
                  <VehicleCard key={p.id} vehicle={p} />
                ) : (
                  <ProductCard key={p.id} product={p} />
                ),
              )}
            </div>
          ) : (
            <Empty
              title="No matches this time"
              text="Try a broader search or reset your filters."
            />
          )}
        </div>
      </div>
      <Modal
        open={mobile}
        onClose={() => setMobile(false)}
        title="Filters"
        drawer
      >
        {filterContent}
        <Button onClick={() => setMobile(false)}>
          Show {items.length} results
        </Button>
      </Modal>
    </div>
  );
}
export function Detail({
  slug,
  market = false,
}: {
  slug: string;
  market?: boolean;
}) {
  const { state, update, favorite, addCart } = useDemo();
  const router = useRouter();
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState(false);
  const [tab, setTab] = useState("Description");
  const [report, setReport] = useState(false);
  const product = state.products.find((p) => p.slug === slug || p.id === slug);
  const vehicle = state.vehicles.find((v) => v.slug === slug || v.id === slug);
  const item = market ? vehicle : product;
  if (
    !item ||
    (market &&
      vehicle?.status !== "Live" &&
      state.role !== "admin" &&
      (state.role === "visitor" || state.userId !== vehicle?.sellerId))
  )
    return (
      <Empty
        title="This listing isn’t available"
        href={market ? "/marketplace" : "/shop"}
      />
    );
  const gallery =
    vehicle && market
      ? vehicle.images.length
        ? vehicle.images
        : ["/images/vehicle-placeholder.svg"]
      : [product!.image];
  const chat = async () => {
    if (state.role === "visitor") {
      router.push(
        "/auth/sign-in?next=" + encodeURIComponent("/marketplace/" + slug),
      );
      return;
    }
    const existing = state.messages.find(
      (c) => c.listingId === item.id && c.userId === state.userId,
    );
    const id = existing?.id || crypto.randomUUID();
    if (!existing)
      await update((s) => {
        s.messages.push({
          id,
          listingId: item.id,
          userId: s.userId,
          seller: vehicle!.seller,
          messages: [],
        });
      });
    router.push("/account/messages/" + id);
  };
  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link href="/">Home</Link> /{" "}
        <Link href={market ? "/marketplace" : "/shop"}>
          {market ? "Marketplace" : "Shop"}
        </Link>{" "}
        / {item.title}
      </div>
      <div className="detail-layout">
        <div>
          <button
            className={`gallery-main ${market ? "vehicle-gallery" : ""}`}
            onClick={() => setZoom(true)}
            aria-label="Enlarge product image"
          >
            <img src={gallery[image]} alt={item.title} />
            <ZoomIn size={23} />
          </button>
          <div className="thumbnails">
            {gallery.map((src, i) => (
              <button
                className={image === i ? "active" : ""}
                key={i}
                onClick={() => setImage(i)}
                aria-label={`View photo ${i + 1}`}
              >
                <img src={src} alt={`${item.title} view ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-info">
          <div className="eyebrow">
            {market
              ? "COMMUNITY LISTING"
              : product?.brand + " · " + product?.category}
          </div>
          <h1>{item.title}</h1>
          <div className="actions">
            <Badge>{item.condition}</Badge>
            {!market && (
              <span className="rating">
                ★★★★★ <span>4.9 · 28 reviews</span>
              </span>
            )}
          </div>
          <div className="detail-price">
            {money(item.price)}
            {!market && <del>{money(product!.oldPrice)}</del>}
          </div>
          <p>{item.description}</p>
          {market ? (
            <>
              <p className="muted inline">
                <MapPin size={16} />
                {vehicle!.city} · Listed {vehicle!.date}
              </p>
              <div className="spec-grid">
                {Object.entries({
                  Year: vehicle!.year,
                  Mileage: vehicle!.mileage.toLocaleString() + " km",
                  Transmission: vehicle!.transmission,
                  Fuel: vehicle!.fuel,
                  Engine: vehicle!.engine,
                  Registration: vehicle!.registration,
                }).map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
              <div className="seller-box">
                <div className="avatar">{vehicle!.seller.slice(0, 1)}</div>
                <div>
                  <Link href={"/seller/" + vehicle!.sellerId}>
                    <b>
                      {vehicle!.seller} <ArrowUpRight size={14} />
                    </b>
                  </Link>
                  <small className="block muted">
                    Community member · since 2024
                  </small>
                </div>
                <ShieldCheck size={22} />
              </div>
              <div className="actions">
                <Button disabled={!vehicle!.allowChat} onClick={chat}>
                  <MessageCircle size={17} />{" "}
                  {vehicle!.allowChat ? "Chat with seller" : "Chat disabled"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPhone(true);
                    if (!vehicle!.showPhone)
                      toast.info("This seller prefers chat.");
                  }}
                >
                  <Phone size={16} />
                  {phone
                    ? vehicle!.showPhone
                      ? vehicle!.phone
                      : "Use chat instead"
                    : "Show number"}
                </Button>
              </div>
              <p className="small muted">
                Community vehicles are sold directly by their owners. Arrange an
                inspection before making a decision.
              </p>
            </>
          ) : (
            <>
              <p className={product!.stock ? "stock" : "error-text"}>
                {product!.stock
                  ? `● In stock · ${product!.stock} available`
                  : "Out of stock"}{" "}
                <span className="muted"> / SKU {product!.sku}</span>
              </p>
              <div className="actions">
                <div className="quantity">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{qty}</span>
                  <button
                    aria-label="Increase quantity"
                    disabled={qty >= product!.stock}
                    onClick={() => setQty(qty + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button
                  disabled={!product!.stock}
                  onClick={() => addCart(item.id, qty)}
                >
                  Add to bag <ArrowRight size={18} />
                </Button>
              </div>
              <div className="delivery-note">
                <Truck size={20} />
                <span>
                  <b>Ready for your next journey</b>
                  <small>
                    {state.settings.deliveryTime} · {state.settings.zones}
                  </small>
                </span>
              </div>
              <div className="delivery-note">
                <ShieldCheck size={20} />
                <span>
                  <b>Manual bank transfer</b>
                  <small>
                    Payment instructions after checkout. No online gateway.
                  </small>
                </span>
              </div>
            </>
          )}
          <div className="detail-actions">
            <button onClick={() => favorite(item.id)}>
              <Heart
                size={17}
                fill={
                  state.favorites.includes(item.id) ? "currentColor" : "none"
                }
              />{" "}
              Save
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(location.href);
                  toast.success("Listing link copied");
                } catch {
                  toast.error("Copy the URL from your address bar.");
                }
              }}
            >
              <Share2 size={17} /> Share
            </button>
            {market && (
              <button onClick={() => setReport(true)}>
                <Flag size={17} /> Report listing
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="detail-tabs">
        <div className="tabs">
          {(market
            ? ["Description", "Specifications", "Condition notes"]
            : [
                "Description",
                "Specifications",
                "Compatibility",
                "Delivery & returns",
                "Reviews",
              ]
          ).map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="panel">
          {tab === "Description" ? (
            <p>
              {item.description}{" "}
              {market
                ? "Contact the seller to discuss an independent inspection and confirm all vehicle information."
                : "Our team can help confirm the part number against your vehicle. Keep the packaging and receipt until installation is complete."}
            </p>
          ) : tab === "Specifications" ? (
            <div className="spec-grid">
              {Object.entries(
                market
                  ? {
                      Make: vehicle!.make,
                      Model: vehicle!.model,
                      Colour: vehicle!.color,
                      "Body type": vehicle!.body,
                    }
                  : product!.specs,
              ).map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
          ) : tab === "Compatibility" ? (
            <p>
              {product!.compatibility}. Confirm the OEM part number and
              specification before installation.
            </p>
          ) : tab === "Condition notes" ? (
            <p>{vehicle!.damage}</p>
          ) : tab === "Reviews" ? (
            <>
              <span className="rating">★★★★★</span>
              <p>
                “Arrived well packed. Exactly as described and a great fit for
                my car.”
              </p>
              <b>Fahad M. · Verified demo purchase</b>
            </>
          ) : (
            <p>
              Delivery usually takes {state.settings.deliveryTime}. Eligible
              uninstalled parts can be returned within 7 days.{" "}
              <Link href="/returns-refunds">Read the return policy →</Link>
            </p>
          )}
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <h2>
            {market
              ? "More cars to make your own."
              : "A good fit for your garage."}
          </h2>
        </div>
        <div className={market ? "vehicle-grid" : "product-grid"}>
          {market
            ? state.vehicles
                .filter((v) => v.id !== item.id && v.status === "Live")
                .slice(0, 3)
                .map((v) => <VehicleCard key={v.id} vehicle={v} />)
            : state.products
                .filter((p) => p.id !== item.id)
                .slice(0, 4)
                .map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      <Modal open={zoom} onClose={() => setZoom(false)} title={item.title}>
        <img className="zoom-image" src={gallery[image]} alt={item.title} />
        <div className="actions">
          {gallery.map((_, i) => (
            <Button variant="outline" key={i} onClick={() => setImage(i)}>
              Photo {i + 1}
            </Button>
          ))}
        </div>
      </Modal>
      <Modal
        open={report}
        onClose={() => setReport(false)}
        title="Report this listing"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            const ok = await update((s) => {
              s.reports.unshift({
                id: crypto.randomUUID(),
                listingId: item.id,
                title: item.title,
                reason: String(d.get("reason")),
                notes: String(d.get("notes")),
                status: "Open",
              });
              recordActivity(s, `Report submitted for ${item.title}`);
            }, "Report submitted for review");
            if (ok) setReport(false);
          }}
        >
          <label>
            Reason
            <select name="reason">
              <option>Incorrect information</option>
              <option>Suspicious listing</option>
              <option>Duplicate listing</option>
              <option>Inappropriate content</option>
            </select>
          </label>
          <label>
            Additional details
            <textarea
              name="notes"
              required
              minLength={5}
              placeholder="Tell our moderation team what to review"
            />
          </label>
          <Button type="submit">Submit report</Button>
        </form>
      </Modal>
    </div>
  );
}
export function Cart() {
  const { state } = useDemo();
  const subtotal = state.cart.reduce(
    (sum, r) =>
      sum +
      (state.products.find((p) => p.id === r.id)?.price || 0) * r.quantity,
    0,
  );
  return (
    <div className="container page">
      <PageTitle
        eyebrow="YOUR NEXT JOURNEY"
        title="A few good things in your bag."
        text="Check your parts and quantities before you head to checkout."
      />
      {state.cart.length ? (
        <div className="checkout-layout">
          <div className="panel">
            <CartLines />
            <Link className="text-link" href="/shop">
              ← Continue exploring
            </Link>
          </div>
          <div className="panel order-summary">
            <h2>Order summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <p className="muted small">
              Delivery calculated at checkout. Free delivery from{" "}
              {money(state.settings.freeThreshold)}.
            </p>
            <div className="summary-total">
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <Button asChild>
              <Link href="/checkout">
                Continue to checkout <ArrowRight size={17} />
              </Link>
            </Button>
            <p className="small muted">Bank transfer · manually verified</p>
          </div>
        </div>
      ) : (
        <Empty title="Your bag is taking a pit stop" />
      )}
    </div>
  );
}
const checkoutSchema = z.object({
  name: z.string().min(3, "Enter your full name"),
  email: z.email("Enter a valid email"),
  phone: z.string().regex(/^[+\d\s-]{10,16}$/, "Enter a valid phone number"),
  address: z.string().min(8, "Enter your complete delivery address"),
  city: z.string().min(2, "Choose your city"),
  note: z.string(),
  delivery: z.string(),
});
type CheckoutValues = z.infer<typeof checkoutSchema>;
export function Checkout() {
  const { state, update, busy } = useDemo();
  const router = useRouter();
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: state.role === "visitor" ? "" : state.profile.name,
      email: state.role === "visitor" ? "" : state.profile.email,
      phone: "",
      address: "",
      city: "Karachi",
      note: "",
      delivery: "standard",
    },
  });
  const subtotal = state.cart.reduce(
    (n, r) =>
      n + (state.products.find((p) => p.id === r.id)?.price || 0) * r.quantity,
    0,
  );
  const pickup = form.watch("delivery") === "pickup";
  const fee =
    pickup || subtotal >= state.settings.freeThreshold
      ? 0
      : state.settings.deliveryFee;
  const submit = async (d: CheckoutValues) => {
    if (!state.cart.length) return;
    const id = "ORD-" + Date.now().toString().slice(-7);
    const ok = await update((s) => {
      const items = checkoutItems(s);
      const currentSubtotal = items.reduce(
        (sum, row) => sum + row.product.price * row.quantity,
        0,
      );
      const currentFee =
        pickup || currentSubtotal >= s.settings.freeThreshold
          ? 0
          : s.settings.deliveryFee;
      for (const row of items)
        s.products.find((p) => p.id === row.product.id)!.stock -= row.quantity;
      s.orders.unshift({
        id,
        userId: s.userId,
        name: d.name,
        email: d.email,
        phone: d.phone,
        address: pickup ? "Showroom pickup" : d.address,
        city: d.city,
        items,
        total: currentSubtotal + currentFee,
        delivery: currentFee,
        payment: "Pending Payment",
        status: "Pending Payment",
        date: new Date().toISOString().slice(0, 10),
        tracking: "",
        courier: "",
        note: d.note,
        history: ["Order placed · awaiting bank transfer"],
      });
      s.cart = [];
      recordActivity(s, `Order ${id} placed — awaiting payment`, s.userId);
    }, "Your demo order is placed");
    if (ok) router.push("/order-success/" + id);
  };
  if (!state.cart.length)
    return (
      <div className="container page">
        <Empty title="Add a little something first" />
      </div>
    );
  return (
    <div className="container page">
      <PageTitle
        eyebrow="ONE LAST PIT STOP"
        title="Let’s get you moving."
        text="Your details. Your delivery. No payment collected here."
      />
      <form onSubmit={form.handleSubmit(submit)} className="checkout-layout">
        <div className="panel">
          <h2>Delivery details</h2>
          {state.role === "visitor" && (
            <p>
              Already part of the community?{" "}
              <Link className="text-link" href="/auth/sign-in?next=/checkout">
                Sign in
              </Link>{" "}
              or{" "}
              <Link className="text-link" href="/auth/sign-up?next=/checkout">
                create an account
              </Link>
              .
            </p>
          )}
          <div className="form-grid">
            {(["name", "email", "phone", "address", "city"] as const).map(
              (name) => (
                <label key={name}>
                  {
                    {
                      name: "Full name",
                      email: "Email address",
                      phone: "Phone number",
                      address: "Street address",
                      city: "City",
                    }[name]
                  }
                  <input
                    {...form.register(name)}
                    type={name === "email" ? "email" : "text"}
                    aria-invalid={!!form.formState.errors[name]}
                  />
                  {form.formState.errors[name] && (
                    <small className="error-text">
                      {form.formState.errors[name]?.message}
                    </small>
                  )}
                </label>
              ),
            )}
          </div>
          <label>
            Order note (optional)
            <textarea
              {...form.register("note")}
              placeholder="Anything we should know about your delivery?"
            />
          </label>
          <h3>Choose your delivery</h3>
          <label className="radio-card">
            <input
              type="radio"
              value="standard"
              {...form.register("delivery")}
            />
            <span>
              <b>Standard delivery</b>
              <small>{state.settings.deliveryTime}</small>
            </span>
            <b>
              {money(
                subtotal >= state.settings.freeThreshold
                  ? 0
                  : state.settings.deliveryFee,
              )}
            </b>
          </label>
          {state.settings.pickup && (
            <label className="radio-card">
              <input
                type="radio"
                value="pickup"
                {...form.register("delivery")}
              />
              <span>
                <b>Collect from our showroom</b>
                <small>We’ll notify you when it’s ready.</small>
              </span>
              <b>Free</b>
            </label>
          )}
        </div>
        <div className="panel order-summary">
          <h2>Your order</h2>
          {state.cart.map((r) => {
            const p = state.products.find((p) => p.id === r.id)!;
            return (
              <div className="summary-row" key={r.id}>
                <span>
                  {p.title} × {r.quantity}
                </span>
                <b>{money(p.price * r.quantity)}</b>
              </div>
            );
          })}
          <div className="summary-row">
            <span>Delivery</span>
            <b>{money(fee)}</b>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <b>{money(subtotal + fee)}</b>
          </div>
          <div className="notice">
            <ShieldCheck size={22} />
            <div>
              <b>Bank transfer / manual payment</b>
              <p>
                {state.settings.instructions} Bank details appear after placing
                your order.
              </p>
            </div>
          </div>
          <label className="checkbox">
            <input required type="checkbox" />I understand this is a frontend
            demo and no real payment is due.
          </label>
          <Button type="submit" disabled={busy}>
            {busy ? "Placing your order…" : "Place demo order"}
            <ArrowRight size={17} />
          </Button>
        </div>
      </form>
    </div>
  );
}
export function PaymentInstructions({ order }: { order: Order }) {
  const { state, update } = useDemo();
  const s = state.settings;
  return (
    <div className="panel payment-panel">
      <div className="eyebrow">YOUR NEXT STEP</div>
      <h2>One transfer. Ready to roll.</h2>
      <p>{s.instructions}</p>
      <div className="notice">Demo bank details — do not send real money.</div>
      {[
        ["Bank", s.bank],
        ["Account title", s.holder],
        ["Account number", s.account],
        ["IBAN", s.iban],
        ["Payment reference", order.id],
        ["Amount due", money(order.total)],
      ].map(([k, v]) => (
        <div className="bank-row" key={k}>
          <span>
            <small>{k}</small>
            <b>{v}</b>
          </span>
          <CopyButton value={v} />
        </div>
      ))}
      <Button asChild>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I have paid for order #${order.id}. I am sending the payment screenshot here. (Frontend demo — no real payment.)`)}`}
        >
          <MessageCircle size={18} /> Send payment proof on WhatsApp{" "}
          <ArrowUpRight size={16} />
        </a>
      </Button>
      <p className="small muted">
        Opens WhatsApp with a message. Nothing is sent automatically.
      </p>
      <Button
        variant="outline"
        onClick={() =>
          update((s) => {
            const o = s.orders.find((o) => o.id === order.id)!;
            o.payment = "Payment Under Review";
            o.status = "Payment Under Review";
            o.history.push("Demo payment proof marked as sent");
            recordActivity(s, `Payment proof ready for ${o.id}`, o.userId);
          }, "Demo proof submitted for admin review")
        }
      >
        Simulate proof sent
      </Button>
    </div>
  );
}
export function OrderView({
  id,
  success = false,
  admin = false,
}: {
  id: string;
  success?: boolean;
  admin?: boolean;
}) {
  const { state, update, busy } = useDemo();
  const order = state.orders.find((o) => o.id === id);
  const [action, setAction] = useState("");
  if (!order)
    return (
      <Empty
        title="Order not found"
        href="/track-order"
        label="Track another order"
      />
    );
  if (!success && !admin && order.userId !== state.userId)
    return (
      <Empty
        title="This order belongs to another account"
        href="/account/orders"
      />
    );
  return (
    <>
      <PageTitle
        eyebrow={
          success ? "THANK YOU FOR CHOOSING ZAHID AUTOS" : `ORDER ${order.id}`
        }
        title={success ? "Your next journey is in motion." : order.id}
        text={
          success
            ? "Your demo order is confirmed. Follow the payment instructions below."
            : `${order.date} · ${order.name}`
        }
      >
        <Badge>{order.status}</Badge>
      </PageTitle>
      <div className="checkout-layout">
        <div>
          <div className="panel">
            <div className="section-heading">
              <h2>{success ? "Order confirmed" : "Order progress"}</h2>
              <CheckCircle2 className="accent" size={28} />
            </div>
            <div className="timeline">
              {order.history.map((h, i) => (
                <div key={i}>
                  <Check size={15} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
            {order.items.map((r, i) => (
              <div className="cart-line" key={i}>
                <img src={r.product.image} alt={r.product.title} />
                <div>
                  <b>{r.product.title}</b>
                  <p>Quantity {r.quantity}</p>
                </div>
                <strong>{money(r.product.price * r.quantity)}</strong>
              </div>
            ))}
            <div className="summary-row">
              <span>Delivery</span>
              <b>{money(order.delivery)}</b>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <b>{money(order.total)}</b>
            </div>
            <div className="spec-grid">
              <div>
                <small>Customer</small>
                <b>{order.name}</b>
                <span>{order.email}</span>
                <span>{order.phone}</span>
              </div>
              <div>
                <small>Delivery address</small>
                <b>{order.address}</b>
                <span>{order.city}</span>
              </div>
              <div>
                <small>Payment status</small>
                <Badge>{order.payment}</Badge>
              </div>
              {order.tracking && (
                <div>
                  <small>Tracking</small>
                  <b>
                    {order.courier} · {order.tracking}
                  </b>
                </div>
              )}
            </div>
            {order.note && <p className="notice">{order.note}</p>}
            <div className="actions">
              <Button variant="outline" asChild>
                <Link href="/account/orders">
                  My orders <ArrowRight size={16} />
                </Link>
              </Button>
              <Link href="/contact" className="text-link">
                Need a hand?
              </Link>
            </div>
          </div>
          {admin && (
            <div className="panel">
              <h2>Manage this order</h2>
              <div className="actions wrap">
                {[
                  "Mark Payment Verified",
                  "Mark Not Verified",
                  "Needs Attention",
                  "Preparing",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                  "Cancelled",
                ].map((a) => (
                  <Button
                    key={a}
                    variant="outline"
                    onClick={() => setAction(a)}
                  >
                    {a}
                  </Button>
                ))}
              </div>
              <form
                className="form-grid"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const d = new FormData(e.currentTarget);
                  await update((s) => {
                    const o = s.orders.find((o) => o.id === id)!;
                    o.courier = String(d.get("courier"));
                    o.tracking = String(d.get("tracking"));
                    o.note = String(d.get("note"));
                    recordActivity(
                      s,
                      `Tracking / notes updated for ${id}`,
                      o.userId,
                    );
                  }, "Order details updated");
                }}
              >
                <label>
                  Courier
                  <input name="courier" defaultValue={order.courier} />
                </label>
                <label>
                  Tracking number
                  <input name="tracking" defaultValue={order.tracking} />
                </label>
                <label>
                  Internal / delivery note
                  <textarea name="note" defaultValue={order.note} />
                </label>
                <Button>Save tracking & notes</Button>
              </form>
            </div>
          )}
        </div>
        {order.payment !== "Verified" && order.status !== "Cancelled" ? (
          <PaymentInstructions order={order} />
        ) : (
          <div className="panel">
            <ShieldCheck size={40} className="accent" />
            <h2>
              {order.status === "Cancelled"
                ? "Order cancelled"
                : "Payment verified"}
            </h2>
            <p>
              {order.status === "Cancelled"
                ? "This order will not be fulfilled."
                : "You’re all set. Follow your order’s progress right here."}
            </p>
            <Badge>{order.status}</Badge>
          </div>
        )}
      </div>
      <Modal open={!!action} onClose={() => setAction("")} title={action}>
        <p>
          Apply this status to {id}? The customer will see an update in their
          notifications.
        </p>
        <Button
          disabled={busy}
          onClick={async () => {
            const ok = await update((s) => {
              const o = s.orders.find((o) => o.id === id)!;
              changeOrderStatus(o, action);
              recordActivity(s, `${id}: ${action}`, o.userId);
            }, "Order updated");
            if (ok) setAction("");
          }}
        >
          Confirm update
        </Button>
      </Modal>
    </>
  );
}
export function TrackOrder() {
  const { state } = useDemo();
  const [found, setFound] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="container page">
      <PageTitle
        eyebrow="FROM OUR GARAGE TO YOURS"
        title="Follow your order."
        text="Use your order reference and checkout email to see the latest update."
      />
      <form
        className="panel narrow"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const o = state.orders.find(
            (o) =>
              o.id.toLowerCase() === String(d.get("id")).trim().toLowerCase() &&
              o.email.toLowerCase() ===
                String(d.get("email")).trim().toLowerCase(),
          );
          setFound(o?.id || "");
          setError(
            o
              ? ""
              : "We couldn’t match that order and email. Try ORD-1048 and wali@example.com.",
          );
        }}
      >
        <label>
          Order reference
          <input required name="id" placeholder="ORD-1048" />
        </label>
        <label>
          Email address
          <input
            required
            name="email"
            type="email"
            placeholder="wali@example.com"
          />
        </label>
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <Button>
          Track order <ArrowRight size={16} />
        </Button>
        <p className="small muted">Demo example: ORD-1048 · wali@example.com</p>
      </form>
      {found && <OrderView id={found} success />}
    </div>
  );
}
