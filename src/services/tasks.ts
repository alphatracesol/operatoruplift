export interface TodayTask { title: string; done: boolean; createdAt: number }

const KEY = 'uplift:todayTasks';

export function listTodayTasks(): TodayTask[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function saveTodayTasks(items: TodayTask[]): void {
  localStorage.setItem(KEY, JSON.stringify(items||[]));
}

export function addTodayTask(title: string): TodayTask[] {
  const items = listTodayTasks();
  items.push({ title, done: false, createdAt: Date.now() });
  saveTodayTasks(items);
  return items;
}

export function toggleTodayTask(index: number): TodayTask[] {
  const items = listTodayTasks();
  if (items[index]) items[index].done = !items[index].done;
  saveTodayTasks(items);
  return items;
}

export function removeTodayTask(index: number): TodayTask[] {
  const items = listTodayTasks();
  items.splice(index, 1);
  saveTodayTasks(items);
  return items;
}

