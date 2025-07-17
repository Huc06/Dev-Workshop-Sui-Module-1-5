---
id: best-practices
title: Best Practices
sidebar_position: 2
---

# 🎯 Best Practices trong Sui Development

## Move Language Best Practices

### 1. Naming Conventions

```move
// ✅ Good: Sử dụng snake_case cho functions và variables
public fun create_user_profile(name: String): UserProfile {
    // ...
}

// ✅ Good: Sử dụng PascalCase cho structs
public struct UserProfile has key, store {
    id: UID,
    name: String,
}

// ❌ Bad: Inconsistent naming
public fun createUserProfile(userName: String): userProfile {
    // ...
}
```

### 2. Error Handling

```move
// ✅ Good: Sử dụng const cho error codes
const EInvalidAmount: u64 = 0;
const EInsufficientBalance: u64 = 1;

public fun transfer_coins(amount: u64, balance: u64) {
    assert!(amount > 0, EInvalidAmount);
    assert!(balance >= amount, EInsufficientBalance);
    // ... transfer logic
}
```

### 3. Resource Management

```move
// ✅ Good: Explicit resource handling
public fun safe_destroy_empty_coin(coin: Coin<SUI>) {
    let Coin { id, balance } = coin;
    assert!(balance::value(&balance) == 0, ENotEmpty);
    balance::destroy_zero(balance);
    object::delete(id);
}

// ❌ Bad: Không handle resource properly
public fun unsafe_function(coin: Coin<SUI>) {
    // coin sẽ bị stuck nếu không được handle
}
```

### 4. Access Control

```move
// ✅ Good: Sử dụng capability pattern
public struct AdminCap has key, store {
    id: UID,
}

public fun admin_only_function(_: &AdminCap, ctx: &mut TxContext) {
    // Chỉ admin mới có thể gọi function này
}
```

## Security Best Practices

### 1. Input Validation

```move
public fun create_listing(
    price: u64,
    item: Item,
    ctx: &mut TxContext
) {
    // ✅ Validate inputs
    assert!(price > 0, EInvalidPrice);
    assert!(object::owner(&item) == tx_context::sender(ctx), ENotOwner);
    
    // ... create listing
}
```

### 2. Reentrancy Protection

```move
// ✅ Good: Thay đổi state trước khi external calls
public fun withdraw(pool: &mut Pool, amount: u64, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    
    // Update state first
    let balance = table::borrow_mut(&mut pool.balances, sender);
    assert!(*balance >= amount, EInsufficientBalance);
    *balance = *balance - amount;
    
    // Then transfer
    let coin = coin::take(&mut pool.treasury, amount, ctx);
    transfer::public_transfer(coin, sender);
}
```

### 3. Overflow Protection

```move
// ✅ Good: Kiểm tra overflow
public fun safe_add(a: u64, b: u64): u64 {
    let result = a + b;
    assert!(result >= a && result >= b, EOverflow);
    result
}
```

## Frontend Best Practices

### 1. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
async function executeTransaction(tx: TransactionBlock) {
    try {
        const result = await signAndExecuteTransactionBlock({
            transactionBlock: tx,
        });
        
        if (result.effects?.status?.status === 'success') {
            console.log('Transaction successful:', result.digest);
            return result;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        if (error.message.includes('User rejected')) {
            console.log('User cancelled transaction');
        } else if (error.message.includes('Insufficient gas')) {
            console.error('Not enough gas for transaction');
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}
```

### 2. Loading States

```tsx
// ✅ Good: Clear loading states
function TransactionButton() {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleClick = async () => {
        setIsLoading(true);
        try {
            await executeTransaction();
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <button 
            onClick={handleClick} 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
        >
            {isLoading ? 'Processing...' : 'Submit Transaction'}
        </button>
    );
}
```

### 3. Data Fetching

```typescript
// ✅ Good: Efficient data fetching
const { data: objects, isLoading, error } = useSuiClientQuery(
    'getOwnedObjects',
    {
        owner: currentAccount?.address || '',
        filter: { StructType: 'package::module::Type' },
        options: { showContent: true },
    },
    {
        enabled: !!currentAccount?.address,
        refetchInterval: 10000, // Refetch every 10 seconds
        staleTime: 5000, // Consider data stale after 5 seconds
    }
);
```

## Testing Best Practices

### 1. Unit Tests

```move
#[test]
fun test_transfer_valid_amount() {
    let ctx = tx_context::dummy();
    let coin = coin::mint_for_testing<SUI>(1000, &mut ctx);
    
    // Test valid transfer
    transfer_amount(&mut coin, 500);
    assert!(coin::value(&coin) == 500, 0);
}

#[test]
#[expected_failure(abort_code = EInsufficientBalance)]
fun test_transfer_insufficient_balance() {
    let ctx = tx_context::dummy();
    let coin = coin::mint_for_testing<SUI>(100, &mut ctx);
    
    // Should fail
    transfer_amount(&mut coin, 500);
}
```

### 2. Integration Tests

```typescript
// ✅ Good: Test complete workflows
describe('NFT Marketplace', () => {
    it('should complete full buy/sell flow', async () => {
        // 1. Mint NFT
        const mintTx = new TransactionBlock();
        mintTx.moveCall({
            target: 'package::nft::mint',
            arguments: [/* args */],
        });
        
        const mintResult = await client.signAndExecuteTransactionBlock({
            signer: seller,
            transactionBlock: mintTx,
        });
        
        // 2. List NFT
        const listTx = new TransactionBlock();
        // ... setup listing
        
        // 3. Buy NFT
        const buyTx = new TransactionBlock();
        // ... setup purchase
        
        // Verify final state
        const nftOwner = await client.getObject({ id: nftId });
        expect(nftOwner.owner).toBe(buyer.address);
    });
});
```

## Performance Best Practices

### 1. Batch Operations

```typescript
// ✅ Good: Batch multiple operations
const tx = new TransactionBlock();

// Batch multiple mints in one transaction
for (let i = 0; i < 10; i++) {
    tx.moveCall({
        target: 'package::nft::mint',
        arguments: [tx.pure(`NFT ${i}`)],
    });
}

await signAndExecuteTransactionBlock({ transactionBlock: tx });
```

### 2. Efficient Queries

```typescript
// ✅ Good: Use specific filters
const { data } = useSuiClientQuery('getOwnedObjects', {
    owner: address,
    filter: {
        StructType: 'package::module::SpecificType',
    },
    options: {
        showContent: true,
        showType: false, // Only fetch what you need
        showOwner: false,
    },
});
```

### 3. Caching Strategy

```typescript
// ✅ Good: Smart caching
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000, // 30 seconds
            cacheTime: 300000, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});
```

## Code Organization

### 1. Module Structure

```
sources/
├── core/
│   ├── coin.move
│   └── nft.move
├── marketplace/
│   ├── listing.move
│   └── auction.move
└── utils/
    ├── math.move
    └── events.move
```

### 2. Frontend Structure

```
src/
├── components/
│   ├── common/
│   ├── wallet/
│   └── marketplace/
├── hooks/
│   ├── useTransactions.ts
│   └── useNFTs.ts
├── utils/
│   ├── sui.ts
│   └── constants.ts
└── types/
    └── sui.ts
```

## Documentation Best Practices

### 1. Code Comments

```move
/// Creates a new marketplace listing
/// 
/// # Arguments
/// * `item` - The item to be listed
/// * `price` - Price in MIST (1 SUI = 1,000,000,000 MIST)
/// * `ctx` - Transaction context
/// 
/// # Returns
/// * `Listing` - The created listing object
/// 
/// # Aborts
/// * `EInvalidPrice` - If price is 0
/// * `ENotOwner` - If sender doesn't own the item
public fun create_listing(
    item: Item,
    price: u64,
    ctx: &mut TxContext
): Listing {
    // Implementation
}
```

### 2. README Documentation

```markdown
# Project Name

## Overview
Brief description of what the project does.

## Quick Start
```bash
sui move build
sui move test
```

## Architecture
Explain the main components and how they interact.

## API Reference
Link to detailed API documentation.
```

Những best practices này sẽ giúp bạn viết code an toàn, hiệu quả và dễ maintain trong Sui ecosystem! 