import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    suiBlockchainSidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Giới thiệu',
        },
        {
            type: 'category',
            label: 'Kiến trúc Sui',
            items: [
                'object-centric-model',
                'UID, ID và Address',
                'dynamic-fields',
            ],
        },
        {
            type: 'category',
            label: 'Hệ thống Type',
            items: [
                'abilities',
                'one-time-witness',
            ],
        },
    ],
};

export default sidebars; 