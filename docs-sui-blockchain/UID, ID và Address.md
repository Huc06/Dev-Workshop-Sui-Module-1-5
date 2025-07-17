---
title: UID, ID và Address 
---

# UID, ID và Address trong Sui Move

Trong Sui Move, `UID`, `ID` và `Address` là ba khái niệm cơ bản liên quan đến định danh đối tượng trên blockchain. Bài viết này sẽ làm rõ sự khác biệt và mối quan hệ giữa chúng, dựa trên module `sui::object`.

## 1. Address

`Address` là kiểu dữ liệu cơ bản trong Sui Move, có độ dài 32 bytes. Nó dùng để định danh duy nhất các tài khoản (ví người dùng) hoặc các đối tượng (objects) trên blockchain. (Bạn có thể tham khảo thêm về `Address` ở các bài viết khác về kiểu dữ liệu).

## 2. ID

`ID` là một `struct` bao bọc kiểu dữ liệu `Address`:

```move
public struct ID has copy, drop, store {
    bytes: Address
}
```

*   `ID` có các khả năng `copy` và `store`, cho phép nó được sao chép và lưu trữ trên chain.
*   Tuy nhiên, `ID` **không thể** được dùng để định danh các object duy nhất. Vì `ID` có thể `copy` (bất kỳ ai cũng có thể sao chép một `ID` với cùng một `Address`) và có thể bị `drop` tùy ý, nó không đảm bảo tính duy nhất cho một đối tượng cụ thể.

## 3. UID

`UID` là một `struct` đặc biệt được thiết kế để định danh đối tượng một cách duy nhất:

```move
public struct UID has store {
    id: ID,
}
```

*   `UID` bao bọc một `ID` bên trong, nhưng khác biệt lớn là nó **không có khả năng `copy` hay `drop` tùy ý**.
*   `UID` chỉ có thể bị xóa bằng cách gọi hàm `object::delete()`.
*   Quan trọng nhất, `UID` chỉ có thể được tạo bởi *transaction context* (`ctx`) thông qua hàm `object::new(ctx)`, đảm bảo tính duy nhất và không thể làm giả.

## 4. Tạo UID

Trong module `sui::object`, `UID` được tạo thông qua hàm `new`:

```move
module sui::object {
    use sui::tx_context;

    /// Tạo một UID mới
    public fun new(ctx: &mut tx_context::TxContext): UID {
        UID { id: tx_context::fresh_object_address(ctx) }
    }
}
```

Hàm `tx_context::fresh_object_address` sẽ tạo ra một `ID` duy nhất mới bằng cách sử dụng hash của giao dịch (`tx_hash`) và số lượng `ID` đã tạo (`ids_created`) để đảm bảo không có xung đột:

```move
module sui::tx_context {
    public fun fresh_object_address(ctx: &mut TxContext): address {
        let ids_created = ctx.ids_created;
        let id = derive_id(*&ctx.tx_hash, ids_created);
        ctx.ids_created = ids_created + 1;
        id
    }

    /// Hàm native để tạo ID thông qua hash(tx_hash || ids_created)
    native fun derive_id(tx_hash: vector<u8>, ids_created: u64): address;
}
```

*   Hàm `derive_id` là một hàm `native`, nghĩa là nó được triển khai ở cấp độ blockchain (thường bằng Rust hoặc C++) để đảm bảo hiệu suất và bảo mật.

## 5. Lấy thông tin từ UID

Module `sui::object` cung cấp các hàm để lấy thông tin từ `UID` của một đối tượng:

*   `object::id<T: key>(obj: &T): ID`: Trả về `ID` được bao bọc bên trong `UID` của đối tượng.
*   `object::borrow_id<T: key>(obj: &T): &ID`: Trả về tham chiếu đến `ID` bên trong `UID`.
*   `object::id_bytes<T: key>(obj: &T): vector<u8>`: Trả về dạng byte của `ID` (sử dụng mã hóa BCS).
*   `object::id_address<T: key>(obj: &T): address`: Trả về `address` của `ID`.

## 6. Xóa UID (Xóa Object)

Trong Sui, `UID` là bất biến (immutable) sau khi tạo. Để "xóa" một đối tượng được định danh bằng `UID`, bạn phải gọi hàm `object::delete()`:

```move
public struct Gift has key { id: UID }

fun destroy_gift(gift: Gift) {
    let Gift { id } = gift; // Giải nén (unpack) Gift để lấy UID
    object::delete(id);     // Xóa object thông qua UID
}
```

### Ví dụ hoàn chỉnh: Tạo và Xóa Object với UID
```move
module simple_uid::simple_uid_example {
    use sui::object::{Self, UID, new, delete};
    use sui::tx_context::{Self, TxContext, sender};
    use sui::transfer;

    /// Struct đơn giản với UID
    public struct SimpleObject has key {
        id: UID,
    }

    /// Hàm tạo mới một SimpleObject và chuyển cho sender
    public entry fun mint_simple_object(ctx: &mut TxContext) {
        let new_object = SimpleObject {
            id: new(ctx),
        };
        transfer::transfer(new_object, sender(ctx));
    }

    /// Hàm xóa một SimpleObject được cung cấp
    public entry fun burn_simple_object(obj: SimpleObject) {
        let SimpleObject { id } = obj;
        delete(id);
    }
}

## 7. Ứng dụng thực tế: Tại sao lại tạo và xóa Objects/UID?

Nếu bạn là nhà đầu tư hoặc người dùng DApp trên Sui, bạn có thể thắc mắc: "Việc tạo và xóa một cái ID hay UID này để làm gì? Nó có ứng dụng gì trong thực tế?"

Câu trả lời nằm ở khái niệm **Đối tượng (Objects)** trong Sui. Mỗi đối tượng trong Sui (ví dụ: một NFT, một vật phẩm trong game, một đơn vị token, hoặc một cấu hình DApp) đều được định danh duy nhất bằng một **UID**.

### 7.1. Tạo UID (hay còn gọi là "Mint" Object)

Việc tạo ra một UID (thông qua hàm `object::new(ctx)`) tương tự như việc bạn "đúc" hoặc "mint" một tài sản kỹ thuật số mới trên blockchain. Đây là hành động cơ bản khi một DApp sinh ra một thứ gì đó mới, độc đáo và có giá trị.

**Ví dụ trong DApp/Đầu tư:**

*   **Mint NFT:** Khi bạn mua một NFT mới trên một sàn giao dịch hoặc tham gia một sự kiện minting, DApp đó đang gọi hàm tạo UID để "đúc" ra một NFT độc nhất vô nhị dành riêng cho bạn.
*   **Tạo vật phẩm trong GameFi:** Mỗi thanh kiếm, mũ bảo hiểm, hoặc nhân vật trong game blockchain là một đối tượng Sui với UID riêng. Việc tạo UID cho phép người chơi thực sự sở hữu những vật phẩm này và có thể giao dịch chúng trên thị trường.
*   **Khởi tạo dự án/token:** Một số dự án có thể tạo ra một đối tượng đặc biệt (ví dụ: một `AdminCap` hoặc `Config Object`) chỉ một lần duy nhất khi khởi chạy, để quản lý các cài đặt hoặc quyền hạn quan trọng. UID đảm bảo tính duy nhất của đối tượng quản lý này.

### 7.2. Xóa UID (hay còn gọi là "Burn" Object)

Việc xóa một UID (thông qua hàm `object::delete(id)`) giống như việc bạn "đốt" hoặc "phá hủy" vĩnh viễn một tài sản kỹ thuật số khỏi blockchain. Hành động này rất quan trọng để quản lý nguồn cung, hoặc để xử lý các tài sản đã được sử dụng/tiêu thụ.

**Ví dụ trong DApp/Đầu tư:**

*   **Burn NFT/Token:** Một dự án có thể cho phép người dùng "burn" NFT hoặc token của họ để nhận được phần thưởng, tham gia xổ số, hoặc giảm nguồn cung lưu hành để tăng giá trị.
*   **Tiêu thụ vật phẩm trong GameFi:** Một lọ thuốc hồi máu trong game là một object có UID. Khi bạn dùng nó, DApp sẽ gọi hàm xóa UID để "tiêu thụ" lọ thuốc đó, và nó sẽ biến mất khỏi kho đồ của bạn.
*   **Đổi quà/Voucher:** Một "voucher" giảm giá có thể là một object với UID. Khi bạn sử dụng voucher, nó sẽ bị xóa khỏi blockchain để đảm bảo không thể dùng lại.

### Tóm lại:
`UID` là "chứng minh thư duy nhất" cho các tài sản trên Sui. Việc tạo và xóa `UID` là cơ chế nền tảng để các DApp quản lý vòng đời của tài sản số: từ khi chúng được sinh ra (mint) cho đến khi chúng bị loại bỏ vĩnh viễn (burn/tiêu thụ). Điều này mang lại tính minh bạch, độc nhất và khả năng sở hữu thực sự cho người dùng trong thế giới blockchain. 