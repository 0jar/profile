# Jarema's profile site

This is Jarema's personal profile website, with a concise biography, current work and studies, project case studies, geography, language proficiency, contact details, and downloadable CVs.

The site is built with [Astro](https://astro.build) 7 and builds as static HTML. English is served at the main directory, Vietnamese is served at /vi/. Estonian and Russian are supported as planned locales but are not currently active.

This repository is hosted on [Codeberg](https://codeberg.org/0jar/profile) and mirrored on [GitHub](https://github.com/0jar/profile) and [GitLab](https://gitlab.com/0jar/profile).

See the site at [jar.vn](https://jar.vn).

## Highlights

- Locale for identity, copy, metadata, JSON-LD, and Open Graph cards for each language
- Content collections for biography, timeline entries, projects, geography chapters, FAQs, and language data
- Static pages with a small vanilla TypeScript layer for theme switching
- Light and dark themes, responsive layouts, semantic HTML, and accessibility checks
- Support for ATS CV routes with locally generated PDFs and checks for stale content
- Static sitemap, robots file, canonical URLs, and locale-aware alternate links
- Taxonomy lanes shared by timeline and project data
- A timeline with responsive date and content columns

## Stack

- Astro 7 with static output
- TypeScript and Astro Content Layer loaders
- Zod schemas for content validation
- Self-hosted fonts
- Playwright and axe-core for accessibility and CSP tests
- Lighthouse CI for performance, accessibility, best practices and SEO auditing
- `pdf-lib` and Playwright for CV verification and PDF generation

## Requirements

- Node.js >=24.22.0
- pnpm (or another package manager you like)

Install dependencies and start the development server:

```sh
pnpm install
pnpm dev
```

The local site is available at <http://localhost:4321>.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Astro development server |
| `pnpm check:type` | Run Astro diagnostics and `tsc --noEmit` |
| `pnpm check:i18n` | Check internationalisation collection, geography, language, UI parity |
| `pnpm build` | Run i18n and Astro checks, build the site, then verify build |
| `pnpm build:pdf` | Build the site and generate the four CV PDFs |
| `pnpm build:og` | Generate Open Graph images |
| `pnpm check:gates` | Verify an existing build |
| `pnpm test:a11y` | Run accessibility tests |
| `pnpm test:lhci` | Run Lighthouse CI tests |
| `pnpm preview` | Preview the production build locally |

The build expects the committed CV PDFs and Open Graph images to be current. When CV source content changes, you need to regenerate the PDFs.

## Content

Content is stored under `src/content/` and is loaded through Astro collections. Locale is derived from each entry's path, content files don't duplicate locale or slug fields in frontmatter.

```text
src/content/
├── bio/<lang>/profile.md
├── timeline/<lang>/*.md
├── projects/<lang>/*.md
├── geography/<lang>/*.md
├── faq/<lang>/*.md
└── languages/<lang>.yaml
```

Locale identity, URLs, locales, and geography metadata are in `src/data/`, UI labels are in `src/i18n/ui.ts`, prose are in the content collections for each locale.

When adding or changing content:

1. Update entries for each language with matching file names and frontmatter keys
2. Dates are in YYYY-MM format
3. Use the shared lane values: `econ`, `ops`, `lang`, or `geo`
4. Run the i18n check before building

## Project layout

```text
public/                 Static assets, Open Graph cards, robots.txt, and CV PDFs
scripts/                i18n, build-gate, Open Graph, and PDF tooling
src/content/            Bilingual Markdown and YAML content collections
src/components/         Astro components for the site sections
src/data/               Locale-independent site and geography data
src/i18n/               Short UI translations and locale helpers
src/layouts/            Shared document layout and metadata
src/page-templates/     Shared home, CV, project, and 404 page templates
src/pages/              File-based routes
src/scripts/            Small client-side theme, interaction and visual scripts
src/styles/             Fonts, design tokens, global, and print styles
tests/                  Playwright accessibility and CSP coverage
```

## Quality checks

The build enforces these conditions:

- All locales have matching content and translation coverage.
- No placeholder copy leaks from content into the build.
- Inline scripts match the allowlisted theme bootstrap hash and inline styles are rejected.
- Home-page JavaScript stays below 40 KB gzipped per locale.
- Open Graph images are present at 1200x630.
- CV source hashes match the committed PDFs.
- Editorial CVs are one or two pages, ATS CVs are exactly one page.
- Accessibility tests for home, CV, project, colophon, and 404 routes.

Lighthouse CI is configured with a minimum score of 95 for performance, accessibility, best practices, and SEO.

## Deployment

The output is static and configured for deployment on Netlify. Settings are in netlify.toml.

## License

This repository is dual-licensed.

Source code is licensed under the [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html), see [LICENSE-AGPL-3.0](LICENSE-AGPL-3.0).

All non-code content, such as text, documentation, photos, and other materials, is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/), see [LICENSE-CC-BY-SA-4.0](LICENSE-CC-BY-SA-4.0). Attribution should include a link to <https://jar.vn>.

Third-party libraries, fonts, and other included assets remain under their respective licenses.
