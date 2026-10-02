# Torque automotive frontend demo

A Next.js App Router / TypeScript frontend for a business-owned automotive shop and a separate customer vehicle marketplace. No backend, database, authentication provider, payment gateway, or email service is connected.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use **Demo** in the bottom-left corner or `/demo` to switch between visitor, customer, and super admin. The single customer combines buying, selling, and every listing status. Any valid email with an 8-character demo password works in the simulated auth screens. Google and Apple buttons also simulate sign-in.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Connected scenarios

- Shop → filters → product → favorite / cart → checkout → order confirmation → bank instructions → simulated proof → admin verification → shipping / tracking → customer status and notifications.
- Marketplace → filters → vehicle details → phone reveal / hidden-phone state → chat and persistent messages → report → admin resolution.
- Sell a car → vehicle / condition / photos / price / contact / preview → pending review → request changes, approve, feature, pause, reject or remove → customer updates.
- Account orders, listings, saved items, notifications, profile, addresses and demo password flows.
- One admin workspace for orders, payments, products, inventory, categories, brands, customers, moderation, reports, home content, pages, media, promotions, email template previews, bank and delivery settings, team roles and activity.
- Demo loading, empty, error and permission states. Reset demo restores original fixtures.

## Routes and implementation

`app/[[...path]]/page.tsx` dispatches the brief's public, auth, customer and admin URLs through `components/app.tsx`. Feature components are grouped into `site`, `commerce`, `account` and `dashboard`. Shared accessible dialogs use Radix/shadcn patterns. Checkout uses React Hook Form and Zod; TanStack Query handles mock reads, queued mutations and cache updates; Framer Motion handles the hero carousel.

Brand defaults and payment placeholders are in `lib/site-config.ts`. Fixtures and types are in `lib/data.ts`. Cross-screen mutations persist in browser localStorage (`torque-demo-v1`). The app synchronizes changes between tabs using storage events.

## Demo boundaries

- Browser data is a shared demonstration workspace, not secure multi-user authentication or authorization. Role controls are intentionally available to the reviewer.
- No real money should be sent. The WhatsApp link opens a prefilled message and does not send it automatically.
- Vehicle photos are illustrative Unsplash images, not verified photographs of the named cars. Parts and fluid packs use external product reference photos; direct links and source pages are in `lib/product-photos.ts`. Photos are illustrative, not verified inventory or exact fitment. External photographs need internet access and remain subject to the source host’s availability and usage terms.
- Image uploads stay in localStorage as data URLs and are limited to 8 images, 2 MB each. Browser storage limits can still be reached; errors preserve the current saved data.
- Admin team roles are editable previews, not production permission enforcement. Promotions and email templates are demo records; emails are not sent.
- Public policy text is demonstration copy. Replace it, the temporary brand, stock imagery and bank placeholders before production use.

The `atrium` reference project was inspected read-only. No reference-site source, brand assets or proprietary images were copied.
