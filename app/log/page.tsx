'use client';

import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../components/nav';
import { bootstrapUser } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function LogPage() {
  const [pagesDone, setPagesDone] = useState(0);
  const [memo, setMemo] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    bootstrapUser().then(({ projectId }) => setProjectId(projectId)).catch((e) => setError(e.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !projectId) return;
    setSaving(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) throw new Error('ログインが必要です。');
      const logDate = dayjs().format('YYYY-MM-DD');
      await supabase.from('daily_logs').upsert({
        project_id: projectId,
        user_id: userId,
        log_date: logDate,
        pages_done: pagesDone,
        memo,
      }, { onConflict: 'project_id,log_date' });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-3 pb-16">
      <h1 className="text-xl font-bold">今日の報告</h1>
      <form onSubmit={onSubmit} className="card space-y-3">
        <label className="block">
          今日進んだページ数
          <input type="number" min={0} value={pagesDone} onChange={(e) => setPagesDone(Number(e.target.value))} className="mt-1 w-full rounded border border-ink p-2" />
        </label>
        <label className="block">
          メモ
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} className="mt-1 w-full rounded border border-ink p-2" rows={4} />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={saving} className="w-full rounded-xl border-2 border-ink bg-ink py-2 text-white disabled:opacity-60">保存</button>
      </form>
      <BottomNav />
    </main>
  );
}
