"use client";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { images, articles } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { Button } from "./ui/button";
import { Empty, PageTitle, Skeleton } from "./ui/shared";
import { Header, Footer, Home, FAQ, DemoControl } from "./site";
import {
  Catalog,
  Detail,
  Cart,
  Checkout,
  OrderView,
  TrackOrder,
} from "./commerce";
import { Auth, SellWizard, AccountPage } from "./account";
import { DashboardShell, AdminPage } from "./dashboard";
import { toast } from "sonner";
export function App({ path }: { path: string[] }) {
  const { loading, scenario, setScenario } = useDemo();
  const section = path[0] || "";
  let content;
  if (section === "auth")
    return (
      <>
        <Suspense fallback={<Skeleton />}>
          <Auth key={path.join("/")} mode={path[1] || "sign-in"} />
        </Suspense>
        <DemoControl />
      </>
    );
  const gate = loading ? (
    <Skeleton />
  ) : scenario === "error" ? (
    <div className="empty">
      <RotateCcw size={35} />
      <h2>A little bump in the road.</h2>
      <p>
        This is the demo error scenario. Retry to restore the normal experience.
      </p>
      <Button onClick={() => setScenario("normal")}>Retry request</Button>
    </div>
  ) : null;
  if (section === "account" || section === "admin")
    return (
      <>
        <DashboardShell admin={section === "admin"}>
          {gate || (
            <Suspense fallback={<Skeleton />}>
              {section === "admin" ? (
                <AdminPage key={path.join("/")} path={path} />
              ) : (
                <AccountPage key={path.join("/")} path={path} />
              )}
            </Suspense>
          )}
        </DashboardShell>
        <DemoControl />
      </>
    );
  if (!section) content = <Home />;
  else if (section === "shop" || section === "search")
    content = <Catalog key={path.join("/")} category={path[1] || ""} />;
  else if (section === "product")
    content = <Detail key={path.join("/")} slug={path[1]} />;
  else if (section === "marketplace")
    content = path[1] ? (
      <Detail key={path.join("/")} market slug={path[1]} />
    ) : (
      <Catalog market />
    );
  else if (section === "seller")
    content = <Catalog market sellerId={path[1]} />;
  else if (section === "cart") content = <Cart />;
  else if (section === "checkout") content = <Checkout />;
  else if (section === "order-success")
    content = (
      <div className="container page">
        <OrderView id={path[1]} success />
      </div>
    );
  else if (section === "track-order") content = <TrackOrder />;
  else if (section === "sell") content = <SellWizard />;
  else if (section === "demo") content = <DemoPage />;
  else if (
    [
      "about",
      "contact",
      "faqs",
      "shipping-delivery",
      "returns-refunds",
      "marketplace-rules",
      "terms",
      "privacy",
      "blog",
    ].includes(section)
  )
    content = <InfoPage path={path} />;
  else
    content = (
      <Empty
        title="A wrong turn. A fresh start."
        text="404 — We couldn’t find that page. Let’s get you back on the road."
        href="/"
        label="Back to Zahid Autos"
      />
    );
  return (
    <>
      <Header />
      <main id="main-content">
        <Suspense
          fallback={
            <div className="container page">
              <Skeleton />
            </div>
          }
        >
          {gate ? <div className="container page">{gate}</div> : content}
        </Suspense>
      </main>
      <Footer />
      <DemoControl />
    </>
  );
}
function DemoPage() {
  const { switchRole, setScenario } = useDemo();
  return (
    <div className="container page">
      <PageTitle
        eyebrow="THE COMPLETE FRONTEND EXPERIENCE"
        title="Take it for a spin."
        text="Choose a role and explore the working scenarios. All changes stay in this browser."
      />
      <div className="vehicle-grid">
        {[
          [
            "visitor",
            "Signed-out visitor",
            "Browse parts and cars, build a bag and try guest checkout.",
            "/",
          ],
          [
            "customer",
            "Customer",
            "Shop, track orders, manage listings in every status, chat with buyers and sellers, and update your account.",
            "/account",
          ],
          [
            "admin",
            "Super admin",
            "Verify payments, ship orders, moderate listings and manage content.",
            "/admin",
          ],
        ].map(([role, title, text, href]) => (
          <div className="panel" key={role}>
            <ShieldCheck size={28} />
            <h2>{title}</h2>
            <p>{text}</p>
            <Button
              onClick={async () => {
                await switchRole(role);
                setScenario("normal");
                window.location.href = href;
              }}
            >
              Start scenario <ArrowRight size={16} />
            </Button>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>A connected demo</h2>
        <p>
          Place an order as a buyer, then switch to Super Admin to verify its
          payment. Return to the customer account to see the updated status and
          notification. The same pattern works for listing submissions,
          moderation and reports.
        </p>
        <p className="muted">
          Use the floating Demo control for loading, empty, error and permission
          states, or to reset the original data.
        </p>
      </div>
    </div>
  );
}
function InfoPage({ path }: { path: string[] }) {
  const { state, update } = useDemo();
  const page = path[0];
  if (page === "faqs")
    return (
      <div className="container page">
        <PageTitle
          eyebrow="A LITTLE CLARITY"
          title="Good questions. Straight answers."
          text="The things worth knowing before your next journey."
        />
        <FAQ />
      </div>
    );
  if (page === "blog") {
    const article = articles.find((a) => a.slug === path[1]);
    if (path[1] && !article)
      return <Empty title="Story not found" href="/blog" label="All stories" />;
    return (
      <div className="container page">
        {article ? (
          <article className="article-detail">
            <PageTitle
              eyebrow={article.category}
              title={article.title}
              text="Zahid Autos Journal · 02 October 2026 · 5 min read"
            />
            <img src={article.image} alt={article.title} />
            <p>{article.text}</p>
            <h2>A little knowledge goes a long way.</h2>
            <p>
              Take your time, ask questions, and keep a clear record of the work
              done on your car. A trusted workshop and the right part can make
              every kilometre feel better.
            </p>
            <Link className="text-link" href="/shop">
              Find the right essentials <ArrowRight size={17} />
            </Link>
          </article>
        ) : (
          <>
            <PageTitle
              eyebrow="THE ZAHID AUTOS JOURNAL"
              title="For the love of the drive."
              text="Useful advice, fresh perspectives, and a few things worth knowing."
            />
            <div className="vehicle-grid">
              {articles.map((a) => (
                <Link
                  href={"/blog/" + a.slug}
                  className="article-card"
                  key={a.slug}
                >
                  <img src={a.image} alt={a.title} />
                  <div className="eyebrow">{a.category}</div>
                  <h2>{a.title}</h2>
                  <p>{a.text.slice(0, 140)}…</p>
                  <span className="text-link">
                    Read story <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  if (page === "contact")
    return (
      <div className="container page">
        <PageTitle
          eyebrow="REAL PEOPLE. REAL SUPPORT."
          title="Let’s talk about your next journey."
          text="A question about fitment, an order, or your listing? We’re here."
        />
        <div className="detail-layout">
          <div className="panel">
            <h2>A little help goes a long way.</h2>
            <p className="delivery-note">
              <Mail />
              {state.settings.email}
            </p>
            <p className="delivery-note">
              <Phone />
              {state.settings.phone}
            </p>
            <p className="delivery-note">
              <MapPin />
              {state.settings.address}
            </p>
            <img
              className="preview-car"
              src={images.workshop}
              alt="Automotive workshop"
            />
          </div>
          <form
            className="panel"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const ok = await update(
                () => {},
                "Demo enquiry saved. No message was sent externally.",
              );
              if (ok) form.reset();
            }}
          >
            <label>
              Your name
              <input required minLength={3} />
            </label>
            <label>
              Email address
              <input type="email" required />
            </label>
            <label>
              How can we help?
              <select>
                <option>Product compatibility</option>
                <option>Order support</option>
                <option>Marketplace listing</option>
                <option>Something else</option>
              </select>
            </label>
            <label>
              Your message
              <textarea required minLength={10} rows={6} />
            </label>
            <Button>
              Send demo enquiry <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </div>
    );
  const titleMap: Record<string, string> = {
    about: "Good parts. Better possibilities.",
    "shipping-delivery": "From our garage to yours.",
    "returns-refunds": "A fair return. A fresh start.",
    "marketplace-rules": "A community built on trust.",
    terms: "A few ground rules.",
    privacy: "Your privacy, respected.",
  };
  const record = state.records.pages.find(
    (r) => r.title.toLowerCase().replaceAll(" ", "-") === page,
  );
  return (
    <div className="container page">
      <div className="article-detail">
        <PageTitle
          eyebrow={page.replaceAll("-", " ").toUpperCase()}
          title={titleMap[page]}
        />
        {page === "about" && (
          <img src={images.road} alt="The open road ahead" />
        )}
        <p className="lead">
          {record?.detail ||
            "A thoughtful approach to buying, selling and keeping your car on the road."}
        </p>
        {page === "about" ? (
          <>
            <h2>For every part of the journey.</h2>
            <p>
              There’s a story behind every car. We’re here for the next chapter:
              the part that gets you moving again, the fluid that keeps things
              running smoothly, the new owner who sees what you see.
            </p>
            <p>
              Our business-owned store and community marketplace work together,
              with clear condition notes and real conversations at their heart.
            </p>
            <Button asChild>
              <Link href="/shop">
                Explore the collection <ArrowRight size={17} />
              </Link>
            </Button>
          </>
        ) : page === "shipping-delivery" ? (
          <>
            <h2>Delivery that keeps you informed.</h2>
            <p>
              Demo delivery zones: {state.settings.zones}. Standard delivery is{" "}
              {state.settings.deliveryTime} after payment verification. Delivery
              charges are shown before placing your order.
            </p>
            <h2>Tracking and collection</h2>
            <p>
              Your tracking reference appears in My Orders when an admin marks
              the order shipped. Showroom collection is{" "}
              {state.settings.pickup ? "available" : "not currently available"}.
            </p>
          </>
        ) : page === "returns-refunds" ? (
          <>
            <h2>Before installation</h2>
            <p>
              Check the part number, fitment and condition on arrival. Eligible
              unused, uninstalled parts may be returned within 7 days. Keep the
              packaging and contact support with your order number.
            </p>
            <h2>Clear exceptions</h2>
            <p>
              Disclosed cosmetic wear, installed electrical parts and damaged or
              repairable vehicles are excluded from the standard demo return
              policy. Contact the team to discuss an issue.
            </p>
          </>
        ) : page === "marketplace-rules" ? (
          <>
            <h2>Be clear. Be honest. Be respectful.</h2>
            <p>
              Use your own photos, disclose repairs and damage, and keep your
              listing accurate. Admins may request changes or remove misleading
              listings.
            </p>
            <h2>Arrange an inspection</h2>
            <p>
              Community sales take place directly between the buyer and seller.
              Zahid Autos does not collect marketplace payments or provide
              escrow. Meet in a suitable public place and verify documents.
            </p>
          </>
        ) : page === "privacy" ? (
          <>
            <h2>Your demo data</h2>
            <p>
              Cart items, profiles, listings, orders and conversations are
              stored in this browser’s localStorage. No backend, email service,
              payment provider or authentication provider is connected.
            </p>
            <h2>External resources</h2>
            <p>
              Vehicle and editorial images load from Unsplash. WhatsApp opens
              only when you choose the payment-proof link. Use the Demo menu to
              reset locally saved data.
            </p>
          </>
        ) : (
          <>
            <h2>A frontend demonstration</h2>
            <p>
              All accounts, inventory, orders and transactions are simulated. Do
              not send real money to the example bank details. Listed vehicle
              photography is illustrative and is not a representation of
              verified inventory.
            </p>
            <h2>Using the prototype</h2>
            <p>
              Data is saved locally for demonstration and can be reset at any
              time. The demo is not a production commerce service.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
