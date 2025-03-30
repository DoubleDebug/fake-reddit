export const RichTextboxConfig = {
  modules: {
    toolbar: [
      [{ header: [0, 1, 2, 3, 4] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  },

  formats: [
    'header',
    'bold',
    'italic',
    'list',
    'underline',
    'ordered',
    'bullet',
    'link',
  ],
};
