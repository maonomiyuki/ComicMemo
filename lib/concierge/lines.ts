import { ConciergeStyle, Reaction, Status } from '../types';

type Dict = Record<ConciergeStyle, Record<Status, Record<Reaction, string[]>>>;

const t = (s: string) => [s];

export const lines: Dict = {
  butler: {
    NO_LOG_TODAY: { PROGRESS: t('本日の進捗、まだ未記入でございます。'), COUNTDOWN: t('締切まであと{days_left}日です。'), PACE: t('必要ペースは{required_ppd:.1f}p/日でございます。'), MEMO: t('{memo}'), PRAISE: t('まずは1ページ、落ち着いて参りましょう。') },
    AHEAD: { PROGRESS: t('ご順調です。残り{remaining_pages}ページ。'), COUNTDOWN: t('余裕が生まれております。あと{days_left}日。'), PACE: t('現ペース{current_ppd:.1f}p/日、見事でございます。'), MEMO: t('{memo}'), PRAISE: t('素晴らしい進捗です。') },
    ON_TRACK: { PROGRESS: t('計画通りでございます。'), COUNTDOWN: t('あと{days_left}日、着実に。'), PACE: t('必要{required_ppd:.1f}p/日、現状{current_ppd:.1f}p/日です。'), MEMO: t('{memo}'), PRAISE: t('この調子で参りましょう。') },
    BEHIND: { PROGRESS: t('少々遅れ気味でございます。'), COUNTDOWN: t('あと{days_left}日、巻き返し可能です。'), PACE: t('必要{required_ppd:.1f}p/日に対し現状{current_ppd:.1f}p/日です。'), MEMO: t('{memo}'), PRAISE: t('次の一手を一緒に整えましょう。') },
    DANGER: { PROGRESS: t('危険域です。優先工程に集中しましょう。'), COUNTDOWN: t('締切まであと{days_left}日。'), PACE: t('必要ペース{required_ppd:.1f}p/日です。'), MEMO: t('{memo}'), PRAISE: t('短時間でも前進すれば必ず変わります。') },
    FINAL_DAY: { PROGRESS: t('本日が締切です。'), COUNTDOWN: t('最終日でございます。'), PACE: t('残り{remaining_pages}ページ、集中して参りましょう。'), MEMO: t('{memo}'), PRAISE: t('最後まで伴走いたします。') },
    DONE: { PROGRESS: t('完了です。お見事でございます。'), COUNTDOWN: t('見事に締切達成でございます。'), PACE: t('全{done_pages}ページ、仕上がりました。'), MEMO: t('{memo}'), PRAISE: t('本当にお疲れさまでした。') }
  },
  genki: {
    NO_LOG_TODAY: { PROGRESS: t('今日の入力まだだよ！'), COUNTDOWN: t('しめきりまであと{days_left}日！'), PACE: t('必要ペースは{required_ppd:.1f}p/日だよ！'), MEMO: t('{memo}'), PRAISE: t('まず1pいってみよー！') },
    AHEAD: { PROGRESS: t('めっちゃ順調！残り{remaining_pages}p！'), COUNTDOWN: t('まだ{days_left}日ある、いい感じ！'), PACE: t('今{current_ppd:.1f}p/日、つよい！'), MEMO: t('{memo}'), PRAISE: t('ナイス進捗！') },
    ON_TRACK: { PROGRESS: t('いいペースだよ！'), COUNTDOWN: t('あと{days_left}日、コツコツ！'), PACE: t('必要{required_ppd:.1f}p/日、今{current_ppd:.1f}p/日！'), MEMO: t('{memo}'), PRAISE: t('その調子その調子！') },
    BEHIND: { PROGRESS: t('ちょっと遅れ気味かも！'), COUNTDOWN: t('あと{days_left}日、まだいける！'), PACE: t('必要{required_ppd:.1f}p/日、今{current_ppd:.1f}p/日！'), MEMO: t('{memo}'), PRAISE: t('今日から立て直そう！') },
    DANGER: { PROGRESS: t('ピンチ！優先タスクに絞ろう！'), COUNTDOWN: t('あと{days_left}日だよ！'), PACE: t('必要{required_ppd:.1f}p/日、集中だ！'), MEMO: t('{memo}'), PRAISE: t('1コマでも前進！') },
    FINAL_DAY: { PROGRESS: t('今日は締切当日だよ！'), COUNTDOWN: t('最終日、いくぞー！'), PACE: t('残り{remaining_pages}p、ラストスパート！'), MEMO: t('{memo}'), PRAISE: t('最後まで応援してる！') },
    DONE: { PROGRESS: t('完走おめでとう！'), COUNTDOWN: t('間に合った！やったー！'), PACE: t('全{done_pages}p達成！'), MEMO: t('{memo}'), PRAISE: t('ほんとにおつかれさま！') }
  },
  senpai: {
    NO_LOG_TODAY: { PROGRESS: t('今日の記録、空いてるよ。'), COUNTDOWN: t('締切まで{days_left}日。'), PACE: t('必要は{required_ppd:.1f}p/日。'), MEMO: t('{memo}'), PRAISE: t('まず現状入力しよう。') },
    AHEAD: { PROGRESS: t('前倒しできてる。良い。'), COUNTDOWN: t('あと{days_left}日、余裕あり。'), PACE: t('現{current_ppd:.1f}p/日、維持でOK。'), MEMO: t('{memo}'), PRAISE: t('この貯金は強いね。') },
    ON_TRACK: { PROGRESS: t('予定線上。'), COUNTDOWN: t('あと{days_left}日、ぶれずに。'), PACE: t('必要{required_ppd:.1f}p/日、現{current_ppd:.1f}p/日。'), MEMO: t('{memo}'), PRAISE: t('いい管理できてる。') },
    BEHIND: { PROGRESS: t('少し遅れ。調整しよう。'), COUNTDOWN: t('あと{days_left}日。再配分で間に合う。'), PACE: t('必要{required_ppd:.1f}p/日 > 現{current_ppd:.1f}p/日。'), MEMO: t('{memo}'), PRAISE: t('次の24時間を設計しよう。') },
    DANGER: { PROGRESS: t('危険域。やることを削ろう。'), COUNTDOWN: t('残り{days_left}日。'), PACE: t('必要{required_ppd:.1f}p/日。最優先のみ。'), MEMO: t('{memo}'), PRAISE: t('集中すればまだ動く。') },
    FINAL_DAY: { PROGRESS: t('締切当日。判断早く。'), COUNTDOWN: t('最終日だ。'), PACE: t('残り{remaining_pages}p、優先順で。'), MEMO: t('{memo}'), PRAISE: t('最後までやり切ろう。') },
    DONE: { PROGRESS: t('完了。よく走り切った。'), COUNTDOWN: t('締切クリア。'), PACE: t('全{done_pages}p完了。'), MEMO: t('{memo}'), PRAISE: t('次もこの管理でいこう。') }
  }
};
