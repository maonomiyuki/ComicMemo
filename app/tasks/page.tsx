'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BottomNav } from '../components/nav';
import { bootstrapUser } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { Task } from '@/lib/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState('');
  const [name, setName] = useState('');
  const [hasPageProgress, setHasPageProgress] = useState(false);

  useEffect(() => {
    async function init() {
      const { projectId } = await bootstrapUser();
      setProjectId(projectId);
      const { data } = await supabase!.from('tasks').select('*').eq('project_id', projectId).order('sort_order');
      setTasks(data ?? []);
    }
    init();
  }, []);

  async function refresh() {
    const { data } = await supabase!.from('tasks').select('*').eq('project_id', projectId).order('sort_order');
    setTasks(data ?? []);
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();
    const { data: user } = await supabase!.auth.getUser();
    await supabase!.from('tasks').insert({
      project_id: projectId,
      user_id: user.user!.id,
      name,
      has_page_progress: hasPageProgress,
      sort_order: tasks.length,
      is_enabled: true,
    });
    setName('');
    setHasPageProgress(false);
    await refresh();
  }

  async function move(task: Task, dir: -1 | 1) {
    const idx = tasks.findIndex((t) => t.id === task.id);
    const other = tasks[idx + dir];
    if (!other) return;
    await supabase!.from('tasks').update({ sort_order: other.sort_order }).eq('id', task.id);
    await supabase!.from('tasks').update({ sort_order: task.sort_order }).eq('id', other.id);
    await refresh();
  }

  return (
    <main className="space-y-3 pb-16">
      <h1 className="text-xl font-bold">チェックリスト編集</h1>
      <section className="card space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-ink p-2">
            <div className="flex items-center justify-between">
              <p>{task.name}</p>
              <div className="space-x-1">
                <button className="rounded border px-2" onClick={() => move(task, -1)}>↑</button>
                <button className="rounded border px-2" onClick={() => move(task, 1)}>↓</button>
                <button className="rounded border px-2" onClick={async () => { await supabase!.from('tasks').delete().eq('id', task.id); await refresh(); }}>削除</button>
              </div>
            </div>
            <div className="mt-2 flex gap-3 text-sm">
              <label><input type="checkbox" checked={task.is_enabled} onChange={async (e) => { await supabase!.from('tasks').update({ is_enabled: e.target.checked }).eq('id', task.id); await refresh(); }} /> 表示</label>
              <label><input type="checkbox" checked={task.has_page_progress} onChange={async (e) => { await supabase!.from('tasks').update({ has_page_progress: e.target.checked }).eq('id', task.id); await refresh(); }} /> ページ進捗</label>
            </div>
          </div>
        ))}
      </section>

      <form className="card space-y-2" onSubmit={addTask}>
        <h2 className="font-semibold">項目追加</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded border border-ink p-2" placeholder="項目名" />
        <label className="text-sm"><input type="checkbox" checked={hasPageProgress} onChange={(e) => setHasPageProgress(e.target.checked)} /> ページ進捗を表示</label>
        <button className="w-full rounded-xl border-2 border-ink bg-ink py-2 text-white">追加</button>
      </form>
      <BottomNav />
    </main>
  );
}
