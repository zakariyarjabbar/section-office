# QA evidence

Verified on 10 September 2026 against the actual static export at http://localhost:3000/. This is a local demonstration; no public host or platform unfurl has been tested.

## Commands actually run

| Command | Result |
|---|---|
| npm run typecheck | Passed |
| npm run lint | Passed, no warnings |
| npm test | 9 focused tests passed |
| npm run build | Passed; static output in out/ |
| npm run verify:export | 23 public routes, 13 covers, 30 images and useful 404 passed |
| npm run test:browser | 17 scenario groups passed; no uncaught client errors |

The unit tests cover query parsing, saved toggles, schema validation/recovery/migration, brief validation, duplicate submission, storage adapter behavior, scoped reset and per-route metadata/origin mapping. Checks are enabled; none were bypassed.

## Browser scenarios

Browser: Chromium 153.0.8010.12. Tests use isolated temporary profiles with sample data, never the user's open browser storage. Machine-readable evidence: [browser-verification.json](browser-verification.json), recorded 2026-09-10T00:53:49.208Z.

| Scenario | Result |
|---|---|
| Every public route supports direct static navigation and refresh; invalid slug returns 404 | passed |
| Filters use URL state, reset/no-results and browser back; list preference survives refresh | passed |
| Accessible gallery supports arrows, zoom, Escape and focus restoration | passed |
| Saved references, draft recovery, validation, review and duplicate-proof local submission | passed |
| Local inbox status/notes synchronize to visitor view and another same-origin tab | passed |
| Text download and printable summary contain the actual saved brief | passed |
| Clean project link sharing excludes filters and visitor fields | passed |
| Contact inquiry uses sample details and appears in the same local inbox | passed |
| Isolated browser context has no local records | passed |
| Corrupt storage remains intact; reset is scoped and sample seeding is idempotent | passed |
| Quota and disabled storage never claim persistent success; temporary mode is explicit | passed |
| Mobile navigation, touch controls and keyboard focus remain usable | passed |
| Representative axe WCAG 2.2 AA scans have no serious or critical violations | passed |
| Responsive layouts and loaded images at 360, 390, 509, 768, 1024 and 1440px | passed |
| 200% text sizing and reduced motion preserve content | passed |
| Measure cold mobile homepage and project performance under stated conditions | passed |
| No uncaught client runtime errors | passed |

Nine representative pages received axe WCAG 2.2 AA-tagged scans with no serious or critical violations. Keyboard focus, Escape/focus return, visible gallery controls, touch navigation, form errors and status announcements were also exercised. This is not a complete WCAG conformance audit or a manual screen-reader certification.

## Visual evidence

The homepage, full Fold House case study, grid and list, studio and brief-builder entry were captured at 1440px, 390px and the observed in-app width of 509px. Layout overflow and image readiness were also checked at 360, 768 and 1024px. Captures were opened and checked for coherent imagery, cropping, alignment, readable type and complete content.

- [Desktop homepage](screenshots/home-desktop.png) and [desktop opening](screenshots/home-desktop-opening.png).
- [Mobile homepage](screenshots/home-mobile.png) and [mobile opening](screenshots/home-mobile-opening.png).
- [Actual-preview-width homepage](screenshots/home-user-509.png).
- [Desktop case study](screenshots/fold-house-desktop.png) and [mobile case study](screenshots/fold-house-mobile.png).
- [Desktop grid](screenshots/work-desktop.png), [desktop list](screenshots/work-list-desktop.png) and [mobile list](screenshots/work-list-mobile.png).
- [Studio](screenshots/studio-desktop.png), [brief entry](screenshots/brief-mobile.png), [filled review](screenshots/brief-review-desktop.png) and [local inbox](screenshots/inbox-desktop.png).
- [Actual downloaded text](screenshots/sample-brief.txt) and [browser print output](screenshots/sample-brief.pdf).

Chromium's full-page capture initially omitted some decoded photographs even though normal viewport rendering was correct. Final long screenshots join actual viewport captures at the stated browser width; no image content was invented or substituted. The repeatable helper is scripts/screenshot.mjs; node scripts/capture-final.mjs refreshes the page evidence. Screenshot loading is deliberately settled; performance measurements use separate cold contexts.

All 30 original project visualizations were inspected in coherent groups, including [flagships](screenshots/flagship-contact-sheet.png) and [other studies](screenshots/collection-contact-sheet.png). All 13 social covers were inspected in landscape, 360×189 thumbnail and centered-square versions. Export inspection confirmed one correct canonical/OG/Twitter mapping per public route, without executing application JavaScript.

## Performance measurements

Headless Chromium, 390×844, new isolated context per page, HTTP localhost static export, cache disabled, 1.6 Mbps download / 0.75 Mbps upload / 100ms latency, 4× CPU throttle; one run each, not Lighthouse or field data. Transfer totals are recorded resource transfer sizes at the measurement point, including resources loaded by that time; they are not the entire exported site's size.

| Route | LCP | CLS | DOM content loaded | Recorded transfer |
|---|---:|---:|---:|---:|
| / | 2016 ms | 0.000346 | 1572 ms | 824.9 KB |
| /work/fold-house/ | 2072 ms | 0.000000 | 1556 ms | 1055.6 KB |

These are single-run laboratory measurements, not a Lighthouse score, field-performance claim or guarantee.

## Fixes and limitations

Resolved during verification: selected-inbox text contrast; enlarged-text wrapping; local font contours in small social identification; static project-index fallback; gallery sequence consistency; capture painting defects. The filter-history test was corrected to wait for navigation completion before issuing Back. Nav and row feedback use transforms instead of layout-changing animation.

Remaining verification limits: no public HTTPS deployment/unfurl, Safari/Firefox/physical-device run, or complete assistive-technology audit. Native OS share sheets and printing hardware were not tested; clean clipboard fallback and generated print output were. Local storage is intentionally browser/profile/origin-specific, user-editable and non-transactional. Temporary-session mode is lost on reload. Generated images are concept visualizations, not evidence of built work.

An independent review of the supplied screenshots and sampled source found two responsive omissions: hidden concept-image credits and missing mobile-list project numbers/years. The fixes preserve attribution and all list facts at every width. Focused confirmation at 360, 390, 509, 768, 1024 and 1440px passed, including 200% text and two additional mobile axe scans. Evidence: [responsive-confirmation.json](responsive-confirmation.json). Final reviewer disposition: ship. Both specified fixes were scored resolved with no material regression visible; this verdict covers that fix list. See [FINISH-REVIEW.md](FINISH-REVIEW.md). The specialized reviewer role was unavailable; a fresh generic review agent received the same bounded brief and evidence.

The documentation agent wrote DESIGN.md and its sidecar before its final response was interrupted. Both files were inspected and the sidecar parsed successfully during the main-thread handoff.
