import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    moveLanguageSidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Giới thiệu',
        },
        {
            type: 'category',
            label: 'Cơ bản',
            items: [
                'hello_world.move',
                'data-types',
                'structs',
                'functions',
            ],
        },
        {
            type: 'category',
            label: 'Hệ thống Type',
            items: [
                'abilities',
            ],
        },
        {
            type: 'category',
            label: 'Patterns & Best Practices',
            items: [
                'one-time-witness',
                'capability-pattern',
            ],
        },
        {
            type: 'category',
            label: 'Development',
            items: [
                'GitHub-Codespace',
                'debugging',
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