import Prism from 'prismjs';
import { createEffect, createSignal, Show } from 'solid-js';
import { CodeInput } from '../../dist/esm';
import styles from './App.module.css';
import { importPrismLanguage } from './importer';
// import './prism-themes/nord.css';
// import './prism-themes/prism-shades-of-purple.css';
// import './prism-themes/shades-of-purple.css';

const themes = [
  'a11y-dark',
  'atom-dark',
  'base16-ateliersulphurpool.light',
  'cb',
  'coldark-cold',
  'coldark-dark',
  'coy-without-shadows',
  'darcula',
  'dracula',
  'duotone-dark',
  'duotone-earth',
  'duotone-forest',
  'duotone-light',
  'duotone-sea',
  'duotone-space',
  'ghcolors',
  'gruvbox-dark',
  'gruvbox-light',
  'holi-theme',
  'hopscotch',
  'laserwave',
  'lucario',
  'material-dark',
  'material-light',
  'material-oceanic',
  'nord',
  'one-dark',
  'one-light',
  'pojoaque',
  'prism-one-dark',
  'prism-shades-of-purple',
  'shades-of-purple',
  'solarized-dark-atom',
  'synthwave84',
  'vs',
  'vsc-dark-plus',
  'xonokai',
  'z-touch',
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
      language={'tsx'}
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

  // Only show the code input when the syntax highlight libraries are loaded.
  createEffect(async () => {
    await importPrismLanguage({
      language: languagePrism?.() || 'jsx',
    });
    setLoadedPrism(true);
  });

  createEffect(async () => {
    // sleep 5 seconds to load
    await new Promise((resolve) => setTimeout(resolve, 5000));

    setInterval(async () => {
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
    }, 500);
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
              value={input}
              language={languagePrism}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
