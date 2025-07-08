---
title: Xây dựng Bộ sưu tập NFT cá nhân trên Sui
sidebar_position: 6
---

Chào mừng bạn đến với hướng dẫn xây dựng bộ sưu tập NFT cá nhân trên nền tảng Sui Blockchain. Trong phần này, chúng ta sẽ cùng nhau tạo ra một NFT độc đáo để giới thiệu bản thân, và sau đó phát triển một bộ sưu tập các NFT chứa đựng những kỷ niệm đáng nhớ của bạn, với khả năng đúc ngẫu nhiên!

Chúng ta sẽ đi qua từng bước một, từ việc định nghĩa cấu trúc dữ liệu cho NFT đến việc triển khai logic đúc NFT ngẫu nhiên. 

## 1. Chuẩn bị môi trường và Module Move

Đầu tiên, chúng ta cần tạo một module Move trong thư mục `sources` của dự án Sui Move của bạn. Nếu bạn chưa có dự án Move, hãy tạo một dự án mới:

```bash
sui move new my_nft_project
cd my_nft_project
```

Sau đó, mở tệp `sources/my_nft_project.move` (hoặc một tệp `.move` khác bạn muốn) và dán đoạn mã sau vào.

```move
module nft::my_nft_collection {
    use sui::object::{UID, new, id as object_id, id_to_address};
    use sui::tx_context::{TxContext, sender, epoch_timestamp_ms};
    use sui::event::emit;
    use sui::transfer;
    use sui::table::{Table, add, borrow, length, new as new_table};
    use 0x1::string::String;

    struct SelfIntroductionNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        slogan: String,
    }

    struct MemoryNFT has key, store {
        id: UID,
        event_name: String,
        date: u64,
        location: String,
        description: String,
        image_url: String,
        rarity: u8,
    }

    struct MemoryTemplateStore has key, store {
        id: UID,
        templates: Table<u64, MemoryTemplate>,
        next_template_id: u64,
    }

    struct MemoryTemplate has store {
        event_name: String,
        date: u64,
        location: String,
        description: String,
        image_url: String,
        rarity: u8,
    }

    struct SelfIntroductionNFTCreated has copy, drop {
        nft_id: address,
        creator: address,
        name: String,
    }

    struct MemoryNFTCreated has copy, drop {
        nft_id: address,
        creator: address,
        event_name: String,
        rarity: u8,
    }

    public entry fun mint_self_introduction_nft(
        name: String,
        description: String,
        image_url: String,
        slogan: String,
        ctx: &mut TxContext
    ) {
        let sender_addr = sender(ctx);
        let self_intro_nft = SelfIntroductionNFT {
            id: new(ctx),
            name,
            description,
            image_url,
            slogan,
        };
        emit(SelfIntroductionNFTCreated {
            nft_id: id_to_address(&object_id(&self_intro_nft)),
            creator: sender_addr,
            name: self_intro_nft.name,
        });
        transfer::transfer(self_intro_nft, sender_addr);
    }

    public entry fun mint_random_memory_nft(
        store: &MemoryTemplateStore,
        ctx: &mut TxContext
    ) {
        let sender_addr = sender(ctx);
        let num_templates = length(&store.templates);
        assert!(num_templates > 0, 1001);
        let seed = epoch_timestamp_ms(ctx);
        let idx = seed % num_templates;
        let template = borrow(&store.templates, idx);
        let nft = MemoryNFT {
            id: new(ctx),
            event_name: template.event_name,
            date: template.date,
            location: template.location,
            description: template.description,
            image_url: template.image_url,
            rarity: template.rarity,
        };
        emit(MemoryNFTCreated {
            nft_id: id_to_address(&object_id(&nft)),
            creator: sender_addr,
            event_name: nft.event_name,
            rarity: nft.rarity,
        });
        transfer::transfer(nft, sender_addr);
    }

    public entry fun add_memory_template(
        store: &mut MemoryTemplateStore,
        event_name: String,
        date: u64,
        location: String,
        description: String,
        image_url: String,
        rarity: u8,
        _ctx: &mut TxContext
    ) {
        let new_template_id = store.next_template_id;
        store.next_template_id = store.next_template_id + 1;
        add(&mut store.templates, new_template_id, MemoryTemplate {
            event_name,
            date,
            location,
            description,
            image_url,
            rarity,
        });
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(MemoryTemplateStore {
            id: new(ctx),
            templates: new_table(ctx),
            next_template_id: 0,
        });
    }
}

## 4. Hàm mint MemoryNFT ngẫu nhiên

Hàm này cho phép bất kỳ ai cũng có thể mint một NFT kỷ niệm ngẫu nhiên từ các mẫu đã được thêm vào `MemoryTemplateStore`.

### Giải thích code:
- Lấy tổng số mẫu kỷ niệm hiện có (`num_templates`).
- Lấy seed "ngẫu nhiên" từ `epoch_timestamp_ms` của giao dịch.
- Tính chỉ số mẫu sẽ được chọn: `idx = seed % num_templates`.
- Lấy mẫu kỷ niệm tại chỉ số đó và tạo một NFT mới dựa trên thông tin mẫu.
- Phát ra sự kiện và chuyển NFT cho người mint.

### Cách sử dụng:

Bạn cần biết `PACKAGE_ID` và `MemoryTemplateStore_OBJECT_ID`.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module my_nft_collection \
  --function mint_random_memory_nft \
  --args <MemoryTemplateStore_OBJECT_ID> \
  --gas-budget 1000000
```

Sau khi chạy lệnh này, bạn sẽ nhận được một NFT kỷ niệm ngẫu nhiên dựa trên các mẫu đã được thêm vào store.

## 5. Hướng dẫn sử dụng Module NFT của bạn

Sau khi đã có mã nguồn Move, chúng ta sẽ đi qua các bước để biên dịch, triển khai và tương tác với module NFT của bạn trên Sui Blockchain.

### Bước 1: Biên dịch (Build) Module Move

Đảm bảo bạn đang ở thư mục gốc của dự án Move (ví dụ: `my_nft_project`). Chạy lệnh sau để biên dịch code của bạn:

```bash
sui move build
```

Nếu không có lỗi, bạn sẽ thấy thông báo `Successfully built package`.

### Bước 2: Triển khai (Publish) Module Move

Sau khi biên dịch thành công, bạn cần triển khai module lên Sui Blockchain. Lệnh này sẽ tạo ra một package mới trên chuỗi và trả về `PACKAGE_ID` cùng với `OBJECT_ID` của `MemoryTemplateStore` (là một shared object).

```bash
sui client publish --gas-budget 1000000
```

**Lưu ý quan trọng:**
*   Giữ lại `PACKAGE_ID` và `MemoryTemplateStore_OBJECT_ID` từ output của lệnh này. Bạn sẽ cần chúng cho các bước tiếp theo.
*   `MemoryTemplateStore_OBJECT_ID` là ID của đối tượng `MemoryTemplateStore` mà hàm `init` đã tạo và chia sẻ.

### Bước 3: Thêm các mẫu kỷ niệm (Add Memory Templates)

Trước khi người dùng có thể mint NFT kỷ niệm ngẫu nhiên, bạn cần thêm các mẫu kỷ niệm vào `MemoryTemplateStore`. Bạn sẽ dùng `add_memory_template` cho việc này.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module my_nft_collection \
  --function add_memory_template \
  --args <MemoryTemplateStore_OBJECT_ID> "<Tên sự kiện>" <Timestamp> "<Địa điểm>" "<Mô tả>" "<URL hình ảnh>" <Rarity> \
  --gas-budget 1000000
```

**Ví dụ:**

```bash
sui client call \
  --package 0x489563cb7a99e87528b871f6f5df62100e96374d7cfc9432af7907f119049151 \
  --module my_nft_collection \
  --function add_memory_template \
  --args 0x0b8391f4a847b3c9b1ec9a4820939906c8520714dcf5f1b4b503f8ab3c33f4c0 "Kỷ niệm gặp gỡ" 1678886400 "Hà Nội" "Lần đầu tiên chúng ta gặp nhau" "https://example.com/meet.png" 3 \
  --gas-budget 1000000

sui client call \
  --package 0x489563cb7a99e87528b871f6f5df62100e96374d7cfc9432af7907f119049151 \
  --module my_nft_collection \
  --function add_memory_template \
  --args 0x0b8391f4a847b3c9b1ec9a4820939906c8520714dcf5f1b4b503f8ab3c33f4c0 "Chuyến đi biển" 1689043200 "Đà Nẵng" "Một chuyến đi biển đầy nắng và gió" "https://example.com/beach.png" 2 \
  --gas-budget 1000000
```

Bạn có thể gọi lệnh này nhiều lần để thêm nhiều mẫu kỷ niệm khác nhau.

### Bước 4: Mint NFT Giới thiệu bản thân (Mint Self-Introduction NFT)

Chỉ cần gọi hàm này một lần để tạo NFT giới thiệu bản thân độc nhất của bạn.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module my_nft_collection \
  --function mint_self_introduction_nft \
  --args "<Tên của bạn>" "<Mô tả ngắn gọn>" "<URL hình ảnh>" "<Câu khẩu hiệu>" \
  --gas-budget 1000000
```

**Ví dụ:**

```bash
sui client call \
  --package 0x489563cb7a99e87528b871f6f5df62100e96374d7cfc9432af7907f119049151 \
  --module my_nft_collection \
  --function mint_self_introduction_nft \
  --args "Nguyễn Văn A" "Một nhà phát triển blockchain đam mê" "https://example.com/avatar.png" "Code for a better future" \
  --gas-budget 1000000
```

### Bước 5: Mint NFT Kỷ niệm ngẫu nhiên (Mint Random Memory NFT)

Bất kỳ người dùng nào cũng có thể gọi hàm này để mint một NFT kỷ niệm ngẫu nhiên từ các mẫu bạn đã cung cấp.

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module my_nft_collection \
  --function mint_random_memory_nft \
  --args <MemoryTemplateStore_OBJECT_ID> \
  --gas-budget 1000000
```

**Ví dụ:**

```bash
sui client call \
  --package 0x489563cb7a99e87528b871f6f5df62100e96374d7cfc9432af7907f119049151 \
  --module my_nft_collection \
  --function mint_random_memory_nft \
  --args 0x0b8391f4a847b3c9b1ec9a4820939906c8520714dcf5f1b4b503f8ab3c33f4c0 \
  --gas-budget 1000000
```

Sau khi chạy lệnh này, bạn sẽ nhận được một NFT kỷ niệm ngẫu nhiên dựa trên các mẫu đã được thêm vào store của bạn.

---