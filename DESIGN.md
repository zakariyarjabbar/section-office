---
name: SECTION / OFFICE
description: A Swiss architectural monograph on cool paper, led by generated concept imagery.
colors:
  paper: "#F1F2F0"
  ink: "#171A1B"
  blue: "#244EFF"
  concrete: "#D7DBD8"
  slate: "#626969"
  line: "#C9CECA"
  white: "#FFFFFF"
  error: "#B12C23"
typography:
  display:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(64px, 7.3vw, 112px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(34px, 3.6vw, 56px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  utility-title:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(40px, 5.6vw, 80px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  reading:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.8
  control:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  square: "0px"
spacing:
  gutter: "40px"
  gutter-tablet: "30px"
  gutter-mobile: "20px"
  section: "clamp(80px, 10vw, 160px)"
  gallery-column: "32px"
  control-gap: "16px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "13px 14px"
  navigation-link:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    padding: "12px 0"
  status-tag:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "5px 10px"
  project-caption:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "15px 0"
---

# Design System: SECTION / OFFICE

## Overview

**Creative North Star: "Swiss architectural monograph"**

The visual system gives architecture the scale and clarity of a photographic monograph. Cool paper, closely set Archivo, restrained technical annotation and signal-blue cues establish a precise editorial identity. Asymmetric image arrangements sit on a consistent underlying grid; generous intervals separate projects while captions and facts stay compact.

This document merges the original user-pinned direction with the implemented system in `app/globals.css`, `app/layout.tsx` and the shared components. It records implementation, not an approved external comp. Architectural photographs are generated concept visualizations; captions and credits preserve that distinction. The SECTION / OFFICE wordmark and original section-slash mark are the established identity.

**Key Characteristics:**

- Large, sharp architectural imagery with indexed facts and visible concept credits.
- Archivo for display, navigation and prose; IBM Plex Mono for technical annotation.
- Cool neutral surfaces, signal blue, square geometry and fine rules.
- Flat editorial layouts with deliberate changes of image scale and alignment.

## Colors

The palette is cool, predominantly neutral and organized around one chromatic accent. Frontmatter records the shared CSS color primitives; component-specific tints remain local treatments rather than additional brand colors.

### Primary

- **Signal blue** marks primary actions, active navigation and filters, the wordmark slash, text selection and keyboard focus.

### Neutral

- **Cool paper** is the default page canvas and light foreground against dark sections.
- **Ink** carries primary text, structural emphasis, dark buttons, the footer and gallery dialog.
- **Concrete** provides image fallback surfaces and neutral control hover fills.
- **Slate** carries secondary copy, captions, indices and placeholders.
- **Line** is the shared divider and outline-control border.
- **White** supplies the foreground on blue primary actions.

The **error** token is reserved for invalid-field borders, field messages and the form error summary. Selection tints and lightbox-specific contrast adjustments are implementation details, not an expanded identity palette.

## Typography

Archivo is locally loaded as a normal variable font, with Arial and sans-serif fallbacks. IBM Plex Mono is locally loaded at regular weight, with a monospace fallback. Most interface and reading sizes use rem units; large display compositions use viewport clamps or explicit responsive overrides.

The frontmatter display role describes the homepage heading. Default page h1 uses `clamp(54px, 7.6vw, 112px)`; utility titles use their smaller dedicated role. Heading weight is generally 500, with tight tracking and balanced wrapping. The masthead wordmark uses weight 650 and a final desktop size of 22px, reduced to 20px at the medium breakpoint.

At widths up to 1100px, the homepage heading uses 7.4vw. At widths up to 600px, it uses `clamp(45px, 9.9vw, 60px)`, line-height 1.02 and tracking -0.05em. Utility titles become 44px. These separate rules preserve the photographic opening and the compact task pages.

Project-caption titles use the title role, standard controls use the control role and mono indices use the label role. Some secondary caption details become smaller at narrow widths. Journal prose uses the reading role in a 730px maximum-width column; mobile prose becomes 1.0625rem with the same line-height. Preserve wrapping and rem-based reading text when extending the system.

## Layout

The outer wrapper is fluid, centered and capped at 1800px. Use the frontmatter gutter on wide screens, its tablet value at widths up to 1100px and its mobile value at widths up to 600px. The shared section rhythm becomes 80px on mobile.

The editorial grid is a twelve-part spatial model, expressed through explicit twelve-column galleries and proportional splits: 9:3 for the desktop homepage heading, 1:11 for its image rail, 7:5 for page introductions and 8:4 for project titles. These are reusable alignment relationships, not a requirement that every component declare twelve CSS columns. Work cards use two equal columns with 32px between columns and 60px between rows. Project galleries use 32px column gaps and 75px row gaps, with wide, offset and inset images.

The main responsive breakpoints are 1100px, 800px and 600px. At the middle breakpoint, the hero rail moves above the photograph and side content compresses. At the mobile breakpoint, page introductions and work cards stack, the masthead uses the menu dialog, facts reflow, and forms become simpler columns. The five-step brief control remains a visible five-column strip without horizontal scrolling.

The homepage photograph changes from a wide 1.98 ratio to 1.7 at the middle breakpoint and 0.94 on mobile, where its crop is positioned at 58% horizontally. Gallery photographs use varied editorial ratios; the lightbox fits the full image with `contain`. Preserve project coherence and choose crops deliberately rather than imposing one ratio everywhere.

Generated-image credits remain visible: at widths up to 1100px the caption wraps and the credit takes its own line. Mobile work-list rows retain the thumbnail, title and save control, with project number, category and concept year in a separate metadata row. Reflow facts and credits instead of hiding them.

## Elevation & Depth

The interface is flat and uses no box shadows. Hierarchy comes from photographic scale, whitespace, fine borders and changes between paper, concrete and ink surfaces. The gallery dialog occupies the viewport on ink; its depth comes from the native modal layer and image presentation. Keyboard focus uses a visible two-pixel outline with a five-pixel offset, reduced to two pixels around form fields; the dark gallery uses a lighter focus color for contrast.

## Shapes

Use square corners, rectangular image crops and one-pixel rules. Buttons and fields have flat borders; project cards remain unboxed image-and-caption compositions. Status tags are compact bordered rectangles, not pills. Icons use thin strokes, square line caps and miter joins; the diagonal arrow and section-slash mark are recurring identity details.

## Components

### Buttons and text links

Primary, outline and dark variants share the dimensions in frontmatter and a minimum height of 49px. Primary hover changes to ink; outline hover fills with ink and uses paper text; dark hover changes to blue. Background and foreground transitions take 180ms. Disabled buttons retain the native disabled state, use a not-allowed cursor and reduce opacity to one half. Standard icon controls are 44px squares; compact contexts have explicit smaller overrides.

Text links use a fine underline, a diagonal arrow and a 24px gap. On hover, text and border change to blue over 200ms. Keep the visible keyboard-focus treatment on links and buttons.

### Project cards, captions and lists

ProjectCard pairs a linked photograph with ProjectCaption: mono project number, title, category and concept year, plus an explicitly labeled exploration control. A fine lower rule anchors the caption. Cards have no ornamental shell. Linked images scale to 1.025 over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`; they are visible before any interaction. List views use the same indexed facts, thumbnail and save action, with the responsive metadata treatment recorded above.

### Navigation and filters

The masthead is 99px high on wide screens, 86px at the medium breakpoint and 78px on mobile. Desktop links gain a blue two-pixel underline on hover and for the current route, animated over 250ms with the shared easing. Mobile navigation is a paper-colored native modal dialog with ruled links, visible close control, Escape support and focus return.

Filters are unboxed text buttons: inactive slate, selected blue with a two-pixel underline and an explicit pressed state. The grid/list switch uses a fine outer border and an ink-filled selected control. Search is an underlined native input. Filter wrapping and the mobile search row preserve readable labels.

### Fields, choices and feedback

Field labels sit above transparent square inputs, selects and textareas. Inputs use a distinct neutral one-pixel stroke, the frontmatter padding and a minimum height of 49px. Textareas resize vertically and begin at 135px high. Hint text uses slate; error text and invalid borders use the error token. ErrorSummary is a ruled alert with links to the affected fields, and fields connect their labels, hints and errors through native HTML and ARIA attributes.

Choice controls use bordered rectangular labels with native inputs. Selected choices receive a blue border and pale blue fill. Status tags use a fine neutral border; new records use blue text and border. Local-storage or session feedback remains visible and distinguishes stored success from temporary or failed persistence. Wording must preserve the local-demo context.

### Gallery dialog

The native full-viewport lightbox has an ink canvas, paper foreground, visible previous/next, zoom and close controls, and a caption with generated-image credit. The normal image fits its available area; zoom provides an independently scrollable larger image. Retain keyboard arrow navigation, Escape and focus restoration.

Reduced motion disables nonessential transitions and animations, restores automatic scrolling, and removes the linked-image hover transform. Print styling removes navigation and controls while preserving the readable brief summary.

## Do's and Don'ts

### Do:

- Do keep the cool-paper palette, Archivo/IBM Plex Mono pairing and SECTION / OFFICE identity.
- Do lead project presentation with sharp, coherent generated architectural imagery and visible concept credits.
- Do align photographs, titles and indexed facts, and reflow metadata at narrow widths.
- Do use flat borders, square controls, visible focus and the implemented reduced-motion behavior.
- Do preserve readable text sizing, native form semantics and honest local-state feedback.

### Don't:

- Don't introduce a warm retail palette, hotel-style serif identity, booking/store components or ornamental cards.
- Don't add shadows, rounded marketing shells or centered display text over full-screen background imagery.
- Don't hide required project facts or generated-image credits to simplify mobile layouts.
- Don't present conceptual projects as real built work or invent practice credentials.
- Don't turn route-specific crops, title scales or homepage composition into universal component rules.
