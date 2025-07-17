---
title: Testing và Deployment
---

# Testing và Deployment trong Sui Move

## 1. Unit Testing trong Move

### 1.1. Cấu trúc test cơ bản
```move
#[cfg(test)]
module my_package::my_module_tests {
    use my_package::my_module::{Self, MyStruct};
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::test_utils;

    #[test]
    fun test_create_object() {
        let scenario_val = ts::begin(@0x1);
        let scenario = &mut scenario_val;
        
        // Test logic here
        
        ts::end(scenario_val);
    }
}
```

### 1.2. Test với Objects
```move
#[test]
fun test_transfer_object() {
    let admin = @0x1;
    let user = @0x2;
    
    let scenario_val = ts::begin(admin);
    let scenario = &mut scenario_val;
    
    // Admin tạo object
    ts::next_tx(scenario, admin);
    {
        my_module::create_object(ts::ctx(scenario));
    };
    
    // User nhận object
    ts::next_tx(scenario, user);
    {
        let obj = ts::take_from_sender<MyStruct>(scenario);
        // Verify object properties
        assert!(my_module::get_value(&obj) == 100, 0);
        ts::return_to_sender(scenario, obj);
    };
    
    ts::end(scenario_val);
}
```

### 1.3. Test với Capabilities
```move
#[test]
fun test_admin_functions() {
    let admin = @0x1;
    let scenario_val = ts::begin(admin);
    let scenario = &mut scenario_val;
    
    // Init module - tạo AdminCap
    ts::next_tx(scenario, admin);
    {
        my_module::init_for_testing(ts::ctx(scenario));
    };
    
    // Sử dụng AdminCap
    ts::next_tx(scenario, admin);
    {
        let admin_cap = ts::take_from_sender<AdminCap>(scenario);
        my_module::admin_function(&admin_cap, ts::ctx(scenario));
        ts::return_to_sender(scenario, admin_cap);
    };
    
    ts::end(scenario_val);
}
```

## 2. Integration Testing

### 2.1. Test với Clock
```move
#[test]
fun test_time_based_function() {
    let scenario_val = ts::begin(@0x1);
    let scenario = &mut scenario_val;
    
    ts::next_tx(scenario, @0x1);
    {
        let clock = clock::create_for_testing(ts::ctx(scenario));
        clock::set_for_testing(&mut clock, 1000); // Set timestamp
        
        // Test function that depends on time
        my_module::time_function(&clock, ts::ctx(scenario));
        
        clock::destroy_for_testing(clock);
    };
    
    ts::end(scenario_val);
}
```

### 2.2. Test với Coins
```move
#[test]
fun test_payment_function() {
    let scenario_val = ts::begin(@0x1);
    let scenario = &mut scenario_val;
    
    ts::next_tx(scenario, @0x1);
    {
        let coin = coin::mint_for_testing<SUI>(1000, ts::ctx(scenario));
        my_module::buy_item(coin, ts::ctx(scenario));
    };
    
    ts::end(scenario_val);
}
```

## 3. Chạy Tests

### 3.1. Run all tests
```bash
sui move test
```

### 3.2. Run specific test
```bash
sui move test --filter test_create_object
```

### 3.3. Run với coverage
```bash
sui move test --coverage
```

### 3.4. Verbose output
```bash
sui move test -v
```

## 4. Deployment Process

### 4.1. Local Development
```bash
# Start local network
sui start --with-faucet

# Get coins from faucet
sui client faucet

# Build project
sui move build

# Run tests
sui move test
```

### 4.2. Deploy to Testnet
```bash
# Switch to testnet
sui client switch --env testnet

# Get testnet coins
sui client faucet

# Publish package
sui client publish --gas-budget 100000000
```

### 4.3. Deploy to Mainnet
```bash
# Switch to mainnet
sui client switch --env mainnet

# Publish package (cần SUI thật)
sui client publish --gas-budget 100000000
```

## 5. Package Upgrades

### 5.1. Upgrade Policy
```move
module my_package::my_module {
    use sui::package;
    
    fun init(ctx: &mut TxContext) {
        // Tạo UpgradeCap với policy
        package::claim_and_keep(otw, ctx);
    }
}
```

### 5.2. Authorize Upgrade
```bash
# Authorize upgrade
sui client call --function authorize_upgrade \
  --module package \
  --package 0x2 \
  --args <UPGRADE_CAP_ID> <POLICY> <DIGEST>
```

### 5.3. Commit Upgrade
```bash
# Commit upgrade
sui client upgrade --upgrade-capability <UPGRADE_CAP_ID>
```

## 6. Best Practices

### 6.1. Test Coverage
- Test tất cả public functions
- Test edge cases và error conditions
- Test với different user roles
- Test upgrade scenarios

### 6.2. Security Testing
```move
#[test]
#[expected_failure(abort_code = EInvalidPermission)]
fun test_unauthorized_access() {
    let scenario_val = ts::begin(@0x1);
    let scenario = &mut scenario_val;
    
    // Test that non-admin cannot call admin function
    ts::next_tx(scenario, @0x2); // Different user
    {
        my_module::admin_only_function(ts::ctx(scenario));
    };
    
    ts::end(scenario_val);
}
```

### 6.3. Gas Testing
```move
#[test]
fun test_gas_efficiency() {
    let scenario_val = ts::begin(@0x1);
    let scenario = &mut scenario_val;
    
    ts::next_tx(scenario, @0x1);
    {
        // Test that function doesn't use excessive gas
        let gas_before = ts::gas_used(scenario);
        my_module::expensive_function(ts::ctx(scenario));
        let gas_after = ts::gas_used(scenario);
        
        assert!(gas_after - gas_before < 1000000, 0); // Max gas limit
    };
    
    ts::end(scenario_val);
}
```

## 7. Monitoring và Debugging

### 7.1. Event Logging
```move
use sui::event;

public struct ItemCreated has copy, drop {
    id: ID,
    creator: address,
    timestamp: u64,
}

public fun create_item(ctx: &mut TxContext) {
    let item = Item { /* ... */ };
    
    event::emit(ItemCreated {
        id: object::id(&item),
        creator: tx_context::sender(ctx),
        timestamp: tx_context::epoch_timestamp_ms(ctx),
    });
    
    transfer::public_transfer(item, tx_context::sender(ctx));
}
```

### 7.2. Error Handling
```move
const EInsufficientBalance: u64 = 1;
const EInvalidPermission: u64 = 2;

public fun transfer_with_fee(
    coin: &mut Coin<SUI>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext
) {
    assert!(coin::value(coin) >= amount + FEE, EInsufficientBalance);
    
    let payment = coin::split(coin, amount, ctx);
    let fee = coin::split(coin, FEE, ctx);
    
    transfer::public_transfer(payment, recipient);
    transfer::public_transfer(fee, FEE_COLLECTOR);
}
```

## 8. CI/CD Pipeline

### 8.1. GitHub Actions Example
```yaml
name: Sui Move CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Install Sui
      run: |
        curl -fLJO https://github.com/MystenLabs/sui/releases/download/testnet-v1.14.0/sui-testnet-v1.14.0-ubuntu-x86_64.tgz
        tar -xzf sui-testnet-v1.14.0-ubuntu-x86_64.tgz
        sudo mv sui-testnet-v1.14.0-ubuntu-x86_64/sui /usr/local/bin/
    - name: Run tests
      run: sui move test
    - name: Build
      run: sui move build
```

Với những kiến thức này, bạn có thể test và deploy smart contracts một cách an toàn và hiệu quả trên Sui blockchain! 🚀 