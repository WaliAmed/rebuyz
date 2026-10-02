"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Car,
  MessageCircle,
  Heart,
  Bell,
  UserRound,
  MapPin,
  ShieldCheck,
  CreditCard,
  Package,
  Layers,
  Warehouse,
  Users,
  Flag,
  PanelsTopLeft,
  Image,
  Tag,
  Settings,
  History,
  LogOut,
  Menu,
  Search,
  ArrowUpRight,
  ChevronDown,
  TrendingUp,
  ArrowRight,
  Plus,
  Check,
  X,
  Truck,
  Wallet,
} from "lucide-react";
import { useDemo, recordActivity } from "@/lib/store";
import { Product, RecordItem, categories, images } from "@/lib/data";
import { money, slugify } from "@/lib/site-config";
import { Button } from "./ui/button";
import { Badge, Confirm, Empty, Modal, PageTitle, Skeleton } from "./ui/shared";
import { Logo } from "./site";
import { OrdersTable } from "./account";
import { OrderView } from "./commerce";
import { toast } from "sonner";
const customerLinks = [
  ["Overview", "", LayoutDashboard],
  ["My orders", "orders", ShoppingBag],
  ["My listings", "listings", Car],
  ["Messages", "messages", MessageCircle],
  ["Saved items", "favorites", Heart],
  ["Notifications", "notifications", Bell],
  ["My profile", "profile", UserRound],
  ["Addresses", "addresses", MapPin],
  ["Security", "security", ShieldCheck],
] as const;
const adminLinks = [
  ["Overview", "", LayoutDashboard],
  ["Orders", "orders", ShoppingBag],
  ["Payment review", "payments", CreditCard],
  ["Products", "products", Package],
  ["Categories", "categories", Layers],
  ["Inventory", "inventory", Warehouse],
  ["Brands", "brands", Tag],
  ["Customers", "customers", Users],
  ["Marketplace", "marketplace", Car],
  ["Reports", "reports", Flag],
  ["Home content", "content/home", PanelsTopLeft],
  ["Site pages", "content/pages", Layers],
  ["Media library", "media", Image],
  ["Promotions", "promotions", Tag],
  ["Notifications", "notifications", Bell],
  ["Payment settings", "settings/payment", Wallet],
  ["Delivery settings", "settings/delivery", Truck],
  ["Admin team", "team", Users],
  ["Activity log", "activity", History],
  ["Settings", "settings", Settings],
] as const;
export function DashboardShell({
  admin = false,
  children,
}: {
  admin?: boolean;
  children: ReactNode;
}) {
  const { state, update, scenario, loading } = useDemo();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const base = admin ? "/admin" : "/account";
  if (loading)
    return (
      <div className="container page">
        <Skeleton />
      </div>
    );
  if (
    state.role === "visitor" ||
    (admin && state.role !== "admin") ||
    scenario === "permission"
  )
    return (
      <div className="container page">
        <Logo />
        <Empty
          title={
            state.role === "visitor"
              ? "Your garage is waiting."
              : "This area needs an admin account."
          }
          text={
            state.role === "visitor"
              ? "Sign in to view your orders, listings and conversations."
              : "Use the Demo menu to preview the Super Admin role."
          }
          href={
            state.role === "visitor"
              ? "/auth/sign-in?next=" + encodeURIComponent(path)
              : "/demo"
          }
          label={state.role === "visitor" ? "Sign in" : "Open demo scenarios"}
        />
      </div>
    );
  const nav = (
    <>
      <Logo />
      <div className="workspace-chip">
        <span className="avatar">{admin ? "Z" : "ZA"}</span>
        <span>
          <b>{admin ? "Zahid Autos workspace" : state.profile.name}</b>
          <small>{admin ? "Super admin" : "Your personal garage"}</small>
        </span>
        <ChevronDown size={14} />
      </div>
      <small className="nav-label">{admin ? "WORKSPACE" : "MY ACCOUNT"}</small>
      <nav className="dashboard-nav">
        {(admin ? adminLinks : customerLinks).map(([title, route, Icon]) => (
          <Link
            className={
              path === base + (route ? "/" + route : "") ? "active" : ""
            }
            href={base + (route ? "/" + route : "")}
            key={route}
            onClick={() => setOpen(false)}
          >
            <Icon size={18} />
            {title}
            {route === "payments" && (
              <span>
                {
                  state.orders.filter(
                    (o) => o.payment === "Payment Under Review",
                  ).length
                }
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <Link href="/">
          Back to storefront <ArrowUpRight size={16} />
        </Link>
        <button
          onClick={() =>
            update((s) => {
              s.role = "visitor";
            }, "Signed out")
          }
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </>
  );
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">{nav}</aside>
      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <button
              className="icon-button mobile-only"
              onClick={() => setOpen(true)}
              aria-label="Open dashboard menu"
            >
              <Menu size={20} />
            </button>
            <span className="muted">{admin ? "Workspace" : "My account"}</span>
            <span>/</span>
            <b>
              {(admin ? adminLinks : customerLinks).find(
                ([, r]) => path === base + (r ? "/" + r : ""),
              )?.[0] || "Details"}
            </b>
          </div>
          <div>
            <Link className="text-link" href="/">
              View store <ArrowUpRight size={14} />
            </Link>
            <Link
              href={admin ? "/admin/notifications" : "/account/notifications"}
              aria-label="Notifications"
              className="icon-button"
            >
              <Bell size={19} />
            </Link>
            <span className="avatar">
              {admin ? "MK" : state.profile.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Your workspace"
        drawer
      >
        {nav}
      </Modal>
    </div>
  );
}
export function AdminPage({ path }: { path: string[] }) {
  const { state, update, scenario } = useDemo();
  const section = path[1] || "";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [reason, setReason] = useState<{ id: string; action: string } | null>(
    null,
  );
  if (section === "orders" && path[2]) return <OrderView id={path[2]} admin />;
  if (section === "orders" || section === "payments")
    return (
      <>
        <PageTitle
          eyebrow="COMMERCE"
          title={section === "payments" ? "Payment review" : "Orders"}
          text={
            section === "payments"
              ? "Review transfer evidence, verify payments and keep orders moving."
              : "Every order, from first click to final delivery."
          }
        />
        {section === "payments" && (
          <div className="notice">
            <CreditCard size={20} /> Payment proof is sent through WhatsApp.
            Open an order to verify or flag it in the demo.
          </div>
        )}
        <OrdersTable admin payments={section === "payments"} />
      </>
    );
  if (section === "products" && path[2]) return <ProductEditor id={path[2]} />;
  if (section === "products" || section === "inventory") {
    const rows =
      scenario === "empty"
        ? []
        : state.products.filter(
            (p) =>
              (p.title + " " + p.sku)
                .toLowerCase()
                .includes(search.toLowerCase()) &&
              (filter !== "Low stock" || p.stock < 5),
          );
    return (
      <>
        <PageTitle
          eyebrow="CATALOGUE"
          title={section === "inventory" ? "Inventory" : "Products"}
          text="Keep your catalogue in good shape."
        >
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus size={17} /> Add product
            </Link>
          </Button>
        </PageTitle>
        <div className="panel">
          <div className="table-toolbar">
            <input
              placeholder="Search products or SKU…"
              aria-label="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              aria-label="Stock filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Low stock</option>
            </select>
          </div>
          {rows.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-product">
                          <img src={p.image} alt="" />
                          <span>
                            <b>{p.title}</b>
                            <small>{p.sku}</small>
                          </span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>{money(p.price)}</td>
                      <td>
                        {section === "inventory" ? (
                          <input
                            className="stock-input"
                            aria-label={`Stock for ${p.title}`}
                            type="number"
                            min="0"
                            defaultValue={p.stock}
                            onBlur={(e) => {
                              const n = Number(e.target.value);
                              if (
                                Number.isInteger(n) &&
                                n >= 0 &&
                                n !== p.stock
                              )
                                update((s) => {
                                  s.products.find((x) => x.id === p.id)!.stock =
                                    n;
                                  recordActivity(
                                    s,
                                    `Stock updated: ${p.title} → ${n}`,
                                  );
                                }, "Stock updated");
                            }}
                          />
                        ) : (
                          <Badge>
                            {p.stock < 5
                              ? `Low stock · ${p.stock}`
                              : `${p.stock} available`}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Badge>{p.published ? "Published" : "Draft"}</Badge>
                      </td>
                      <td>
                        <Link
                          className="table-action"
                          href={"/admin/products/" + p.id}
                        >
                          Edit <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No products found" />
          )}
        </div>
      </>
    );
  }
  if (section === "marketplace") {
    const detail = state.vehicles.find((v) => v.id === path[2]);
    const rows =
      scenario === "empty"
        ? []
        : state.vehicles.filter(
            (v) =>
              (filter === "All" || v.status === filter) &&
              v.title.toLowerCase().includes(search.toLowerCase()),
          );
    const actions = (id: string) => (
      <div className="actions wrap">
        {["Approve", "Reject", "Request Changes", "Pause", "Remove"].map(
          (a) => (
            <Button
              variant={a === "Approve" ? "primary" : "outline"}
              key={a}
              onClick={() => setReason({ id, action: a })}
            >
              {a}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          onClick={() =>
            update((s) => {
              const v = s.vehicles.find((v) => v.id === id)!;
              v.featured = !v.featured;
              recordActivity(
                s,
                `${v.title}: ${v.featured ? "Featured" : "Unfeatured"}`,
              );
            }, "Featured status updated")
          }
        >
          {state.vehicles.find((v) => v.id === id)?.featured
            ? "Unfeature"
            : "Feature"}
        </Button>
      </div>
    );
    return (
      <>
        <PageTitle
          eyebrow="COMMUNITY"
          title={detail ? detail.title : "Marketplace moderation"}
          text="Give great listings the green light."
        />
        {detail ? (
          <div className="panel">
            <div className="review-gallery">
              {detail.images.map((src, i) => (
                <img key={i} src={src} alt={`${detail.title} photo ${i + 1}`} />
              ))}
            </div>
            <div className="section-heading">
              <h2>{money(detail.price)}</h2>
              <Badge>{detail.status}</Badge>
            </div>
            <p>{detail.description}</p>
            <div className="spec-grid">
              {Object.entries({
                Seller: detail.seller,
                City: detail.city,
                Year: detail.year,
                Mileage: detail.mileage,
                Transmission: detail.transmission,
                Fuel: detail.fuel,
                Engine: detail.engine,
                Colour: detail.color,
                Registration: detail.registration,
                "Condition notes": detail.damage,
                Phone: detail.showPhone ? detail.phone : "Hidden",
                Chat: detail.allowChat ? "Allowed" : "Disabled",
              }).map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            {detail.note && <p className="notice">{detail.note}</p>}
            {actions(detail.id)}
          </div>
        ) : (
          <div className="panel">
            <div className="table-toolbar">
              <input
                placeholder="Search cars…"
                aria-label="Search marketplace listings"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                aria-label="Moderation status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {[
                  "All",
                  "Pending Review",
                  "Live",
                  "Changes Required",
                  "Rejected",
                  "Paused",
                  "Sold",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>City</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="table-product">
                          <img src={v.images[0] || images.car} alt="" />
                          <b>{v.title}</b>
                        </div>
                      </td>
                      <td>{v.seller}</td>
                      <td>{money(v.price)}</td>
                      <td>{v.city}</td>
                      <td>{v.date}</td>
                      <td>
                        <Badge>{v.status}</Badge>
                      </td>
                      <td>
                        <Link
                          className="table-action"
                          href={"/admin/marketplace/" + v.id}
                        >
                          Review <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rows.length && (
                <Empty
                  title="The queue is clear"
                  href="/admin"
                  label="Back to overview"
                />
              )}
            </div>
          </div>
        )}
        <Modal
          open={!!reason}
          onClose={() => setReason(null)}
          title={`${reason?.action} listing`}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const ok = await update((s) => {
                const v = s.vehicles.find((v) => v.id === reason!.id)!;
                v.status = (
                  {
                    Approve: "Live",
                    Reject: "Rejected",
                    "Request Changes": "Changes Required",
                    Pause: "Paused",
                    Remove: "Removed",
                  } as Record<string, string>
                )[reason!.action];
                v.note = String(d.get("note") || "");
                recordActivity(
                  s,
                  `${v.title}: ${v.status}${v.note ? " — " + v.note : ""}`,
                  v.sellerId,
                );
              }, "Moderation saved and seller notified");
              if (ok) setReason(null);
            }}
          >
            <label>
              Review notes
              <textarea
                name="note"
                required={["Reject", "Request Changes"].includes(
                  reason?.action || "",
                )}
                placeholder="Explain the decision or requested changes"
              />
            </label>
            <Button>Confirm {reason?.action.toLowerCase()}</Button>
          </form>
        </Modal>
      </>
    );
  }
  if (section === "reports")
    return (
      <>
        <PageTitle
          title="Reports"
          text="Keep the community on the right road."
        />
        {state.reports.map((r) => (
          <div className="panel" key={r.id}>
            <div className="section-heading">
              <h3>{r.title}</h3>
              <Badge>{r.status}</Badge>
            </div>
            <p>
              <b>{r.reason}</b> · {r.notes}
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                await update((s) => {
                  const x = s.reports.find((x) => x.id === r.id)!;
                  x.status = String(d.get("action"));
                  x.notes = String(d.get("notes"));
                  if (x.status === "Listing removed") {
                    const v = s.vehicles.find((v) => v.id === r.listingId);
                    if (v) v.status = "Removed";
                  }
                  recordActivity(s, `Report ${r.id}: ${x.status}`);
                }, "Report updated");
              }}
            >
              <div className="form-grid">
                <label>
                  Review notes
                  <input name="notes" defaultValue={r.notes} required />
                </label>
                <label>
                  Resolution
                  <select name="action">
                    <option>Resolved</option>
                    <option>Dismissed</option>
                    <option>Listing removed</option>
                  </select>
                </label>
              </div>
              <Button variant="outline">Save resolution</Button>
            </form>
          </div>
        ))}
        {!state.reports.length && (
          <Empty title="No reports to review" href="/admin" />
        )}
      </>
    );
  if (section === "settings")
    return <SettingsForm type={path[2] || "general"} />;
  if (section === "activity")
    return (
      <>
        <PageTitle
          title="Activity log"
          text="A clear record of changes across your workspace."
        />
        <div className="panel">
          {state.activity.map((a, i) => (
            <div className="activity-row" key={i}>
              <span className="activity-dot" />
              <div>
                <b>{a}</b>
                <small>
                  Zahid Autos admin · {i === 0 ? "Just now" : "Recent activity"}
                </small>
              </div>
              <Check size={16} />
            </div>
          ))}
        </div>
      </>
    );
  if (section === "customers" && path[2]) {
    const c = state.records.customers.find((c) => c.id === path[2]);
    return (
      <>
        <PageTitle title={c?.title || "Customer not found"} text={c?.detail} />
        <div className="stats-grid">
          {[
            ["Orders", state.orders.filter((o) => o.userId === path[2]).length],
            [
              "Listings",
              state.vehicles.filter((v) => v.sellerId === path[2]).length,
            ],
            [
              "Messages",
              state.messages.filter((m) => m.userId === path[2]).length,
            ],
            [
              "Flags",
              state.reports.filter((r) =>
                state.vehicles.some(
                  (v) => v.id === r.listingId && v.sellerId === path[2],
                ),
              ).length,
            ],
          ].map(([t, n]) => (
            <div className="stat-card" key={t}>
              <span>{t}</span>
              <strong>{n}</strong>
            </div>
          ))}
        </div>
        <Records type="customers" title="Customer records" />
      </>
    );
  }
  if (
    [
      "categories",
      "brands",
      "customers",
      "team",
      "promotions",
      "notifications",
      "media",
    ].includes(section)
  )
    return (
      <Records
        type={section}
        title={
          {
            categories: "Categories",
            brands: "Brands",
            customers: "Customers",
            team: "Admin team",
            promotions: "Promotions",
            notifications: "Notification templates",
            media: "Media library",
          }[section] || section
        }
      />
    );
  if (section === "content")
    return (
      <Records
        type={path[2] === "home" ? "home" : "pages"}
        title={path[2] === "home" ? "Home content" : "Site pages"}
      />
    );
  return (
    <>
      <PageTitle
        eyebrow="FRIDAY, 02 OCTOBER 2026"
        title="A good day to keep things moving."
        text="Here’s the latest from your store and community."
      >
        <Button asChild variant="outline">
          <Link href="/shop">
            View storefront <ArrowUpRight size={16} />
          </Link>
        </Button>
      </PageTitle>
      <div className="stats-grid">
        {[
          [
            ShoppingBag,
            "Total orders",
            state.orders.length,
            "Across all order stages",
          ],
          [
            Wallet,
            "Verified revenue",
            money(
              state.orders
                .filter((o) => o.payment === "Verified")
                .reduce((a, o) => a + o.total, 0),
            ),
            "Verified demo payments",
          ],
          [
            CreditCard,
            "Payment review",
            state.orders.filter(
              (o) =>
                o.payment === "Payment Under Review" ||
                o.payment === "Pending Payment",
            ).length,
            "Awaiting your attention",
          ],
          [
            Car,
            "Pending listings",
            state.vehicles.filter((v) => v.status === "Pending Review").length,
            "Ready for a second look",
          ],
        ].map(([Icon, label, value, note]) => {
          const I = Icon as typeof Car;
          return (
            <div className="stat-card" key={String(label)}>
              <div className="section-heading">
                <span>{String(label)}</span>
                <I size={20} />
              </div>
              <strong>{String(value)}</strong>
              <small>
                <span className="trend">↗</span> {String(note)}
              </small>
            </div>
          );
        })}
      </div>
      <div className="dashboard-two-col">
        <div className="panel">
          <div className="section-heading">
            <div>
              <h2>Sales at a glance</h2>
              <p className="small muted">
                Illustrative demo trend · Last 7 days
              </p>
            </div>
            <Badge>This week</Badge>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label="Illustrative sales chart: Monday 48%, Tuesday 62%, Wednesday 43%, Thursday 78%, Friday 92%, Saturday 66%, Sunday 82%"
          >
            {[48, 62, 43, 78, 92, 66, 82].map((n, i) => (
              <div key={i}>
                <span style={{ height: n + "%" }} />
                <small>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>A little attention goes a long way.</h2>
          {[
            [
              "Payment verification",
              state.orders.filter((o) => o.payment !== "Verified").length,
              "payments",
              CreditCard,
            ],
            [
              "Listings to review",
              state.vehicles.filter((v) => v.status === "Pending Review")
                .length,
              "marketplace",
              Car,
            ],
            [
              "Open reports",
              state.reports.filter((r) => r.status === "Open").length,
              "reports",
              Flag,
            ],
            [
              "Low-stock products",
              state.products.filter((p) => p.stock < 5).length,
              "inventory",
              Package,
            ],
          ].map(([t, n, h, Icon]) => {
            const I = Icon as typeof Car;
            return (
              <Link
                className="attention-row"
                key={String(t)}
                href={"/admin/" + h}
              >
                <I size={18} />
                <span>{String(t)}</span>
                <b>{String(n)}</b>
                <ArrowUpRight size={16} />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="section-heading">
        <h2>Recent orders</h2>
        <Link href="/admin/orders" className="text-link">
          All orders <ArrowRight size={16} />
        </Link>
      </div>
      <OrdersTable admin />
      <div className="dashboard-two-col">
        <div className="panel">
          <h2>Community pulse</h2>
          <div className="summary-row">
            <span>Live listings</span>
            <b>{state.vehicles.filter((v) => v.status === "Live").length}</b>
          </div>
          <div className="summary-row">
            <span>Registered customers</span>
            <b>{state.records.customers.length}</b>
          </div>
          <div className="summary-row">
            <span>Published products</span>
            <b>{state.products.filter((p) => p.published).length}</b>
          </div>
        </div>
        <div className="panel">
          <h2>Recent activity</h2>
          {state.activity.slice(0, 3).map((a, i) => (
            <div className="activity-row" key={i}>
              <span className="activity-dot" />
              {a}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
function SettingsForm({ type }: { type: string }) {
  const { state, update, busy } = useDemo();
  const keys =
    type === "payment"
      ? ["bank", "holder", "account", "iban", "whatsapp", "instructions"]
      : type === "delivery"
        ? ["zones", "deliveryFee", "freeThreshold", "courier", "deliveryTime"]
        : ["name", "tagline", "email", "phone", "address"];
  const labels: Record<string, string> = {
    bank: "Bank name",
    holder: "Account holder",
    account: "Account number",
    iban: "IBAN",
    whatsapp: "WhatsApp payment number",
    instructions: "Payment instructions",
    zones: "Delivery zones",
    deliveryFee: "Delivery fee (PKR)",
    freeThreshold: "Free delivery threshold (PKR)",
    courier: "Courier",
    deliveryTime: "Estimated delivery time",
    name: "Brand name",
    tagline: "Tagline",
    email: "Support email",
    phone: "Support phone",
    address: "Showroom address",
  };
  return (
    <>
      <PageTitle
        title={
          type === "payment"
            ? "Payment settings"
            : type === "delivery"
              ? "Delivery settings"
              : "Site settings"
        }
        text="Updates are saved locally and used throughout the demo."
      />
      <form
        className="panel narrow"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          await update((s) => {
            for (const key of keys) {
              const value = String(d.get(key));
              Object.assign(s.settings, {
                [key]: ["deliveryFee", "freeThreshold"].includes(key)
                  ? Number(value)
                  : value,
              });
            }
            if (type === "delivery") s.settings.pickup = !!d.get("pickup");
            recordActivity(s, `${type} settings updated`);
          }, "Settings saved");
        }}
      >
        {keys.map((k) => (
          <label key={k}>
            {labels[k]}
            <input
              name={k}
              required
              type={
                ["deliveryFee", "freeThreshold"].includes(k)
                  ? "number"
                  : k === "email"
                    ? "email"
                    : "text"
              }
              min="0"
              defaultValue={String(
                state.settings[k as keyof typeof state.settings],
              )}
            />
          </label>
        ))}
        {type === "delivery" && (
          <label className="checkbox">
            <input
              type="checkbox"
              name="pickup"
              defaultChecked={state.settings.pickup}
            />
            Offer showroom pickup
          </label>
        )}
        <Button disabled={busy}>
          Save settings <Check size={16} />
        </Button>
      </form>
    </>
  );
}
function Records({ type, title }: { type: string; title: string }) {
  const { state, update, scenario } = useDemo();
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<RecordItem | null>(null);
  const [preview, setPreview] = useState<RecordItem | null>(null);
  const [status, setStatus] = useState("All");
  const rows =
    scenario === "empty"
      ? []
      : (state.records[type] || []).filter(
          (r) =>
            (r.title + " " + r.detail)
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (status === "All" || r.status === status),
        );
  return (
    <>
      <PageTitle
        eyebrow="WORKSPACE"
        title={title}
        text={
          type === "notifications"
            ? "Edit and preview simulated customer emails. No email service is connected."
            : type === "home"
              ? "Edit hero copy, promotions, FAQs and testimonials. Changes appear on the storefront."
              : "Manage your saved demo records."
        }
      >
        <Button
          onClick={() =>
            setEdit({
              id: "",
              title: "",
              detail: "",
              status: type === "pages" ? "Published" : "Active",
            })
          }
        >
          <Plus size={16} /> Add {type === "media" ? "media" : "record"}
        </Button>
      </PageTitle>
      <div className="panel">
        <div className="table-toolbar">
          <input
            aria-label={`Search ${title}`}
            placeholder={`Search ${title.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Filter records"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            {Array.from(
              new Set((state.records[type] || []).map((r) => r.status)),
            ).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {rows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{type === "team" ? "Name" : "Title"}</th>
                  <th>{type === "team" ? "Role / permissions" : "Details"}</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="table-product">
                        {r.image && <img src={r.image} alt={r.title} />}
                        <b>
                          {type === "customers" ? (
                            <Link href={"/admin/customers/" + r.id}>
                              {r.title}
                            </Link>
                          ) : (
                            r.title
                          )}
                        </b>
                      </div>
                    </td>
                    <td className="record-detail">{r.detail}</td>
                    <td>
                      <Badge>{r.status}</Badge>
                    </td>
                    <td>
                      <div className="actions wrap">
                        <button
                          className="text-button"
                          onClick={() => setEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-button"
                          onClick={() => setPreview(r)}
                        >
                          Preview
                        </button>
                        <Confirm
                          label="Delete"
                          danger
                          title={`Delete ${r.title}?`}
                          onConfirm={() =>
                            update((s) => {
                              s.records[type] = s.records[type].filter(
                                (x) => x.id !== r.id,
                              );
                              recordActivity(s, `${type}: ${r.title} removed`);
                            }, "Record removed")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No records found"
            href="/admin"
            label="Back to overview"
          />
        )}
      </div>
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={`${edit?.id ? "Edit" : "Add"} ${type}`}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            const ok = await update((s) => {
              const row = {
                ...edit!,
                id: edit!.id || crypto.randomUUID(),
                title: String(d.get("title")),
                detail: String(d.get("detail")),
                status: String(d.get("status")),
              };
              const i = s.records[type].findIndex((r) => r.id === row.id);
              if (i >= 0) s.records[type][i] = row;
              else s.records[type].push(row);
              recordActivity(s, `${type}: ${row.title} saved`);
            }, "Record saved");
            if (ok) setEdit(null);
          }}
        >
          <label>
            Title / name
            <input required name="title" defaultValue={edit?.title} />
          </label>
          {type === "team" ? (
            <label>
              Role
              <select name="detail" defaultValue={edit?.detail}>
                {[
                  "Super Admin",
                  "Order Manager",
                  "Catalogue Manager",
                  "Marketplace Moderator",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          ) : (
            <label>
              {type === "notifications"
                ? "Email body"
                : type === "customers"
                  ? "Email / admin notes"
                  : "Content / details"}
              <textarea
                required
                name="detail"
                defaultValue={edit?.detail}
                rows={5}
              />
            </label>
          )}
          <label>
            Status
            <select name="status" defaultValue={edit?.status}>
              {[
                "Active",
                "Published",
                "Draft",
                "Ready",
                "Paused",
                "Suspended",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          {type === "media" && (
            <label>
              Upload image (demo, stored locally)
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 2 * 1024 * 1024) {
                    toast.error("Use an image smaller than 2 MB");
                    return;
                  }
                  const r = new FileReader();
                  r.onload = () =>
                    setEdit((v) =>
                      v ? { ...v, image: String(r.result) } : null,
                    );
                  r.readAsDataURL(f);
                }}
              />
            </label>
          )}
          {type === "team" && (
            <p className="notice">
              Role presets: orders and payments · catalogue and inventory ·
              marketplace and reports · all workspace controls.
            </p>
          )}
          <Button>Save changes</Button>
        </form>
      </Modal>
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title || "Preview"}
      >
        {preview?.image && (
          <img
            className="preview-car"
            src={preview.image}
            alt={preview.title}
          />
        )}
        <div className="panel">
          <Badge>{preview?.status}</Badge>
          <h2>{preview?.title}</h2>
          <p className="prose">
            {preview?.detail
              .replaceAll("{{customer}}", "wali")
              .replaceAll("{{reference}}", "ORD-1048")}
          </p>
        </div>
      </Modal>
    </>
  );
}
function ProductEditor({ id }: { id: string }) {
  const { state, update, busy } = useDemo();
  const p = state.products.find((p) => p.id === id);
  const [category, setCategory] = useState(p?.category || "Oils & Fluids");
  const [saved, setSaved] = useState(false);
  if (id !== "new" && !p)
    return <Empty title="Product not found" href="/admin/products" />;
  return (
    <>
      <PageTitle
        title={p ? "Edit product" : "A new addition to the garage."}
        text="Automotive details help customers find the right fit."
      />
      <form
        className="panel"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const title = String(d.get("title"));
          const price = Number(d.get("price"));
          const sale = Number(d.get("sale"));
          if (sale > price) {
            toast.error("Sale price cannot exceed regular price");
            return;
          }
          const ok = await update((s) => {
            const row: Product = {
              id: p?.id || "p-" + crypto.randomUUID(),
              slug: String(d.get("slug")) || slugify(title),
              title,
              category,
              brand: String(d.get("brand")),
              price: sale || price,
              oldPrice: price,
              stock: Number(d.get("stock")),
              condition: String(d.get("condition")),
              image: String(d.get("image")),
              sku: String(d.get("sku")),
              description: String(d.get("description")),
              compatibility: String(d.get("compatibility")),
              featured: !!d.get("featured"),
              published: !!d.get("published"),
              specs:
                category === "Oils & Fluids"
                  ? {
                      "Fluid type": String(d.get("fluid")),
                      Specification: String(d.get("specification")),
                      "Pack size": String(d.get("volume")),
                    }
                  : category.includes("Cars")
                    ? {
                        Make: String(d.get("make")),
                        Model: String(d.get("model")),
                        Year: String(d.get("year")),
                        Mileage: String(d.get("mileage")),
                        Fuel: String(d.get("fuel")),
                        Engine: String(d.get("engine")),
                        City: String(d.get("city")),
                        Registration: String(d.get("registration")),
                      }
                    : {
                        "Part number": String(d.get("part")),
                        "Donor vehicle": String(d.get("donor")),
                        "Wear notes": String(d.get("wear")),
                      },
            };
            const index = s.products.findIndex((x) => x.id === row.id);
            if (index >= 0) s.products[index] = row;
            else s.products.unshift(row);
            recordActivity(s, `Product saved: ${title}`);
          }, "Product saved");
          if (ok) setSaved(true);
        }}
      >
        <div className="form-grid">
          {[
            ["title", "Product title", p?.title],
            ["slug", "URL slug", p?.slug],
            ["brand", "Brand", p?.brand],
            ["sku", "SKU / part number", p?.sku],
            ["price", "Regular price", p?.oldPrice],
            ["sale", "Sale price (optional)", p?.price],
            ["stock", "Stock quantity", p?.stock],
            [
              "image",
              "Image URL or local asset",
              p?.image || "/images/oil-red.svg",
            ],
          ].map(([key, label, value]) => (
            <label key={key}>
              {label}
              <input
                name={String(key)}
                required={!["slug", "sale"].includes(String(key))}
                type={
                  ["price", "sale", "stock"].includes(String(key))
                    ? "number"
                    : "text"
                }
                min="0"
                defaultValue={value}
              />
            </label>
          ))}
          <label>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Condition
            <select name="condition" defaultValue={p?.condition}>
              <option>New</option>
              <option>Used</option>
              <option>Damaged</option>
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea required name="description" defaultValue={p?.description} />
        </label>
        <label>
          Compatible makes, models, years and notes
          <input
            required
            name="compatibility"
            defaultValue={p?.compatibility}
          />
        </label>
        <h3>
          {category === "Oils & Fluids"
            ? "Fluid specifications"
            : category.includes("Cars")
              ? "Vehicle specifications"
              : "Part details"}
        </h3>
        <div className="form-grid">
          {(category === "Oils & Fluids"
            ? [
                ["fluid", "Fluid type"],
                ["specification", "Specification"],
                ["volume", "Pack size"],
              ]
            : category.includes("Cars")
              ? [
                  ["make", "Make"],
                  ["model", "Model"],
                  ["year", "Year"],
                  ["mileage", "Mileage"],
                  ["fuel", "Fuel"],
                  ["engine", "Engine"],
                  ["city", "City"],
                  ["registration", "Registration"],
                ]
              : [
                  ["part", "Part number"],
                  ["donor", "Donor vehicle"],
                  ["wear", "Wear notes"],
                ]
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <input required name={key} defaultValue={p?.specs[label]} />
            </label>
          ))}
        </div>
        <div className="actions">
          <label className="checkbox">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={p?.featured}
            />{" "}
            Featured
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              name="published"
              defaultChecked={p?.published ?? true}
            />{" "}
            Published
          </label>
        </div>
        <div className="actions">
          <Button disabled={busy}>
            {busy ? "Saving…" : "Save product"}
            <Check size={16} />
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">Back to catalogue</Link>
          </Button>
        </div>
        {saved && (
          <p className="stock">
            Product saved. It is now available in the catalogue.
          </p>
        )}
      </form>
    </>
  );
}
