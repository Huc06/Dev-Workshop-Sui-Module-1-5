import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

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
    'introduction',
    {
      type: 'category',
      label: '🚀 Bắt đầu với Sui Move',
      items: [
        'nlp-in-coding',
        'GitHub-Codespace',
        'hello_world.move',
      ],
    },
    {
      type: 'category',
      label: '📚 Kiến thức cơ bản Move',
      items: [
        'data-types',
        'functions',
        'structs',
        'abilities',
        'debugging',
      ],
    },
    {
      type: 'category',
      label: '🎯 Sui Object Model',
      items: [
        'UID, ID và Address',
        'object-centric-model',
        'dynamic-fields',
      ],
    },
    {
      type: 'category',
      label: '🔐 Patterns nâng cao',
      items: [
        'capability-pattern',
        'one-time-witness',
      ],
    },
    {
      type: 'category',
      label: '🧪 Testing & Deployment',
      items: [
        'testing-deployment',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Dự án thực tế',
      items: [
        'my-nft-collection',
      ],
    },
  ],
};

export default sidebars;
