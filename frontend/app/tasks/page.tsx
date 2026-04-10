'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, toggleTask, deleteTask } from '@/lib/api';

interface Task {
  id: number;
  title: string;
  isDone: boolean;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data as Task[]);
    } catch {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createTask(title);
    setTitle('');
    await fetchTasks();
  };

  const handleToggle = async (id: number) => {
    await toggleTask(id);
    await fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    await fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const done = tasks.filter((t) => t.isDone).length;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-lg mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">📋 Task Manager</h1>
            <p className="text-gray-500 text-sm mt-1">
              เสร็จแล้ว {done}/{tasks.length} Task
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-400 transition"
          >
            ออกจากระบบ
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="เพิ่ม Task ใหม่..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl font-semibold transition"
          >
            +
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-4 rounded-xl border transition ${
                task.isDone
                  ? 'bg-gray-900/50 border-gray-800'
                  : 'bg-gray-900 border-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={() => handleToggle(task.id)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  task.isDone ? 'line-through text-gray-600' : 'text-white'
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-gray-600 hover:text-red-400 transition text-lg"
              >
                ×
              </button>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-gray-500">ยังไม่มี Task ครับ เพิ่มได้เลย!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}