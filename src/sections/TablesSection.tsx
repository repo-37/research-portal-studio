import {Badge} from '@astryxdesign/core/Badge';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import {Text} from '@astryxdesign/core/Text';

type Run = {
  id: string;
  model: string;
  split: 'training' | 'validation' | 'testing';
  accuracy: number;
  latency: number;
  status: 'passed' | 'failed' | 'pending';
};

const RUNS: Run[] = [
  {id: 'r-0184', model: 'slot-a / qwen3b', split: 'testing', accuracy: 0.834, latency: 412, status: 'passed'},
  {id: 'r-0183', model: 'slot-a / qwen3b', split: 'validation', accuracy: 0.821, latency: 398, status: 'passed'},
  {id: 'r-0182', model: 'slot-b / lfm9b', split: 'testing', accuracy: 0.792, latency: 1180, status: 'failed'},
  {id: 'r-0181', model: 'slot-b / lfm9b', split: 'training', accuracy: 0.845, latency: 1264, status: 'passed'},
  {id: 'r-0180', model: 'slot-c / extractor', split: 'testing', accuracy: 0.881, latency: 96, status: 'pending'},
];

const STATUS_VARIANT = {
  passed: 'success',
  failed: 'error',
  pending: 'warning',
} as const;

export function TablesSection() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Data tables</Heading>
        <Text color="secondary">
          Numeric columns align on the decimal, status columns carry a badge, and
          the table keeps its header while it scrolls. Dense research data is rows,
          never a wall of cards.
        </Text>
      </VStack>

      <Table<Run>
        data={RUNS}
        density="compact"
        isStriped
        hasHover
        textOverflow="truncate"
        columns={[
          {key: 'id', header: 'Run', width: pixel(96)},
          {key: 'model', header: 'Model', width: proportional(2, {minWidth: 140})},
          {key: 'split', header: 'Split', width: pixel(110)},
          {
            key: 'accuracy',
            header: 'Accuracy',
            width: pixel(110),
            align: 'end',
            renderCell: (run: Run) => <Text>{run.accuracy.toFixed(3)}</Text>,
          },
          {
            key: 'latency',
            header: 'Latency (ms)',
            width: pixel(120),
            align: 'end',
            renderCell: (run: Run) => <Text>{run.latency}</Text>,
          },
          {
            key: 'status',
            header: 'Status',
            width: pixel(110),
            renderCell: (run: Run) => (
              <Badge label={run.status} variant={STATUS_VARIANT[run.status]} />
            ),
          },
        ]}
      />

      <HStack gap={2} vAlign="center">
        <Badge label="5 runs" variant="neutral" />
        <Text size="sm" color="secondary">
          Compiler output: results/runs.jsonl · one row per run, no aggregation.
        </Text>
      </HStack>
    </VStack>
  );
}
