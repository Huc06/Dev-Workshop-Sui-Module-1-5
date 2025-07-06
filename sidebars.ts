import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Say Hello Move',
      items: [
        'nlp-in-coding',
        'GitHub-Codespace',
      ],
    },
    {
      type: 'category',
      label: 'The Basic move programming',
      items: [
        'data-types',
        'functions',
        'structs',
        'abilities',
      ],
    },
    {
      type: 'category',
      label: 'Object programming',
      items: [
        'object-centric-model',
        'capability-pattern',
        'dynamic-fields',
        'one-time-witness',
      ],
    },
  ],
};

export default sidebars;
