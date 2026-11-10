import {Heading} from '@astryxdesign/core/Heading';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

import {Figure} from '../components/Figure';
import {BarChart, ClusterPlot, ScatterPlot} from '../figures/charts';

export function Figures() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Figures &amp; plots</Heading>
        <Text color="secondary">
          Continuous-tone plots stay vector, take the full content width, and keep
          their colours in theme tokens. The compiler inlines a matplotlib SVG into
          the same frame the app renders.
        </Text>
      </VStack>

      <Figure
        index={1}
        title="Accuracy by trial"
        caption="Source: results/accuracy.json · grouped bars, baseline against treatment, five trials."
      >
        <BarChart />
      </Figure>

      <Figure
        index={2}
        title="Throughput against batch size"
        caption="Source: results/throughput.csv · least-squares fit, r² = 0.94, n = 15."
      >
        <ScatterPlot />
      </Figure>

      <Figure
        index={3}
        title="Latent projection, k = 3"
        caption="Source: results/latent.npz · UMAP projection, cluster labels from k-means."
      >
        <ClusterPlot />
      </Figure>
    </VStack>
  );
}
