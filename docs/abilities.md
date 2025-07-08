---
title: Ablities là gì?
---

# Ablities trong Move 

Trong Move, không phải mọi struct đều có thể làm mọi thứ. Giống như việc mỗi loài động vật có khả năng riêng (bay, bơi, đi bộ), mỗi struct trong Move cũng có những "quyền năng" đặc biệt gọi là **abilities**.

Abilities giúp Move đảm bảo an toàn cho tài sản và các đối tượng trong blockchain. Khi bạn định nghĩa một struct, bạn phải quyết định xem nó có những abilities nào.

## 1. Các Abilities Cơ Bản

Có bốn abilities chính trong Move:

| Ability | Ý nghĩa | Ví dụ | Dùng cho đối tượng? |
|---|---|---|---|
| `copy` | Có thể sao chép giá trị. | `u64`, `bool` | Có thể nhân bản (không phải tài sản) |
| `drop` | Có thể bị xóa (hủy) mà không cần chuyển đi. | `u64`, `bool` | Có thể bỏ đi (không phải tài sản) |
| `store` | Có thể được lưu trữ trong struct khác hoặc trong global storage. | `Coin`, `NFT` | Có thể lưu trữ (tài sản) |
| `key` | Có thể trở thành khóa toàn cục (global key) trong storage, giúp truy cập trực tiếp từ địa chỉ. | `Coin`, `NFT` | Có định danh duy nhất (tài sản) |

## 2. Cách Định Nghĩa Abilities

Bạn khai báo abilities ngay sau tên struct, dùng từ khóa `has`:

```move
public struct MyCoin has store, key {
    id: UID,
    value: u64,
}

public struct MyToken has copy, drop {
    value: u64,
}
```

## 3. Abilities quan trọng cho Tài sản (Assets)

Đối với tài sản trên blockchain (như tiền tệ, NFT), chúng thường có `key` và `store`.

- `key`: Để có thể truy cập bằng ID duy nhất trên blockchain.
- `store`: Để có thể lưu trữ trong các struct khác hoặc được gửi vào storage.

## 4. Quy Tắc Kế Thừa Abilities

Nếu một struct chứa một struct khác, thì struct chứa đó phải có các abilities tương ứng.

Ví dụ: Nếu `InnerStruct` có `store`, thì `OuterStruct` chứa nó cũng phải có `store`.

```move
struct InnerStruct has store { val: u64 }

// Lỗi: OuterStruct thiếu 'store' dù chứa InnerStruct có 'store'
// struct OuterStruct { inner: InnerStruct }

// Đúng:
struct OuterStruct has store { inner: InnerStruct }
```

## 5. Tại Sao Abilities Quan Trọng?

- **An toàn**: Ngăn chặn việc sao chép tiền tệ trái phép (`copy` không dùng cho tài sản).
- **Kiểm soát tài sản**: Đảm bảo tài sản không bị mất (`drop` không dùng cho tài sản).
- **Lưu trữ**: Chỉ những đối tượng có `store` mới được phép tồn tại trên blockchain (persistent storage).

## Tóm tắt

| Ability | Mô tả ngắn gọn |
|---|---|
| `copy` | Nhân bản giá trị |
| `drop` | Xóa giá trị không cần transfer |
| `store` | Lưu trữ trong global storage/struct khác |
| `key` | Có ID duy nhất, truy cập trực tiếp |

**Tìm hiểu thêm?**
Để tìm hiểu sâu hơn về Abilities, bạn có thể đọc [Move Book - Abilities](https://move-language.github.io/move/abilities.html). 