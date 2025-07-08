---
title: Debug trong Move
---

# Hướng dẫn Debug trong Move

Trong Move, bạn có thể sử dụng module `std::debug` để in giá trị ra console khi chạy test hoặc trong môi trường phát triển.

## Ví dụ sử dụng `debug::print`

Bạn có thể thêm dòng `use std::debug;` và gọi `debug::print(&biến_của_bạn);` để in giá trị của biến đó.

**File `firts_project/sources/hello_world.move` (ví dụ):**

```move
// hello_world.move
module firts_project::hello_world {

    use std::debug;
 
    #[test]
    public entry fun hello_world() {
        let _y = 5; // Move sẽ đoán kiểu từ ngữ cảnh
        let _y: u8 = 200; // rõ ràng hơn
        let _z = 1_000_000u64; // dễ đọc, dễ nhớ
        debug::print(&_x);
        debug::print(&_y);
        debug::print(&_z);
    }
}
```

## Cách chạy test để xem kết quả debug

Để chạy test và xem kết quả từ `debug::print`, bạn sử dụng lệnh:

```bash
sui move test
```

Kết quả từ `debug::print` sẽ hiển thị trong output của lệnh `sui move test`. 