# iptv-player

Ù‚Ø§Ù„Ø¨ Ø¥Ù†ØªØ§Ø¬ÙŠ Ø¬Ø§Ù‡Ø² Ù„Ù„Ø¨Ø¯Ø¡: Next.js 16 (App Router + Turbopack) ÙˆTailwind CSS 4ØŒ Ø¨ÙˆØ§Ø¬Ù‡Ø© Ø¹Ø±Ø¨ÙŠØ© Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ ÙˆØ§ØªØ¬Ø§Ù‡ RTLØŒ Ù…Ø¹ ÙˆØ¶Ø¹ Ø¯Ø§ÙƒÙ†ØŒ Ù…ÙƒÙˆÙ‘Ù†Ø§ØªØŒ Ø§Ø®ØªØ¨Ø§Ø±Ø§ØªØŒ ÙˆÙ†Ø´Ø± Ù…Ø¬Ø§Ù†ÙŠ.

## Ø§Ù„ØªØ´ØºÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ¹

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Ø§Ù„Ø£ÙˆØ§Ù…Ø±

| Ø§Ù„Ø£Ù…Ø±               | Ø§Ù„ÙˆØ¸ÙŠÙØ©                                       |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Ø®Ø§Ø¯Ù… Ø§Ù„ØªØ·ÙˆÙŠØ±                                  |
| `pnpm build`        | Ø¨Ù†Ø§Ø¡ Ø§Ù„Ø¥Ù†ØªØ§Ø¬                                  |
| `pnpm start`        | ØªØ´ØºÙŠÙ„ Ù†Ø³Ø®Ø© Ø§Ù„Ø¥Ù†ØªØ§Ø¬                            |
| `pnpm lint`         | ÙØ­Øµ ESLint                                    |
| `pnpm typecheck`    | ÙØ­Øµ TypeScript                                |
| `pnpm format`       | ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„Ù…Ù„ÙØ§Øª Ø¹Ø¨Ø± Prettier                    |
| `pnpm test`         | Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Playwright (Ø³Ø·Ø­ Ø§Ù„Ù…ÙƒØªØ¨ + Ø¬ÙˆØ§Ù„)       |
| `pnpm build:static` | ØªØµØ¯ÙŠØ± Ø«Ø§Ø¨Øª Ø¥Ù„Ù‰ `out/` Ù„Ù†Ø´Ø± GitHub Pages       |
| `pnpm cf:build`     | ØªØ¬Ù‡ÙŠØ² Ø­Ø²Ù…Ø© Cloudflare                         |
| `pnpm cf:preview`   | ØªØ¬Ø±Ø¨Ø© Cloudflare Ù…Ø­Ù„ÙŠØ§Ù‹                       |
| `pnpm cf:deploy`    | Ù†Ø´Ø± Ø¹Ù„Ù‰ Cloudflare Workers                    |

## Ø§Ù„Ø¨Ù†ÙŠØ©

```text
src/
â”œâ”€ app/                 # Ø§Ù„ØµÙØ­Ø§Øª ÙˆØ§Ù„ØªØ®Ø·ÙŠØ· Ø§Ù„Ø¹Ø§Ù… ÙˆÙˆØ§Ø¬Ù‡Ø© /api/health
â”œâ”€ components/
â”‚  â”œâ”€ ui/               # Button, Card, Container, Badge, SectionHeading
â”‚  â”œâ”€ site-header.tsx
â”‚  â”œâ”€ site-footer.tsx
â”‚  â””â”€ theme-toggle.tsx
â””â”€ lib/
   â”œâ”€ site.ts           # Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„ÙˆØµÙ ÙˆØ§Ù„Ø±ÙˆØ§Ø¨Ø· (Ù…ØµØ¯Ø± ÙˆØ§Ø­Ø¯ Ù„Ù„Ø­Ù‚ÙŠÙ‚Ø©)
   â””â”€ cn.ts             # Ø¯Ù…Ø¬ Ø§Ù„Ø£ØµÙ†Ø§Ù
tests/e2e/              # Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Playwright
```

## Ø§Ù„ØªØ®ØµÙŠØµ

1. Ø¹Ø¯Ù‘Ù„ `src/lib/site.ts` (Ø§Ù„Ø§Ø³Ù…ØŒ Ø§Ù„ÙˆØµÙØŒ Ø§Ù„Ø±ÙˆØ§Ø¨Ø·).
2. Ø¹Ø¯Ù‘Ù„ Ø£Ù„ÙˆØ§Ù† Ø§Ù„Ø¹Ù„Ø§Ù…Ø© ÙÙŠ `src/app/globals.css` Ø¯Ø§Ø®Ù„ `@theme`.
3. Ø§Ø³ØªØ¨Ø¯Ù„ Ù…Ø­ØªÙˆÙ‰ `src/app/page.tsx` Ø¨Ù…Ø­ØªÙˆÙ‰ Ù…ÙˆÙ‚Ø¹Ùƒ.
4. Ø£Ø¶Ù ØµÙØ­Ø§ØªÙƒ ØªØ­Øª `src/app/<route>/page.tsx`.

## Ø§Ù„Ù†Ø´Ø± Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠ

### Cloudflare Workers (ÙƒØ§Ù…Ù„: ØµÙØ­Ø§Øª + APIs)

```bash
pnpm dlx wrangler login     # Ù…Ø±Ø© ÙˆØ§Ø­Ø¯Ø©
pnpm cf:build
pnpm cf:deploy
```

ÙŠØ¹Ø·ÙŠÙƒ Ø±Ø§Ø¨Ø·Ø§Ù‹ Ø¹Ù„Ù‰ `*.workers.dev` Ù…Ø¬Ø§Ù†Ø§Ù‹. Ø±Ø§Ø¬Ø¹ `wrangler.jsonc` Ù„Ø¥Ø¶Ø§ÙØ© D1/KV/R2.

### GitHub Pages (Ø«Ø§Ø¨Øª ÙÙ‚Ø·)

```bash
pnpm build:static <repo-name>
```

Ø«Ù… Ø§Ø±ÙØ¹ Ù…Ø¬Ù„Ø¯ `out/` Ø£Ùˆ Ø§Ø³ØªØ®Ø¯Ù… Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø¬Ø§Ù‡Ø² ÙÙŠ `.github/workflows/deploy-pages.yml` (ÙØ¹Ù‘Ù„ Pages Ù…Ù† Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø³ØªÙˆØ¯Ø¹ â†’ Source: GitHub Actions).

## Ù…Ù„Ø§Ø­Ø¸Ø§Øª

- `cacheComponents` Ù…ÙØ¹Ù‘Ù„ Ø§ÙØªØ±Ø§Ø¶ÙŠØ§Ù‹ ÙÙŠ `next.config.ts`Ø› Ø¥Ù† ÙˆØ§Ø¬Ù‡Øª ØªØ¹Ø§Ø±Ø¶Ø§Ù‹ Ù…Ø¹ Ù†Ø´Ø± Ù…Ø¹ÙŠÙ‘Ù† ÙŠÙ…ÙƒÙ† ØªØ¹Ø·ÙŠÙ„Ù‡.
- `typedRoutes` Ù…ÙØ¹Ù‘Ù„: Ø§Ù„Ø±ÙˆØ§Ø¨Ø· ÙŠØ¬Ø¨ Ø£Ù† ØªÙƒÙˆÙ† Ù…Ø³Ø§Ø±Ø§Øª ØµØ­ÙŠØ­Ø© Ù…Ø¹Ù„ÙˆÙ…Ø© ÙˆÙ‚Øª Ø§Ù„Ø¨Ù†Ø§Ø¡.
- Ù„Ø§ ØªØ±ÙØ¹ `.env.local` Ø£Ø¨Ø¯Ø§Ù‹.
