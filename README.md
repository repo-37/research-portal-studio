# Research Portal Studio (`research-portal-studio`)

A deterministic documentation compiler and static site generator that transforms scientific, architectural, and agentic research repositories into high-performance, accessible multi-page portals styled with the **Pure Grayscale Design System** ($R=G=B$, zero chromatic tinting).

## Key Features

1. **Deterministic Markdown-to-HTML AST Compiler**: Converts standard Markdown trees into modular standalone HTML pages with automated cross-document link resolution.
2. **Pure Grayscale Design Tokens**: Built on a 15-step grayscale token scale (`--gray-0` `#000000` to `--gray-100` `#ffffff`) with zero blue or zinc undertones.
3. **Collapsible Navigation & Global Keyboard Shortcuts**:
   - Collapsible desktop sidebar via `Alt+B` hotkey and header fold toggle.
   - Persistent layout preference saved in `localStorage`.
   - Native quick-filter search (`Ctrl+K`).
4. **6-Part Scientific Canon Layout**: Automatically structures empirical research documents into canonical cards:
   - (1) Problem Definition & Motivation
   - (2) Research Questions & Objectives
   - (3) Baseline & Prior State Analysis
   - (4) Experimental Methodology
   - (5) Empirical Results
   - (6) Analysis & Synthesis
5. **Component Fences**:
   - Mermaid diagram wrapper (`.mermaid-frame`)
   - Monospace UTF-8 Unicode ASCII schematics (`.ascii-frame`)
   - GitHub alert callouts (`> [!NOTE]`, `> [!WARNING]`, etc.)
   - Responsive data tables (`.table-wrap > .data-table`)

---

## Directory Structure

```
research-portal-studio/ (formerly gh-pages-demo)
├── bin/
│   └── research-portal-studio      # Standalone compilation CLI tool
├── docs/
│   ├── dev/
│   │   ├── ARCHITECTURE.md          # AST compilation & component mapping internals
│   │   └── EXTENDING_DESIGN_SYSTEM.md # Adding components & CSS token constraints
│   └── usage/
│       ├── CONFIGURATION.md         # Comprehensive portal.yaml and CLI options
│       ├── WORKFLOW_GUIDE.md        # Operator authoring & maintenance protocol
│       └── DEPLOYMENT.md            # GitHub Pages, Vercel, and local serving
├── index.html                       # Living design system showcase & layout catalog
├── style.css                        # Pure grayscale tokens and component library styles
├── app.js                           # Sidebar collapsible controller, theme engine, search
├── README.md                        # Project landing & quickstart
└── .nojekyll                        # Direct GitHub Pages static deployment
```

---

## Quickstart

### 1. Requirements

```bash
pip install markdown beautifulsoup4 pyyaml
```

### 2. Run Compiler

From any repository containing Markdown documentation:

```bash
# Using the CLI tool directly:
/path/to/research-portal-studio/bin/research-portal-studio \
  --source /path/to/markdown-repo \
  --output ./dist-portal \
  --config portal.yaml
```

### 3. Preview Locally

```bash
python3 -m http.server 8080 --directory ./dist-portal
```

---

## Documentation Links

- [Configuration Guide (`docs/usage/CONFIGURATION.md`)](file:///mnt/data/projects/gh-pages-demo-wt-studio/docs/usage/CONFIGURATION.md)
- [Operator Workflow Guide (`docs/usage/WORKFLOW_GUIDE.md`)](file:///mnt/data/projects/gh-pages-demo-wt-studio/docs/usage/WORKFLOW_GUIDE.md)
- [Deployment Guide (`docs/usage/DEPLOYMENT.md`)](file:///mnt/data/projects/gh-pages-demo-wt-studio/docs/usage/DEPLOYMENT.md)
- [Architecture & AST Compiler Internals (`docs/dev/ARCHITECTURE.md`)](file:///mnt/data/projects/gh-pages-demo-wt-studio/docs/dev/ARCHITECTURE.md)
- [Extending the Design System (`docs/dev/EXTENDING_DESIGN_SYSTEM.md`)](file:///mnt/data/projects/gh-pages-demo-wt-studio/docs/dev/EXTENDING_DESIGN_SYSTEM.md)
