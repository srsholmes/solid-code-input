import Prism from 'prismjs';
import highlightjs from 'highlight.js';
import { createEffect, createSignal, Show } from 'solid-js';
import styles from './App.module.css';
import { CodeInput } from '../../dist/esm';
import { importHighlightLanguage, importPrismLanguage } from './importer';
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

export function App() {
  // Our code input
  const [input, setInput] = createSignal(exampleCode);

  // Syntax Highlight libraries. It's up to you to import them.
  // CodeInput will use either library if you pass it in.
  const [loadedPrism, setLoadedPrism] = createSignal(false);
  const [loadedHighlight, setLoadedHighlight] = createSignal(true);
  const [languagePrism, setLanguagePrism] = createSignal('typescript');
  const [languageHighlight, setLanguageHighlight] = createSignal('typescript');

  // Only show the code input when the syntax highlight libraries are loaded.
  createEffect(async () => {
    await importPrismLanguage({
      language: languagePrism?.() || 'typescript',
    });
    setLoadedPrism(true);

    await importHighlightLanguage({
      language: languageHighlight?.() || 'typescript',
    });
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
