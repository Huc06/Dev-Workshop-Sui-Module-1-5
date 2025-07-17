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
            label: 'Cơ bản',
            items: [
                'sui-sdk-basics',
                'wallet-integration',
                'react-components',
            ],
        },
        {
            type: 'category',
            label: 'Development & Deployment',
            items: [
                'frontend-setup',
                'frontend-deployment',
            ],
        },
    ],
};

export default sidebars; 