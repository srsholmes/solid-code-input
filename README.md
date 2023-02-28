# Solid Code Input

## Introduction

Solid Code Input is a small component for SolidJS that allows you to create a lightweight text area component which will automatically syntax highlight the code you type in it. It is designed for basic use cases where you want to display code to the user, and allow them to edit it, without all the overhead of a full blown code editor.

![solid-code-input](./resources/demo.gif 'solid-code-input')
![solid-code-input](./resources/example.png 'solid-code-input')

It supports both [PrismJS](https://prismjs.com/) and [HighlightJS](https://highlightjs.org/) to do the syntax highlighting, and will use either depending on which library you pass in as a prop.

## Features

- Very Lightweight (no dependencies)
- Easier to use than CodeMirror, Ace, and Monaco
- Supports both PrismJS and HighlightJS
- Auto Indentation
- Tab to indent
- Auto resize to fit content
- Resizable
- Placeholders

## Installation

```bash
npm install @srsholmes/solid-code-input
# or
yarn add @srsholmes/solid-code-input
```

## Usage

```jsx
import { CodeInput } from '@srsholmes/code-input';

<CodeInput
  autoHeight={true}
  resize="both"
  placeholder="Input your code here..."
  prismJS={Prism}
  onChange={setInput}
  value={input}
  language={languagePrism}
/>;
```

## API

CodeInput takes the following props:
| Name          | Type                                                | Description                                                                       |
|---------------|-----------------------------------------------------|-----------------------------------------------------------------------------------|
| `prismJS`     | `typeof Prism`                                     | Optional. An instance of the Prism library for syntax highlighting.              |
| `highlightjs` | `typeof highlightjs`                               | Optional. An instance of the Highlight.js library for syntax highlighting.        |
| `value`       | `Accessor<string>`                                 | Required. A state accessor for the value of the code input.                        |
| `language`    | `Accessor<string>`                                 | Required. A state accessor for the language of the code input.                     |
| `onChange`    | `(value: string) => void`                          | Required. A callback function that is called when the value of the input changes. |
| `placeholder` | `string`                                            | Optional. Placeholder text for the input.                                         |
| `resize`      | `'both'` \| `'horizontal'` \| `'vertical'`         | Optional. Specifies whether the input can be resized, and in which direction.     |
| `autoHeight`  | `boolean`                                           | Optional. Specifies whether the input height should adjust automatically.         |


## Types
```ts
export type CodeInputProps = {
  prismJS?: typeof Prism;
  highlightjs?: typeof highlightjs;
  value: Accessor<string>;
  language: Accessor<string>;
  onChange: (value: string) => void;
  placeholder?: string;
  resize?: 'both' | 'horizontal' | 'vertical';
  autoHeight?: boolean;
};
```

## Shout outs
Shout out to Oliver Geer (WebCoder49) for this awesome article which inspired this component [Creating an Editable Textarea That Supports Syntax-Highlighted Code](https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/).

The method used was heavily inspired by this repo [code-input](https://github.com/WebCoder49/code-input), and the auto indent was taken directly from his indent plugin.

## License
MIT