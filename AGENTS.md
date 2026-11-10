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

Installed 2026-11-10 with `@astryxdesign/cli@0.7.12`:

| package | version | role |
|---|---|---|
| `@astryxdesign/core` | 0.7.12 | components, base CSS (`reset.css`, `astryx.css`) |
| `@astryxdesign/theme-neutral` | 0.7.12 | restrained warm gray theme |
| `@stylexjs/stylex` | 0.19.1 | StyleX runtime; needs `@stylexjs/babel-plugin` in a bundler before any `xstyle` is compiled |
| `react`, `react-dom` | 19.3.1 | peer dependencies of core |
| `@astryxdesign/cli` | 0.7.12 | devDependency; run as `npx astryx` |

Before rendering a component, in this order:

1. Base CSS, from the app entry: `@import "@astryxdesign/core/reset.css";` then `@import "@astryxdesign/core/astryx.css";`
2. Theme: `npx astryx theme add neutral` writes `astryx-themes`, then wrap the root in `<Theme theme={themes[defaultThemeSlug]}>`.
3. Components import from their own entry, the path `npx astryx component <Name>` prints.

Two things block a drop-in adoption here, both measured on 2026-11-10:

- **Cascade layers.** `style.css` is unlayered, and the Astryx stylesheets live in `@layer reset` and `@layer astryx-base`. Unlayered styles beat any layer regardless of specificity, so the 2007-line `style.css` would override every Astryx component. Adopting Astryx means declaring `@layer reset, astryx-base, app;` at the top of `style.css` and wrapping its body in `@layer app { ... }`.
- **No bundler.** This is a static site: `index.html`, `app.js`, `style.css`, no build step. Nothing imports React today, so no component renders until an entry and a bundler exist. `npx astryx doctor` reports `themes: [warn]` for this reason.

Verify with `npx astryx doctor`.
