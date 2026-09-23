# Design Tokens Reference

**For:** Core Cash Treasury Intelligence SPA → Next.js + Tailwind CSS Migration

This document defines all CSS custom properties (design tokens) extracted from `corecash-spa-v7.html`. Use these to configure `tailwind.config.ts` and `globals.css`.

---

## Color Palette

### Primary Colors
| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| `--blue` | `#0057D9` | Primary actions, links, active states, primary badges |
| `--blue-lt` | `#EBF2FF` | Blue background, hover states, light backgrounds |
| `--blue-bd` | `rgba(0,87,217,.2)` | Blue borders, dividers |

### Status Colors
| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| `--green` | `#059669` | Success, positive status, approved, passing checks |
| `--green-lt` | `#ECFDF5` | Green background, success alerts |
| `--green-bd` | `rgba(5,150,105,.2)` | Green borders |
| `--amber` | `#D97706` | Warning, caution, moderate risk, attention needed |
| `--amber-lt` | `#FFFBEB` | Amber background, warning alerts |
| `--amber-bd` | `rgba(217,119,6,.22)` | Amber borders |
| `--red` | `#DC2626` | Error, critical, danger, rejection |
| `--red-lt` | `#FEF2F2` | Red background, error alerts |
| `--red-bd` | `rgba(220,38,38,.2)` | Red borders |

### Info Color
| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| `--info` | `#0369A1` | Informational messages, tooltips, hints |
| `--info-lt` | `#F0F9FF` | Info background |
| `--info-bd` | `rgba(3,105,161,.2)` | Info borders |

### Neutral Colors (Backgrounds & Text)
| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| `--bg` | `#F4F6FA` | Page background, app background |
| `--sur` | `#FFF` | Surface/card background, modals |
| `--elv` | `#F8F9FC` | Elevated background, section headers, input backgrounds |
| `--hov` | `#EEF1F7` | Hover state background, subtle highlight |

### Text Colors
| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| `--t1` | `#0F1728` | Primary text, headings, strong emphasis |
| `--t2` | `#4B5675` | Secondary text, body copy, descriptions |
| `--tm` | `#9AA3B5` | Tertiary/muted text, labels, metadata, hints |

### Border Colors
| Token | Value | Hex | Use Case |
|-------|-------|-----|----------|
| `--b0` | `#E8ECF4` | Light borders, dividers, table borders |
| `--b1` | `#D1D9EC` | Stronger borders, input borders, focus outlines |

---

## Typography

### Font Families
| Token | Value | Use Case |
|--------|-------|----------|
| `--ui` | `'Inter', sans-serif` | UI text, headings, labels, body copy |
| `--mono` | `'JetBrains Mono', monospace` | Numbers, codes, timestamps, data values |

### Font Sizes (relative to 14px base)
| Scale | Size | Use Case |
|-------|------|----------|
| Small | `10px`, `11px`, `12px`, `12.5px` | Labels, captions, badges, help text |
| Base | `13px`, `14px` | Body text, normal content |
| Large | `15px`, `16px`, `17px` | Section titles, emphasis |
| XL | `20px`, `24px` | Page titles, headers |

### Font Weights
| Weight | Use Case |
|--------|----------|
| `400` | Regular body text, normal emphasis |
| `500` | Medium weight, slight emphasis |
| `600` | Semi-bold, emphasis, badges, stat values |
| `700` | Bold, headings, section titles, strong emphasis |

---

## Spacing & Layout

### Border Radius
| Token | Value | Use Case |
|-------|-------|----------|
| `--rsm` | `5px` | Small rounded corners (buttons, badges, small inputs) |
| `--rmd` | `9px` | Medium rounded corners (cards, modals, dropdowns) |
| `--rlg` | `14px` | Large rounded corners (section cards, large panels) |

### Gap/Padding Helpers (Tailwind-style)
| Measurement | Pixels | Tailwind Equiv | Use Case |
|-------------|--------|---|----------|
| `g2`, `gap:8px` | 8px | `gap-2` | Small gaps between inline items |
| `g3`, `gap:12px` | 12px | `gap-3` | Standard gaps, moderate spacing |
| `g4`, `gap:16px` | 16px | `gap-4` | Larger gaps, section separation |
| `mt2`, `mt3`, `mt4` | 8px, 12px, 16px | `mt-2`, `mt-3`, `mt-4` | Top margins |
| `mb3` | 12px | `mb-3` | Bottom margins |

---

## Shadows

### Box Shadows
| Token | Value | Use Case |
|-------|-------|----------|
| `--shc` | `0 1px 3px rgba(15,23,40,.07), 0 0 0 1px var(--b0)` | Subtle shadow + border (cards, tooltips) |
| `--she` | `0 4px 16px rgba(15,23,40,.1), 0 0 0 1px var(--b0)` | Elevated shadow + border (modals, dropdowns) |

---

## Animations

### Keyframes Defined in HTML
| Animation | Duration | Properties | Use Case |
|-----------|----------|-----------|----------|
| `@keyframes pulse` | `2.4s ease-in-out` (infinite) | Opacity + box-shadow glow | Live status indicators, active badges |
| `@keyframes spin` | `0.7s linear` (infinite) | Rotation | Loading spinners, refresh icons |
| `@keyframes tin` | `0.2s ease` | Transform translateX + opacity | Toast slide-in animation |

### Utility Classes for Animations
```css
.spinning { animation: spin 0.7s linear infinite; }
```

---

## Tailwind Configuration Template

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',      // #F4F6FA
        sur: 'var(--sur)',    // #FFF
        elv: 'var(--elv)',    // #F8F9FC
        hov: 'var(--hov)',    // #EEF1F7
        blue: {
          DEFAULT: 'var(--blue)',     // #0057D9
          light: 'var(--blue-lt)',    // #EBF2FF
          border: 'var(--blue-bd)',   // rgba(0,87,217,.2)
        },
        green: {
          DEFAULT: 'var(--green)',    // #059669
          light: 'var(--green-lt)',   // #ECFDF5
          border: 'var(--green-bd)',  // rgba(5,150,105,.2)
        },
        amber: {
          DEFAULT: 'var(--amber)',    // #D97706
          light: 'var(--amber-lt)',   // #FFFBEB
          border: 'var(--amber-bd)',  // rgba(217,119,6,.22)
        },
        red: {
          DEFAULT: 'var(--red)',      // #DC2626
          light: 'var(--red-lt)',     // #FEF2F2
          border: 'var(--red-bd)',    // rgba(220,38,38,.2)
        },
        info: {
          DEFAULT: 'var(--info)',     // #0369A1
          light: 'var(--info-lt)',    // #F0F9FF
          border: 'var(--info-bd)',   // rgba(3,105,161,.2)
        },
        text: {
          1: 'var(--t1)',             // #0F1728 (primary)
          2: 'var(--t2)',             // #4B5675 (secondary)
          m: 'var(--tm)',             // #9AA3B5 (muted)
        },
        border: {
          0: 'var(--b0)',             // #E8ECF4 (light)
          1: 'var(--b1)',             // #D1D9EC (strong)
        },
      },
      fontFamily: {
        ui: 'var(--ui)',              // Inter
        mono: 'var(--mono)',          // JetBrains Mono
      },
      borderRadius: {
        sm: 'var(--rsm)',             // 5px
        md: 'var(--rmd)',             // 9px
        lg: 'var(--rlg)',             // 14px
      },
      boxShadow: {
        card: 'var(--shc)',           // Subtle + border
        elevated: 'var(--she)',       // Elevated + border
      },
      spacing: {
        'gap-2': '8px',
        'gap-3': '12px',
        'gap-4': '16px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## CSS Variables in globals.css

Add to `src/app/globals.css`:

```css
@import 'tailwindcss';

:root {
  /* Colors */
  --bg: #F4F6FA;
  --sur: #FFF;
  --elv: #F8F9FC;
  --hov: #EEF1F7;

  /* Primary */
  --blue: #0057D9;
  --blue-lt: #EBF2FF;
  --blue-bd: rgba(0, 87, 217, 0.2);

  /* Status */
  --green: #059669;
  --green-lt: #ECFDF5;
  --green-bd: rgba(5, 150, 105, 0.2);

  --amber: #D97706;
  --amber-lt: #FFFBEB;
  --amber-bd: rgba(217, 119, 6, 0.22);

  --red: #DC2626;
  --red-lt: #FEF2F2;
  --red-bd: rgba(220, 38, 38, 0.2);

  /* Info */
  --info: #0369A1;
  --info-lt: #F0F9FF;
  --info-bd: rgba(3, 105, 161, 0.2);

  /* Text */
  --t1: #0F1728;
  --t2: #4B5675;
  --tm: #9AA3B5;

  /* Borders */
  --b0: #E8ECF4;
  --b1: #D1D9EC;

  /* Typography */
  --ui: 'Inter', sans-serif;
  --mono: 'JetBrains Mono', monospace;

  /* Border Radius */
  --rsm: 5px;
  --rmd: 9px;
  --rlg: 14px;

  /* Shadows */
  --shc: 0 1px 3px rgba(15, 23, 40, 0.07), 0 0 0 1px var(--b0);
  --she: 0 4px 16px rgba(15, 23, 40, 0.1), 0 0 0 1px var(--b0);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.35);
  }
  50% {
    opacity: 0.75;
    box-shadow: 0 0 0 5px transparent;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes tin {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.spinning {
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
```

---

## Notes

- **Font Import:** Add to `src/app/layout.tsx`:
  ```typescript
  import { Inter, JetBrains_Mono } from 'next/font/google'
  
  const inter = Inter({ subsets: ['latin'] })
  const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })
  ```

- **Dark Mode:** If needed, duplicate all colors under `@media (prefers-color-scheme: dark)` with adjusted values

- **Responsive:** Use Tailwind's breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) for responsive styles. The original HTML uses a `shell` grid layout that's already responsive.
