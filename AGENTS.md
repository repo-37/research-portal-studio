# AGENTS.md

Project-specific guidance for AI coding agents.

<!-- ASTRYX:START -->
Astryx v0.7.12 · 174 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.
Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then tokens (var(--color-*|--spacing-*|--radius-*)). No raw hex/px. No StyleX/Tailwind compiler here — don't use xstyle/utility classes directly. Some templates use StyleX and need a compiler plugin; see `astryx docs styling-overview`.
- Palettes and custom colors go through the theme, never :root overrides. Run `astryx theme add <slug>` to import; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any raw <div>/<span>, imported .css/@apply, or hardcoded #hex/px with the component or a token.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands and API reference
  docs authoring     build an integration package, and every field it holds
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->

## Local setup (not CLI-managed; edit freely)

Stack: Vite 7 + React 19 + Astryx 0.7.12, theme `neutral`.

| package | version | role |
|---|---|---|
| `@astryxdesign/core` | 0.7.12 | components, base CSS (`reset.css`, `astryx.css`) |
| `@astryxdesign/theme-neutral` | 0.7.12 | theme, mounted once in `src/main.tsx` |
| `@stylexjs/stylex` + `@stylexjs/unplugin` | 0.19.1 | StyleX runtime and Vite plugin |
| `@heroicons/react` | 2.2.0 | nav icons |
| `react`, `react-dom` | 19.3.1 | peer dependencies of core |
| `vite` | 7.3.8 | dev server and build |
| `@astryxdesign/cli` | 0.7.12 | devDependency; run as `npx astryx` |

Commands: `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`, `npm run doctor`.

Layout:

- `index.html` + `src/main.tsx` are the Vite entry. `<Theme theme={themes[defaultThemeSlug]}>` wraps the app once.
- `src/App.tsx` is the shell: `AppShell` + `SideNav` + `Layout`. Every sidebar item is a section component in `src/sections/`, rendered in `Layout contentWidth={1280}` because plots and tables need width.
- `src/global.css` declares `@layer reset, astryx-base, app;` first, then imports the core stylesheets. An unlayered rule outranks every layer, so app CSS must stay inside `@layer app`.
- `src/figures/charts.tsx` holds inline-SVG plot primitives. `src/components/Figure.tsx` is the shared frame: number, title, plotting surface, source caption.
- `legacy/` keeps the previous static showcase page and its Three.js workspaces (`legacy/index.html`, `legacy/app.js`). It is not part of the Vite build.
- `bin/research-portal-studio` still emits portals that link `style.css`. That stylesheet stays at the repo root and belongs to the compiler, not to the app.

Known warnings, measured with `npx astryx doctor --built dist`:

- `theme-fonts`: the neutral theme imports Figtree from `fonts.googleapis.com`, which the doctor cannot verify offline. Self-host the font, or accept the external import.
- The app bundle is ~955 kB in one chunk, and the CSS asset ~575 kB. Code-split the sections before this is a public site.

Verify with `npx astryx doctor && npx astryx doctor --built dist`.
