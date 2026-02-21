import { ProgressMetrics } from '../progress';
import { ConciergeStyle, Reaction } from '../types';
import { lines } from './lines';

const fallbackMemo = '一言メモどうぞ';

export function speak(style: ConciergeStyle, reaction: Reaction, metrics: ProgressMetrics, memo?: string | null) {
  const templates = lines[style][metrics.status][reaction];
  const raw = templates[Math.floor(Math.random() * templates.length)] ?? templates[0];
  return raw
    .replaceAll('{days_left}', String(metrics.daysLeft))
    .replaceAll('{remaining_pages}', String(metrics.remainingPages))
    .replaceAll('{done_pages}', String(metrics.donePages))
    .replaceAll('{required_ppd:.1f}', metrics.requiredPpd.toFixed(1))
    .replaceAll('{current_ppd:.1f}', metrics.currentPpd.toFixed(1))
    .replaceAll('{memo}', memo?.trim() || fallbackMemo);
}
