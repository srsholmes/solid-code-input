import highlightjs from 'highlight.js';
import Prism from 'prismjs';
import { createSignal, onMount, Show } from 'solid-js';
import { CodeInput } from '../../dist/esm';
import styles from './App.module.css';

import './themes/nord-highlight.css';
import './themes/nord-prism.css';

const exampleCode = `import { render } from 'solid-js/web';
import { createSignal, createEffect } from 'solid-js';
import Prism from 'prismjs';
import { CodeInput } from '@srsholmes/solid-code-input';

function App() {
  const [input, setInput] = createSignal('');

  return (
    <CodeInput
      placeholder="Input your code here..."
      prismJS={Prism}
      onChange={setInput}
      language={'jsx'}
      autoHeight={true}
      resize="both"
      value={input}
    />
  );
}

render(() => <App />, document.getElementById('app'));
`;

// Syntax Highlight libraries to generate the tokens.
//  It's up to you to import them.
const libs = [
  import('prismjs/components/prism-markup'),
  import('prismjs/components/prism-typescript'),
  import('prismjs/components/prism-javascript'),
  import('prismjs/components/prism-jsx'),
  import('prismjs/components/prism-markup'),
  import('prismjs/components/prism-css'),
  import('highlight.js/lib/languages/typescript'),
  import('highlight.js/lib/languages/javascript'),
  import('highlight.js/lib/languages/css'),
];

export function App() {
  // Our code input
  const [input, setInput] = createSignal(exampleCode);

  // Syntax Highlight libraries. It's up to you to import them.
  // CodeInput will use either library if you pass it in.
  const [loadedPrism, setLoadedPrism] = createSignal(false);
  const [loadedHighlight, setLoadedHighlight] = createSignal(true);
  const [languagePrism, setLanguagePrism] = createSignal('jsx');
  const [languageHighlight, setLanguageHighlight] = createSignal('typescript');

  onMount(async () => {
    await Promise.all(libs);
    setLoadedPrism(true);
    setLoadedHighlight(true);
  });

  return (
    <div class={styles.app}>
      <h1 class={styles.heading}>Solid Code Input Demo</h1>
      <div>
        <h2>PrismJS</h2>
        <Show when={loadedPrism()}>
          <div>
            <CodeInput
              autoHeight={true}
              resize="both"
              placeholder="Input your code here..."
              prismJS={Prism}
              onChange={setInput}
              value={input()}
              language={languagePrism()}
            />
          </div>
        </Show>

        <LanguageSelect setLanguage={setLanguagePrism} value={languagePrism} />
      </div>
      <div>
        <h2>Highlight.js</h2>
        <Show when={loadedHighlight()}>
          <CodeInput
            autoHeight={false}
            resize="vertical"
            placeholder="Input your code here..."
            highlightjs={highlightjs}
            onChange={setInput}
            value={input()}
            language={languageHighlight()}
          />
        </Show>
        <LanguageSelect
          setLanguage={setLanguageHighlight}
          value={languageHighlight}
        />
      </div>
    </div>
  );

  function LanguageSelect(props: {
    setLanguage: (language: string) => void;
    value: () => string;
  }) {
    return (
      <select
        class={styles.select}
        value={props.value()}
        oninput={(e) => props.setLanguage(e.currentTarget.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="jsx">JSX</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="json">JSON</option>
      </select>
    );
  }
}
