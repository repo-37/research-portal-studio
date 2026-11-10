import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

const BADGES = [
  {label: 'neutral', variant: 'neutral'},
  {label: 'info', variant: 'info'},
  {label: 'success', variant: 'success'},
  {label: 'warning', variant: 'warning'},
  {label: 'error', variant: 'error'},
] as const;

export function Notices() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Notices &amp; status</Heading>
        <Text color="secondary">
          A research page has to say what is provisional, what failed, and what was
          superseded. Notices are typed, never decorative.
        </Text>
      </VStack>

      <VStack gap={3}>
        <Banner
          status="info"
          title="Dataset admitted"
          description="dataset-standard@1 passes on tests/library-checks/data: four-way split present, no leakage across splits."
        />
        <Banner
          status="warning"
          title="Provisional result"
          description="Run r-0182 exceeded its latency ceiling. The accuracy figure is reported but not used in the summary."
        />
        <Banner
          status="error"
          title="Reproduction failed"
          description="The recorded seed is absent from r-0182, so the run cannot be replayed. Filed against the run harness."
        />
        <Banner
          status="success"
          title="Reproduced"
          description="Run r-0184 replayed from seed to identical accuracy and latency within 1 percent."
        />
      </VStack>

      <Divider />

      <VStack gap={3}>
        <Heading level={2}>Status labels</Heading>
        <HStack gap={3} wrap="wrap">
          {BADGES.map(badge => (
            <Badge key={badge.label} label={badge.label} variant={badge.variant} />
          ))}
        </HStack>
        <Card padding={4}>
          <HStack gap={6} wrap="wrap">
            <HStack gap={2} vAlign="center">
              <StatusDot variant="success" label="healthy" />
              <Text size="sm">gateway healthy</Text>
            </HStack>
            <HStack gap={2} vAlign="center">
              <StatusDot variant="warning" label="degraded" />
              <Text size="sm">slot b degraded</Text>
            </HStack>
            <HStack gap={2} vAlign="center">
              <StatusDot variant="error" label="down" />
              <Text size="sm">extractor down</Text>
            </HStack>
          </HStack>
        </Card>
      </VStack>
    </VStack>
  );
}
