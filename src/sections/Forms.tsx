import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';

export function Forms() {
  const [title, setTitle] = useState('Latent projection, k = 3');
  const [source, setSource] = useState('results/latent.npz');
  const [caption, setCaption] = useState(
    'UMAP projection, cluster labels from k-means. n = 512 points, 3 clusters.',
  );
  const [isSaving, setIsSaving] = useState(false);

  const onSave = () => {
    setIsSaving(true);
    window.setTimeout(() => setIsSaving(false), 900);
  };

  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>Authoring</Heading>
        <Text color="secondary">
          Every figure carries a title, a source path, and a caption. The compiler
          refuses a figure without a source, because a result reported anywhere has
          to carry its provenance.
        </Text>
      </VStack>

      <Card padding={5}>
        <VStack gap={4}>
          <TextInput label="Figure title" value={title} onChange={setTitle} />
          <TextInput
            label="Source file"
            description="A path inside the repository, relative to the project root."
            value={source}
            onChange={setSource}
            hasClear
          />
          <TextArea label="Caption" value={caption} onChange={setCaption} />
          <HStack gap={2}>
            <Button
              label="Save figure"
              variant="primary"
              isLoading={isSaving}
              clickAction={onSave}
            />
            <Button label="Preview" variant="secondary" />
            <Button label="Discard" variant="ghost" />
          </HStack>
        </VStack>
      </Card>

      <Banner
        status="info"
        title="Provenance is enforced at admission"
        description="A figure without a source path fails the dataset gate, so the published page cannot cite a number nobody can trace."
      />
    </VStack>
  );
}
