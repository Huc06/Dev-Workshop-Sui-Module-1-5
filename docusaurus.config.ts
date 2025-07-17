import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'SuiHub HCMC',
  tagline: 'Tài liệu Sui Blockchain tiếng Việt',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.sui.io.vn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'suihub-hcmc', // Usually your GitHub org/user name.
  projectName: 'sui-docs-vn', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  presets: [
    [
      'classic',
      {
        docs: false, // Disable default docs
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
    },
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sui-blockchain',
        path: 'docs-sui-blockchain',
        routeBasePath: 'sui-blockchain',
        sidebarPath: './sidebars-sui-blockchain.ts',
        editUrl: 'https://github.com/terrancrypt/sui-docs-vn/tree/main/',
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'move-language',
        path: 'docs-move-language',
        routeBasePath: 'move-language',
        sidebarPath: './sidebars-move-language.ts',
        editUrl: 'https://github.com/terrancrypt/sui-docs-vn/tree/main/',
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'web3-frontend',
        path: 'docs-web3-frontend',
        routeBasePath: 'web3-frontend',
        sidebarPath: './sidebars-web3-frontend.ts',
        editUrl: 'https://github.com/terrancrypt/sui-docs-vn/tree/main/',
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'docs-community',
        routeBasePath: 'community',
        sidebarPath: './sidebars-community.ts',
        editUrl: 'https://github.com/terrancrypt/sui-docs-vn/tree/main/',
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'showcase',
        path: 'showcase',
        routeBasePath: 'showcase-docs',
        sidebarPath: './sidebars-showcase.ts',
        editUrl: 'https://github.com/terrancrypt/sui-docs-vn/tree/main/',
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'SuiHub HCMC Logo',
        src: 'img/Sui_Logo_Ocean.svg',
        srcDark: 'img/Sui_Logo_White.svg',
      },
      hideOnScroll: true,
      items: [
        {
          to: '/sui-blockchain/intro',
          label: 'Sui Blockchain',
          position: 'left',
          activeBaseRegex: `/sui-blockchain/`,
        },
        {
          to: '/move-language/intro',
          label: 'Move Language',
          position: 'left',
          activeBaseRegex: `/move-language/`,
        },
        {
          to: '/web3-frontend/intro',
          label: 'Web3 Frontend',
          position: 'left',
          activeBaseRegex: `/web3-frontend/`,
        },
        {
          to: '/community/intro',
          label: 'Community',
          position: 'left',
          activeBaseRegex: `/community/`,
        },
        {
          to: '/showcase',
          label: 'Showcase',
          position: 'left'
        },
        {
          href: 'https://discord.gg/sui',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://github.com/terrancrypt/sui-docs-vn',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Tài liệu',
          items: [
            {
              label: 'Sui Blockchain',
              to: '/sui-blockchain/intro',
            },
            {
              label: 'Move Language',
              to: '/move-language/intro',
            },
            {
              label: 'Web3 Frontend',
              to: '/web3-frontend/intro',
            },
            {
              label: 'Community',
              to: '/community/intro',
            },
          ],
        },
        {
          title: 'Cộng đồng',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/sui',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/SuiNetwork',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/sui_network',
            },
          ],
        },
        {
          title: 'Liên kết',
          items: [
            {
              label: 'Showcase',
              to: '/showcase',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/terrancrypt/sui-docs-vn',
            },
            {
              label: 'Sui Official Docs',
              href: 'https://docs.sui.io/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SuiHub HCMC.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['rust', 'toml', 'json'],
    },
    // algolia: {
    //   // Uncomment and configure when you have Algolia search set up
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY', 
    //   indexName: 'YOUR_INDEX_NAME',
    //   contextualSearch: true,
    //   searchPagePath: 'search',
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
