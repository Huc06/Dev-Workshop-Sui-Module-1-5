---
title: Function trong sui move
---

# Làm chủ Functions trong Move

Khi bạn muốn máy tính thực hiện một việc gì đó — như tính tổng, kiểm tra điều kiện, hay trả về dữ liệu — bạn dùng hàm (function). Trong Move, viết hàm không hề phức tạp nếu bạn hiểu đúng bản chất của nó.

## 1. Cấu trúc cơ bản của một hàm

```move
public fun add(a: u64, b: u64): u64 {
    a + b
}
```
Hãy tưởng tượng: bạn đưa vào 2 con số (a và b), Move trả lại cho bạn kết quả sau dấu `return` — trong ví dụ này là `a + b`.

- `public` cho phép gọi từ nơi khác
- `fun` nghĩa là bạn đang viết một hàm
- `a: u64, b: u64`: là "nguyên liệu đầu vào"
- `: u64`: là loại kết quả bạn mong nhận về
- `{ a + b }`: phần "xử lý" – ở đây là phép cộng

## 2. Tự kiểm tra hàm có đúng không

```move
#[test]
fun test_add() {
    let sum = add(1, 2);
    assert!(sum == 3);
}
```
Bạn chạy một bài kiểm tra nhỏ, xem nếu đưa vào `1 + 2` thì Move có trả đúng kết quả `3` hay không. Nếu đúng: yên tâm. Nếu sai: Move sẽ dừng lại và báo lỗi.

## 3. Viết một hàm không cần trả lại gì
Không phải lúc nào bạn cũng cần kết quả. Có lúc bạn chỉ muốn "gọi hàm để làm việc gì đó" – như ghi log, gửi thông báo, in chữ…

```move
fun log_message() {
    // không trả gì cả
}
```
Lúc đó, hàm sẽ trả về `()` — tức là không có gì.

## 4. Gọi hàm từ một module khác
Khi bạn viết nhiều module, bạn có thể "mượn" hàm từ module khác:

```move
use book::math;

fun call_add() {
    let result = math::add(5, 10);
}
```
Nghĩ đơn giản: `book::math` là "địa chỉ", `add` là "cánh cửa" bạn đang gõ để dùng hàm.

## 5. Trả về nhiều kết quả một lúc

```move
fun get_name_and_age(): (vector<u8>, u8) {
    (b"John", 25)
}
```
Lúc này hàm trả về cả "tên" và "tuổi". Để dùng kết quả, bạn mở ra như sau:

```move
let (name, age) = get_name_and_age();
```
Nếu chỉ cần tuổi, bạn viết:

```move
let (_, age) = get_name_and_age();
```
Hoặc nếu bạn cần sửa lại giá trị `name` sau đó:

```move
let (mut name, age) = get_name_and_age();
```

## Tóm gọn 5 điều nên nhớ
- `fun tên_hàm(tham_số): kiểu_trả_về` là cách khai báo chuẩn
- Có thể dùng `assert!` để kiểm thử hàm hoạt động đúng
- Nếu không trả gì: để trống phần trả về → hàm tự hiểu là `()`
- Bạn có thể lấy nhiều giá trị cùng lúc bằng tuple
- Dễ dàng gọi hàm từ module khác nếu dùng `use`

## Gợi ý thực hành
- Tạo hàm `double(n: u64): u64` → trả về giá trị `n * 2`
- Viết thêm `test_double()` để kiểm tra

**Tìm hiểu thêm?**
Nếu bạn cần tìm hiểu thêm, hãy đọc [Move Book - Functions](https://move-language.github.io/move/functions.html) để hiểu sâu hơn.

Nội dung đang được cập nhật. 