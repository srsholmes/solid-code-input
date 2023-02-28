import highlightjs from 'highlight.js';
import Prism from 'prismjs';
import { Accessor } from 'solid-js';

export type CodeInputProps = {
  prismJS?: typeof Prism;
  highlightjs?: typeof highlightjs;
  value: Accessor<string>;
  language: Accessor<string>;
  onChange: (value: string) => void;
  placeholder?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoHeight?: boolean;
};
