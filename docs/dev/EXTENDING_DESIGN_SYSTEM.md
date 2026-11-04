# Extending the Pure Grayscale Design System

The Pure Grayscale Design System enforced by `research-portal-studio` operates under the strict mathematical constraint of zero chromatic undertones ($R = G = B$).

---

## 1. CSS Custom Properties & Token Scale

All UI tokens are defined in `style.css`. The system uses a 15-step grayscale ramp:

```css
:root {
  --gray-0: #000000;
  --gray-5: #0d0d0d;
  --gray-10: #1a1a1a;
  --gray-15: #262626;
  --gray-20: #333333;
  --gray-30: #4d4d4d;
  --gray-40: #666666;
  --gray-50: #808080;
  --gray-60: #999999;
  --gray-70: #b3b3b3;
  --gray-80: #cccccc;
  --gray-85: #d9d9d9;
  --gray-90: #e6e6e6;
  --gray-95: #f2f2f2;
  --gray-100: #ffffff;
}
```

### Absolute Constraints:
- **No Chromatic Undertones**: Values like `#f8fafc` (slate) or `#f4f4f5` (zinc) are strictly forbidden. Every RGB component must match ($R=G=B$).
- **Canvas vs Surface Inversion**:
  - In **Light Mode**: The page background canvas is `--gray-95` (`#f2f2f2`), while cards and sidebars are elevated with `--gray-100` (`#ffffff`).
  - In **Dark Mode**: The page background canvas is `--gray-0` (`#000000`), while cards and sidebars are elevated with `--gray-10` (`#1a1a1a`).

---

## 2. Adding a New Component

When introducing a new visual component to `style.css`:

1. **Declare Semantic Role**:
   Assign colors via semantic variables (`--color-surface-card`, `--color-border-subtle`, `--color-text-primary`) rather than hardcoded hex values.

2. **Hover & Interactive Elevations**:
   Elevate hover states through border contrast rather than colorful box shadows:
   ```css
   .custom-component {
     background-color: var(--color-surface-card);
     border: 1px solid var(--color-border-subtle);
     transition: border-color 0.15s ease, background-color 0.15s ease;
   }

   .custom-component:hover {
     border-color: var(--color-border-strong);
     background-color: var(--color-surface-hover);
   }
   ```

3. **Register AST Handler in Compiler**:
   If the component requires automated injection from Markdown syntax, add a corresponding handler in `bin/research-portal-studio` within `clean_markdown_and_convert()`.
