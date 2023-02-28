import highlightjs from 'highlight.js';

const prismImportMap = {
  typescript: () => import('prismjs/components/prism-typescript'),
  javascript: () => import('prismjs/components/prism-javascript'),
  jsx: () => import('prismjs/components/prism-jsx'),
  html: () => import('prismjs/components/prism-markup'),
  css: () => import('prismjs/components/prism-css'),
};

export async function importPrismLanguage(args: { language: string }) {
  if (!args.language || prismImportMap[args.language] === undefined) {
    return;
  }
  return Promise.all([
    import('prismjs/components/prism-markup'),
    prismImportMap[args.language.toLowerCase()](),
  ]);
}

const highlightImportMap = {
  typescript: () => import('highlight.js/lib/languages/typescript'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  css: () => import('highlight.js/lib/languages/css'),
};

export async function importHighlightLanguage(args: { language: string }) {
  if (
    !args.language ||
    prismImportMap[args.language.toLowerCase()] === undefined
  ) {
    return;
  }
  const lang = await highlightImportMap[args.language.toLowerCase()]();
  return highlightjs.registerLanguage(args.language, lang.default);
}
