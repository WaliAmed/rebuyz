"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Check,
  Camera,
  X,
  ChevronLeft,
  MessageCircle,
  Send,
  Car,
  ShoppingBag,
  Heart,
  Bell,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo, recordActivity } from "@/lib/store";
import { images, Vehicle } from "@/lib/data";
import { money, slugify } from "@/lib/site-config";
import { Button } from "./ui/button";
import { Badge, Confirm, Empty, Modal, PageTitle } from "./ui/shared";
import { Logo, ProductCard, VehicleCard } from "./site";
import { OrderView } from "./commerce";
export function Auth({ mode }: { mode: string }) {
  const { state, update, busy } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const titles: Record<string, string> = {
    "sign-in": "Welcome back.",
    "sign-up": "Your next journey starts here.",
    "forgot-password": "Let’s get you back in.",
    "reset-password": "A fresh start.",
    "verify-email": "Check your inbox.",
  };
  const next = params.get("next") || "/account";
  const destination =
    next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  const signIn = async (name?: string, email?: string) => {
    const ok = await update((s) => {
      s.role = "customer";
      if (name) s.profile.name = name;
      if (email) s.profile.email = email;
    }, "Welcome to Zahid Autos");
    if (ok) router.push(destination);
  };
  return (
    <div className="auth-page">
      <div
        className="auth-brand"
        style={{
          backgroundImage: `linear-gradient(180deg,#18161866,#181618f2),url(${images.hero})`,
        }}
      >
        <Logo />
        <div>
          <div className="eyebrow">GOOD PARTS. GREAT JOURNEYS.</div>
          <h1>
            Everything for
            <br />
            the road ahead.
          </h1>
          <p>
            Find the right part. Meet your next car.
            <br />
            Make yourself at home.
          </p>
          <div className="auth-trust">
            <ShieldCheck /> A community built on trust.
          </div>
        </div>
        <span>© 2026 Zahid Autos · Demo experience</span>
      </div>
      <div className="auth-content">
        <Link href="/" className="text-link">
          <ChevronLeft size={16} /> Back to the road
        </Link>
        <div className="auth-form">
          <div className="eyebrow">YOUR ZAHID AUTOS ACCOUNT</div>
          <h1>{titles[mode] || titles["sign-in"]}</h1>
          <p>
            {mode === "verify-email"
              ? "We’ve prepared a demo verification message. No email is sent."
              : "Good to have you here. Let’s keep you moving."}
          </p>
          <div className="notice small">
            Frontend demo only. Use any valid email and a password of 8+
            characters. No credentials are stored.
          </div>
          {done ? (
            <div className="success-box">
              <Check size={30} />
              <h2>
                {mode === "forgot-password"
                  ? "Recovery link is ready."
                  : "You’re all set."}
              </h2>
              <p>This is a simulated email flow.</p>
              <Button asChild>
                <Link
                  href={
                    mode === "forgot-password"
                      ? "/auth/reset-password"
                      : "/auth/sign-in"
                  }
                >
                  {mode === "forgot-password"
                    ? "Open demo reset link"
                    : "Continue to sign in"}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          ) : mode === "verify-email" ? (
            <>
              <Button disabled={busy} onClick={() => signIn()}>
                Verify demo email <Check size={16} />
              </Button>
              <button
                className="text-button"
                onClick={() =>
                  toast.success("A new demo verification link is ready.")
                }
              >
                Resend verification link
              </button>
            </>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const d = new FormData(e.currentTarget);
                if (d.get("password") && String(d.get("password")).length < 8) {
                  setError("Use at least 8 characters for your demo password.");
                  return;
                }
                if (
                  mode === "reset-password" &&
                  d.get("password") !== d.get("confirm")
                ) {
                  setError("Passwords don’t match.");
                  return;
                }
                if (mode === "forgot-password" || mode === "reset-password") {
                  const ok = await update(
                    () => {},
                    mode === "reset-password"
                      ? "Demo password reset complete"
                      : "Demo recovery link prepared",
                  );
                  if (ok) setDone(true);
                } else if (mode === "sign-up") {
                  const ok = await update((s) => {
                    s.profile.name = String(d.get("name"));
                    s.profile.email = String(d.get("email"));
                  }, "Demo account created");
                  if (ok)
                    router.push(
                      "/auth/verify-email?next=" +
                        encodeURIComponent(destination),
                    );
                } else await signIn(undefined, String(d.get("email")));
              }}
            >
              {mode === "sign-up" && (
                <label>
                  Full name
                  <input
                    name="name"
                    required
                    minLength={3}
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                </label>
              )}
              {mode !== "reset-password" && (
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>
              )}
              {mode !== "forgot-password" && (
                <label>
                  Password
                  <div className="password-input">
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      minLength={8}
                      required
                      autoComplete={
                        mode === "sign-in" ? "current-password" : "new-password"
                      }
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              )}
              {mode === "reset-password" && (
                <label>
                  Confirm password
                  <input
                    name="confirm"
                    type="password"
                    required
                    minLength={8}
                  />
                </label>
              )}
              {mode === "sign-in" && (
                <div className="section-heading small">
                  <label className="checkbox">
                    <input type="checkbox" defaultChecked /> Remember me
                  </label>
                  <Link href="/auth/forgot-password">Forgot password?</Link>
                </div>
              )}
              {mode === "sign-up" && (
                <label className="checkbox small">
                  <input type="checkbox" required />I accept the demo{" "}
                  <Link href="/terms">terms</Link> and{" "}
                  <Link href="/privacy">privacy policy</Link>.
                </label>
              )}
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
              <Button disabled={busy} type="submit">
                {busy
                  ? "Just a moment…"
                  : mode === "sign-up"
                    ? "Create account"
                    : mode === "forgot-password"
                      ? "Send recovery link"
                      : mode === "reset-password"
                        ? "Reset password"
                        : "Sign in"}
                <ArrowRight size={16} />
              </Button>
            </form>
          )}
          {["sign-in", "sign-up"].includes(mode) && (
            <>
              <div className="divider">or continue with</div>
              <div className="sso-grid">
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => signIn("wali Ahmed", "wali@example.com")}
                >
                  <b className="google-g">G</b> Google
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => signIn("wali Ahmed", "wali@example.com")}
                >
                  ● Apple
                </Button>
              </div>
              <p className="small center">
                {mode === "sign-in" ? "New around here?" : "Already a member?"}{" "}
                <Link
                  className="text-link"
                  href={mode === "sign-in" ? "/auth/sign-up" : "/auth/sign-in"}
                >
                  {mode === "sign-in" ? "Join the community" : "Sign in"}
                </Link>
              </p>
            </>
          )}
        </div>
        <p className="small muted center">
          Your demo data stays in this browser.
        </p>
      </div>
    </div>
  );
}
const steps = [
  "Vehicle",
  "Condition",
  "Photos",
  "Price & location",
  "Contact",
  "Preview",
];
export function SellWizard({ editId }: { editId?: string }) {
  const { state, update, busy } = useDemo();
  const router = useRouter();
  const existing = state.vehicles.find((v) => v.id === editId);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState<Vehicle>(
    existing || {
      id: "",
      slug: "",
      title: "",
      sellerId: state.userId,
      seller: state.profile.name,
      price: 0,
      make: "Toyota",
      model: "",
      year: 2020,
      mileage: 0,
      city: "Karachi",
      transmission: "Automatic",
      fuel: "Petrol",
      body: "Sedan",
      condition: "Used",
      engine: "",
      color: "",
      registration: "Registered",
      description: "",
      damage: "",
      images: [],
      phone: state.profile.phone,
      showPhone: true,
      allowChat: true,
      status: "Draft",
      featured: false,
      note: "",
      date: "2026-10-02",
    },
  );
  const set = (
    key: keyof Vehicle,
    value: string | number | boolean | string[],
  ) => setDraft((d) => ({ ...d, [key]: value }));
  if (state.role === "visitor")
    return (
      <div className="container page">
        <Empty
          title="Your car’s next chapter starts with you."
          text="Sign in to save your listing and connect with interested buyers."
          href="/auth/sign-in?next=/sell"
          label="Sign in to sell"
        />
      </div>
    );
  if (existing && existing.sellerId !== state.userId && state.role !== "admin")
    return (
      <Empty
        title="You can only edit your own listings"
        href="/account/listings"
      />
    );
  const field = (
    key: keyof Vehicle,
    label: string,
    type = "text",
    options?: string[],
  ) => (
    <label key={key}>
      {label}
      {options ? (
        <select
          value={String(draft[key])}
          onChange={(e) => set(key, e.target.value)}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          required={key === "description"}
          minLength={key === "description" ? 20 : undefined}
          value={String(draft[key])}
          onChange={(e) => set(key, e.target.value)}
        />
      ) : (
        <input
          required={!["damage"].includes(key)}
          type={type}
          pattern={key === "phone" ? "[+0-9 \\-]{10,16}" : undefined}
          min={key === "year" ? 1990 : key === "price" ? 1 : 0}
          max={key === "year" ? 2026 : undefined}
          value={String(draft[key] || "")}
          onChange={(e) =>
            set(
              key,
              type === "number" ? Number(e.target.value) : e.target.value,
            )
          }
        />
      )}
    </label>
  );
  const save = async (status: string) => {
    const id = draft.id || "v-" + crypto.randomUUID();
    const ok = await update(
      (s) => {
        const v = {
          ...draft,
          id,
          slug: slugify(draft.title) + "-" + id.slice(-4),
          status,
          sellerId: s.userId,
          seller: s.profile.name,
        };
        const i = s.vehicles.findIndex((v) => v.id === id);
        if (i >= 0) s.vehicles[i] = v;
        else s.vehicles.unshift(v);
        recordActivity(s, `${draft.title}: ${status}`, s.userId);
      },
      status === "Draft" ? "Draft saved" : "Listing submitted for review",
    );
    if (ok) router.push("/account/listings");
  };
  return (
    <div className="container page wizard-page">
      <PageTitle
        eyebrow="A NEW ROAD FOR YOUR CAR"
        title={
          editId
            ? "Make your listing shine."
            : "Great cars deserve a second chapter."
        }
        text="A few details. A few photos. A whole community of possibilities."
      />
      <div className="wizard-steps">
        {steps.map((s, i) => (
          <div
            className={i === step ? "active" : i < step ? "complete" : ""}
            key={s}
          >
            <span>{i < step ? <Check size={16} /> : i + 1}</span>
            <small>{s}</small>
          </div>
        ))}
      </div>
      <form
        className="panel wizard"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 2 && !draft.images.length) {
            toast.error("Add a photo or use the demo gallery.");
            return;
          }
          if (step === 4 && !draft.allowChat && !draft.showPhone) {
            toast.error("Enable at least one contact method.");
            return;
          }
          if (step === 5) save("Pending Review");
          else setStep(step + 1);
        }}
      >
        <div className="eyebrow">STEP 0{step + 1} / 06</div>
        <h2>
          {
            [
              "Let’s meet your car.",
              "Tell its story honestly.",
              "A great first impression.",
              "Find the right starting point.",
              "Stay connected, your way.",
              "Looking good. Ready to go?",
            ][step]
          }
        </h2>
        {step === 0 && (
          <div className="form-grid">
            {field("title", "Listing title")}
            {field("make", "Make", "text", [
              "Toyota",
              "Honda",
              "Suzuki",
              "Kia",
              "Daihatsu",
              "Nissan",
            ])}
            {field("model", "Model / variant")}
            {field("year", "Year", "number")}
            {field("body", "Body type", "text", [
              "Sedan",
              "Hatchback",
              "SUV",
              "Wagon",
            ])}
            {field("fuel", "Fuel", "text", [
              "Petrol",
              "Hybrid",
              "Diesel",
              "Electric",
            ])}
            {field("transmission", "Transmission", "text", [
              "Automatic",
              "Manual",
            ])}
            {field("engine", "Engine capacity")}
            {field("mileage", "Mileage (km)", "number")}
            {field("color", "Colour")}
          </div>
        )}
        {step === 1 && (
          <>
            {field("condition", "Overall condition", "text", [
              "Used",
              "Like new",
              "Damaged",
            ])}
            {field("registration", "Registration status", "text", [
              "Registered",
              "Unregistered",
              "Imported — documents available",
            ])}
            {field("damage", "Accident / repair notes", "textarea")}
            {field("description", "Vehicle description", "textarea")}
            <p className="small muted">
              Include service history, ownership details and anything an
              interested buyer should know.
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <label className="upload-zone">
              <Camera size={35} />
              <b>
                {uploading ? "Preparing your photos…" : "Add your best angles"}
              </b>
              <span>Up to 8 images · JPEG, PNG or WebP · 2 MB each</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={uploading}
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (
                    files.length + draft.images.length > 8 ||
                    files.some((f) => f.size > 2 * 1024 * 1024)
                  ) {
                    toast.error("Use up to 8 images, under 2 MB each.");
                    return;
                  }
                  setUploading(true);
                  const urls = await Promise.all(
                    files.map(
                      (f) =>
                        new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => resolve(String(reader.result));
                          reader.onerror = reject;
                          reader.readAsDataURL(f);
                        }),
                    ),
                  ).catch(() => []);
                  setDraft((d) => ({ ...d, images: [...d.images, ...urls] }));
                  setUploading(false);
                }}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                set("images", [images.car, images.interior, images.road])
              }
            >
              Use demo photo gallery
            </Button>
            <div className="photo-grid">
              {draft.images.map((src, i) => (
                <div key={i}>
                  <img src={src} alt={`Vehicle photo ${i + 1}`} />
                  <button
                    type="button"
                    aria-label={`Remove photo ${i + 1}`}
                    onClick={() =>
                      set(
                        "images",
                        draft.images.filter((_, j) => j !== i),
                      )
                    }
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    className="cover-button"
                    onClick={() =>
                      set("images", [
                        src,
                        ...draft.images.filter((_, j) => j !== i),
                      ])
                    }
                  >
                    {i === 0 ? "✓ Cover photo" : "Set as cover"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <div className="form-grid">
            {field("price", "Asking price (PKR)", "number")}
            {field("city", "City", "text", [
              "Karachi",
              "Lahore",
              "Islamabad",
              "Rawalpindi",
              "Faisalabad",
            ])}
          </div>
        )}
        {step === 4 && (
          <>
            {field("phone", "Contact phone")}
            <label className="radio-card">
              <input
                type="checkbox"
                checked={draft.allowChat}
                onChange={(e) => set("allowChat", e.target.checked)}
              />
              <span>
                <b>Allow in-app chat</b>
                <small>Keep your conversations in your account.</small>
              </span>
            </label>
            <label className="radio-card">
              <input
                type="checkbox"
                checked={draft.showPhone}
                onChange={(e) => set("showPhone", e.target.checked)}
              />
              <span>
                <b>Show my phone number</b>
                <small>Buyers reveal it by clicking Show number.</small>
              </span>
            </label>
          </>
        )}
        {step === 5 && (
          <>
            <img
              className="preview-car"
              src={draft.images[0]}
              alt={draft.title}
            />
            <div className="section-heading">
              <h2>{draft.title}</h2>
              <h3>{money(draft.price)}</h3>
            </div>
            <p>
              {draft.year} · {draft.mileage.toLocaleString()} km ·{" "}
              {draft.transmission} · {draft.city}
            </p>
            <p>{draft.description}</p>
            <div className="spec-grid">
              {[
                ["Make / model", draft.make + " " + draft.model],
                ["Condition", draft.condition],
                ["Engine / fuel", draft.engine + " · " + draft.fuel],
                ["Colour / body", draft.color + " · " + draft.body],
                ["Registration", draft.registration],
                ["Repair notes", draft.damage || "None declared"],
                [
                  "Contact",
                  `${draft.allowChat ? "Chat enabled" : ""} ${draft.showPhone ? "· " + draft.phone : "· Phone hidden"}`,
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <div className="notice">
              <ShieldCheck size={20} /> Your listing will appear after admin
              review.
            </div>
          </>
        )}
        <div className="wizard-footer">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft size={16} /> Back
          </Button>
          <button
            type="button"
            className="text-button"
            disabled={!draft.title || busy}
            onClick={() => save("Draft")}
          >
            Save draft
          </button>
          <Button type="submit" disabled={busy || uploading}>
            {busy ? "Saving…" : step === 5 ? "Submit listing" : "Continue"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
export function OrdersTable({
  admin = false,
  payments = false,
}: {
  admin?: boolean;
  payments?: boolean;
}) {
  const { state, scenario } = useDemo();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");
  const rows =
    scenario === "empty"
      ? []
      : state.orders.filter(
          (o) =>
            (admin || o.userId === state.userId) &&
            (!payments || o.payment !== "Verified") &&
            (o.id + " " + o.name)
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (status === "All" || o.status === status || o.payment === status) &&
            (!date || o.date >= date),
        );
  return (
    <div className="panel">
      <div className="table-toolbar">
        <input
          aria-label="Search orders"
          placeholder="Search orders or customers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Order status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            "All",
            "Pending Payment",
            "Payment Under Review",
            "Verified",
            "Preparing",
            "Shipped",
            "Delivered",
            "Needs Attention",
            "Cancelled",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <label className="inline">
          From{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>
      {rows.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Date",
                  "Total",
                  "Payment",
                  "Delivery",
                  "",
                ].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link
                      href={`/${admin ? "admin" : "account"}/orders/${o.id}`}
                    >
                      <b>{o.id}</b>
                    </Link>
                  </td>
                  <td>{o.name}</td>
                  <td>{o.date}</td>
                  <td>{money(o.total)}</td>
                  <td>
                    <Badge>{o.payment}</Badge>
                  </td>
                  <td>
                    <Badge>{o.status}</Badge>
                  </td>
                  <td>
                    <Link
                      className="table-action"
                      href={`/${admin ? "admin" : "account"}/orders/${o.id}`}
                    >
                      Review <ArrowUpRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="No orders to show" />
      )}
    </div>
  );
}
export function AccountPage({ path }: { path: string[] }) {
  const { state, update, scenario } = useDemo();
  const [filter, setFilter] = useState("All");
  const section = path[1] || "";
  if (section === "orders" && path[2]) return <OrderView id={path[2]} />;
  if (section === "orders")
    return (
      <>
        <PageTitle
          eyebrow="YOUR PURCHASES"
          title="My orders"
          text="Every part of the journey, all in one place."
        />
        <OrdersTable />
      </>
    );
  if (section === "listings" && path[2] === "new") return <SellWizard />;
  if (section === "listings" && path[3] === "edit")
    return <SellWizard editId={path[2]} />;
  if (section === "messages") return <Messages id={path[2]} />;
  if (
    section === "profile" ||
    section === "security" ||
    section === "addresses"
  )
    return <AccountSettings section={section} />;
  if (section === "favorites")
    return (
      <>
        <PageTitle
          eyebrow="THE GOOD STUFF"
          title="Saved for later"
          text="A garage full of possibilities."
        />
        <div className="product-grid">
          {state.products
            .filter((p) => state.favorites.includes(p.id))
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
        <div className="vehicle-grid">
          {state.vehicles
            .filter((v) => state.favorites.includes(v.id))
            .map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
        </div>
        {!state.favorites.length && (
          <Empty
            title="Your favorites live here"
            text="Tap the heart on a part or car to save it."
          />
        )}
      </>
    );
  if (section === "notifications")
    return (
      <>
        <PageTitle
          title="Your updates"
          text="The latest from your orders, listings and community."
        />
        <div className="section-heading">
          <div className="tabs">
            {["All", "Unread"].map((t) => (
              <button
                className={filter === t ? "active" : ""}
                onClick={() => setFilter(t)}
                key={t}
              >
                {t}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() =>
              update((s) => {
                s.notifications
                  .filter((n) => n.userId === s.userId)
                  .forEach((n) => (n.read = true));
              }, "All updates marked read")
            }
          >
            Mark all read
          </Button>
        </div>
        <div className="panel">
          {state.notifications
            .filter(
              (n) => n.userId === state.userId && (filter === "All" || !n.read),
            )
            .map((n) => (
              <button
                className={`notification-row ${n.read ? "" : "unread"}`}
                key={n.id}
                onClick={() =>
                  update((s) => {
                    s.notifications.find((x) => x.id === n.id)!.read = true;
                  })
                }
              >
                <Bell size={20} />
                <span>
                  {n.title}
                  <small className="block muted">
                    {n.read ? "Read" : "New update · click to mark read"}
                  </small>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
        </div>
      </>
    );
  if (section === "listings") {
    const rows =
      scenario === "empty"
        ? []
        : state.vehicles.filter(
            (v) =>
              v.sellerId === state.userId &&
              (filter === "All" || v.status === filter),
          );
    return (
      <>
        <PageTitle
          title="My garage"
          text="Manage your listings and their next chapter."
        >
          <Button asChild>
            <Link href="/sell">
              <Plus size={17} /> List a car
            </Link>
          </Button>
        </PageTitle>
        <div className="tabs">
          {[
            "All",
            "Draft",
            "Pending Review",
            "Live",
            "Changes Required",
            "Paused",
            "Sold",
          ].map((t) => (
            <button
              key={t}
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {rows.length ? (
          rows.map((v) => (
            <div className="panel listing-row" key={v.id}>
              <img src={v.images[0] || images.car} alt={v.title} />
              <div>
                <Badge>{v.status}</Badge>
                <h3>{v.title}</h3>
                <p>
                  {money(v.price)} · {v.city}
                </p>
                {v.note && <p className="notice">{v.note}</p>}
                <div className="actions wrap">
                  <Button asChild variant="outline">
                    <Link href={`/account/listings/${v.id}/edit`}>Edit</Link>
                  </Button>
                  <Link className="text-link" href={"/marketplace/" + v.slug}>
                    Preview
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() =>
                      update((s) => {
                        s.vehicles.find((x) => x.id === v.id)!.status =
                          v.status === "Live"
                            ? "Paused"
                            : v.status === "Paused"
                              ? "Live"
                              : "Pending Review";
                      }, "Listing updated")
                    }
                  >
                    {v.status === "Live"
                      ? "Pause"
                      : v.status === "Paused"
                        ? "Resume"
                        : "Resubmit"}
                  </Button>
                  <Confirm
                    label="Mark sold"
                    title="Mark this car as sold?"
                    onConfirm={() =>
                      update((s) => {
                        s.vehicles.find((x) => x.id === v.id)!.status = "Sold";
                      }, "Congratulations on your sale")
                    }
                  />
                  <Confirm
                    danger
                    label="Delete"
                    title="Remove this demo listing?"
                    onConfirm={() =>
                      update((s) => {
                        s.vehicles = s.vehicles.filter((x) => x.id !== v.id);
                      }, "Listing removed")
                    }
                  />
                  <Link href="/account/messages" className="text-link">
                    Messages
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty
            title="A fresh start for your garage"
            href="/sell"
            label="List your first car"
          />
        )}
      </>
    );
  }
  const orders = state.orders.filter((o) => o.userId === state.userId);
  const listings = state.vehicles.filter((v) => v.sellerId === state.userId);
  return (
    <>
      <PageTitle
        eyebrow="YOUR PERSONAL GARAGE"
        title={`Good to see you, ${state.profile.name.split(" ")[0]}.`}
        text="Here’s what’s happening on your side of the road."
      >
        <Button asChild>
          <Link href="/sell">
            Sell your car <ArrowUpRight size={16} />
          </Link>
        </Button>
      </PageTitle>
      <div className="stats-grid">
        {[
          [ShoppingBag, "Orders", orders.length, "/account/orders"],
          [
            Car,
            "Active listings",
            listings.filter((v) => v.status === "Live").length,
            "/account/listings",
          ],
          [
            MessageCircle,
            "Conversations",
            state.messages.filter(
              (c) =>
                c.userId === state.userId ||
                state.vehicles.some(
                  (v) => v.id === c.listingId && v.sellerId === state.userId,
                ),
            ).length,
            "/account/messages",
          ],
          [Heart, "Saved items", state.favorites.length, "/account/favorites"],
        ].map(([Icon, label, value, href]) => {
          const I = Icon as typeof Car;
          return (
            <Link className="stat-card" href={String(href)} key={String(label)}>
              <I size={22} />
              <span>{String(label)}</span>
              <strong>{String(value)}</strong>
              <small>
                View details <ArrowUpRight size={13} />
              </small>
            </Link>
          );
        })}
      </div>
      <div className="notice">
        <Bell size={20} />
        <div>
          <b>
            {orders.filter((o) => o.payment === "Pending Payment").length} order
            awaiting payment
          </b>
          <p>Complete the demo bank-transfer flow to get your order moving.</p>
        </div>
        <Link href="/account/orders">View orders →</Link>
      </div>
      <div className="section-heading">
        <h2>Recent orders</h2>
        <Link href="/track-order" className="text-link">
          Track an order <ArrowRight size={16} />
        </Link>
      </div>
      <OrdersTable />
      <div className="panel">
        <h2>Recent updates</h2>
        {state.notifications
          .filter((n) => n.userId === state.userId)
          .slice(0, 4)
          .map((n) => (
            <p key={n.id} className="notification-row">
              <Bell size={17} />
              {n.title}
            </p>
          ))}
      </div>
    </>
  );
}
function Messages({ id }: { id?: string }) {
  const { state, update } = useDemo();
  const [text, setText] = useState("");
  const [report, setReport] = useState(false);
  const conversations = state.messages.filter(
    (c) =>
      c.userId === state.userId ||
      state.vehicles.find((v) => v.id === c.listingId)?.sellerId ===
        state.userId,
  );
  const selected = conversations.find((c) => c.id === id) || conversations[0];
  const listing = state.vehicles.find((v) => v.id === selected?.listingId);
  return (
    <>
      <PageTitle
        title="A good conversation starts here."
        text="Your community messages, in one place."
      />
      {!selected ? (
        <Empty
          title="No conversations yet"
          href="/marketplace"
          label="Meet your next car"
        />
      ) : (
        <div className="chat-layout">
          <aside>
            {conversations.map((c) => (
              <Link
                className={c.id === selected.id ? "active" : ""}
                href={"/account/messages/" + c.id}
                key={c.id}
              >
                <div className="avatar">{c.seller.slice(0, 1)}</div>
                <span>
                  <b>
                    {c.userId === state.userId
                      ? c.seller
                      : state.records.customers.find((u) => u.id === c.userId)
                          ?.title || "Interested buyer"}
                  </b>
                  <small>
                    {state.vehicles.find((v) => v.id === c.listingId)?.title}
                  </small>
                </span>
              </Link>
            ))}
          </aside>
          <div className="chat-main">
            <div className="chat-header">
              <img
                src={listing?.images[0] || images.car}
                alt={listing?.title || "Vehicle"}
              />
              <span>
                <b>{listing?.title}</b>
                <small>
                  {selected.userId === state.userId
                    ? selected.seller
                    : "Interested buyer"}{" "}
                  · Demo conversation
                </small>
              </span>
              <button className="text-button" onClick={() => setReport(true)}>
                Report
              </button>
            </div>
            <div className="chat-messages">
              {selected.messages.length === 0 && (
                <p className="muted center">Say hello and ask about the car.</p>
              )}
              {selected.messages.map((m, i) => (
                <div
                  className={`message ${(m.senderId ? m.senderId === state.userId : m.own === (selected.userId === state.userId)) ? "own" : ""}`}
                  key={i}
                >
                  <p>{m.text}</p>
                  <small>{m.time}</small>
                </div>
              ))}
            </div>
            <form
              className="chat-compose"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!text.trim()) return;
                const ok = await update((s) => {
                  s.messages
                    .find((c) => c.id === selected.id)!
                    .messages.push({
                      text: text.trim(),
                      own: true,
                      senderId: s.userId,
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    });
                });
                if (ok) setText("");
              }}
            >
              <input
                aria-label="Message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a message…"
              />
              <Button aria-label="Send message" type="submit">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
      <Modal
        open={report}
        onClose={() => setReport(false)}
        title="Report this conversation"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            await update((s) => {
              s.reports.unshift({
                id: crypto.randomUUID(),
                listingId: selected!.listingId,
                title: "Conversation: " + selected!.seller,
                reason: "Inappropriate message",
                notes: String(d.get("notes")),
                status: "Open",
              });
            }, "Conversation reported");
            setReport(false);
          }}
        >
          <label>
            What happened?
            <textarea name="notes" required minLength={5} />
          </label>
          <Button>Submit report</Button>
        </form>
      </Modal>
    </>
  );
}
function AccountSettings({ section }: { section: string }) {
  const { state, update } = useDemo();
  const [editing, setEditing] = useState<string | null>(null);
  if (section === "addresses")
    return (
      <>
        <PageTitle title="Your places" text="Save your usual destinations.">
          <Button onClick={() => setEditing("new")}>
            <Plus size={16} /> Add address
          </Button>
        </PageTitle>
        <div className="vehicle-grid">
          {state.addresses.map((a) => (
            <div className="panel" key={a.id}>
              <MapPin size={25} />
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
              <Badge>{a.status}</Badge>
              <div className="actions">
                <Button variant="outline" onClick={() => setEditing(a.id)}>
                  Edit
                </Button>
                <Confirm
                  label="Remove"
                  danger
                  title="Remove address?"
                  onConfirm={() =>
                    update((s) => {
                      s.addresses = s.addresses.filter((x) => x.id !== a.id);
                    }, "Address removed")
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <Modal
          open={!!editing}
          onClose={() => setEditing(null)}
          title={editing === "new" ? "Add a destination" : "Edit address"}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              await update((s) => {
                const a = {
                  id: editing === "new" ? crypto.randomUUID() : editing!,
                  title: String(d.get("title")),
                  detail: String(d.get("detail")),
                  status: d.get("default") ? "Default" : "Saved",
                };
                if (a.status === "Default")
                  s.addresses.forEach((x) => (x.status = "Saved"));
                const i = s.addresses.findIndex((x) => x.id === a.id);
                if (i >= 0) s.addresses[i] = a;
                else s.addresses.push(a);
              }, "Address saved");
              setEditing(null);
            }}
          >
            <label>
              Label
              <input
                required
                name="title"
                defaultValue={
                  state.addresses.find((a) => a.id === editing)?.title
                }
                placeholder="Home or work"
              />
            </label>
            <label>
              Complete address
              <textarea
                required
                minLength={10}
                name="detail"
                defaultValue={
                  state.addresses.find((a) => a.id === editing)?.detail
                }
              />
            </label>
            <label className="checkbox">
              <input name="default" type="checkbox" />
              Use as default address
            </label>
            <Button>Save address</Button>
          </form>
        </Modal>
      </>
    );
  return (
    <>
      <PageTitle
        title={
          section === "profile" ? "Make yourself at home." : "Account security"
        }
        text={
          section === "profile"
            ? "Keep your details up to date."
            : "Demo controls only — no real credentials are stored."
        }
      />
      <form
        className="panel narrow"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const d = new FormData(form);
          if (section === "security") {
            if (d.get("password") !== d.get("confirm")) {
              toast.error("Passwords don’t match");
              return;
            }
            await update(
              () => {},
              "Demo password updated. No credentials stored.",
            );
            form.reset();
          } else
            await update((s) => {
              s.profile = {
                name: String(d.get("name")),
                email: String(d.get("email")),
                phone: String(d.get("phone")),
              };
            }, "Profile updated");
        }}
      >
        {section === "profile" ? (
          <>
            <label>
              Full name
              <input
                name="name"
                required
                minLength={3}
                defaultValue={state.profile.name}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                defaultValue={state.profile.email}
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                required
                minLength={10}
                defaultValue={state.profile.phone}
              />
            </label>
          </>
        ) : (
          <>
            <label>
              New demo password
              <input required minLength={8} name="password" type="password" />
            </label>
            <label>
              Confirm password
              <input required minLength={8} name="confirm" type="password" />
            </label>
          </>
        )}
        <Button>
          Save changes <Check size={16} />
        </Button>
      </form>
    </>
  );
}
