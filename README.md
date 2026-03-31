# Journey Through Claude Code

An interactive website that explores the internal architecture of [Claude Code](https://claude.ai/code), Anthropic's CLI for software engineering with Claude.

## Two Journeys

**Follow a Prompt** — Scroll through an animated pipeline that traces what happens when you type a prompt and hit Enter. Watch it flow through input capture, context assembly, the API call, and then branch into four different scenarios: a simple question, a file edit, running tests, or spawning an agent swarm.

**Explore the Architecture** — A fractal zoom interface. Start with 5 high-level systems, click to zoom in and reveal subsystems, click again for implementation details. Breadcrumbs and a minimap keep you oriented.

## Built With

- [Next.js](https://nextjs.org) (static export)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Tailwind CSS](https://tailwindcss.com) (styling)
- [Shiki](https://shiki.style) (syntax highlighting)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# Static files in out/
```

## Source Material

Based on the Claude Code source (`src/`) leaked via npm source maps on 2026-03-31. Code snippets are curated excerpts used for educational purposes.
