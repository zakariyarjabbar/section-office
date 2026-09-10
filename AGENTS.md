# SECTION OFFICE operating rules

Read AGENTS.md, PRODUCT.md, DESIGN.md, docs/STATUS.md, then relevant architecture/QA documents before changes. Preserve the user's work and existing npm lockfile.

Visual quality is primary: photographic architectural monograph, bold Archivo, cool paper and signal blue. No fabricated practice credentials or built work. Images are generated concept visualizations, always credited. Keep each project coherent.

Use Next.js App Router, strict TypeScript, static export with trailing slashes. All editorial data lives in typed local fixtures. Client components only for interaction. One validated versioned localStorage adapter; no backend, database, authentication, API keys, tracking or actual message delivery. Failures must never masquerade as persistent success.

Use semantic CSS tokens, accessible labels/focus, keyboard controls, responsive images and reduced-motion support. Keep public content build-rendered. SITE_URL is the one build-time public origin. Never deploy, purchase assets, register domains or send messages without authorization.

Commands: npm install; npm run dev; npm run typecheck; npm run lint; npm test; npm run build; npm run start (serves out/ on port 3000). npm run verify:export validates exported routes and metadata; npm run test:browser runs browser scenarios against the static server.

Completion requires all requested routes and interactions, optimized local assets, 1200×630 route-specific social covers, successful checks, desktop/mobile visual evidence, accurate docs/QA.md and docs/STATUS.md. A build alone is not visual QA or proof of a public social unfurl.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
