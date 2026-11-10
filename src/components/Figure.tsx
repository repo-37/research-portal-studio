import type {ReactNode} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

/**
 * The figure contract: number, title, plotting surface, source caption.
 * A matplotlib SVG, a mermaid graph, and an ascii schematic all land in the
 * same frame, so a report reads the same regardless of how the figure was made.
 */
export function Figure({
  index,
  title,
  caption,
  children,
}: {
  index: number;
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <VStack gap={2}>
      <HStack gap={2} vAlign="center">
        <Badge label={`Figure ${index}`} variant="neutral" />
        <Heading level={3}>{title}</Heading>
      </HStack>
      <Card padding={3} width="100%">
        {children}
      </Card>
      <Text size="sm" color="secondary">
        {caption}
      </Text>
    </VStack>
  );
}
