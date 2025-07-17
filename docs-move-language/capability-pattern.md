---
title: Capability Pattern
---

# Capability Pattern trong Sui Move

## 1. Giới thiệu về Capability Pattern

**Capability Pattern** là một design pattern quan trọng trong Sui Move, được sử dụng để **kiểm soát quyền truy cập** và **ủy quyền** trong smart contracts. Pattern này cho phép tạo ra các "chìa khóa" đặc biệt để thực hiện các hành động nhạy cảm.

## 2. Tại sao cần Capability Pattern?

### Vấn đề truyền thống:
```move
// ❌ Không an toàn - ai cũng có thể gọi
public fun admin_function() {
    // Chức năng quan trọng
}
```

### Giải pháp với Capability:
```move
// ✅ An toàn - chỉ ai có AdminCap mới gọi được
public fun admin_function(_: &AdminCap) {
    // Chức năng quan trọng
}
```

## 3. Cách implement Capability Pattern

### 3.1. Định nghĩa Capability Struct
```move
module my_package::admin {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    /// Capability để thực hiện các hành động admin
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Capability để mint tokens
    public struct MintCap has key, store {
        id: UID,
        max_supply: u64,
        minted: u64,
    }
}
```

### 3.2. Tạo và phân phối Capabilities
```move
/// Chỉ được gọi một lần khi deploy contract
fun init(ctx: &mut TxContext) {
    // Tạo AdminCap cho deployer
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    
    // Transfer cho deployer
    transfer::transfer(admin_cap, tx_context::sender(ctx));
}

/// Admin có thể tạo MintCap cho người khác
public fun create_mint_cap(
    _: &AdminCap,  // Cần có AdminCap để gọi
    max_supply: u64,
    ctx: &mut TxContext
): MintCap {
    MintCap {
        id: object::new(ctx),
        max_supply,
        minted: 0,
    }
}
```

### 3.3. Sử dụng Capabilities
```move
/// Chỉ ai có MintCap mới mint được
public fun mint_token(
    mint_cap: &mut MintCap,
    recipient: address,
    ctx: &mut TxContext
) {
    assert!(mint_cap.minted < mint_cap.max_supply, EMintCapExceeded);
    
    let token = Token {
        id: object::new(ctx),
        value: 100,
    };
    
    mint_cap.minted = mint_cap.minted + 1;
    transfer::transfer(token, recipient);
}
```

## 4. Các loại Capability phổ biến

### 4.1. Admin Capability
```move
public struct AdminCap has key, store { id: UID }

// Chỉ admin mới update được config
public fun update_config(_: &AdminCap, new_config: Config) {
    // Implementation
}
```

### 4.2. Mint Capability
```move
public struct MintCap has key, store { 
    id: UID,
    remaining: u64 
}

// Chỉ ai có MintCap mới mint được
public fun mint(_: &mut MintCap, recipient: address) {
    // Implementation
}
```

### 4.3. Burn Capability
```move
public struct BurnCap has key, store { id: UID }

// Chỉ ai có BurnCap mới burn được
public fun burn(_: &BurnCap, token: Token) {
    // Implementation
}
```

## 5. Ví dụ thực tế: Game Item Shop

```move
module game::shop {
    use sui::object::{Self, UID};
    use sui::coin::Coin;
    use sui::sui::SUI;

    // Capability để quản lý shop
    public struct ShopOwnerCap has key, store {
        id: UID,
    }

    // Game item
    public struct GameItem has key, store {
        id: UID,
        name: String,
        rarity: u8,
    }

    // Chỉ shop owner mới thêm item được
    public fun add_item_to_shop(
        _: &ShopOwnerCap,
        name: String,
        rarity: u8,
        ctx: &mut TxContext
    ): GameItem {
        GameItem {
            id: object::new(ctx),
            name,
            rarity,
        }
    }

    // Chỉ shop owner mới withdraw được tiền
    public fun withdraw_earnings(
        _: &ShopOwnerCap,
        shop_balance: &mut Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        coin::split(shop_balance, amount, ctx)
    }
}
```

## 6. Best Practices

### 6.1. Principle of Least Privilege
```move
// ✅ Tốt: Chia nhỏ quyền hạn
public struct MintCap has key, store { id: UID }
public struct BurnCap has key, store { id: UID }
public struct AdminCap has key, store { id: UID }

// ❌ Không tốt: Một cap cho tất cả
public struct SuperCap has key, store { id: UID }
```

### 6.2. Transferable vs Non-transferable
```move
// Transferable - có thể chuyển nhượng
public struct TransferableCap has key, store { id: UID }

// Non-transferable - không thể chuyển nhượng
public struct NonTransferableCap has key { id: UID }  // Không có 'store'
```

### 6.3. Time-limited Capabilities
```move
public struct TimeLimitedCap has key, store {
    id: UID,
    expires_at: u64,  // Timestamp
}

public fun use_capability(
    cap: &TimeLimitedCap,
    clock: &Clock,
) {
    assert!(clock::timestamp_ms(clock) < cap.expires_at, ECapabilityExpired);
    // Use capability
}
```

## 7. Kết luận

Capability Pattern là một công cụ mạnh mẽ để:
- **Kiểm soát quyền truy cập** một cách fine-grained
- **Ủy quyền** an toàn cho các actors khác nhau
- **Tránh centralization** thông qua phân quyền hợp lý
- **Tăng bảo mật** cho smart contracts

Pattern này là nền tảng cho nhiều ứng dụng phức tạp trên Sui blockchain. 