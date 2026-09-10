# Architecture

## Static content and routing
Next.js 16.3.4 App Router with React 19.2.8, TypeScript strict and `output: 'export'`. `trailingSlash: true` produces portable directory indexes. Project and journal slugs are pre-generated with `generateStaticParams`; unknown slugs use the exported 404. No runtime API, Server Action, database, ORM, authentication, CMS or required API key exists.

`lib/content.ts` contains typed original fixtures: eight projects, 30 images and three articles. Projects have stable IDs, category, year, fictional site context, indicative area, materials, narratives and related IDs. Public content is rendered at build time. The project index has a static project-grid fallback; query-dependent controls hydrate inside Suspense. Locally created records use fixed routes with opaque query IDs, never runtime dynamic routes.

## Browser store
`lib/state.ts` owns pure schema normalization, validation, saved toggles, draft/submission rules and text summaries. `lib/browser-store.ts` is the one storage adapter. `components/store.tsx` connects it through `useSyncExternalStore`, hydrates after mount, listens for storage events and announces outcomes.

Key: `section-office:demo:v1`.

```ts
{
  version: 1,
  saved: string[],
  view: 'grid' | 'list',
  briefs: [{ id, reference, kind, step, data, createdAt, updatedAt,
             submittedAt?, status, notes }],
  inquiries: [{ id, name, email, message, createdAt, status, notes }]
}
```

The adapter reads the latest stored state before each mutation. Saved IDs are deduplicated and filtered against live fixtures. Invalid records are discarded; strings and lists are bounded. Corrupt JSON and unknown versions are preserved until an explicit reset. A narrowly defined legacy version 0 (`savedIds`, view preference) migrates to version 1 with empty record lists. Future versions must add an explicit migration, never a silent overwrite.

A draft saves valid and incomplete field values on change. Validation gates forward navigation and submission. Submission writes one stable record before showing success; a ref guard blocks rapid repeated clicks and the pure reducer refuses a second submission with the same ID. Submitted records are reviewable; drafts are editable. Starting another brief creates a separate draft. Status and notes are local studio-demo mutations.

Read/write errors do not report persistent success. The visitor can explicitly select temporary-session mode, which keeps in-memory data until refresh/close, or reset only the namespaced key. Reset never calls `localStorage.clear()`. No imagery or base64 data is stored in browser storage. Limits are 200 briefs and 200 inquiries, with bounded text fields.

Same-profile, same-origin tabs receive storage events. Mutations are best-effort read/modify/write, not transactions. Different origins, devices and browser profiles are separate. Local storage is user-editable and is not an authentication boundary.

## Assets and fonts
Thirty built-in Imagegen originals are stored in `assets/originals/`; exact prompts and source records live in `assets/image-manifest.json`. `scripts/prepare-images.mjs` creates WebP variants at up to 640, 960 and 1536px without enlarging the source. Native img/srcset/sizes provides static-compatible delivery. Hero images load eagerly with high fetch priority; offscreen imagery loads lazily and reserves dimensions. All galleries include captions and generated-visualization credits.

Archivo variable Latin and IBM Plex Mono regular Latin are loaded using `next/font/local` from the locked Fontsource packages. Only one Archivo normal variable file and one Mono regular file are shipped. The social script uses licensed static Archivo glyph outlines from WOFF assets; it composes exact type and photography deterministically with Sharp. No runtime font or image service is needed.

## Metadata
`lib/metadata.ts` validates SITE_URL and builds complete canonical, Open Graph and Twitter fields. All absolute URLs derive from this single origin. Local HTTP is permitted for localhost/127.0.0.1; public origins require HTTPS and reject paths, query strings, credentials and example.com. Project/article covers are selected from fixtures at build time. There is no root file-based OG image to override them.

## Accessibility and local interactions
Semantic landmarks, heading hierarchy, native controls, labels and visible focus. Native modal dialogs contain gallery/mobile navigation focus; Escape closes and returns focus. Galleries have visible previous/next/zoom controls and captions. Reduced motion disables nonessential transitions. Public sharing strips query strings and uses the current deployment origin; native-share cancellation stays quiet and clipboard failures give an honest fallback instruction.

## Build and preview
`npm run build` generates assets then the export. `npm run start` serves only `out/` with directory index support, correct MIME types and a real 404 response. `npm run verify:export` reads HTML directly without application JavaScript. Public deployment is deliberately separate and requires authorization and the actual HTTPS origin; see SOCIAL-PREVIEWS.md.
