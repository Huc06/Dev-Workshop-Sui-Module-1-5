---
id: intro
title: Giới thiệu về Move Language
sidebar_position: 1
---

# ⚡ Move Language

Chào mừng bạn đến với phần tài liệu về **Move Language**!

## Move Language là gì?

**Move** là ngôn ngữ lập trình được thiết kế đặc biệt cho blockchain, với những đặc điểm nổi bật:

### 🔒 Resource-oriented Programming
- Tài nguyên không thể copy hay drop tùy ý
- Ngăn chặn double-spending tự động
- Linear type system đảm bảo an toàn

### 🛡️ Safety-first Design
- Ngăn chặn các lỗi phổ biến trong smart contracts
- Formal verification capabilities
- Static analysis và type checking

### 🎯 Blockchain-native
- Được thiết kế từ đầu cho blockchain
- Tối ưu cho parallel execution
- Built-in security patterns

## Tại sao chọn Move?

```move
// Move ngăn chặn double-spending tự động
public fun transfer_coin(coin: Coin, recipient: address) {
    transfer::public_transfer(coin, recipient);
    // coin không thể sử dụng lại sau khi transfer
}
```

## Move trên Sui vs Move trên Aptos

| Đặc điểm         | Sui Move            | Aptos Move                            |
| ---------------- | ------------------- | ------------------------------------- |
| **Object Model** | Object-centric      | Account-based                         |
| **Storage**      | Objects có ID riêng | Global storage                        |
| **Execution**    | Parallel by default | Sequential with parallel optimization |
| **Ownership**    | Explicit ownership  | Account ownership                     |

## Nội dung trong phần này

Trong phần này, bạn sẽ học về:

- Hello World trong Move
- Structs và cách định nghĩa
- Functions và visibility
- Data types cơ bản
- Capability pattern
- Debugging techniques

Hãy bắt đầu hành trình lập trình Move! 💪 