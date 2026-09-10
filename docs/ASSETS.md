# Assets and provenance

## Architectural visualizations
All 30 architectural images are original outputs from the built-in Imagegen tool, generated for this self-initiated fictional portfolio. They are not photographs documenting constructed projects and do not represent the work of an actual architect or client. The interface labels them as concept visualizations. No stock photographs, scraped studio imagery, recognizable commissioned buildings or purchased assets are used.

`assets/image-manifest.json` is the complete provenance manifest. Every entry records its project, order, original workspace file, generator, exact prompt, source path, usage basis and available caption. The source paths are historical; the site depends only on copied project assets. Original PNG files are retained in `assets/originals/`. Final responsive WebP files are in `public/images/`.

| Study | Files | Image narrative |
|---|---:|---|
| Fold House | 5 | Courtyard, living interior, meadow context, portrait veranda, material junction |
| Foundry Hall | 5 | Main hall, exterior, return interior, timber threshold, brick/steel detail |
| Common Ground | 5 | Street/porch, reading interior, threshold context, portrait porch, material detail |
| Quarry Rooms | 3 | Stone court, guest interior, oak/stone threshold |
| Frame Apartment | 3 | Shared room, reverse view, ribbed-glass/oak detail |
| Field Pavilion | 3 | Meadow setting, under-roof view, bolted timber connection |
| Northlight Studio | 3 | Workspace, workshop exterior, birch worktable detail |
| Passage Gallery | 3 | Linear gallery, street entrance, steel reveal |

Reference strategy: each project’s first image establishes its architecture and material family. Subsequent generated images use that local image as an identity reference. Every output was visually inspected; batched contact sheets are saved in `docs/screenshots/`. The visualizations are not survey-accurate reconstructions or construction documentation. Minor texture/light variation is expected between generated views. No known missing image deliverables remain.

## Fonts
- Archivo: Omnibus-Type; SIL Open Font License 1.1, supplied through `@fontsource-variable/archivo` and `@fontsource/archivo`.
- IBM Plex Mono: IBM; SIL Open Font License 1.1, supplied through `@fontsource/ibm-plex-mono`.
- License texts are copied into `assets/licenses/`. Package versions are pinned in package.json/package-lock.json. Browser loading uses locally bundled Latin WOFF2 assets.
- Social typography uses actual Archivo glyph outlines from the static 400/500 WOFF files. It is composed by code, never generated lettering.

Upstream references: [Archivo](https://github.com/Omnibus-Type/Archivo), [IBM Plex](https://github.com/IBM/plex), [Fontsource](https://fontsource.org/). The package license files, not a guessed license, establish the font usage basis.

## Identity and drawings
The section/slash favicon and SVG interface icons are original vector code. Three conceptual plan/section drawings are original SVGs in `components/diagram.tsx`, labelled not to scale and not construction-ready. The social covers are original deterministic composites of the generated project images and licensed font outlines.

No real staff portraits, testimonials, press badges, credentials, measured outcomes or client identities are used.
