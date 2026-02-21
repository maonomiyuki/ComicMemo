'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BottomNav } from '../components/nav';
import { bootstrapUser } from '@/lib/data';
import { ConciergeStyle } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState(30);
  const [deadline, setDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [style, setStyle] = useState<ConciergeStyle>('butler');
  const [avatar, setAvatar] = useState('butler_01');
  const [notificationTime, setNotificationTime] = useState('21:00');

  useEffect(() => {
    async function load() {
      const ids = await bootstrapUser();
      setProjectId(ids.projectId);
      setUserId(ids.userId);
      const [project, profile] = await Promise.all([
        supabase!.from('projects').select('*').eq('id', ids.projectId).single(),
        supabase!.from('profiles').select('*').eq('id', ids.userId).single(),
      ]);
      setTitle(project.data.title);
      setTotalPages(project.data.total_pages);
      setDeadline(project.data.deadline);
      setStartDate(project.data.start_date);
      setStyle(profile.data.concierge_style);
      setAvatar(profile.data.concierge_avatar_key);
      setNotificationTime(profile.data.notification_time ?? '21:00');
    }
    load();
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    await Promise.all([
      supabase!.from('projects').update({ title, total_pages: totalPages, deadline, start_date: startDate }).eq('id', projectId),
      supabase!.from('profiles').upsert({ id: userId, concierge_style: style, concierge_avatar_key: avatar, notification_time: notificationTime }),
    ]);
    alert('保存しました');
  }

  return (
    <main className="space-y-3 pb-16">
      <h1 className="text-xl font-bold">設定</h1>
      <form onSubmit={save} className="card space-y-2">
        <label className="block">プロジェクト名<input className="mt-1 w-full rounded border border-ink p-2" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="block">総ページ数<input type="number" min={1} className="mt-1 w-full rounded border border-ink p-2" value={totalPages} onChange={(e) => setTotalPages(Number(e.target.value))} /></label>
        <label className="block">締切<input type="date" className="mt-1 w-full rounded border border-ink p-2" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
        <label className="block">開始日<input type="date" className="mt-1 w-full rounded border border-ink p-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
        <label className="block">スタイル
          <select className="mt-1 w-full rounded border border-ink p-2" value={style} onChange={(e) => setStyle(e.target.value as ConciergeStyle)}>
            <option value="butler">butler</option>
            <option value="genki">genki</option>
            <option value="senpai">senpai</option>
          </select>
        </label>
        <label className="block">立ち絵
          <select className="mt-1 w-full rounded border border-ink p-2" value={avatar} onChange={(e) => setAvatar(e.target.value)}>
            <option value="butler_01">butler_01</option>
            <option value="genki_01">genki_01</option>
            <option value="senpai_01">senpai_01</option>
          </select>
        </label>
        <label className="block">通知時刻（Phase2）<input type="time" className="mt-1 w-full rounded border border-ink p-2" value={notificationTime} onChange={(e) => setNotificationTime(e.target.value)} /></label>
        <button className="w-full rounded-xl border-2 border-ink bg-ink py-2 text-white">保存</button>
      </form>
      <BottomNav />
    </main>
  );
}
