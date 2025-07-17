---
id: react-components
title: React Components cho Sui dApps
sidebar_position: 4
---

# ⚛️ React Components cho Sui dApps

## Thiết kế Component Architecture

### 1. Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Modal.tsx
│   ├── wallet/
│   │   ├── WalletConnectButton.tsx
│   │   ├── WalletInfo.tsx
│   │   └── NetworkSelector.tsx
│   ├── transactions/
│   │   ├── TransactionButton.tsx
│   │   ├── TransactionHistory.tsx
│   │   └── GasEstimator.tsx
│   └── nft/
│       ├── NFTCard.tsx
│       ├── NFTGallery.tsx
│       └── NFTMinter.tsx
```

## Common Components

### 1. Loading Spinner

```tsx
// components/common/LoadingSpinner.tsx
import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message 
}) => {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};
```

### 2. Error Boundary

```tsx
// components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 3. Modal Component

```tsx
// components/common/Modal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
```

## Wallet Components

### 1. Enhanced Wallet Connect Button

```tsx
// components/wallet/WalletConnectButton.tsx
import React, { useState } from 'react';
import { useCurrentAccount, useWallets, useConnectWallet, useDisconnectWallet } from '@mysten/dapp-kit';
import { Modal } from '../common/Modal';
import './WalletConnectButton.css';

export const WalletConnectButton: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const [showModal, setShowModal] = useState(false);

  const handleConnect = (wallet: any) => {
    connect({ wallet }, {
      onSuccess: () => setShowModal(false),
      onError: (error) => console.error('Connection failed:', error),
    });
  };

  if (currentAccount) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <span className="wallet-address">
            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          </span>
        </div>
        <button 
          className="disconnect-button"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button 
        className="connect-wallet-button"
        onClick={() => setShowModal(true)}
      >
        Connect Wallet
      </button>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Connect Your Wallet"
      >
        <div className="wallet-options">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="wallet-option"
              onClick={() => handleConnect(wallet)}
              disabled={!wallet.features['sui:connect']}
            >
              <img src={wallet.icon} alt={wallet.name} width={32} height={32} />
              <span>{wallet.name}</span>
              {!wallet.features['sui:connect'] && (
                <span className="not-available">Not Available</span>
              )}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};
```

### 2. Wallet Info Display

```tsx
// components/wallet/WalletInfo.tsx
import React from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatSuiBalance } from '../../utils/format';

export const WalletInfo: React.FC = () => {
  const currentAccount = useCurrentAccount();
  
  const { data: balance, isLoading } = useSuiClientQuery(
    'getBalance',
    { owner: currentAccount?.address || '' },
    { enabled: !!currentAccount?.address }
  );

  if (!currentAccount) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="wallet-info-card">
      <h3>Wallet Information</h3>
      
      <div className="info-row">
        <label>Address:</label>
        <span className="address">
          {currentAccount.address.slice(0, 10)}...{currentAccount.address.slice(-10)}
        </span>
      </div>

      <div className="info-row">
        <label>SUI Balance:</label>
        {isLoading ? (
          <LoadingSpinner size="small" />
        ) : (
          <span className="balance">
            {formatSuiBalance(balance?.totalBalance || '0')} SUI
          </span>
        )}
      </div>
    </div>
  );
};
```

## Transaction Components

### 1. Transaction Button with States

```tsx
// components/transactions/TransactionButton.tsx
import React, { useState } from 'react';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TransactionButtonProps {
  transaction: TransactionBlock;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  transaction,
  onSuccess,
  onError,
  children,
  disabled = false,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const handleClick = async () => {
    setIsLoading(true);
    
    signAndExecute(
      { transactionBlock: transaction },
      {
        onSuccess: (result) => {
          setIsLoading(false);
          onSuccess?.(result);
        },
        onError: (error) => {
          setIsLoading(false);
          onError?.(error);
        },
      }
    );
  };

  return (
    <button
      className={`transaction-button ${className} ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
```

### 2. Transaction History

```tsx
// components/transactions/TransactionHistory.tsx
import React from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatTimestamp } from '../../utils/format';

export const TransactionHistory: React.FC = () => {
  const currentAccount = useCurrentAccount();
  
  // Note: This is a simplified example
  // In practice, you'd need to implement pagination
  const { data: transactions, isLoading } = useSuiClientQuery(
    'queryTransactionBlocks',
    {
      filter: { FromAddress: currentAccount?.address },
      options: { showEffects: true, showInput: true },
      limit: 20,
    },
    { enabled: !!currentAccount?.address }
  );

  if (!currentAccount) {
    return <div>Connect wallet to view transaction history</div>;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  return (
    <div className="transaction-history">
      <h3>Recent Transactions</h3>
      
      {transactions?.data.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div className="transaction-list">
          {transactions?.data.map((tx) => (
            <div key={tx.digest} className="transaction-item">
              <div className="tx-digest">
                {tx.digest.slice(0, 10)}...{tx.digest.slice(-10)}
              </div>
              <div className="tx-status">
                {tx.effects?.status?.status === 'success' ? '✅' : '❌'}
              </div>
              <div className="tx-timestamp">
                {formatTimestamp(tx.timestampMs)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## NFT Components

### 1. NFT Card

```tsx
// components/nft/NFTCard.tsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface NFTCardProps {
  nft: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  };
  onClick?: () => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <div 
        className="nft-card" 
        onClick={() => setShowModal(true)}
      >
        <div className="nft-image-container">
          {imageError ? (
            <div className="nft-image-placeholder">
              🖼️ Image not available
            </div>
          ) : (
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="nft-image"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        
        <div className="nft-info">
          <h4 className="nft-name">{nft.name}</h4>
          <p className="nft-id">#{nft.id.slice(-6)}</p>
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={nft.name}
      >
        <div className="nft-details">
          <img src={nft.imageUrl} alt={nft.name} className="nft-detail-image" />
          <p>{nft.description}</p>
          
          {nft.attributes && (
            <div className="nft-attributes">
              <h4>Attributes</h4>
              {nft.attributes.map((attr, index) => (
                <div key={index} className="attribute">
                  <span className="trait-type">{attr.trait_type}:</span>
                  <span className="trait-value">{attr.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
```

## Utility Functions

```tsx
// utils/format.ts
export const formatSuiBalance = (balance: string): string => {
  const sui = Number(balance) / 1_000_000_000; // Convert MIST to SUI
  return sui.toFixed(4);
};

export const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return 'Unknown';
  return new Date(Number(timestamp)).toLocaleDateString();
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};
```

## CSS Styling Examples

```css
/* components/common/LoadingSpinner.css */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner--small .spinner {
  width: 16px;
  height: 16px;
}

.loading-spinner--large .spinner {
  width: 32px;
  height: 32px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

Những components này tập trung vào Frontend development thuần túy, giúp xây dựng UI/UX tốt cho Sui dApps mà không lẫn lộn với Move development! 