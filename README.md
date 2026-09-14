# NATH SOLUTION — Figma Modern UI Portfolio

This rebuild preserves the portfolio data from the supplied `inddcex(3).html` source while presenting it in a Figma-inspired application/canvas interface.

## Files
- `index.html` — complete portfolio markup and source data
- `style.css` — responsive Figma-like UI
- `script.js` — routing, theme switch, package carousel, before/after slider, Three.js scene, and original `/api/submit` form payloads

## Preserved source data
- Nathaniel Sumaoang / Freelancer Software Developer
- Nath Solution description and profile details
- Paniqui, Tarlac / Remote
- nathsumaoang@gmail.com
- 4 featured projects and live URLs
- Frontend, backend/database, cloud/devops, quality/workflow stack
- 4 services
- 3 pricing packages with original Philippine peso rates
- 2 YouTube walkthrough embeds
- Engineering role/responsibility matrix
- Book-a-call and contact form fields
- `/api/submit` JSON payload structure with `formType: "book-call"` and `formType: "contact"`

## Local assets
The source references `nath.jpg`, `donn.jpg`, and `donncode.png`. Keep those image files beside `index.html` to display them. The site uses a fallback avatar when `nath.jpg` is absent.

## Backend
The frontend keeps the source's API endpoint at `/api/submit`. Deploy it alongside your existing backend/API implementation.
