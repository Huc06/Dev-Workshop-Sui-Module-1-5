---
title: Object Centric Model
---

# Mô hình Object-Centric trong Sui

## 1. Giới thiệu về Object Model

Sui sử dụng **mô hình đối tượng** (object model) làm nền tảng cho toàn bộ hệ thống blockchain. Khác với các blockchain khác sử dụng mô hình account-based, Sui tập trung vào các **objects** như đơn vị cơ bản để lưu trữ và xử lý dữ liệu.

## 2. Đặc điểm của Objects trong Sui

### 2.1. Mỗi Object có ID duy nhất
```move
public struct MyObject has key {
    id: UID,        // ID duy nhất của object
    value: u64,     // Dữ liệu của object
}
```

### 2.2. Objects có ownership (quyền sở hữu)
- **Owned Objects**: Thuộc về một address cụ thể
- **Shared Objects**: Có thể được truy cập bởi nhiều transaction đồng thời
- **Immutable Objects**: Không thể thay đổi sau khi tạo

### 2.3. Objects có thể chứa Objects khác
```move
public struct Container has key {
    id: UID,
    items: vector<Item>,  // Chứa nhiều objects con
}
```

## 3. Lợi ích của Object Model

### 3.1. Parallel Execution (Thực thi song song)
- Các transaction không liên quan có thể chạy đồng thời
- Tăng throughput của blockchain

### 3.2. Intuitive Programming Model
- Lập trình viên dễ hiểu hơn so với global state
- Objects giống như real-world entities

### 3.3. Efficient Storage
- Chỉ load objects cần thiết cho transaction
- Tiết kiệm memory và compute

## 4. Ví dụ thực tế

```move
module my_package::game {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;

    // Game character object
    public struct Character has key, store {
        id: UID,
        name: String,
        level: u8,
        experience: u64,
    }

    // Weapon object
    public struct Weapon has key, store {
        id: UID,
        name: String,
        damage: u16,
        owner: address,
    }

    // Function để tạo character mới
    public fun create_character(
        name: String, 
        ctx: &mut TxContext
    ): Character {
        Character {
            id: object::new(ctx),
            name,
            level: 1,
            experience: 0,
        }
    }
}
```

## 5. So sánh với các blockchain khác

| Blockchain | Model         | Đặc điểm                        |
| ---------- | ------------- | ------------------------------- |
| Ethereum   | Account-based | Global state, khó parallel      |
| Sui        | Object-based  | Local state, parallel execution |
| Solana     | Account-based | Parallel nhưng phức tạp         |

## 6. Kết luận

Mô hình Object-Centric của Sui mang lại:
- **Hiệu suất cao** thông qua parallel execution
- **Dễ lập trình** với intuitive model
- **Bảo mật tốt** thông qua ownership system
- **Scalability** cho future growth 