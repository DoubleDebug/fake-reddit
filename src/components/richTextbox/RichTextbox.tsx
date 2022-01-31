import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextbox.css';

interface IRichTextboxProps {
    value: string;
    onChange: (newValue: string) => void;
}

const modules = {
    toolbar: [
        [{ header: [0, 1, 2, 3, 4] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold',
    'italic',
    'list',
    'underline',
    'ordered',
    'bullet',
    'link',
];

export const RichTextbox: React.FC<IRichTextboxProps> = (props) => {
    return (
        <ReactQuill
            theme="snow"
            value={props.value}
            placeholder="Whats on your mind?"
            onChange={(newValue) => props.onChange(newValue)}
            modules={modules}
            formats={formats}
        ></ReactQuill>
    );
};
