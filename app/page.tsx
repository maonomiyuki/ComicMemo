'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from './components/nav';
import { bootstrapUser } from '@/lib/data';
import { computeMetrics } from '@/lib/progress';
import { DailyLog, Profile, Project, Reaction, Task, TaskProgress } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { speak } from '@/lib/concierge/speak';

const reactions: Reaction[] = ['PROGRESS', 'COUNTDOWN', 'PACE', 'MEMO', 'PRAISE'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskProgress, setTaskProgress] = useState<Record<string, TaskProgress>>({});
  const [reactionIndex, setReactionIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        if (!supabase) throw new Error('Supabase環境変数を設定してください。');
        const { userId, projectId } = await bootstrapUser();
        const [projectRes, profileRes, logsRes, tasksRes, progressRes] = await Promise.all([
          supabase.from('projects').select('*').eq('id', projectId).single(),
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('daily_logs').select('*').eq('project_id', projectId).order('log_date', { ascending: false }),
          supabase.from('tasks').select('*').eq('project_id', projectId).eq('is_enabled', true).order('sort_order', { ascending: true }),
          supabase.from('task_progress').select('*').eq('project_id', projectId),
        ]);
        setProject(projectRes.data);
        setProfile(profileRes.data);
        setLogs(logsRes.data ?? []);
        setTasks(tasksRes.data ?? []);
        setTaskProgress(Object.fromEntries((progressRes.data ?? []).map((p) => [p.task_id, p])));
      } catch (e) {
        setError(e instanceof Error ? e.message : '読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const metrics = useMemo(() => {
    if (!project) return null;
    return computeMetrics({
      logs,
      totalPages: project.total_pages,
      deadline: project.deadline,
      startDate: project.start_date,
    });
  }, [project, logs]);

  if (loading) return <main className="p-4">読み込み中...</main>;
  if (error || !project || !profile || !metrics) return <main className="p-4 text-red-600">{error ?? 'データ不足'}</main>;

  const latestMemo = logs.find((l) => l.memo)?.memo;
  const reaction = reactions[reactionIndex % reactions.length];

  return (
    <main className="space-y-3 pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border-2 border-ink bg-paper p-3">
        <h1 className="text-lg font-bold">{project.title}</h1>
        <Link href="/settings" className="rounded-xl border-2 border-ink px-3 py-1">⚙️</Link>
      </header>

      <section className="card">
        <p>しめきりまで あと {metrics.daysLeft}日</p>
        <p>のこり {metrics.remainingPages}ページ</p>
        <p className="mt-2 rounded-xl bg-paper p-2 text-sm">{speak(profile.concierge_style, reaction, metrics, latestMemo)}</p>
      </section>

      <button className="card w-full" onClick={() => setReactionIndex((p) => p + 1)}>
        <div className="relative mx-auto h-56 w-56">
          <Image src={`/concierge/${profile.concierge_avatar_key}.svg`} alt="concierge" fill className="object-contain" />
        </div>
        <p className="text-xs">タップで反応切替: {reaction}</p>
      </button>

      <section className="card grid grid-cols-2 gap-2 text-sm">
        <p>現在ペース: {metrics.currentPpd.toFixed(1)} p/日</p>
        <p>必要ペース: {metrics.requiredPpd.toFixed(1)} p/日</p>
        <p>今日の入力: {metrics.hasLogToday ? '済' : '未'}</p>
        <Link href="/log" className="rounded-lg border border-ink px-2 py-1 text-center">報告へ</Link>
      </section>

      <section className="card space-y-2">
        {tasks.map((task) => {
          const progress = taskProgress[task.id];
          const total = progress?.total_pages ?? project.total_pages;
          return (
            <div key={task.id} className="flex min-h-11 items-center justify-between rounded-xl border border-ink px-2 py-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={progress?.is_checked ?? false} readOnly className="h-5 w-5" />
                <span>{task.name}</span>
              </div>
              {task.has_page_progress && <span className="text-xs">{progress?.done_pages ?? 0}/{total}</span>}
            </div>
          );
        })}
        <Link href="/tasks" className="inline-block rounded-lg border-2 border-ink px-3 py-1">編集</Link>
      </section>
      <BottomNav />
    </main>
  );
}
