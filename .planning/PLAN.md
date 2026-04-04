# PLAN — Redesign Premium Light Mode (Os Oliveiras)

## Goal
Adapt the loja-premium.jsx reference layout to light mode across the home page and catalog, elevating visual quality to match premium Shopify stores without dark mode, caramelo, or emojis.

## Design Tokens (immutable)
- Background: `#FFFFFF` / `#F8FAFC`
- Accent dark: `#0F172A`
- Accent medium: `#475569`
- Green: `#059669`
- Red badge: `#DC2626`
- Border: `1px solid #E2E8F0`
- Fonts: Playfair Display (headings), DM Sans (body)

## Reference Adaptations (dark → light)
| Reference dark token | Os Oliveiras light |
|---|---|
| `var(--bg-card)` | `#FFFFFF` + `border-[#E2E8F0]` |
| `var(--primary)` / gradient-text | `#0F172A` bold |
| `var(--accent)` green | `#059669` |
| Avatar gradient bg | `bg-[#0F172A]` (navy) |
| `var(--bg-secondary)` | `#F8FAFC` |
| hover-lift shadow glow | `hover:shadow-lg hover:-translate-y-1` |

---

## Tasks

### TASK 1 — HeroSection.tsx (MAJOR UPGRADE)
**File:** `src/components/home/HeroSection.tsx`
**Reference:** HeroSection component (~line 870–1145 of loja-premium.jsx)

Replace current hero with a more dramatic layout:
- **Left column:** 
  - Social proof row: 5 gold stars + "4.8 · 424 avaliações verificadas"
  - Playfair Display heading 52px: "Sua segurança começa aqui." / italic "com quem você ama."  
  - Body text + trust dots (Entrega garantida, Parcele em 6x, PIX 5% OFF)
  - CTA buttons: "Ver Coleção" (navy filled pill) + "Comprar Agora" (border pill)
  - Floating stat cards at bottom-left: "+2.000 pedidos entregues" (white card, shadow)
- **Right column:**
  - `bg-[#F1F5F9]` rounded-3xl background shape
  - Hero product image with `animate-float` (already has this)
  - Floating badge top-right: "Mais Vendido" navy pill
  - Floating badge bottom-right: "✓ Compra 100% Segura" green card
- **Add scroll indicator** at bottom center: "Scroll" text + animated mouse icon (border div + floating dot)

Implementation notes:
- Keep `"use client"` + framer-motion (already imported)
- Add second floating badge (top-right of image)
- Scroll indicator: absolute bottom-8, flex-col, bounce animation via CSS

---

### TASK 2 — ProductCard.tsx (HOVER UPGRADE)
**File:** `src/components/catalog/ProductCard.tsx`

Adapt ProductCard with hover overlay from reference (line ~1150–1420):
- On hover: show semi-transparent overlay over image with "Ver Produto" button
- Add `sold count` below rating: `{product.reviewCount * 3} vendidos` (derived)
- Add PIX price line: `PIX R$ {fmt(product.pixPrice)}` with green Zap icon + `(5% OFF)`  
- Image hover scale already works (keep `group-hover:scale-[1.04]`)
- Quick-add overlay: `opacity-0 group-hover:opacity-100 transition-opacity` absolute bottom of image, `bg-[#0F172A]/80` strip with cart icon + "Adicionar"

Changes:
```tsx
// After rating div, before price:
<div className="flex items-center gap-1.5">
  <Zap className="w-3 h-3 text-[#059669]" />
  <span className="text-[11px] text-[#059669] font-semibold tabular-nums">
    PIX R$ {fmt(product.pixPrice)}
  </span>
  <span className="text-[10px] text-[#94A3B8]">(5% OFF)</span>
</div>
```
Add to image Link: overlay div (absolute inset-0, opacity-0 group-hover:opacity-100, flex items-end, navy strip at bottom with ShoppingCart + "Adicionar")

---

### TASK 3 — Testimonials.tsx (FULL REDESIGN)
**File:** `src/components/home/Testimonials.tsx`
**Reference:** ReviewsSection (~line 1817–2050)

Full redesign matching reference structure adapted to light mode:
- **Section header (centered):**
  - 5 gold stars row (24px)
  - Playfair Display heading 36–40px: "O que a família diz"
  - Subtext: "Mais de 2.000 pedidos entregues com 4.8 estrelas"
- **Review cards** (grid-cols-3, gap-8):
  - Avatar: `w-12 h-12 bg-[#0F172A] rounded-full` with white initials (replaces gradient)
  - Name + "✓ Compra Verificada" check mark (green)
  - Date (top-right, `text-[#94A3B8]`)
  - Stars row (right side of header)
  - Product tag: navy/light pill with Package icon + product name
  - Review text: `text-[#475569]` leading-relaxed
  - Card bg: `bg-white border border-[#E2E8F0] rounded-2xl p-8`
  - `hover:shadow-md hover:-translate-y-1 transition-all duration-200`
- Add 2 more reviews (total 5 rotating → show 3 on desktop grid, scroll on mobile)

---

### TASK 4 — TrustBar.tsx → BenefitsSection (REDESIGN)
**File:** `src/components/home/TrustBar.tsx`
**Reference:** BenefitsSection (~line 1518–1640)

Convert from 4-item center-aligned to 4-column asymmetric layout:
- **Section heading** (left-aligned): `text-[28px] font-playfair` "Por que escolher a Guardiã?"
- **4 benefit cards** in 2×2 grid or 4-col row:
  - `Zap` icon + "Arco Elétrico Potente" + description
  - `BatteryCharging` icon + "Recarregável USB" + description  
  - `ShieldCheck` icon + "Trava de Segurança" + description
  - `Scale` icon + "Legal no Brasil" + "Aprovado para uso civil em todo o país"
- Card style: `bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6`
- Icon container: `w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center` with white icon
- Section bg: `bg-white` with top border

---

### TASK 5 — ShippingBanner.tsx → PaymentHighlight (REDESIGN)
**File:** `src/components/home/ShippingBanner.tsx`
**Reference:** PaymentSection (~line 1620–1812)

2-column layout adapted to light:
- **Left column** (text):
  - Chip label: `bg-[#F1F5F9] rounded-full px-4 py-2` "Formas de Pagamento"
  - Playfair Display heading: "Pague do jeito que preferir"
  - Body: "Aceitamos PIX com 5% de desconto, cartão em até 6x sem juros e muito mais."
  - Payment method rows with icons: PIX | Visa | Mastercard | Elo
- **Right column** (navy card):
  - `bg-[#0F172A] rounded-2xl p-10 text-white`
  - "Pagamento via PIX" small label
  - "5% OFF" huge bold
  - "Instantâneo e Seguro" subtext
  - `bg-white/10 rounded-xl p-5` inner card: Zap icon + "Aprovação Imediata" / "Seu pedido é processado na hora"
- Section bg: `bg-[#F8FAFC] py-20`

---

### TASK 6 — ProductScroll.tsx (SECTION HEADER UPGRADE)
**File:** `src/components/home/ProductScroll.tsx`

Minor upgrade — section header improvements:
- Add pill label above title: `bg-[#F1F5F9] text-[#475569] text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest`
- Title → Playfair Display `font-playfair` instead of font-bold
- Subtitle → `text-[#94A3B8]` 
- "Ver Todos" button → match pill style `border border-[#0F172A] text-[#0F172A]`
- Keep scrollable cards as-is (they work well)

---

### TASK 7 — home/page.tsx (SECTION ORDER)
**File:** `src/app/page.tsx`

Re-order and clean up section composition after redesigns:
```tsx
<HeroSection />          // Task 1
<AnnouncementBar />      // keep
<ProductScroll title="Mais Vendidos" subtitle="Os favoritos da família" />  // Task 6  
<TrustBar />             // Task 4 (now BenefitsSection)
<FeaturedBanner />       // keep
<ProductScroll title="Novidades" subtitle="Confira o que acabou de chegar" />
<ShippingBanner />       // Task 5 (now PaymentHighlight)
<Testimonials />         // Task 3
<BrandStory />           // keep
```

Remove `CategoryGrid` if layout feels crowded after upgrades.

---

## Execution Order
1. Task 3 (Testimonials) — self-contained, no deps, high visual impact
2. Task 4 (TrustBar/Benefits) — self-contained, high impact
3. Task 5 (ShippingBanner/Payment) — self-contained  
4. Task 2 (ProductCard) — affects catalog + home
5. Task 6 (ProductScroll header) — small, quick
6. Task 1 (HeroSection) — largest, last (builds on correct card + section styles)
7. Task 7 (page.tsx order) — final cleanup

## Acceptance Criteria
- [ ] Home page renders all sections without errors
- [ ] No dark mode colors (`#111111` or dark bg) on home page
- [ ] All `#111111` occurrences replaced with `#0F172A`
- [ ] ProductCard shows PIX price + hover overlay
- [ ] Testimonials shows navy avatar initials + product tag
- [ ] TrustBar shows icon-in-navy-box pattern + section heading
- [ ] ShippingBanner shows 2-col layout with navy PIX card right
- [ ] HeroSection has 2 floating badges + scroll indicator
- [ ] `rtk next build` passes with 0 TypeScript errors
