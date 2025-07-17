import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    communitySidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Giới thiệu',
        },
        {
            type: 'category',
            label: 'Phương pháp học',
            items: [
                'nlp-in-coding',
            ],
        },
        {
            type: 'category',
            label: 'Development Guidelines',
            items: [
                'best-practices',
            ],
        },
    ],
};

export default sidebars; 