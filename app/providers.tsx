'use client';

import { CartProvider } from '@/lib/CartContext';
import { ToastProvider } from '@/lib/ToastContext';
import { ABTestProvider } from '@/lib/ABTestContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ABTestProvider>
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </ABTestProvider>
  );
}
