import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextbox.css';
import { RichTextboxConfig } from './RichTextboxConfig';

interface IRichTextboxProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const RichTextbox: React.FC<IRichTextboxProps> = (props) => {
  return (
    <ReactQuill
      theme="snow"
      value={props.value}
      placeholder="Whats on your mind?"
      onChange={(newValue: string) => props.onChange(newValue)}
      modules={RichTextboxConfig.modules}
      formats={RichTextboxConfig.formats}
    />
  );
};
