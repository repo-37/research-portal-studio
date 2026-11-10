import {Banner} from '@astryxdesign/core/Banner';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

import {Figure} from '../components/Figure';

const ASCII_ARCH = `+-------------------+        +-------------------+
|  source tree      |        |  portal.yaml      |
|  docs/**/*.md     |        |  nav, sections    |
+---------+---------+        +---------+---------+
          |                            |
          v                            v
+---------------------------------------------------+
|  ast parser  ->  section canon  ->  page assembler |
+-------------------------+-------------------------+
                          |
                          v
              +-----------+-----------+
              |   dist/page-*.html    |
              |   style.css, index    |
              +-----------------------+

Legend:  ->  data flow     |  tier boundary`;

const MERMAID = `flowchart TD
  A[markdown tree] --> B[ast parser]
  B --> C[section canon]
  C --> D[page assembler]
  D --> E[dist/page-*.html]
  D --> F[search index]
  F --> G[portal search]`;

export function Diagrams() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Diagrams &amp; ascii</Heading>
        <Text color="secondary">
          Architecture diagrams arrive as mermaid source or as monospaced text.
          Both are stored as source, rendered at build time, and shown here in the
          same figure frame.
        </Text>
      </VStack>

      <Banner
        status="warning"
        title="Mermaid renders at compile time, not in the browser"
        description="The compiler turns a mermaid fence into inline SVG so a published portal needs no runtime script. In this app the source is shown as code until the same transform is wired into the build."
      />

      <Figure
        index={4}
        title="Compiler architecture"
        caption="Source: docs/dev/ARCHITECTURE.md · monospaced schematic, preserved verbatim."
      >
        <CodeBlock code={ASCII_ARCH} language="text" hasLineNumbers={false} />
      </Figure>

      <Figure
        index={5}
        title="Page assembly pipeline"
        caption="Source: docs/dev/ARCHITECTURE.md · mermaid flowchart, compiled to inline SVG."
      >
        <CodeBlock code={MERMAID} language="mermaid" hasLineNumbers={false} />
      </Figure>
    </VStack>
  );
}
