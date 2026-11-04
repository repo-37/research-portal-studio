# Internal Architecture & AST Compilation Pipeline

`research-portal-studio` implements a multi-stage Abstract Syntax Tree (AST) compilation and transformation pipeline.

---

## 1. Pipeline Overview

```mermaid
flowchart TD
    MD["Source Markdown Files"] --> AST["Markdown AST (Python-Markdown)"]
    CFG["portal.yaml Specification"] --> MAP["Link & Navigation Resolver"]
    AST --> BS4["DOM Tree (BeautifulSoup4)"]
    MAP --> BS4
    BS4 --> COMP["Component Rewriters<br/>(Mermaid, ASCII, Tables, Alerts)"]
    COMP --> LINK["Link Normalizer (.md -> .html)"]
    LINK --> TMPL["HTML Page Template Wrapper"]
    TMPL --> HTML["Static HTML Files"]
```

---

## 2. Compilation Stages

### Stage 1: Frontmatter Stripping & Alert Pre-Processing
- Removes YAML frontmatter delimiters (`--- ... ---`) from the top of markdown documents to prevent raw metadata leaking into body copy.
- Parses GitHub Alert syntax (`> [!NOTE]`, `> [!WARNING]`, etc.) into pure grayscale semantic callout tags before Markdown parsing.

### Stage 2: Markdown AST Generation
Utilizes `markdown` with the following extension set:
- `tables`: Standard GFM pipe table parser.
- `fenced_code`: Triple-backtick block demarcation.
- `toc`: Header inspection and anchor calculation.
- `nl2br`: Conservative whitespace preservation.
- `codehilite`: Code element tagging.

### Stage 3: DOM Tree Rewriting (BeautifulSoup4)
The raw HTML AST is converted to a mutable DOM tree:
1. **Tables**: Wrapped in `<div class="table-wrap">` and assigned the `.data-table` class to support horizontal scrolling on mobile viewports.
2. **Mermaid Diagrams**: Detected by code class or keyword header (`flowchart`, `graph`, `sequenceDiagram`). Rewritten into `<div class="mermaid-frame"><div class="mermaid">...</div></div>`.
3. **ASCII Box Schematics**: Monospace code blocks containing UTF-8 box-drawing characters (`┌`, `─`, `│`, `└`) or tagged `ascii`/`text` are wrapped into `<div class="ascii-frame"><pre><code class="ascii-art">...</code></pre></div>`.

### Stage 4: Cross-Document Link Normalization
All `<a>` tags with relative Markdown destinations (`href="../path/to/doc.md#anchor"`) are inspected against the resolved page map. Relative file paths are swapped for the target `.html` filename while preserving hash anchors.

### Stage 5: Template Assembly
The transformed DOM is injected into the single-page HTML skeleton:
- Injects responsive breadcrumb path.
- Generates categorized sidebar navigation with active page indicators.
- Emits sequential previous/next pagination footer controls.
