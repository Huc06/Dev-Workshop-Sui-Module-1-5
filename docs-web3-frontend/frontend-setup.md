---
id: frontend-setup
title: Setup Frontend Development Environment
sidebar_position: 5
---

# 🛠️ Setup Frontend Development Environment

## Khởi tạo React Project cho Sui dApp

### 1. Tạo project với Vite

```bash
# Tạo React project với TypeScript
npm create vite@latest my-sui-dapp -- --template react-ts
cd my-sui-dapp

# Cài đặt dependencies
npm install
```

### 2. Cài đặt Sui dependencies

```bash
# Sui SDK và dApp Kit
npm install @mysten/sui.js @mysten/dapp-kit

# React Query (required by dApp Kit)
npm install @tanstack/react-query

# UI libraries (optional)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react # for icons
```

### 3. Cấu hình TypeScript

Cập nhật `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Cấu hình Vite

Cập nhật `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

## Cấu trúc Project

### 1. Tổ chức thư mục

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── wallet/       # Wallet-related components
│   ├── transactions/ # Transaction components
│   └── nft/          # NFT-related components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # App constants
├── contexts/         # React contexts
├── pages/            # Page components
└── styles/           # CSS/styling files
```

### 2. Setup App.tsx

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { ThemeProvider } from './contexts/ThemeContext';
import { Router } from './Router';
import '@mysten/dapp-kit/dist/index.css';
import './App.css';

const queryClient = new QueryClient();

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  devnet: { url: getFullnodeUrl('devnet') },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <ThemeProvider>
            <Router />
          </ThemeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### 3. Environment Variables

Tạo `.env.local`:

```bash
# Network configuration
VITE_SUI_NETWORK=testnet

# Contract addresses (update with your deployed contracts)
VITE_PACKAGE_ID=0x...
VITE_NFT_CONTRACT=0x...

# API endpoints (if using custom RPC)
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Feature flags
VITE_ENABLE_DEVTOOLS=true
```

## Development Tools

### 1. VS Code Extensions

Cài đặt các extensions hữu ích:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense"
  ]
}
```

### 2. ESLint Configuration

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Tạo `.eslintrc.js`:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### 3. Prettier Configuration

Tạo `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Custom Hooks

### 1. useLocalStorage Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### 2. useDebounce Hook

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. useAsync Hook

```typescript
// src/hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
```

## Utility Functions

### 1. Constants

```typescript
// src/constants/sui.ts
export const SUI_NETWORKS = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet',
  DEVNET: 'devnet',
} as const;

export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '';

export const TRANSACTION_TIMEOUT = 30000; // 30 seconds

export const MIST_PER_SUI = 1_000_000_000;
```

### 2. Format Utilities

```typescript
// src/utils/format.ts
export const formatSui = (balance: string | number): string => {
  const sui = Number(balance) / 1_000_000_000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(sui);
};

export const formatAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
};
```

## Scripts trong package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## Tiếp theo

Sau khi setup xong environment, bạn có thể:

1. Tạo các React components cho wallet integration
2. Implement transaction handling
3. Build UI cho NFT marketplace
4. Deploy lên Vercel/Netlify

Trong bài tiếp theo, chúng ta sẽ học cách deploy Frontend application! 