import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    web3FrontendSidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Giới thiệu',
        },
        {
            type: 'category',
            label: 'Setup & Development',
            items: [
                'GitHub-Codespace',
                'testing-deployment',
            ],
        },
        {
            type: 'category',
            label: 'Projects',
            items: [
                'my-nft-collection',
            ],
        },
    ],
};

export default sidebars; 