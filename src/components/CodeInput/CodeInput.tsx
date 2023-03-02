import { Component, createSignal, mergeProps, onMount } from 'solid-js';
import { CodeInputProps } from '../../types';
import { handleEnterKey, handleTabKey } from '../../utils';
import styles from './styles.module.css';

export const CodeInput: Component<CodeInputProps> = (props) => {
  const merged = mergeProps({ autoHeight: true }, props);

  const language = () => merged.language || 'typescript';
  const value = () => merged.value || '';

  let preElement: HTMLPreElement;
  let textAreaElement: HTMLTextAreaElement;
  let wrapperElement: HTMLDivElement;
  let outerElement: HTMLDivElement;

  // Used to detect when the user manually resizes the wrapper with handle
  let wrapperHeight: number;
  let wrapperWidth: number;

  const [manualResize, setManualResize] = createSignal(false);

  onMount(async () => {
    watchResize();
    if (props.autoHeight) {
      autoHeight();
    }
    setBackgroundWrapper();
  });

  function setBackgroundWrapper() {
    const preBackground = window.getComputedStyle(preElement).backgroundColor;
    outerElement.style.backgroundColor = preBackground;
  }

  function setSizes() {
    const { height, width } = getTextareaSize();
    preElement.style.width = `${width}px`;
    preElement.style.height = `${height}px`;
    wrapperElement.style.width = `${width}px`;
    wrapperElement.style.height = `${height}px`;

    // calculate what 1rem is in pixels
    const rem = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    outerElement.style.width = `${width + rem}px`;
    outerElement.style.height = `${height + rem}px`;
  }

  function getTextareaSize() {
    const { height, width } = textAreaElement.getBoundingClientRect();
    return { height, width };
  }

  function autoHeight() {
    if (manualResize() === true) {
      return;
    }
    wrapperElement.style.height = `0px`;
    wrapperElement.style.height = textAreaElement.scrollHeight + 'px';
  }

  function watchResize() {
    new ResizeObserver(setSizes).observe(textAreaElement);
  }

  function syncScroll() {
    preElement.scrollTop = textAreaElement.scrollTop;
    preElement.scrollLeft = textAreaElement.scrollLeft;
    // Prevents a scrolling issue when the user manually resizes the wrapper
    if (textAreaElement.scrollTop > preElement.scrollTop) {
      textAreaElement.scrollTop = preElement.scrollTop;
    }
    if (textAreaElement.scrollLeft > preElement.scrollLeft) {
      textAreaElement.scrollLeft = preElement.scrollLeft;
    }
  }

  const codeTokens = () => {
    try {
      if (merged.prismJS) {
        if (merged.prismJS.languages[language()]) {
          if (merged.autoHeight) {
            autoHeight();
          }
          const tokens = merged.prismJS.highlight(
            value(),
            merged.prismJS.languages[language()],
            language(),
          );
          return tokens;
        } else {
          if (merged.autoHeight) {
            autoHeight();
          }
          return merged.prismJS.util.encode(value()).toString();
        }
      } else if (merged.highlightjs) {
        const tokens = merged.highlightjs.highlight(value(), {
          language: language(),
        }).value;
        if (merged.autoHeight) {
          autoHeight();
        }
        return tokens;
      }
    } catch (e) {
      console.error(e);
    }
  };

  function handleKeyDown(event: KeyboardEvent) {
    let input_element = textAreaElement;
    let code = input_element.value;
    if (event.key === 'Tab') {
      handleTabKey(event, input_element, code);
      merged.onChange(input_element.value);
    }
    if (event.key === 'Enter') {
      handleEnterKey(event, input_element);
      merged.onChange(input_element.value);
    }
  }

  async function handleInput(e: Event) {
    merged.onChange((e.target as HTMLTextAreaElement).value);
  }

  function handleMouseDown() {
    const { height, width } = getTextareaSize();
    wrapperHeight = height;
    wrapperWidth = width;
  }

  function handleMouseUp() {
    const { height, width } = getTextareaSize();
    if (height !== wrapperHeight || width !== wrapperWidth) {
      setManualResize(true);
    }
  }

  return (
    <div ref={outerElement!} style={`padding: 1rem; background: red;`}>
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        ref={wrapperElement!}
        class={styles.wrap}
      >
        <textarea
          class={`${merged.resize ? styles[`resize-${merged.resize}`] : ''}`}
          spellcheck={false}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onScroll={syncScroll}
          ref={textAreaElement!}
          placeholder={merged.placeholder || 'Type code here...'}
          value={value()}
        ></textarea>
        <pre
          ref={preElement!}
          class={`language-${language()}`}
          aria-hidden={true}
        >
          <div innerHTML={codeTokens()} class="code-highlighted"></div>
        </pre>
      </div>
    </div>
  );
};

export default CodeInput;
