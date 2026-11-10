import {Banner} from '@astryxdesign/core/Banner';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Grid} from '@astryxdesign/core/Grid';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';

const FACTS = [
  {label: 'Figures rendered', value: '6', note: 'bar, scatter, cluster'},
  {label: 'Tables compiled', value: '12', note: '4-part split dataset'},
  {label: 'Diagram sources', value: '31', note: 'mermaid and ascii'},
];

export function Overview() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Research Portal Studio</Heading>
        <Text>
          A compiler and a reading surface for empirical research. Markdown trees
          become standalone pages, and every figure, table, and diagram keeps its
          provenance from source file to rendered page.
        </Text>
      </VStack>

      <Banner
        status="info"
        title="Figures are first-class content"
        description="Plots, architecture diagrams, ascii schematics, and tables share one frame and one caption rule, so a report reads the same whether a figure came from matplotlib, mermaid, or a text file."
      />

      <Grid columns={3} gap={4}>
        {FACTS.map(fact => (
          <Card key={fact.label} padding={4}>
            <VStack gap={1}>
              <Text size="sm" color="secondary">
                {fact.label}
              </Text>
              <Heading level={2}>{fact.value}</Heading>
              <Badge label={fact.note} variant="neutral" />
            </VStack>
          </Card>
        ))}
      </Grid>

      <VStack gap={2}>
        <Heading level={2}>Reading surfaces</Heading>
        <Text color="secondary">
          Each entry in the sidebar is a page: figures, diagrams, tables, notices,
          and the authoring surface. The compiler writes static HTML from the same
          data; this app reads it interactively.
        </Text>
      </VStack>
    </VStack>
  );
}
