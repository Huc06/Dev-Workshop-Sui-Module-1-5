---
title: Structs và Resources trong Move
---

Trong Move, `struct` là kiểu dữ liệu do người dùng định nghĩa, cho phép bạn gom nhóm nhiều thuộc tính có kiểu rõ ràng (typed fields) lại với nhau.

### Struct là gì?

A `struct` là một cấu trúc dữ liệu do người dùng định nghĩa chứa các trường có kiểu. `Struct` có thể lưu trữ bất kỳ kiểu nào không phải tham chiếu (non-reference) và không phải tuple (non-tuple type), bao gồm cả các `struct` khác.

Struct có thể chứa:

*   Kiểu nguyên thủy (`u64`, `bool`, `address`)
*   Chuỗi (`String`)
*   Hoặc struct khác (như `struct` lồng nhau)

### Resources là gì?

Move mặc định xem mọi `struct` là linear và ephemeral:

*   **Linear**: không thể tự ý sao chép (`copy`) hay bỏ (`drop`) giá trị.
*   **Ephemeral**: không được lưu trữ trong storage.

Điều này giúp tránh lỗi tự ý nhân bản tài sản (như tiền), rất phù hợp khi xây ứng dụng tài chính, blockchain, NFT,...

Để thay đổi điều đó, bạn cần thêm các `abilities` cho `struct`:

*   `copy`: Cho phép sao chép.
*   `drop`: Cho phép tự động huỷ.
*   `store`: Cho phép lưu trong storage.

```move
public struct Foo has copy, drop, store {
    value: u64
}
```

### Bài học: Tạo Loài Vật và Chuồng Thú bằng Struct

Hãy tưởng tượng bạn đang xây dựng một hệ thống quản lý Sở Thú.

#### 1. Định nghĩa struct Animal và Enclosure

```move
public struct Animal has copy, drop {
    name: String,
    is_predator: bool,
}

public struct Enclosure has copy, drop {
    title: String,
    resident: Animal,
    built_year: u16,
    is_open: bool,
    maintenance_count: Option<u16>,
}
```

**Giải thích:**

*   `name`: Tên con vật.
*   `is_predator`: Có phải là loài ăn thịt?
*   `resident`: Con vật đang sống trong chuồng.
*   `maintenance_count`: Có thể có hoặc không (`Option<u16>`).

#### 2. Viết hàm test Sở Thú

```move
#[test]
public fun test_zoo() {
    let tiger = Animal {
        name: b"Tiger".to_string(),
        is_predator: true,
    };

    let cage = Enclosure {
        title: b"Tiger Zone".to_string(),
        resident: tiger,
        built_year: 2018,
        is_open: true,
        maintenance_count: option::some(7),
    };

    // Kiểm tra điều kiện
    assert!(cage.built_year == 2018, 100);
    assert!(cage.is_open, 101);
    assert!(cage.resident.name == b"Tiger".to_string(), 102);

    // In thông tin chuồng thú ra màn hình
    debug::print(&cage); 
}
```

#### Kết quả khi chạy `sui move test`

```text
[debug] 0x0::hello_world::Enclosure {
  title: "Tiger Zone",
  resident: 0x0::hello_world::Animal {
    name: "Tiger",
    is_predator: true
  },
  built_year: 2018,
  is_open: true,
  maintenance_count: 0x1::option::Option<u16> {
    vec: [ 7 ]
  }
}
[ PASS    ] firts_project::hello_world::test_zoo
```

### Tóm tắt

| Thành phần | Ý nghĩa |
|---|---|
| `struct` | Kiểu dữ liệu người dùng định nghĩa |
| `has copy, drop` | Cho phép sao chép và hủy struct |
| `.field` | Truy cập dữ liệu bên trong struct |
| `Option<T>` | Giá trị có thể có hoặc không |
| `assert!` | Kiểm tra điều kiện đúng/sai |
| `debug::print()` | In thông tin ra console |

## Muốn học sâu hơn?

Xem thêm tài liệu chính thức:
[Move Book – Structs](https://move-language.github.io/move/structs.html) 