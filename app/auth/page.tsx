'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function signIn(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : 'メールを送信しました。');
  }

  if (!supabase) return <main className="p-4">Supabase環境変数を設定してください。</main>;

  return (
    <main className="card mt-10 space-y-2">
      <h1 className="text-xl font-bold">ログイン</h1>
      <form onSubmit={signIn} className="space-y-2">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-ink p-2" placeholder="email@example.com" />
        <button className="w-full rounded-xl border-2 border-ink bg-ink py-2 text-white">ログインリンク送信</button>
      </form>
      {message && <p className="text-sm">{message}</p>}
    </main>
  );
}
