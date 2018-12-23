import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/xcode.css';

[
  'bash',
  'cpp',
  'cs',
  'css',
  'dart',
  'dockerfile',
  'go',
  'http',
  'java',
  'javascript',
  'json',
  'julia',
  'makefile',
  'markdown',
  'nginx',
  'python',
  'shell',
  'xml',
  'yaml'
].forEach(langName => {
  /* eslint-disable */
  const langModule = require(`highlight.js/lib/languages/${langName}`);
  hljs.registerLanguage(langName, langModule);
});

hljs.initHighlightingOnLoad();
