---
title: One time witness
---

# One-Time Witness trong Move

Trong Move, "One-Time Witness" (Chứng kiến một lần) là một mô hình thiết kế đặc biệt, cho phép một module được thực thi logic khởi tạo chỉ duy nhất một lần. Điều này cực kỳ quan trọng đối với các hợp đồng thông minh trên blockchain, nơi mà việc đảm bảo tính duy nhất và không thể thay đổi của các cấu hình ban đầu là tối cần thiết.

## 1. Mục đích của One-Time Witness

Mục đích chính của One-Time Witness là để:

*   **Đảm bảo tính duy nhất:** Chỉ cho phép một hành động, một sự kiện, hoặc một object được tạo ra/khởi tạo một lần duy nhất trong toàn bộ vòng đời của một module.
*   **Kiểm soát khởi tạo:** Ngăn chặn việc tạo lại các tài nguyên quan trọng hoặc cấu hình lại các thông số đã được thiết lập.
*   **Bảo mật:** Giảm thiểu rủi ro từ các cuộc tấn công tái thực thi (replay attacks) hoặc các lỗi logic do khởi tạo nhiều lần.

## 2. Khả năng `Drop` và vai trò của nó

Trong Move, một `struct` (cấu trúc dữ liệu) mặc định không thể bị hủy bỏ (dropped) nếu nó có các trường chứa tài nguyên. Để cho phép một `struct` bị hủy bỏ một cách an toàn (tức là không cần phải chuyển giao nó), bạn cần thêm khả năng `drop` cho nó. One-Time Witness thường là một `struct` trống rỗng (hoặc có rất ít trường) và có khả năng `drop`.

Sự tồn tại của một `struct` có khả năng `drop` trong một hàm `init` ngụ ý rằng module đó đã được khởi tạo. Vì `struct` này có thể `drop` (tức là có thể bị biến mất mà không cần chuyển giao), nó được dùng như một "cờ hiệu" hoặc "chứng kiến" rằng logic khởi tạo đã chạy.

## 3. Ví dụ về One-Time Witness

Để hiểu rõ hơn, hãy xem xét ví dụ sau. Chúng ta sẽ tạo một module `my_module` với một hàm `init` sử dụng `OneTimeWitness` để đảm bảo nó chỉ được gọi một lần.

```move
module my_address::my_module {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table, add, contains, new as table_new};

    /// Một struct rỗng đóng vai trò là One-Time Witness
    /// Nó có khả năng `drop` để có thể bị hủy bỏ sau khi init chạy.
    struct MY_MODULE_ONE_TIME_WITNESS has drop {}

    /// Một Shared Object sẽ được tạo ra khi module được khởi tạo
    struct WhiteList has key, store {
        id: UID,
        allowed_addresses: Table<address, bool>,
    }

    /// Hàm khởi tạo của module, chỉ chạy một lần duy nhất
    fun init(otw: MY_MODULE_ONE_TIME_WITNESS, ctx: &mut TxContext) {
        // Khi hàm init được gọi, hệ thống sẽ truyền vào một One-Time Witness.
        // Sự hiện diện của tham số `otw` đảm bảo rằng hàm này chỉ được thực thi một lần.
        // Sau khi hàm kết thúc, `otw` sẽ tự động bị drop.

        // Logic khởi tạo của bạn ở đây
        let initial_whitelist = WhiteList {
            id: object::new(ctx),
            allowed_addresses: table::new(ctx),
        };
        transfer::share_object(initial_whitelist);
    }

    /// Hàm thêm địa chỉ vào whitelist
    public entry fun add_to_whitelist(
        whitelist: &mut WhiteList,
        addr: address,
        ctx: &mut TxContext
    ) {
        // Chỉ người tạo ra whitelist hoặc một địa chỉ được ủy quyền mới có thể thêm vào.
        // Trong ví dụ này, chúng ta sẽ bỏ qua quyền hạn cho đơn giản.
        // Thực tế, bạn sẽ cần kiểm tra `tx_context::sender(ctx)` hoặc một cơ chế quản lý khác.
        table::add(&mut whitelist.allowed_addresses, addr, true);
    }

    /// Hàm kiểm tra xem một địa chỉ có trong whitelist hay không
    public fun is_whitelisted(whitelist: &WhiteList, addr: address): bool {
        table::contains(&whitelist.allowed_addresses, addr)
    }
}

### Giải thích:

*   **`struct MY_MODULE_ONE_TIME_WITNESS has drop {}`**: Đây là `struct` One-Time Witness. Nó rỗng và có khả năng `drop`. Khi module được triển khai, Sui Runtime sẽ tự động tạo một instance của `MY_MODULE_ONE_TIME_WITNESS` và truyền nó vào hàm `init`.
*   **`fun init(otw: MY_MODULE_ONE_TIME_WITNESS, ctx: &mut TxContext)`**: Hàm `init` là một hàm đặc biệt trong Move, được chạy tự động một lần duy nhất khi module được triển khai (published) lên blockchain. Việc khai báo `otw: MY_MODULE_ONE_TIME_WITNESS` như một tham số đầu vào đảm bảo rằng hàm này sẽ nhận được một instance của `MY_MODULE_ONE_TIME_WITNESS`. Vì `MY_MODULE_ONE_TIME_WITNESS` là một One-Time Witness, nó chỉ có thể được tạo ra một lần, do đó đảm bảo `init` chỉ chạy một lần.
*   **Logic bên trong `init`**: Trong ví dụ này, `init` tạo ra một `WhiteList` Shared Object và khởi tạo một `Table` rỗng để lưu trữ các địa chỉ được phép. Vì `init` chỉ chạy một lần, `WhiteList` này cũng chỉ được tạo ra một lần duy nhất.
*   **`add_to_whitelist`**: Hàm này cho phép thêm một địa chỉ vào whitelist. Trong một ứng dụng thực tế, hàm này sẽ có các kiểm tra quyền hạn chặt chẽ hơn (ví dụ: chỉ chủ sở hữu hoặc quản trị viên mới có thể thêm).
*   **`is_whitelisted`**: Hàm này kiểm tra xem một địa chỉ có tồn tại trong whitelist hay không.

## 4. Cách sử dụng (Triển khai Module)

Khi bạn biên dịch và triển khai (publish) module chứa hàm `init` với One-Time Witness, bạn sẽ không cần phải truyền đối số `otw` một cách rõ ràng. Sui CLI và Runtime sẽ tự động xử lý việc này.

Chỉ cần chạy lệnh publish như bình thường:

```bash
sui client publish --gas-budget 1000000
```

Lần đầu tiên module được publish, hàm `init` sẽ được gọi và `WhiteList` object sẽ được tạo ra và chia sẻ. Nếu bạn cố gắng publish lại cùng một module (hoặc một phiên bản của nó mà không thay đổi `object_id`), hàm `init` sẽ không được gọi lại, đảm bảo tính "một lần" của nó.

### Thêm địa chỉ vào WhiteList:

Sau khi module được triển khai và `WhiteList` object được tạo, bạn có thể thêm địa chỉ vào whitelist bằng cách gọi hàm `add_to_whitelist`. Bạn cần biết `PACKAGE_ID` và `WHITELIST_OBJECT_ID` (là ID của đối tượng `WhiteList` được tạo ra trong hàm `init`).

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module my_module \
  --function add_to_whitelist \
  --args <WHITELIST_OBJECT_ID> <ADDRESS_TO_ADD> \
  --gas-budget 1000000
```

**Ví dụ:**

```bash
sui client call \
  --package 0xYourPackageId \
  --module my_module \
  --function add_to_whitelist \
  --args 0xYourWhitelistObjectId 0xabcdef1234567890abcdef1234567890abcdef1234567890 \
  --gas-budget 1000000
```

Bạn có thể gọi lệnh này nhiều lần để thêm nhiều địa chỉ khác nhau vào whitelist.

--- 