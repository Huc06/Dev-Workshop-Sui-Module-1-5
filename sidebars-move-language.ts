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
                'structs',
                'functions',
                'data-types',
            ],
        },
        {
            type: 'category',
            label: 'Nâng cao',
            items: [
                'capability-pattern',
                'debugging',
            ],
        },
    ],
};

export default sidebars; 