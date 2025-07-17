---
title: One time witness
---

# One-Time Witness trong Move: Khởi tạo duy nhất

"One-Time Witness" (OTW) là mô hình trong Move, đảm bảo module chỉ khởi tạo một lần. Quan trọng cho tính duy nhất và bất biến của cấu hình trên blockchain.

## 1. Mục đích

OTW giúp:

*   Đảm bảo khởi tạo duy nhất.
*   Kiểm soát tạo/cấu hình lại tài nguyên.
*   Tăng cường bảo mật.

## 2. Vai trò của `Drop` Ability

OTW là `struct` rỗng với `drop` ability. Move Runtime tạo OTW và truyền vào `init`. OTW tự động bị `drop` sau khi `init` hoàn tất, đảm bảo `init` chỉ chạy một lần.

## 3. Ví dụ đơn giản

Module với `init` dùng OTW để khởi tạo `Config` object duy nhất:

```move
module my_address::my_module {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    struct MY_MODULE_ONE_TIME_WITNESS has drop {}

    struct MyConfig has key, store {
        id: UID,
        value: u64,
    }

    fun init(otw: MY_MODULE_ONE_TIME_WITNESS, ctx: &mut TxContext) {
        let initial_config = MyConfig {
            id: object::new(ctx),
            value: 100,
        };
        transfer::share_object(initial_config);
    }
}
```

### Giải thích ví dụ:

*   `MY_MODULE_ONE_TIME_WITNESS`: Struct rỗng, `has drop`. Sui Runtime tạo một lần khi module publish.
*   `fun init(...)`: Hàm khởi tạo module, nhận OTW đảm bảo tính duy nhất.
*   `MyConfig`: Object tạo ra duy nhất một lần trong `init`.

## 4. Cách sử dụng (Triển khai)

Biên dịch và triển khai module. Sui CLI/Runtime tự động xử lý OTW.

```bash
sui client publish --gas-budget 1000000
```

Lần đầu publish, `init` được gọi và `MyConfig` object được tạo. Các lần publish sau, `init` không chạy lại.

--- 