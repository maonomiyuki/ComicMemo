'use client';

import { useEffect } from 'react';

const repoBase = '/ComicMemo';

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const prefix = window.location.pathname.startsWith(`${repoBase}/`) ? repoBase : '';
      navigator.serviceWorker.register(`${prefix}/sw.js`).catch(() => undefined);
    }
  }, []);
  return null;
}
