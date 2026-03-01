# Brew & Bloom — 3D Coffee Shop Website

A stunning, fully responsive 3D coffee shop static website built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript** — no frameworks, no build tools required.

## ✨ Features

| Section | Highlights |
|---|---|
| **Hero** | Full-screen landing with a 3D animated CSS coffee cup, rising steam, mouse parallax depth effect, and scroll parallax |
| **About** | Brand story with an interactive 3D tilt floating card and animated stats |
| **Menu** | Tabbed 3D card grid (Hot Drinks, Cold Drinks, Pastries) with hover lift effect |
| **Why Us** | CSS 3D flip cards on hover revealing extra detail |
| **Gallery** | 3D perspective carousel with auto-play, keyboard & touch/swipe support |
| **Testimonials** | Auto-advancing review slider with touch support |
| **Contact** | Info cards, stylised map placeholder, validated contact form |
| **Footer** | Social links, quick nav, opening hours, dynamic year |

### 3D Effects
- CSS `perspective` + `transform: rotateX/Y/Z` on cards and the hero cup
- `@keyframes` floating/bobbing and steam-rise animations
- JavaScript mouse-move parallax on the hero section
- JavaScript scroll parallax (hero content & cup)
- Scroll-triggered reveal animations via **Intersection Observer API**
- Touch/swipe gesture support on the carousel and testimonial slider

## 🎨 Design

| Token | Value | Usage |
|---|---|---|
| Espresso Brown | `#2C1810` | Primary background |
| Coffee Brown | `#6F4E37` | Secondary surfaces |
| Caramel Gold | `#D4A574` | Accent / CTA colour |
| Cream White | `#FFF8F0` | Body text / light surfaces |
| Near Black | `#1A0A00` | Dark text on light backgrounds |

**Fonts:** Playfair Display (headings) · Poppins (body) — via Google Fonts

## 📁 File Structure

```
/
├── index.html        ← Single-page markup (all 8 sections)
├── css/
│   └── style.css     ← All styles: layout, 3D transforms, animations, responsive
├── js/
│   └── main.js       ← All interactivity: parallax, carousel, sliders, form
└── README.md
```

## 🚀 Getting Started

No build step needed — just open the file in a browser.

### Option 1 — Double-click
Open `index.html` directly in any modern browser.

### Option 2 — Local dev server (recommended to avoid CORS on fonts)
```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```
Then visit `http://localhost:8080`.

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `> 1024 px` | Full desktop — side-by-side grids, visible 3D cup |
| `≤ 1024 px` | Tablet — single-column grids, reduced cup opacity |
| `≤ 768 px` | Mobile — hamburger nav, hidden cup, stacked cards |
| `≤ 480 px` | Small mobile — vertical CTA stack, single-column features |

## 🌐 Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge). Requires CSS `perspective` and `transform-style: preserve-3d` support.
