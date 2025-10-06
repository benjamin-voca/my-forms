import { match } from 'ts-pattern';
import ShortAnswer from './ShortAnswer';
import Paragraph from './Paragraph';
import MultipleChoice from './MultipleChoice';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import FileUpload from './FileUpload';
import LinearScale from './LinearScale';
import MCGrid from './MCGrid';
import CheckboxGrid from './CheckboxGrid';
import DateSection from './Date';
import TimeSection from './Time';
import { Component, JSX } from 'solid-js';
import { Section, SectionKind, SectionPayloads } from '~/db/schema/sections';

type SectionByType<K extends SectionKind> = Omit<Section, 'details' | 'type'> & {
  type: K;
  details: { type: K } & SectionPayloads[K];
};

export type NarrowSection = {
  [K in SectionKind]: SectionByType<K>;
}[SectionKind];
interface SectionCardProps {
  title: string;
  description?: string;
  children: JSX.Element;
}

const SectionCard: Component<SectionCardProps> = (props) => {
  return (
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mb-6 mx-auto">
      <div class="mb-4">
        <h2 class="text-xl font-medium text-gray-900">{props.title}</h2>
        {props.description && (
          <p class="text-sm text-gray-600 mt-1">{props.description}</p>
        )}
      </div>
      <div class="flex flex-col gap-4">
        {props.children}
      </div>
    </div>
  );
};

const SectionRenderer = (props: { section: NarrowSection}): JSX.Element => {
  const { section } = props;

  const sectionComponent = match(section)
    .with({ type: 'ShortAnswer' }, (s) => <ShortAnswer section={s.details} />)
    .with({ type: 'Paragraph' }, (s) => <Paragraph section={s.details} />)
    .with({ type: 'MultipleChoice' }, (s) => <MultipleChoice section={s.details} />)
    .with({ type: 'Checkbox' }, (s) => <Checkbox section={s.details} />)
    .with({ type: 'Dropdown' }, (s) => <Dropdown section={s.details} />)
    .with({ type: 'FileUpload' }, (s) => <FileUpload section={s.details} />)
    .with({ type: 'LinearScale' }, (s) => <LinearScale section={s.details} />)
    .with({ type: 'MCGrid' }, (s) => <MCGrid section={s.details} />)
    .with({ type: 'CheckboxGrid' }, (s) => <CheckboxGrid section={s.details} />)
    .with({ type: 'Date' }, (s) => <DateSection section={s.details} />)
    .with({ type: 'Time' }, (s) => <TimeSection section={s.details} />)
    .exhaustive(); // this ensures all types are covered
  return (<SectionCard title={section.title} description={section.description}> {sectionComponent}</SectionCard>)
};

export default SectionRenderer;
