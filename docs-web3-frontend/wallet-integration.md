---
id: wallet-integration
title: Tích hợp Sui Wallet
sidebar_position: 3
---

# 💼 Tích hợp Sui Wallet

## Cài đặt Sui dApp Kit

```bash
npm install @mysten/dapp-kit @mysten/sui.js @tanstack/react-query
```

## Setup Provider

### 1. Cấu hình SuiClientProvider

```tsx
// App.tsx
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const networks = {
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networks} defaultNetwork="testnet">
                <WalletProvider>
                    <YourApp />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}
```

### 2. Import CSS (tùy chọn)

```tsx
import '@mysten/dapp-kit/dist/index.css';
```

## Connect Wallet Button

### 1. Component cơ bản

```tsx
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

function WalletSection() {
    const currentAccount = useCurrentAccount();

    return (
        <div>
            <ConnectButton />
            {currentAccount && (
                <div>
                    <h3>Đã kết nối:</h3>
                    <p>Address: {currentAccount.address}</p>
                </div>
            )}
        </div>
    );
}
```

### 2. Custom Connect Button

```tsx
import { 
    useConnectWallet, 
    useDisconnectWallet, 
    useCurrentAccount,
    useWallets 
} from '@mysten/dapp-kit';

function CustomWalletConnect() {
    const currentAccount = useCurrentAccount();
    const { mutate: connect } = useConnectWallet();
    const { mutate: disconnect } = useDisconnectWallet();
    const wallets = useWallets();

    if (currentAccount) {
        return (
            <div>
                <p>Kết nối: {currentAccount.address.slice(0, 6)}...</p>
                <button onClick={() => disconnect()}>
                    Ngắt kết nối
                </button>
            </div>
        );
    }

    return (
        <div>
            <h3>Chọn ví:</h3>
            {wallets.map((wallet) => (
                <button
                    key={wallet.name}
                    onClick={() => connect({ wallet })}
                    disabled={!wallet.features['sui:connect']}
                >
                    <img src={wallet.icon} alt={wallet.name} width={24} />
                    {wallet.name}
                </button>
            ))}
        </div>
    );
}
```

## Thực hiện Transaction từ Frontend

### 1. Transfer SUI

```tsx
import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

function TransferSui() {
    const client = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

    const handleTransfer = async () => {
        const tx = new TransactionBlock();
        
        // Split coin và transfer
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000000)]); // 0.001 SUI
        tx.transferObjects([coin], tx.pure('0x_recipient_address_'));

        signAndExecute(
            {
                transactionBlock: tx,
                options: {
                    showEffects: true,
                },
            },
            {
                onSuccess: (result) => {
                    console.log('Transfer thành công:', result.digest);
                },
                onError: (error) => {
                    console.error('Transfer thất bại:', error);
                },
            }
        );
    };

    return (
        <button onClick={handleTransfer}>
            Transfer 0.001 SUI
        </button>
    );
}
```

### 2. Tương tác với Smart Contract

```tsx
function InteractWithContract() {
    const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

    const handleMintNFT = async () => {
        const tx = new TransactionBlock();
        
        // Gọi function từ smart contract đã deploy
        tx.moveCall({
            target: 'package_id::nft::mint',
            arguments: [
                tx.pure('NFT Name'),
                tx.pure('NFT Description'),
                tx.pure('https://image-url.com'),
            ],
        });

        signAndExecute(
            {
                transactionBlock: tx,
            },
            {
                onSuccess: (result) => {
                    console.log('Mint NFT thành công:', result.digest);
                },
            }
        );
    };

    return (
        <button onClick={handleMintNFT}>
            Mint NFT
        </button>
    );
}
```

## Lấy dữ liệu từ Blockchain

### 1. Lấy Objects của User

```tsx
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

function UserObjects() {
    const currentAccount = useCurrentAccount();
    
    const { data: objects, isLoading } = useSuiClientQuery(
        'getOwnedObjects',
        {
            owner: currentAccount?.address || '',
            filter: {
                StructType: 'package_id::nft::NFT',
            },
        },
        {
            enabled: !!currentAccount?.address,
        }
    );

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h3>NFTs của bạn:</h3>
            {objects?.data.map((obj) => (
                <div key={obj.data?.objectId}>
                    Object ID: {obj.data?.objectId}
                </div>
            ))}
        </div>
    );
}
```

### 2. Lấy Balance

```tsx
function UserBalance() {
    const currentAccount = useCurrentAccount();
    
    const { data: balance } = useSuiClientQuery(
        'getBalance',
        {
            owner: currentAccount?.address || '',
        },
        {
            enabled: !!currentAccount?.address,
        }
    );

    return (
        <div>
            SUI Balance: {balance?.totalBalance || '0'} MIST
        </div>
    );
}
```

## Error Handling

```tsx
function TransactionWithErrorHandling() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

    const handleTransaction = async () => {
        setLoading(true);
        setError(null);

        try {
            const tx = new TransactionBlock();
            // ... setup transaction

            signAndExecute(
                { transactionBlock: tx },
                {
                    onSuccess: (result) => {
                        console.log('Success:', result.digest);
                        setLoading(false);
                    },
                    onError: (error) => {
                        console.error('Error:', error);
                        setError(error.message || 'Transaction failed');
                        setLoading(false);
                    },
                }
            );
        } catch (err) {
            setError('Failed to create transaction');
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleTransaction} disabled={loading}>
                {loading ? 'Processing...' : 'Execute Transaction'}
            </button>
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </div>
    );
}
```

## Network Switching

```tsx
import { useSuiClientContext } from '@mysten/dapp-kit';

function NetworkSwitcher() {
    const { selectNetwork, networks, network } = useSuiClientContext();

    return (
        <select 
            value={network} 
            onChange={(e) => selectNetwork(e.target.value)}
        >
            {Object.keys(networks).map((networkName) => (
                <option key={networkName} value={networkName}>
                    {networkName}
                </option>
            ))}
        </select>
    );
}
```

## Best Practices

### 1. Loading States
```tsx
function TransactionButton() {
    const [isPending, setIsPending] = useState(false);
    
    return (
        <button disabled={isPending}>
            {isPending ? 'Processing...' : 'Submit Transaction'}
        </button>
    );
}
```

### 2. Transaction Confirmation
```tsx
function TransactionWithConfirmation() {
    const handleTransaction = () => {
        if (window.confirm('Bạn có chắc muốn thực hiện giao dịch này?')) {
            // Execute transaction
        }
    };

    return <button onClick={handleTransaction}>Execute</button>;
}
```

### 3. Gas Estimation
```tsx
async function estimateGas(tx: TransactionBlock) {
    try {
        const dryRun = await client.dryRunTransactionBlock({
            transactionBlock: await tx.build({ client }),
        });
        return dryRun.effects.gasUsed;
    } catch (error) {
        console.error('Gas estimation failed:', error);
        return null;
    }
}
```

## Tiếp theo

Trong bài tiếp theo, chúng ta sẽ học cách deploy và test ứng dụng dApp trên Sui. 