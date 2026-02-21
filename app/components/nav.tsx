'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  ['/', 'ダッシュボード'],
  ['/log', '今日の報告'],
  ['/tasks', 'タスク'],
  ['/settings', '設定'],
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 gap-1 border-t-2 border-ink bg-paper p-2">
      {items.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 rounded-xl px-2 py-2 text-center text-xs ${
            path === href ? 'bg-ink text-white' : 'bg-white'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
