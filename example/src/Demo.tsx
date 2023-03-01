import Prism from 'prismjs';
import { createEffect, createSignal, onMount, Show } from 'solid-js';
import { CodeInput } from '../../dist/esm';
import styles from './App.module.css';

const libs = [
  import('prismjs/components/prism-markup'),
  import('prismjs/components/prism-typescript'),
  import('prismjs/components/prism-javascript'),
  import('prismjs/components/prism-jsx'),
];

const BEST_THEMES = [
  'atom-dark',
  'xonokai',
  'nord',
  'vsc-dark-plus',
  'synthwave84',
  'one-dark',
  'one-light',
  'material-dark',
  'material-light',
  'material-oceanic',
  'prism-one-dark',
  'darcula',
  'dracula',
  'duotone-dark',
  'duotone-earth',
  'duotone-forest',
  'duotone-light',
  'duotone-sea',
  'duotone-space',
];

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
      autoHeight={true}
      resize="both"
      value={input}
    />
  );
}

render(() => <App />, document.getElementById('app'));`;

export function Demo() {
  const [input, setInput] = createSignal('');
  // Syntax Highlight libraries. It's up to you to import them.
  // CodeInput will use either library if you pass it in.
  const [loadedPrism, setLoadedPrism] = createSignal(false);
  const [languagePrism, setLanguagePrism] = createSignal('jsx');

  createEffect(async () => {
    await Promise.all(libs);
    setLoadedPrism(true);
    // sleep 5 seconds to load
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // setInterval(async () => {
    const oldStyle = document.getElementById('theme');
    if (oldStyle) {
      document.head.removeChild(oldStyle);
    }
    const theme = BEST_THEMES[Math.floor(Math.random() * BEST_THEMES.length)];
    const res = await import(`./prism-themes/${theme}.css?raw`);
    const style = document.createElement('style');
    style.textContent = res.default;
    style.id = `theme`;
    document.head.appendChild(style);
    document.body.dataset.theme = theme;
    // }, 500);
  });

  return (
    <div class={styles.app}>
      <div>
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
      </div>
    </div>
  );
}
