import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { PwaRegister } from './components/pwa-register';

export const metadata: Metadata = {
  title: 'Comic Memo',
  description: '漫画作画 作業管理アプリ',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="mx-auto min-h-dvh max-w-md px-3 pb-10 pt-3">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
