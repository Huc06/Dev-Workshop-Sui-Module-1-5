---
title: Hello World Move Module
---

# Tạo Module Move đầu tiên

Chào mừng bạn đến với bài học đầu tiên về lập trình Move trên Sui! Trong bài này, chúng ta sẽ tạo một module Move đơn giản để hiểu cách hoạt động cơ bản.

## 1. Tạo dự án mới

Đầu tiên, tạo một dự án Move mới:

```bash
sui move new hello_world_project
cd hello_world_project
```

## 2. Code Hello World Module

Tạo file `sources/hello_world.move` với nội dung sau:

```move
// hello_world_project/sources/hello_world.move
module hello_world::hello_world {

    use std::string;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// An object that contains an arbitrary string
    public struct HelloWorldObject has key, store {
        id: UID,
        /// A string contained in the object
        text: string::String
    }

    #[lint_allow(self_transfer)]
    public entry fun hello_world(ctx: &mut TxContext) {
        let object = HelloWorldObject {
            id: object::new(ctx),
            text: string::utf8(b"Hello World!")
        };
        transfer::public_transfer(object, tx_context::sender(ctx));
    }
} 
```

## 3. Giải thích code

### 3.1. Module declaration
```move
module hello_world::hello_world {
```
- Định nghĩa module với package name `hello_world` và module name `hello_world`

### 3.2. Struct definition
```move
public struct HelloWorldObject has key, store {
    id: UID,
    text: string::String
}
```
- `key`: Object có thể được owned và transferred
- `store`: Object có thể được stored trong other objects
- `UID`: Unique identifier cho object

### 3.3. Entry function
```move
public entry fun hello_world(ctx: &mut TxContext)
```
- `entry`: Function có thể được gọi từ transaction
- `TxContext`: Cung cấp thông tin về transaction context

## 4. Build và test

### 4.1. Build project
```bash
sui move build
```

Kết quả build thành công:
```
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING hello_world
```

### 4.2. Test locally
```bash
sui move test
```

## 5. Publish lên testnet

```bash
# Publish module
sui client publish --gas-budget 100000000

# Gọi function
sui client call --function hello_world --module hello_world --package <PACKAGE_ID> --gas-budget 10000000
```

Chúc mừng! Bạn đã tạo thành công module Move đầu tiên trên Sui! 🎉 