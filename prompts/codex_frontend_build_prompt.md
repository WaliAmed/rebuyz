# Codex Frontend Build Prompt - Automotive Commerce + Customer Vehicle Marketplace

You are working on a **frontend-only, production-quality UI prototype** for a new automotive commerce website. Build the complete website experience, including all public pages, authentication screens, customer dashboard, super-admin dashboard, and all important user/admin scenarios in a working demo state.

## 1. Read this first - non-negotiable requirements

1. This task is **FRONTEND UI ONLY**.
2. Do **not** build a real backend, database, payment gateway, email service, or real authentication provider.
3. Every important interaction must still work in the frontend using mock services/state so the project feels like a complete working product demo rather than static screenshots.
4. The public landing page must recreate the **layout, spacing rhythm, responsiveness, section order, interaction patterns, and animation feel** of this reference as closely as possible:
   - https://demo.pixelaxis.net/rebuyz/
5. Do not copy the reference website's source code, branding, logo, text, or proprietary image assets. Recreate the visual structure and interaction behavior using original automotive content and images.
6. The entire site must be **fully responsive** on mobile, tablet, laptop, desktop, and large desktop screens. No horizontal overflow and no broken dashboard layouts.
7. Use high-quality automotive imagery: auto parts, oils/fluids, used vehicles, damaged vehicles, workshops, headlights, engines, transmissions, steering parts, etc.
8. Use realistic mock data throughout. Do not fill the UI with generic `Product 1`, `User 1`, or lorem ipsum.
9. All pages and dashboard screens must include realistic **loading, empty, success, error, validation, permission, modal, confirmation, dropdown, toast, and responsive states** where relevant.
10. Do not stop after the home page. Complete the entire route map in this document.

---

# 2. Existing project references

## A. Public-site visual reference

Use the following website as the main home-page design/interaction reference:

https://demo.pixelaxis.net/rebuyz/

Before coding the home page:

- inspect the reference carefully in desktop and mobile widths;
- understand the top announcement area, header, category/search area, navigation, hero carousel, product tabs, promotional blocks, countdown/flash-sale style sections, category sections, recommendations, testimonial carousel, FAQ, latest articles and footer;
- reproduce the layout proportions and transitions as closely as possible while converting all content to the automotive business described below;
- inspect hover behavior, section spacing, card styling, slider motion, arrows, pagination dots, sticky/header behavior, dropdowns and mobile menu behavior;
- use browser screenshots while building and compare the result section-by-section.

The target should feel like an **automotive version of the reference design**, not merely a loosely inspired ecommerce template.

## B. Local `atrium` project reference

There is another project here:

`C:\Users\Wali\Documents\GitHub\atrium`

Treat this folder as **read-only reference material**.

Inspect it specifically for:

- authentication page layout;
- login/register visual hierarchy;
- SSO button patterns;
- password recovery / verification flows;
- dashboard shell and sidebar behavior;
- mobile dashboard navigation;
- card/grid patterns;
- dashboard headers/toolbars;
- tables, filters and action menus;
- settings/profile pages;
- general density and spacing choices.

Do **not** modify the `atrium` project.

Do not duplicate its branding/theme. Use it only to understand the kind of clean dashboard and auth experience wanted for this new project.

Important difference: the new project has **one super-admin dashboard**, not the two-dashboard arrangement used by the single super admin in `atrium`.

---

# 3. Product concept

The platform combines two experiences in one site.

## Business-owned ecommerce store

The business itself sells automotive inventory, including examples such as:

- ATF oil;
- CVT oil;
- used auto parts;
- used cars;
- damaged cars;
- future automotive products/categories.

Business-owned products can be browsed, added to cart and checked out.

There is **no online payment gateway** in this version.

The checkout flow is:

1. buyer selects business products;
2. buyer adds them to cart;
3. buyer completes checkout;
4. the website creates an order;
5. the order confirmation screen shows bank-transfer instructions;
6. a WhatsApp button lets the buyer send the payment screenshot to the business;
7. the order remains Pending Payment / Payment Verification;
8. a super admin later verifies the payment manually and updates the order status;
9. the customer sees updated payment/delivery progress in the dashboard.

For the frontend demo, simulate all of those states.

## Customer vehicle marketplace

Registered customers can also publish their own cars for sale, in a classified-listing experience similar in purpose to OLX.

A customer vehicle listing is **not** treated like a normal ecommerce cart item.

Instead:

1. a user publishes a car;
2. admin moderation can approve it;
3. the listing becomes public;
4. interested buyers open the vehicle detail page;
5. they can save/share/report it;
6. they can contact the seller using in-app chat;
7. they can press `Show Number` if the seller made a phone number available.

No marketplace payment/escrow flow is required.

---

# 4. Required frontend stack

Use the existing versions in the target repository where available. Do not downgrade working dependencies simply to match this list.

Core:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Lucide icons
- TanStack Table for complex dashboard tables if useful
- Recharts for dashboard charts if needed
- date-fns for date formatting if needed
- shadcn/Embla carousel for sliders where appropriate

State/demo architecture:

- Use a small, clean mock service layer for frontend data requests.
- Use TanStack Query for fetching, mutation states, cache updates and loading states.
- Use localStorage for demo persistence where it improves the experience: cart, favorites, created listings, mock orders, notification read state and mock account state.
- A lightweight client store/context can be used for cart/auth UI state if needed, but do not overengineer it.
- Do not introduce a fake full backend framework or unnecessary abstraction layers.

---

# 5. Global design direction

Create a premium automotive visual identity while respecting the structure of the ReBuyZ reference.

Use:

- strong dark neutral / deep automotive color base;
- one bold accent color;
- large product imagery;
- strong headings;
- clean cards;
- premium but practical dashboard styling;
- subtle borders;
- polished hover and focus states;
- smooth animations, never excessive motion.

Centralize changeable brand data in something like `siteConfig`:

- brand name;
- logo text/image;
- phone;
- email;
- WhatsApp number;
- bank details placeholder;
- default currency;
- primary address;
- social links.

Use a temporary automotive brand name if one has not already been provided, but make it easy to change from one place.

---

# 6. Home page - match the reference structure closely

The landing page is the highest-priority visual page.

Reproduce the overall structure and animation style of the reference site and adapt each section to automotive content.

## Global header area

Create:

- top announcement/contact strip;
- phone and email;
- promotion message;
- main desktop header;
- category dropdown;
- large product search field;
- account button;
- favorites button;
- cart button with count;
- clear `Sell Your Car` CTA;
- desktop navigation;
- mobile menu;
- cart drawer / mini-cart;
- search suggestions UI;
- category mega-menu/dropdown.

Suggested public navigation:

- Home
- Shop
- Auto Parts
- Oils & Fluids
- Used Cars
- Damaged Cars
- Customer Marketplace
- Sell Your Car
- About
- Contact

## Hero slider

Create three automotive slides with the same overall layout behavior as the reference hero slider.

Examples:

- premium ATF / CVT oil campaign;
- used auto parts campaign;
- used/damaged vehicle inventory campaign.

Include:

- animated text entry;
- CTA buttons;
- slide navigation arrows;
- pagination/slide index;
- responsive crop/layout behavior.

## Featured business products section

Adapt the reference product section to business inventory.

Tabs can include:

- All Products
- New Arrivals
- Hot Deals
- Used Parts
- Oils & Fluids

Cards should support:

- image carousel/alternate image on hover if appropriate;
- condition badge;
- discount badge;
- product category;
- title;
- rating mock;
- current/old price;
- favorite;
- quick view;
- add to cart;
- choose options for variant-style items.

## Editorial / large feature area

Use a premium automotive feature banner analogous to the large editorial feature in the reference.

Example: `Drive Better. Maintain Smarter.` with transmission-fluid imagery or a high-end part.

## Recommended section

Tabs such as:

- Best Selling
- Featured
- New Arrivals

## Moving ticker / promo strip

Add a polished marquee/ticker similar in spirit to the reference.

Example messages:

- New used engines arrived this week
- Free inspection support on selected business vehicles
- Genuine transmission fluids now in stock

## Flash sale / countdown section

Adapt countdown visuals to an automotive sale campaign.

The countdown must actually tick in the frontend.

## Popular automotive categories

Use automotive category cards/icons/images such as:

- ATF Oil
- CVT Oil
- Engine Parts
- Suspension
- Steering
- Lights
- Body Parts
- Electrical
- Used Cars
- Damaged Cars

## Promotional banners

Use multiple layouts similar to the reference promotional areas, with varied image crops and CTAs.

## Customer cars for sale

This is a new section that must integrate naturally into the home page.

Title examples:

- Cars Listed by Our Community
- Recently Listed Cars
- Customer Marketplace

Show vehicle cards with:

- photo;
- price;
- title;
- year;
- mileage;
- transmission;
- location;
- posting time;
- favorite;
- seller badge/type;
- click to detail page.

Include `View All Cars` and `Sell Your Car` CTAs.

## Testimonials

Build an animated testimonial/carousel section matching the sophistication of the reference.

## FAQ

Accordion with realistic questions such as:

- How do manual payments work?
- How long does payment verification take?
- Can I return a used part?
- How do I list my car?
- Does the platform collect payment for customer vehicle listings?
- Can I hide my phone number?

## Latest stories / guides

Create blog/article cards for automotive content:

- how to choose ATF fluid;
- signs a CVT needs service;
- checklist before buying a used car.

## Footer

Create a complete responsive footer with:

- logo/about;
- shopping categories;
- marketplace links;
- customer support;
- legal links;
- contact;
- social links;
- newsletter form UI if useful;
- copyright.

---

# 7. Public route map

Implement all of the following routes with complete responsive UI.

## Store / ecommerce

- `/`
- `/shop`
- `/shop/[category]`
- `/product/[slug]`
- `/search`
- `/cart`
- `/checkout`
- `/order-success/[orderId]`
- `/track-order`

## Customer marketplace

- `/marketplace`
- `/marketplace/[slug]`
- `/seller/[sellerId]`
- `/sell`

## Information / content

- `/about`
- `/contact`
- `/faqs`
- `/shipping-delivery`
- `/returns-refunds`
- `/marketplace-rules`
- `/terms`
- `/privacy`
- `/blog`
- `/blog/[slug]`

Also make a designed 404 page.

If the existing project has a different route convention, adapt intelligently but keep all functionality represented.

---

# 8. Shop page

Create a polished automotive catalogue.

Desktop:

- heading/breadcrumb;
- category intro banner;
- left filter sidebar or reference-appropriate filter UI;
- result count;
- sort control;
- grid/list toggle if visually useful;
- responsive product grid.

Mobile:

- filter drawer/sheet;
- sort sheet/dropdown;
- easy reset filters.

Store filters should include useful combinations of:

- category;
- price;
- brand;
- condition;
- availability;
- vehicle make;
- vehicle model;
- compatible year;
- oil/fluid specification;
- item type.

Show active filter chips and Clear All.

---

# 9. Product detail page

Make the product page detailed and automotive-specific.

Include:

- breadcrumbs;
- image gallery;
- thumbnails;
- zoom/lightbox UI;
- title;
- rating mock;
- SKU/part number;
- condition;
- current/old price;
- stock;
- quantity;
- add to cart;
- buy/contact alternative for business vehicles where useful;
- favorite/share;
- shipping/delivery summary;
- compatibility information;
- tabs/sections for description, specifications, compatibility, delivery/returns and reviews;
- related products;
- recently viewed mock section.

Examples of specs by category:

### Oil
- type;
- specification/grade;
- pack size;
- suitable transmission/vehicle notes.

### Used part
- donor vehicle;
- compatible vehicles;
- part number;
- condition;
- visible wear notes.

### Business-owned vehicle
- make;
- model;
- year;
- mileage;
- transmission;
- fuel;
- engine;
- city;
- registration;
- condition.

---

# 10. Cart and checkout

## Cart

Must support:

- quantity adjustment;
- remove item;
- empty cart;
- subtotal;
- delivery estimate placeholder;
- total;
- continue shopping;
- checkout;
- mini-cart/drawer synchronization.

Persist cart state locally.

## Checkout

Create a realistic checkout form with validation:

- full name;
- email;
- phone;
- address;
- city;
- optional order note;
- sign-in prompt if user already has an account;
- optional account creation path for guest;
- delivery selection UI;
- order summary.

Payment method in this prototype:

**Bank Transfer / Manual Payment only.**

Show a clean explanation before order placement.

When `Place Order` is pressed:

- validate form;
- simulate mutation/loading;
- create a mock order;
- clear purchased cart items;
- redirect to order success page.

---

# 11. Order success / manual payment screen

This screen is important.

Show:

- success icon;
- order number;
- amount due;
- order summary;
- customer email/phone;
- delivery address;
- bank name placeholder;
- account title placeholder;
- account number/IBAN placeholder;
- payment-reference/order number;
- `Copy` buttons;
- clear instructions to send the bank-transfer screenshot through WhatsApp;
- `Send Payment Proof on WhatsApp` button;
- dashboard/order-tracking button.

The WhatsApp link should be generated from `siteConfig` and include a prefilled message such as:

`Hello, I have paid for order #ORD-1048. I am sending the payment screenshot here.`

This is frontend only; do not integrate WhatsApp API.

---

# 12. Customer marketplace page

Build a classifieds-style vehicle marketplace while keeping the new site's visual identity.

Include:

- page banner/title;
- search;
- location/city;
- make;
- model;
- year range;
- price range;
- mileage range;
- transmission;
- fuel type;
- body type;
- condition;
- sort newest/price;
- filter chips;
- clear all;
- mobile filters.

Vehicle card content:

- primary image;
- price;
- title;
- year;
- mileage;
- transmission;
- city/location;
- posted time;
- seller/member badge;
- favorite button.

Add a prominent `Sell Your Car` CTA.

---

# 13. Marketplace vehicle detail page

Use a layout similar in purpose to a professional classifieds listing page.

Include:

- image gallery with count;
- featured badge where relevant;
- price;
- title;
- location;
- posted time;
- favorite;
- share;
- specifications grid;
- vehicle description;
- damage/repair notes when present;
- seller card;
- `Chat` button;
- `Show Number` button;
- report listing;
- seller's other listings;
- similar cars.

`Show Number` behavior:

- initially show `Show Number`;
- click reveals the mock phone number;
- if the listing has phone visibility disabled, show a polite message to use chat instead.

`Chat` behavior:

- signed-out visitor -> auth modal/page prompt;
- signed-in customer -> create/open mock conversation tied to this listing.

Report behavior:

- modal with report reasons;
- notes field;
- submit success toast;
- the report should become visible in the mock admin Reports page.

---

# 14. Sell Your Car flow

Build `/sell` as a polished multi-step wizard that works particularly well on mobile.

Suggested steps:

1. Vehicle
2. Condition
3. Photos
4. Price & Location
5. Contact Preferences
6. Preview & Submit

Collect realistic fields:

- listing title;
- make;
- model;
- variant/trim;
- year;
- body type;
- fuel;
- transmission;
- engine;
- mileage;
- color;
- registration status;
- overall condition;
- accident/damage notes;
- price;
- city/location;
- description;
- photos;
- allow chat toggle;
- show phone number toggle.

Frontend image behavior:

- allow local image preview using object URLs;
- sortable/reorderable thumbnails if practical;
- choose cover image;
- remove image;
- image count limits;
- upload progress simulation.

Final step:

- show a full public-listing preview;
- Submit Listing button;
- mutation/loading state;
- create mock listing with status `Pending Review`;
- persist it locally;
- show confirmation and link to My Listings.

If user is signed out, require/mock sign-in before continuing.

---

# 15. Authentication screens

Inspect `C:\Users\Wali\Documents\GitHub\atrium` before implementing these.

Use the same general quality level and UX patterns, but different automotive branding/theme.

Required routes/screens:

- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/verify-email`
- `/auth/forgot-password`
- `/auth/reset-password`

Create:

- email/phone + password fields;
- password show/hide;
- remember me;
- terms checkbox where appropriate;
- validation;
- success/error states;
- Google SSO button;
- Apple SSO button;
- optional divider `or continue with`;
- links between auth screens.

This is mock authentication only.

Implement a simple frontend auth state supporting:

- signed out;
- customer;
- super admin.

SSO buttons should behave as demo actions, for example show loading then sign in as a seeded user.

Do not configure real Google/Apple credentials.

---

# 16. Customer dashboard

Create a responsive customer dashboard shell inspired by the good parts of the Atrium dashboard layout.

Desktop:

- sidebar;
- top header;
- breadcrumbs/page title;
- notification indicator;
- account menu.

Mobile:

- drawer/sheet sidebar;
- compact header;
- fully usable content widths.

Required routes:

- `/account`
- `/account/orders`
- `/account/orders/[orderId]`
- `/account/listings`
- `/account/listings/new`
- `/account/listings/[listingId]/edit`
- `/account/messages`
- `/account/messages/[conversationId]`
- `/account/favorites`
- `/account/notifications`
- `/account/profile`
- `/account/addresses`
- `/account/security`

## Account overview

Show:

- active/recent orders;
- pending payment state;
- active listings;
- pending listings;
- unread messages;
- favorites;
- recent notifications;
- quick actions: Track Order / Sell Your Car / View Messages.

## My Orders

Table/cards with:

- order number;
- date;
- total;
- payment status;
- fulfilment status;
- delivery status;
- view action.

Seed multiple scenarios:

- Pending Payment;
- Payment Under Review;
- Paid / Preparing;
- Shipped;
- Delivered;
- Needs Attention;
- Cancelled.

## Order Detail

Show:

- progress timeline;
- items;
- totals;
- address;
- bank-transfer instructions while unpaid;
- payment status;
- delivery status;
- courier/tracking when shipped;
- order status history;
- support/WhatsApp action.

## My Listings

Tabs/filters:

- All
- Draft
- Pending Review
- Live
- Changes Required
- Paused
- Sold

Each listing supports the appropriate mock actions:

- edit;
- preview;
- pause/resume;
- mark sold;
- delete/archive;
- view messages.

## Messages

Build a realistic chat UI:

- conversation sidebar/list;
- listing thumbnail/title in conversation header;
- buyer/seller names;
- message bubbles;
- timestamps;
- unread state;
- compose input;
- send button;
- mobile responsive behavior.

Sent messages should appear immediately and persist in mock state/localStorage.

## Favorites

Mix saved business products and saved marketplace vehicles clearly.

## Notifications

Filter read/unread and support mark all read.

## Profile / Addresses / Security

All forms should work with frontend validation and success toasts.

---

# 17. Super-admin dashboard

Create exactly **one** super-admin dashboard shell.

Use Atrium for layout inspiration but create original styling for this automotive project.

Required routes:

- `/admin`
- `/admin/orders`
- `/admin/orders/[orderId]`
- `/admin/payments`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[productId]`
- `/admin/categories`
- `/admin/inventory`
- `/admin/brands`
- `/admin/customers`
- `/admin/customers/[customerId]`
- `/admin/marketplace`
- `/admin/marketplace/[listingId]`
- `/admin/reports`
- `/admin/content/home`
- `/admin/content/pages`
- `/admin/media`
- `/admin/promotions`
- `/admin/notifications`
- `/admin/settings/payment`
- `/admin/settings/delivery`
- `/admin/team`
- `/admin/activity`
- `/admin/settings`

## Admin overview

Show realistic KPI cards such as:

- orders today;
- pending payment verification;
- paid orders;
- revenue mock;
- low-stock items;
- pending marketplace listings;
- active marketplace listings;
- unresolved reports;
- customers.

Add:

- recent orders table;
- pending payment panel;
- marketplace approvals panel;
- sales chart;
- category/order chart if useful;
- recent activity.

## Orders

Complex table with:

- order ID;
- customer;
- date;
- amount;
- payment status;
- fulfilment status;
- delivery status;
- actions.

Filters/search/date range.

## Admin order detail

Show:

- customer;
- items;
- amount;
- address;
- payment state;
- order notes;
- status timeline;
- courier/tracking;
- internal notes;
- action menu.

Working frontend actions:

- Mark Payment Verified;
- Mark Not Verified;
- Needs Attention;
- Mark Preparing;
- Mark Shipped;
- Out for Delivery;
- Delivered;
- Cancel Order.

Each action must update the UI and add a mock activity-log entry.

When payment status changes, add a mock notification to the customer account.

## Payments page

Focus on bank-transfer review queue:

- order;
- customer;
- amount;
- created time;
- payment status;
- WhatsApp-proof status placeholder;
- review action.

Because payment proof is actually sent externally on WhatsApp, the UI can show admin controls such as:

- Proof Checked;
- Verified;
- Needs Attention;
- Not Verified.

## Products

Product management table and full create/edit form.

Fields should adapt to product type.

Common:

- title;
- slug;
- category;
- brand;
- SKU/part number;
- price;
- sale price;
- condition;
- stock;
- images;
- short/full description;
- featured status;
- published status.

Automotive compatibility:

- compatible makes;
- models;
- years;
- compatibility note.

Oil fields:

- fluid type;
- grade/specification;
- volume/pack size.

Vehicle fields:

- make;
- model;
- year;
- mileage;
- transmission;
- fuel;
- engine;
- city;
- registration;
- condition.

## Categories

Tree/list UI for categories and subcategories.

Seed:

- Oils & Fluids
  - ATF Oil
  - CVT Oil
- Used Parts
  - Engine Parts
  - Suspension
  - Steering
  - Electrical
  - Lights
  - Body Parts
- Vehicles
  - Used Cars
  - Damaged Cars

Support mock add/edit/delete/reorder.

## Inventory

Show stock table, low-stock badges, quick stock adjustment and item availability.

## Customers

Table and customer detail screen with:

- account information;
- order history;
- listings;
- messages count;
- flags/reports;
- account status;
- admin notes.

## Marketplace moderation

Queue with:

- listing image;
- seller;
- vehicle;
- price;
- city;
- submitted date;
- status.

Listing review page must show complete listing preview and actions:

- Approve;
- Reject;
- Request Changes;
- Pause/Remove;
- Feature/Unfeature.

On Request Changes / Reject, open a reason dialog.

Actions update the seller's My Listings state and create a notification.

## Reports

Show reported listings/messages with:

- reason;
- reporter;
- listing;
- seller;
- created time;
- status;
- review notes;
- resolve/dismiss/remove listing actions.

## Home content management

Build an interface for controlling mock home sections:

- hero slides;
- featured categories;
- featured products;
- marketplace highlights;
- promo banners;
- testimonials;
- FAQs;
- latest stories.

This can be a functional demo form/list system. Changes should update preview data if practical.

## Site pages

Manage simple content-page records for About, Delivery, Returns, Terms, Privacy and Marketplace Rules.

## Media

Responsive media library UI with upload simulation, search, type filter, select/delete.

## Promotions

Manage promo banners, sale labels, featured items and campaign date ranges.

## Notifications

Show configurable email-template previews for:

- order placed;
- payment instructions;
- payment verified;
- payment issue;
- shipped;
- delivered;
- listing approved;
- listing changes required.

Frontend preview/editor only.

## Payment settings

Form for:

- bank name;
- account holder;
- account number;
- IBAN;
- WhatsApp payment number;
- checkout payment instructions.

Changes should update the manual-payment demo UI.

## Delivery settings

Form/cards for:

- delivery zones;
- delivery fee;
- free delivery threshold;
- courier names;
- estimated time ranges;
- pickup option if desired.

## Admin team

Team-member table with role/permissions UI.

Seed roles such as:

- Super Admin
- Order Manager
- Catalogue Manager
- Marketplace Moderator

Frontend role editing only.

## Activity log

Chronological list/table of mock admin actions:

- payment verified;
- order status changed;
- product edited;
- listing approved;
- listing rejected;
- report resolved;
- settings updated.

---

# 18. Mock data

Create enough realistic mock data that every screen feels populated.

## Business products examples

Use realistic names similar to:

- Toyota Genuine ATF WS 4L
- Honda HCF-2 CVT Fluid 4L
- Nissan NS-3 CVT Fluid
- Toyota Corolla 2018 LED Headlight - Used
- Prius 2016 Inverter Assembly - Used
- Honda Civic Steering Rack - Used
- Toyota Aqua ABS Pump - Used
- Front Brake Pad Set
- Used 1NZ-FE Engine Assembly
- Toyota Vitz Tail Light Pair

## Business-owned vehicles

Examples:

- Toyota Aqua 2018 - Business Stock
- Honda Vezel 2017 - Used
- Toyota Prius 2020 - Damaged / Repairable

## Customer marketplace listings

Examples:

- Suzuki Alto VXL 2022
- Toyota Corolla Altis 2019
- Honda Civic Oriel 2020
- Kia Sportage AWD 2021
- Toyota Yaris ATIV 2021
- Honda City Aspire 2018
- Toyota Prado TX 2016
- Daihatsu Mira 2020

Each should have complete specs, city, seller, description and photo set.

## Orders

Seed multiple orders covering every major status.

## Customers

Seed multiple customers with different combinations of purchases/listings/messages.

## Admin activity

Seed realistic recent actions.

---

# 19. Frontend scenario system

The goal is for someone reviewing the UI to be able to demonstrate the whole platform without a backend.

Create a simple development/demo mechanism for switching roles and scenarios.

This can be one of:

- a small `Demo` menu available only in development;
- a hidden `/demo` page;
- a query-param/dev helper.

Support at least:

- Signed Out Visitor
- Customer: Buyer Only
- Customer: Seller with Pending Listing
- Customer: Seller with Live Listings
- Super Admin

Do not let the demo control harm the real design.

---

# 20. Required working scenarios

Test every scenario manually in the UI.

## Store

1. Browse home page.
2. Open shop.
3. Apply filters.
4. Open product detail.
5. Favorite product.
6. Add to cart.
7. Update cart quantity.
8. Checkout.
9. Submit checkout form.
10. See manual-payment order-success page.
11. Open WhatsApp proof link.
12. View order in customer dashboard.

## Customer account

1. Sign up using mock form.
2. Mock Google SSO sign-in.
3. Forgot password.
4. Update profile.
5. Add/edit address.
6. Save favorites.
7. Read notifications.

## Marketplace

1. Browse/filter marketplace.
2. Open vehicle listing.
3. Favorite/share.
4. Show phone number.
5. Start chat.
6. Send message.
7. Report listing.
8. Start Sell Your Car flow.
9. Complete all steps.
10. Preview listing.
11. Submit -> Pending Review.
12. See it in My Listings.

## Super admin

1. Open admin dashboard.
2. Review pending payment.
3. Mark payment verified.
4. Move order to Preparing/Shipped.
5. Add tracking.
6. Review pending marketplace listing.
7. Request changes.
8. Approve another listing.
9. Feature listing.
10. View report created by customer.
11. Resolve report.
12. Add/edit product.
13. Adjust stock.
14. Change bank settings and see updated checkout/payment info.
15. Review activity log.

---

# 21. Responsive acceptance criteria

Check at minimum these approximate viewport widths:

- 360/375 px
- 430 px
- 768 px
- 1024 px
- 1280 px
- 1440 px
- 1920 px

Requirements:

- no horizontal scrolling;
- no clipped dropdowns/modals;
- accessible touch targets;
- text does not overflow cards;
- desktop menus become clean mobile menus;
- dashboard sidebar becomes a drawer on small screens;
- data tables become horizontally managed or card-based where needed;
- product galleries remain usable;
- multi-step selling flow is easy on phone;
- checkout form is comfortable on phone;
- chat works at small widths.

---

# 22. Animations and interaction quality

Use Framer Motion/CSS transitions thoughtfully.

Recreate the reference's polished feel with:

- hero slide transitions;
- subtle reveal-on-scroll where appropriate;
- card hover image/transform effects;
- tab transitions;
- dropdown/mega-menu animation;
- cart drawer animation;
- modal/sheet animation;
- carousel motion;
- testimonial motion;
- FAQ accordion motion;
- animated count/countdown;
- dashboard hover/focus feedback;
- skeleton loading states.

Respect `prefers-reduced-motion` where practical.

Do not add random animations that make dashboard operations feel slow.

---

# 23. Accessibility and quality basics

Include:

- proper labels for form inputs;
- keyboard-focus styles;
- accessible buttons/links;
- alt text for meaningful images;
- adequate contrast;
- semantic headings;
- dialog/sheet behavior from shadcn;
- keyboard-accessible dropdowns where practical.

---

# 24. File/component organization

Keep the project clear and maintainable.

Suggested approach, adapted to the existing repo structure:

- `app/(public)/...`
- `app/(auth)/...`
- `app/account/...`
- `app/admin/...`
- `components/site/...`
- `components/store/...`
- `components/marketplace/...`
- `components/account/...`
- `components/admin/...`
- `components/ui/...`
- `data/...`
- `lib/mock-api/...`
- `lib/site-config.ts`
- `types/...`

Do not create abstraction layers just for the sake of abstraction. Reuse components where they actually reduce duplication.

---

# 25. Implementation process

Follow this order.

## Step 1 - inspect

Before changing code:

- inspect the current target repository;
- inspect package versions;
- inspect the ReBuyZ reference visually;
- inspect the Atrium auth/dashboard project read-only;
- identify reusable existing components in the target repo.

## Step 2 - define structure

Create:

- route map;
- site config;
- mock types;
- mock data;
- public shell;
- customer dashboard shell;
- admin dashboard shell.

## Step 3 - home page pixel/detail pass

Build the home page first and compare screenshots against the reference at desktop and mobile widths.

Do not move on with a generic-looking landing page.

## Step 4 - store pages

Build shop, product, cart, checkout, success/tracking.

## Step 5 - marketplace

Build marketplace browse/detail/seller/sell flow.

## Step 6 - auth and customer dashboard

Use Atrium as UX/layout inspiration.

## Step 7 - admin dashboard

Build all listed admin sections with working mock actions.

## Step 8 - state/scenarios

Connect mock mutations and persistence so scenarios work end-to-end.

## Step 9 - responsive pass

Check all major viewport sizes.

## Step 10 - quality pass

Fix:

- broken spacing;
- inconsistent cards;
- placeholder text;
- missing loading states;
- missing empty states;
- console errors;
- hydration warnings;
- invalid nesting;
- missing keys;
- accessibility warnings where practical.

---

# 26. Final completion checklist

Do not consider the task finished until all of these are true:

- [ ] ReBuyZ-inspired automotive home page is visually close in layout/animation behavior.
- [ ] Desktop and mobile headers are complete.
- [ ] All public routes exist.
- [ ] All auth routes exist.
- [ ] Customer dashboard is complete.
- [ ] Super-admin dashboard is complete.
- [ ] No second admin dashboard has been created.
- [ ] Store browsing/filtering works.
- [ ] Product details are automotive-specific.
- [ ] Cart works and persists.
- [ ] Checkout validates and creates a mock order.
- [ ] Manual bank-payment instructions are shown.
- [ ] WhatsApp proof CTA works with a generated link.
- [ ] Customer can view order status.
- [ ] Customer marketplace is separate from store checkout.
- [ ] Marketplace filters work.
- [ ] Show Number interaction works.
- [ ] Chat works in mock state.
- [ ] Report listing works and appears in admin.
- [ ] Sell Your Car wizard works end-to-end.
- [ ] New listing appears as Pending Review.
- [ ] Admin can approve/reject/request changes.
- [ ] Listing status updates in customer dashboard.
- [ ] Admin can verify payment and change delivery statuses.
- [ ] Customer receives mock notifications from admin actions.
- [ ] Product/catalog/inventory pages work.
- [ ] Home-content management UI exists.
- [ ] Payment and delivery settings exist.
- [ ] Activity log exists.
- [ ] All tables/forms have useful empty/loading states.
- [ ] All major actions have toasts/dialog confirmations.
- [ ] No unresolved console errors.
- [ ] No horizontal overflow at required viewport widths.
- [ ] UI is polished enough to show directly to a client.

---

# 27. Final instruction

Do not produce only a plan or a collection of disconnected UI pages.

**Build the frontend.**

Make the prototype feel like one cohesive, high-quality automotive commerce product with:

- an ecommerce store owned by the business;
- a customer-to-customer car marketplace;
- manual bank-payment ordering;
- customer accounts;
- buyer/seller chat;
- a complete customer dashboard;
- one complete super-admin dashboard;
- realistic mock data;
- fully working frontend scenarios;
- excellent responsive behavior;
- a home page closely matching the selected reference site's layout and animation quality.

When implementation is complete, run the project, test the main scenarios, fix visual/runtime issues, and provide a concise summary of what was completed and any genuinely unavoidable limitations.
