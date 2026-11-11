# Implementation Plan: Customer-Wise Mobile Touch & Deal Gestures for Agoza

## 1. User Request & Intent Summary - COMPLETED ✅

The user requested **"More gestures customerwise"**, combining:
1. **Interactive Touch & Mobile Gestures**:
   - ✅ Swipe gestures on cards to Save, Offer, or Pass (with tactile directional visual cues).
   - ✅ Pull-to-refresh feed with Ethiopian coffee brewing Jebena & Roasted Beans animation.
   - ✅ Long-press on collectible cards to trigger instant Quick Inspection popover preview.
   - ✅ Pinch-to-zoom & pan gestures on item photos with Ethiopian authenticity watermark.
2. **Customer Appreciation & Deal-Making Gestures**:
   - ✅ **Handshake Agreement Animation** (*ደህና ሁን / የንግድ ስምምነት*) upon offer acceptance or deal locking.
   - ✅ **Ethiopian Coffee Blessing Token** (*የቡና ምርቃት / Buna Baraka*) granting customer appreciation perks and buyer confidence badges.
   - ✅ **Loyalty Coffee Bean Rewards** (*የቡና ፍሬ ማበረታቻ*) displaying collected roasted coffee bean points per completed safe trade.
   - ✅ **Interactive Counter-Offer Slider** with instant price differential and Birr calculations for real-time buyer-seller negotiation in `TradeOfferModal` and `ChatNegotiationDrawer`.

---

## 2. Completed Architecture & Components

* **`src/hooks/useTouchGestures.ts`**:
  - Touch event listeners with velocity and delta calculation.
  - Directional swipe detection (`onSwipeLeft`, `onSwipeRight`, `onSwipeUp`, `onSwipeDown`).
  - Long-press timer (420ms) with device haptic pulse (`navigator.vibrate?.([20])`).
* **`src/components/CustomerGestureCard.tsx`**:
  - Direct swipe gestures with color-tinted action reveal underlays:
    - Right swipe -> Emerald `Save (አስቀምጥ)`
    - Up swipe -> Gold `Quick Offer (ዋጋ አቅርብ)`
    - Left swipe -> Rose/Slate `Pass (እለፍ)`
  - Instant long-press detection triggering Quick Inspection preview.
* **`src/components/QuickInspectionModal.tsx`**:
  - High-fidelity zoom canvas supporting 2-finger pinch-to-zoom, double-tap zoom, and pan dragging.
  - Agoza Verified Seal watermark, key item specs, and 1-tap customer quick buttons (WCAG $\ge 44\text{px}$).
* **`src/components/PullToRefreshContainer.tsx`**:
  - Pull-down gesture detecting top-of-page scroll.
  - Rotating roasted coffee beans & steaming clay Jebena animation (*"ቡናውን እያፈላን ነው..."*).
* **`src/components/HandshakeDealModal.tsx`**:
  - Stylized Ethiopian deal handshake animation (*ደህና ሁን / የንግድ ስምምነት - የእጅ መጨባበጥ*).
  - Digital contract seal with verified buyer, seller, safe hub, and escrow checkout bridge.
* **`src/components/BunaBlessingToken.tsx`**:
  - Traditional Ethiopian coffee blessing ceremony (*የቡና ምርቃት*) with traditional Amharic blessings.
  - Customer Roasted Coffee Beans wallet with redeemable perks (0% escrow fee pass, priority inspection queue, spotlight boosts).
* **`src/components/CounterOfferSlider.tsx`**:
  - Integrated into `TradeOfferModal.tsx` and `ChatNegotiationDrawer.tsx`.
  - Live Ethiopian Birr calculations, discount savings, and cultural likelihood of acceptance gauge.

---

## 4. Pure E-Commerce P2P Transformation (Complete ✅)

- **Removed All Relics & Antique Relic Terminology**:
  - Replaced ancient relics ("Axumite coins", "parchments", "Lalibela crosses", "antique weapons", "imperial epoch", "rarity filters") with high-demand modern consumer categories: Smartphones & Tech, Laptops & Workstations, Vehicles & Hybrid Cars, Streetwear & Fashion, Home & Living, and Specialty Grade 1 Yirgacheffe Coffee.
  - Renamed "Historical Era" to **"Created"** with realistic generation options (2024-2025 Latest, 2020-2023, 2015-2019, Pre-2015).
  - Renamed all dropdowns and options to clean commercial labels.
- **Strict Frontend-Design Compliance**:
  - **Top Bar Contract**: 3 clear zones (Zone 1: Logo Wordmark; Zone 2: 4 single-line links - All Items, Safe Hubs, Buyer Protection, My Dashboard; Zone 3: City selector, Chat, Theme, and + Post P2P Ad CTA).
  - **Zero-Pill & Metadata Discipline**: Unboxed metadata (`Addis Ababa · Like New · 35 mins ago`), no pill sandwiches, no decorative status dots.
  - **Single Retained Swipe Gesture**: Card swiping strictly keeps Right Swipe to Save (Watchlist) with green tactile underlay and removes pass/offer drag conflicts per user specification.
- **Medium Roasted Coffee Dark Theme**:
  - Crisp dark theme anchored in warm coffee tones (`#1e130c`, `#251810`, `#d4a373`) with custom coffee bean, Jebena, and Jonia burlap sac vector icons.
- **Verification**: `tsc --noEmit` and Vite production build verified with 0 errors.
