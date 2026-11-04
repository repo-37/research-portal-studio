# Configuration Guide

`research-portal-studio` supports explicit configuration through a `portal.yaml` file, as well as automatic document discovery when no configuration file is provided.

---

## 1. Minimal `portal.yaml`

Place `portal.yaml` in your project root or pass its location via `--config`:

```yaml
site_title: "Autonomous Robotics Research Portal"
brand_tag: "PERCEPTION"
footer_status: "SYSTEM READY"
footer_version: "v2.4.0"

categories:
  - name: "Overview & Mission"
    items:
      - src: "README.md"
        title: "Executive Summary"
        target: "index.html"
      - src: "docs/ARCHITECTURE.md"
        title: "System Architecture"
        target: "doc_architecture.html"

  - name: "Empirical Studies"
    items:
      - src: "experiments/01_pointcloud_filtering.md"
        title: "Pointcloud Voxel Filtration"
        target: "doc_pointcloud.html"
      - src: "experiments/02_latency_benchmarks.md"
        title: "Inference Latency on Jetson Orin"
        target: "doc_latency.html"
```

---

## 2. Field Reference

| Key | Type | Default | Description |
|---|---|---|---|
| `site_title` | string | `"Research Portal Studio"` | Global title displayed in topbars, headers, and `<title>` tags. |
| `brand_tag` | string | `"RESEARCH"` | Monospace badge appearing above the site title in the sidebar. |
| `footer_status` | string | `"OPERATIONAL"` | Status text next to the green status dot in the sidebar footer. |
| `footer_version` | string | `"v1.0.0"` | Version indicator displayed in the sidebar footer. |
| `categories` | list | `[]` | Ordered list of navigation sections. |
| `categories[].name` | string | (required) | Header label displayed above the section's link list. |
| `categories[].items` | list | (required) | List of page definitions in this category. |
| `items[].src` | string | (required) | Relative path to the Markdown file from the `--source` root. |
| `items[].title` | string | (required) | Human-readable title shown in navigation and page headers. |
| `items[].target` | string | (required) | Output `.html` filename generated in the `--output` directory. |

---

## 3. CLI Command Options

```bash
research-portal-studio [OPTIONS]
```

### Options:

- `-s, --source <PATH>`: The root directory of the markdown repository. Defaults to `.` (current working directory).
- `-o, --output <PATH>`: Directory where compiled `.html`, `.css`, and `.js` files are output. Defaults to `./portal`.
- `-c, --config <PATH>`: Path to YAML configuration file. Defaults to `portal.yaml`. If not found, runs in automatic discovery mode.
- `-h, --help`: Displays help message and CLI options.

---

## 4. Automatic Discovery Mode

When no `portal.yaml` is provided, `research-portal-studio` scans the source directory for all `.md` files (ignoring `.git` and `node_modules`), orders them alphabetically, and compiles them into standalone pages under a single "Repository Documents" category. The first file or any file named `README.md` is automatically mapped to `index.html`.
