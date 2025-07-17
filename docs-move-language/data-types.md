---
title: Sui move data types
---

# Kiểu dữ liệu cơ bản trong Move

## 1. Kiểu số nguyên (Integers)
Trong Move, bạn sẽ thường xuyên làm việc với các con số. Và không chỉ có "số bình thường" đâu nhé, Move có tận 6 kiểu số nguyên không âm (unsigned integer) cho bạn lựa chọn, tùy vào phạm vi giá trị bạn cần.

| Tên kiểu | Phạm vi giá trị | Ví dụ |
|---|---|---|
| u8 | 0 → 255 | `let a: u8 = 255;` |
| u16 | 0 → 65.535 | `let b = 1234u16;` |
| u32 | 0 → ~4.2 tỷ | `let c: u32 = 1_000_000;` |
| u64 | 0 → rất lớn | `let d = 999_999_999u64;` |
| u128 | 0 → rất rất lớn | `let e = 999_999u128;` |
| u256 | 0 → siêu to | `let f = 1_000_000_000_000u256;` |

**Mẹo học nhanh:**
Cứ nhớ u8, u16, u32... là kích thước (bit) càng lớn thì số lưu trữ càng nhiều. Nếu không chắc dùng loại nào, mặc định là u64.

## 2. Cách viết số trong Move
Bạn có thể viết số như sau:

- Dạng thường: `112`, `999_999`
- Dạng thập lục phân (hex): `0xFF`, `0xDEADBEEF`
- Gắn hậu tố để chỉ rõ kiểu: `112u8`, `1_000u128`

Ví dụ dễ nhớ:

```move
let x = 100; // Move sẽ đoán kiểu từ ngữ cảnh
let y: u8 = 200; // rõ ràng hơn
let z = 1_000_000u64; // dễ đọc, dễ nhớ
```

## 3. Boolean (bool)
Đây là kiểu dữ liệu đơn giản nhất – chỉ có hai giá trị: `true` hoặc `false`.

```move
let is_active: bool = true;
let is_zero = 0 == 0; // cũng là true
```
Tip: dùng để kiểm tra điều kiện hoặc viết logic đơn giản như bật/tắt.

## 4. Vector – Bộ sưu tập "động"
Bạn đã biết mảng trong các ngôn ngữ khác chưa? Trong Move, `vector<T>` chính là phiên bản "mảng linh hoạt" đó.

- Lưu trữ nhiều phần tử cùng kiểu
- Có thể thêm (`push`), xóa (`pop`) phần tử
- Phù hợp cho mọi tình huống cần danh sách linh hoạt

Ví dụ cực dễ hiểu:

```move
let mut numbers: vector<u64> = vector[];
vector::push_back(&mut numbers, 10);
vector::push_back(&mut numbers, 20);
```
Đây là cách tạo một danh sách `numbers`, thêm vào `10` và `20`.

Bạn cũng có thể lồng nhiều vector:

```move
let mut nested: vector<vector<u8>> = vector[];
```

**Lưu ý:**
- Nếu bạn viết sai kiểu hoặc giá trị quá lớn, trình biên dịch sẽ báo lỗi.
- Luôn nên định nghĩa rõ ràng kiểu dữ liệu nếu Move không tự đoán được.

**Tìm hiểu thêm?**

Nếu bạn muốn học sâu hơn về Move, có thể khám phá thêm tại:
[https://move-language.github.io/move](https://move-language.github.io/move)
