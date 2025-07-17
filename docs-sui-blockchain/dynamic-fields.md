---
title: Dynamic Fields
---

# Dynamic Fields và Dynamic Object Fields trong Sui Move

1. Dynamic Fields là gì?
Thông thường, các trường (field) trong struct được khai báo cố định khi bạn publish module. Nhưng trong nhiều tình huống thực tế như:

*   Bạn cần thêm các trường sau khi publish
*   Bạn muốn lưu số lượng không cố định các giá trị
*   Bạn muốn lưu trữ nhiều loại giá trị khác nhau

Bạn cần Dynamic Fields và Dynamic Object Fields.


| Loại            | Lưu được gì?                   | Đặc điểm                                        | Module sử dụng          |
|---------------|-----------------------------|-------------------------------------------------|-------------------------|
| Dynamic Field | Bất kỳ giá trị nào có store   | Nếu lưu object → object bị "wrap" và không dùng ID được | `sui::dynamic_field`    |
| Object Field  | Chỉ lưu object có key + id: UID | Object vẫn dùng được ID, dùng được với ví, explorer | `sui::dynamic_object_field` |


Field name có thể là bất kỳ giá trị có `copy`, `drop`, `store` — ví dụ: `vector<u8>` như `b"child"`.

3. Tạo Object & Thêm Dynamic Field
Định nghĩa:
```move
public struct Parent has key {
    id: UID,
}

public struct Child has key, store {
    id: UID,
    count: u64,
}
```
Thêm dynamic object field:
```move
public fun add_child(parent: &mut Parent, child: Child) {
    dynamic_object_field::add(&mut parent.id, b"child", child);
}
```
Sau khi thêm:

*   `Parent` vẫn do người dùng sở hữu
*   `Child` do `Parent` sở hữu và chỉ truy cập được qua dynamic field tên `b"child"`

4. Sửa giá trị trong dynamic field
Truy cập để chỉnh sửa:
```move
public fun mutate_child(child: &mut Child) {
    child.count = child.count + 1;
}
```
Truy cập thông qua Parent:
```move
public fun mutate_child_via_parent(parent: &mut Parent) {
    mutate_child(dynamic_object_field::borrow_mut<Child>(&mut parent.id, b"child"));
}
```
Cảnh báo: Bạn không thể chỉnh sửa `Child` trực tiếp nếu nó đã được wrap vào dynamic field → phải mượn qua `parent.id`.

5. Xoá dynamic field
Gỡ object ra khỏi dynamic field:
```move
public fun reclaim_child(parent: &mut Parent): Child {
    dynamic_object_field::remove(&mut parent.id, b"child")
}
```
Sau đó có thể xoá:
```move
public fun delete_child(parent: &mut Parent) {
    let Child { id, count: _ } = reclaim_child(parent);
    object::delete(id);
}
```
Nếu bạn xoá `Parent` mà chưa xoá `Child` → `Child` sẽ bị mất luôn, không truy cập được nữa!

6. Cảnh báo quan trọng
*   Nếu gọi `borrow`, `remove` dynamic field mà không tồn tại → giao dịch sẽ fail
*   Nếu type không khớp khi `borrow<Value>` → giao dịch sẽ `abort`
*   Nếu lỡ xoá `Parent` khi `Child` còn bên trong → tất cả dynamic field bên trong sẽ mất

7. Gợi ý sử dụng Table hoặc Bag nếu bạn cần:
*   Collection có số lượng phần tử linh hoạt
*   Tự động kiểm tra rỗng/trống trước khi xoá
*   Tránh mất dữ liệu không mong muốn

Tham khảo thêm:

*   `Tables and Bags in Sui`

Tóm tắt bài học

| Khái niệm                    | Ghi nhớ nhanh                                                         |
|:-----------------------------|:---------------------------------------------------------------------:|
| `dynamic_field::add`         | Thêm trường có giá trị bất kỳ                                         |
| `dynamic_object_field::add`  | Thêm object vào dynamic field (vẫn dùng ID được)                       |
| `borrow / borrow_mut`        | Truy cập động trường theo tên                                         |
| `remove`                     | Gỡ giá trị khỏi dynamic field                                         |
| `delete Parent`              | Sẽ **xoá luôn toàn bộ dynamic fields bên trong nếu chưa remove trước** |


8. Minh hoạ code hoàn chỉnh
```move
```