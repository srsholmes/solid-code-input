import { Component, createSignal, mergeProps, onMount } from 'solid-js';
import { CodeInputProps } from '../../types';
import { handleEnterKey, handleTabKey } from '../../utils';
import styles from './styles.module.css';

export const CodeInput: Component<CodeInputProps> = (props) => {
  const merged = mergeProps({ autoHeight: true }, props);
  let preElement: HTMLPreElement;
  let textAreaElement: HTMLTextAreaElement;
  let wrapperElement: HTMLDivElement;

  // Used to detect when the user manually resizes the wrapper with handle
  let wrapperHeight: number;
  let wrapperWidth: number;

  const [manualResize, setManualResize] = createSignal(false);

  onMount(async () => {
    watchResize();
    if(props.autoHeight){
      autoHeight();
    }
  });

  function setSizes() {
    const { height, width } = getWrapperSize();
    preElement.style.width = `${width}px`;
    preElement.style.height = `${height}px`;
  }

  function getWrapperSize() {
    const { height, width } = wrapperElement.getBoundingClientRect();
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
    new ResizeObserver(setSizes).observe(wrapperElement);
  }

  function syncScroll() {
    preElement.scrollTop = textAreaElement.scrollTop;
    preElement.scrollLeft = textAreaElement.scrollLeft;
  }

  const codeTokens = () => {
    try {
      if (merged.prismJS) {
        if (merged.prismJS.languages[merged.language()]) {
          if (merged.autoHeight) {
            autoHeight();
          }
          return merged.prismJS.highlight(
            merged.value(),
            merged.prismJS.languages[merged.language()],
            merged.language(),
          );
        } else {
          if (merged.autoHeight) {
            autoHeight();
          }
          return merged.prismJS.util.encode(merged.value()).toString();
        }
      } else if (merged.highlightjs) {
        const tokens = merged.highlightjs.highlight(merged.value(), {
          language: merged.language(),
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
    const { height, width } = getWrapperSize();
    wrapperHeight = height;
    wrapperWidth = width;
  }

  function handleMouseUp() {
    const { height, width } = getWrapperSize();
    if (height !== wrapperHeight || width !== wrapperWidth) {
      setManualResize(true);
    }
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      ref={wrapperElement!}
      class={`${styles['code-input']} ${
        merged.resize ? styles[`resize-${merged.resize}`] : ''
      }`}
    >
      <textarea
        placeholder={merged.placeholder}
        onkeydown={handleKeyDown}
        onScroll={syncScroll}
        ref={textAreaElement!}
        spellcheck={false}
        value={merged.value()}
        oninput={handleInput}
      ></textarea>
      <pre
        ref={preElement!}
        class={`language-${merged.language()}`}
        aria-hidden={true}
      >
        <div innerHTML={codeTokens()} class="code-highlighted"></div>
      </pre>
    </div>
  );
};

export default CodeInput;
