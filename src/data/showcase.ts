export type TagType =
    | 'defi'
    | 'nft'
    | 'gaming'
    | 'infrastructure'
    | 'social'
    | 'dao'
    | 'marketplace'
    | 'wallet'
    | 'analytics'
    | 'bridge';

export type User = {
    title: string;
    description: string;
    preview: string | null;
    website: string;
    source: string | null;
    tags: TagType[];
};

export const TagList: { [type in TagType]: { label: string; description: string; color: string } } = {
    defi: {
        label: 'DeFi',
        description: 'Ứng dụng tài chính phi tập trung',
        color: '#39ca30',
    },
    nft: {
        label: 'NFT',
        description: 'Non-Fungible Tokens và collectibles',
        color: '#fe6829',
    },
    gaming: {
        label: 'Gaming',
        description: 'Game blockchain và metaverse',
        color: '#8c2f00',
    },
    infrastructure: {
        label: 'Infrastructure',
        description: 'Công cụ và infrastructure cho developers',
        color: '#127f82',
    },
    social: {
        label: 'Social',
        description: 'Mạng xã hội và ứng dụng cộng đồng',
        color: '#14cfc3',
    },
    dao: {
        label: 'DAO',
        description: 'Tổ chức tự trị phi tập trung',
        color: '#ffcfc3',
    },
    marketplace: {
        label: 'Marketplace',
        description: 'Thị trường giao dịch',
        color: '#f7b93e',
    },
    wallet: {
        label: 'Wallet',
        description: 'Ví điện tử và quản lý tài sản',
        color: '#fb9d3b',
    },
    analytics: {
        label: 'Analytics',
        description: 'Phân tích dữ liệu blockchain',
        color: '#8c2f00',
    },
    bridge: {
        label: 'Bridge',
        description: 'Cầu nối giữa các blockchain',
        color: '#4267b2',
    },
};

export const Users: User[] = [
    {
        title: 'Cetus Protocol',
        description: 'DEX hàng đầu trên Sui với concentrated liquidity và yield farming',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://cetus.zone',
        source: 'https://github.com/CetusProtocol',
        tags: ['defi', 'marketplace'],
    },
    {
        title: 'Turbos Finance',
        description: 'DeFi protocol tối ưu hóa yield farming và liquidity provision',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://turbos.finance',
        source: null,
        tags: ['defi'],
    },
    {
        title: 'Kriya DEX',
        description: 'Orderbook-based DEX với trải nghiệm trading chuyên nghiệp',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://kriya.finance',
        source: null,
        tags: ['defi', 'marketplace'],
    },
    {
        title: 'Suiet Wallet',
        description: 'Ví Sui đa nền tảng với UI/UX thân thiện',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://suiet.app',
        source: 'https://github.com/suiet/suiet',
        tags: ['wallet', 'infrastructure'],
    },
    {
        title: 'BlueMove',
        description: 'NFT marketplace đa chuỗi với focus vào Sui ecosystem',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://sui.bluemove.net',
        source: null,
        tags: ['nft', 'marketplace'],
    },
    {
        title: 'Clutchy',
        description: 'Game NFT với gameplay engaging và tokenomics bền vững',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://clutchy.io',
        source: null,
        tags: ['gaming', 'nft'],
    },
    {
        title: 'Sui Vision',
        description: 'Block explorer và analytics platform cho Sui blockchain',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://suivision.xyz',
        source: null,
        tags: ['analytics', 'infrastructure'],
    },
    {
        title: 'Aftermath Finance',
        description: 'DeFi suite với staking, lending và advanced trading tools',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://aftermath.finance',
        source: null,
        tags: ['defi'],
    },
    {
        title: 'Scallop',
        description: 'Money market protocol cho lending và borrowing',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://scallop.io',
        source: null,
        tags: ['defi'],
    },
    {
        title: 'Polymedia',
        description: 'Nền tảng tạo và quản lý NFT collections',
        preview: '/img/showcase/placeholder.svg',
        website: 'https://polymedia.app',
        source: null,
        tags: ['nft', 'infrastructure'],
    },
];

export function sortUsers() {
    let result = Users;
    // Sort by site name
    result = result.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    return result;
} 