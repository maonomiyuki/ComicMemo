import dayjs from 'dayjs';
import { supabase } from './supabase';

const defaultTasks = [
  ['プロット', false],
  ['ネーム', false],
  ['下書き', true],
  ['ペン入れ', true],
  ['ベタ', false],
  ['効果線', false],
  ['トーン', true],
  ['仕上げ', true],
] as const;

export async function requireSession() {
  if (!supabase) {
    throw new Error('Supabase環境変数が設定されていません。');
  }
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) throw new Error('ログインが必要です。');
  return data.session.user;
}

export async function bootstrapUser() {
  const user = await requireSession();
  const today = dayjs();

  const { data: profile } = await supabase!
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    await supabase!.from('profiles').insert({
      id: user.id,
      concierge_style: 'butler',
      concierge_avatar_key: 'butler_01',
      timezone: 'Asia/Tokyo',
    });
  }

  const { data: project } = await supabase!
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  let projectId = project?.id as string | undefined;

  if (!projectId) {
    const { data: created } = await supabase!
      .from('projects')
      .insert({
        user_id: user.id,
        title: '新規プロジェクト',
        total_pages: 30,
        start_date: today.format('YYYY-MM-DD'),
        deadline: today.add(14, 'day').format('YYYY-MM-DD'),
      })
      .select('*')
      .single();

    projectId = created.id;

    const { data: insertedTasks } = await supabase!
      .from('tasks')
      .insert(
        defaultTasks.map(([name, has], i) => ({
          project_id: projectId,
          user_id: user.id,
          name,
          sort_order: i,
          has_page_progress: has,
          is_enabled: true,
        })),
      )
      .select('id');

    if (insertedTasks?.length) {
      await supabase!.from('task_progress').insert(
        insertedTasks.map((task) => ({
          task_id: task.id,
          project_id: projectId,
          user_id: user.id,
          is_checked: false,
        })),
      );
    }
  }

  return { userId: user.id, projectId: projectId! };
}
