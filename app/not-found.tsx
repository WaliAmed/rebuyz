import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <div className="eyebrow">404 / A WRONG TURN</div>
      <h1>Let’s get you back on the road.</h1>
      <p>We couldn’t find that page.</p>
      <Link className="btn primary" href="/">
        Back to Zahid Autos
      </Link>
    </main>
  );
}
