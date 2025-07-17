---
id: frontend-deployment
title: Deploy Frontend Applications
sidebar_position: 6
---

# 🚀 Deploy Frontend Applications

## Deployment Platforms

### 1. Vercel (Recommended)

Vercel là platform tốt nhất cho React applications với zero-config deployment.

#### Setup Vercel Deployment

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Deploy từ terminal
vercel

# Hoặc deploy production
vercel --prod
```

#### Vercel Configuration

Tạo `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUI_NETWORK": "testnet",
    "VITE_PACKAGE_ID": "@package-id"
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### Environment Variables trên Vercel

```bash
# Thêm environment variables qua Vercel dashboard hoặc CLI
vercel env add VITE_PACKAGE_ID production
vercel env add VITE_SUI_NETWORK production
```

### 2. Netlify

#### Setup Netlify Deployment

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

#### Netlify Configuration

Tạo `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 3. GitHub Pages

#### Setup GitHub Pages

```bash
# Cài đặt gh-pages
npm install -D gh-pages
```

Thêm vào `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/repository-name"
}
```

Cập nhật `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/repository-name/', // Tên repository của bạn
  plugins: [react()],
  // ... other config
})
```

## Environment Management

### 1. Environment Files

```bash
# Development
.env.local

# Staging
.env.staging

# Production
.env.production
```

### 2. Environment Variables

```bash
# .env.production
VITE_SUI_NETWORK=mainnet
VITE_PACKAGE_ID=0x...
VITE_API_URL=https://api.yourapp.com
VITE_ENABLE_ANALYTICS=true
```

### 3. Runtime Environment Detection

```typescript
// src/config/env.ts
export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  SUI_NETWORK: import.meta.env.VITE_SUI_NETWORK || 'testnet',
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || '',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Type-safe environment
export type Environment = typeof ENV;
```

## Build Optimization

### 1. Bundle Analysis

```bash
# Cài đặt bundle analyzer
npm install -D rollup-plugin-visualizer

# Cập nhật vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
});
```

### 2. Code Splitting

```typescript
// Lazy loading components
import { lazy, Suspense } from 'react';

const NFTGallery = lazy(() => import('./components/NFTGallery'));
const Marketplace = lazy(() => import('./pages/Marketplace'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/nfts" element={<NFTGallery />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. Asset Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          sui: ['@mysten/sui.js', '@mysten/dapp-kit'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

## Performance Monitoring

### 1. Web Vitals

```bash
npm install web-vitals
```

```typescript
// src/utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### 2. Error Tracking

```typescript
// src/utils/errorTracking.ts
export function initErrorTracking() {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to error tracking service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to error tracking service
  });
}
```

## Security Best Practices

### 1. Content Security Policy

```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://fullnode.testnet.sui.io https://fullnode.mainnet.sui.io;">
```

### 2. Environment Variable Security

```typescript
// ❌ Never expose private keys in frontend
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY; // DON'T DO THIS

// ✅ Only expose public configuration
const PUBLIC_CONFIG = {
  NETWORK: import.meta.env.VITE_SUI_NETWORK,
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID,
  API_URL: import.meta.env.VITE_API_URL,
};
```

### 3. Input Validation

```typescript
// src/utils/validation.ts
export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

export const validateAmount = (amount: string): boolean => {
  const num = Number(amount);
  return !isNaN(num) && num > 0;
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

## CI/CD Pipeline

### 1. GitHub Actions

Tạo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build project
      run: npm run build
      env:
        VITE_SUI_NETWORK: ${{ secrets.VITE_SUI_NETWORK }}
        VITE_PACKAGE_ID: ${{ secrets.VITE_PACKAGE_ID }}
    
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 2. Automated Testing

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

Tạo `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## Monitoring & Analytics

### 1. Application Monitoring

```typescript
// src/utils/monitoring.ts
export class AppMonitoring {
  static trackPageView(page: string) {
    // Google Analytics, Mixpanel, etc.
    console.log(`Page view: ${page}`);
  }

  static trackEvent(event: string, properties?: Record<string, any>) {
    console.log(`Event: ${event}`, properties);
  }

  static trackError(error: Error, context?: Record<string, any>) {
    console.error('Application error:', error, context);
  }
}
```

### 2. Performance Metrics

```typescript
// src/hooks/usePerformance.ts
export function usePerformance() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint'] });

    return () => observer.disconnect();
  }, []);
}
```

## Troubleshooting Common Issues

### 1. Build Failures

```bash
# Clear cache
rm -rf node_modules dist .vercel
npm install

# Check for TypeScript errors
npm run type-check

# Check bundle size
npm run build -- --analyze
```

### 2. Runtime Errors

```typescript
// Error boundary for production
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (ENV.IS_PRODUCTION) {
      // Send to error tracking service
      console.error('Production error:', error, errorInfo);
    }
  }
}
```

### 3. Performance Issues

```typescript
// Performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Component render time: ${endTime - startTime}ms`);
    };
  });
}
```

Với những setup này, bạn có thể deploy Sui dApp một cách an toàn và hiệu quả! 