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
import { JSX } from 'solid-js';

const SectionRenderer = (props: { section: any }): JSX.Element => {
  const { section } = props;

  switch (section.type) {
    case 'ShortAnswer':
      return <ShortAnswer section={section} />;
    case 'Paragraph':
      return <Paragraph section={section} />;
    case 'MultipleChoice':
      return <MultipleChoice section={section} />;
    case 'Checkbox':
      return <Checkbox section={section} />;
    case 'Dropdown':
      return <Dropdown section={section} />;
    case 'FileUpload':
      return <FileUpload section={section} />;
    case 'LinearScale':
      return <LinearScale section={section} />;
    case 'MCGrid':
      return <MCGrid section={section} />;
    case 'CheckboxGrid':
      return <CheckboxGrid section={section} />;
    case 'Date':
      return <DateSection section={section} />;
    case 'Time':
      return <TimeSection section={section} />;
    default:
      console.warn('Unknown section type:', section.type);
      const _exhaustiveCheck: never = section;
      return _exhaustiveCheck;
  }
};

export default SectionRenderer;
