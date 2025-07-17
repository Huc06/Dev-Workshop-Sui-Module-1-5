---
id: sui-sdk-basics
title: Sui SDK Cơ bản
sidebar_position: 2
---

# 🔧 Sui SDK Cơ bản

## Cài đặt Sui SDK

### JavaScript/TypeScript
```bash
npm install @mysten/sui.js
# hoặc
yarn add @mysten/sui.js
```

### React với Sui dApp Kit
```bash
npm install @mysten/dapp-kit @mysten/sui.js @tanstack/react-query
```

## Khởi tạo SuiClient

```typescript
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

// Kết nối với Testnet
const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
});

// Kết nối với Mainnet
const mainnetClient = new SuiClient({
    url: getFullnodeUrl('mainnet'),
});

// Custom RPC endpoint
const customClient = new SuiClient({
    url: 'https://your-custom-rpc.com',
});
```

## Các thao tác cơ bản

### 1. Lấy thông tin Object

```typescript
// Lấy object theo ID
const objectId = '0x123...';
const object = await client.getObject({
    id: objectId,
    options: {
        showContent: true,
        showOwner: true,
        showType: true,
    },
});

console.log('Object data:', object.data);
```

### 2. Query Objects theo Owner

```typescript
// Lấy tất cả objects của một address
const address = '0xabc...';
const ownedObjects = await client.getOwnedObjects({
    owner: address,
    filter: {
        StructType: 'package_id::module::StructName',
    },
});

console.log('Owned objects:', ownedObjects.data);
```

### 3. Lấy thông tin Balance

```typescript
// Lấy SUI balance
const balance = await client.getBalance({
    owner: address,
});

console.log('SUI Balance:', balance.totalBalance);

// Lấy balance của coin khác
const customCoinBalance = await client.getBalance({
    owner: address,
    coinType: '0x123::my_coin::MY_COIN',
});
```

### 4. Lấy thông tin Transaction

```typescript
// Lấy transaction theo digest
const txDigest = 'abc123...';
const transaction = await client.getTransactionBlock({
    digest: txDigest,
    options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
    },
});

console.log('Transaction:', transaction);
```

## Tạo và thực hiện Transaction

### 1. Transfer SUI

```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';

const tx = new TransactionBlock();

// Transfer SUI
tx.transferObjects(
    [tx.gas], // Sử dụng gas coin
    tx.pure('0x_recipient_address_'),
);

// Hoặc transfer amount cụ thể
const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000000)]); // 0.001 SUI
tx.transferObjects([coin], tx.pure('0x_recipient_address_'));
```

### 2. Tương tác với Smart Contract

```typescript
const tx = new TransactionBlock();

// Tương tác với smart contract đã deploy
tx.moveCall({
    target: 'package_id::module_name::function_name',
    arguments: [
        tx.pure('hello'), // String argument
        tx.pure(42),      // Number argument
        tx.object('0x_object_id_'), // Object argument
    ],
});
```

### 3. Ký và thực hiện Transaction

```typescript
// Với keypair (server-side)
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

const keypair = Ed25519Keypair.generate();
const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
});

console.log('Transaction result:', result.digest);
```

## Event Subscription

```typescript
// Subscribe to events
const unsubscribe = await client.subscribeEvent({
    filter: {
        Package: 'package_id',
    },
    onMessage: (event) => {
        console.log('New event:', event);
    },
});

// Unsubscribe sau một thời gian
setTimeout(() => {
    unsubscribe();
}, 60000);
```

## Error Handling

```typescript
try {
    const result = await client.getObject({ id: 'invalid_id' });
} catch (error) {
    if (error.code === 'OBJECT_NOT_FOUND') {
        console.log('Object không tồn tại');
    } else {
        console.error('Lỗi khác:', error.message);
    }
}
```

## Best Practices

### 1. Connection Management
```typescript
// Sử dụng connection pooling
const client = new SuiClient({
    url: getFullnodeUrl('testnet'),
    // Thêm options cho production
});
```

### 2. Error Handling
```typescript
const safeGetObject = async (objectId: string) => {
    try {
        return await client.getObject({ id: objectId });
    } catch (error) {
        console.error(`Failed to get object ${objectId}:`, error);
        return null;
    }
};
```

### 3. Batch Operations
```typescript
// Thay vì nhiều calls riêng lẻ
const promises = objectIds.map(id => client.getObject({ id }));
const objects = await Promise.all(promises);
```

## Tiếp theo

Trong bài tiếp theo, chúng ta sẽ học cách tích hợp với Sui Wallet để tạo trải nghiệm người dùng hoàn chỉnh. 