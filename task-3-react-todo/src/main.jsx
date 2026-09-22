import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const starterTasks = [
  { id: 1, title: 'Map the first user journey', done: true },
  { id: 2, title: 'Write a clear project brief', done: false },
  { id: 3, title: 'Share an early prototype', done: false },
];

function App() {
  const [tasks, setTasks] = useState(starterTasks);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const visibleTasks = tasks.filter((task) => filter === 'all' || (filter === 'done' ? task.done : !task.done));
  const remaining = tasks.filter((task) => !task.done).length;

  function submitTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    if (editingId) {
      setTasks(tasks.map((task) => task.id === editingId ? { ...task, title: cleanTitle } : task));
      setEditingId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), title: cleanTitle, done: false }]);
    }
    setTitle('');
  }

  function editTask(task) { setEditingId(task.id); setTitle(task.title); }
  function deleteTask(id) { setTasks(tasks.filter((task) => task.id !== id)); }
  function toggleTask(id) { setTasks(tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task)); }

  return <main className="app-shell"><div className="app-inner"><header><p className="eyebrow">Small steps / big picture</p><h1>Today, made <em>clear.</em></h1><p className="intro">A calm place for the work that moves things forward.</p></header><section className="task-panel"><div className="panel-header"><div><span className="task-count">{remaining}</span><span className="task-label"> open {remaining === 1 ? 'task' : 'tasks'}</span></div><div className="filters">{['all', 'open', 'done'].map((option) => <button key={option} className={filter === option ? 'active' : ''} onClick={() => setFilter(option)}>{option}</button>)}</div></div><form className="task-form" onSubmit={submitTask}><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={editingId ? 'Update this task...' : 'What needs doing?'} aria-label="Task title" /><button type="submit">{editingId ? 'Save' : 'Add'} <span>↗</span></button></form><ul className="task-list">{visibleTasks.map((task) => <li className={task.done ? 'done' : ''} key={task.id}><button className="check" onClick={() => toggleTask(task.id)} aria-label={`Mark ${task.title} ${task.done ? 'open' : 'complete'}`}>{task.done ? '✓' : ''}</button><span>{task.title}</span><div className="task-actions"><button onClick={() => editTask(task)} aria-label={`Edit ${task.title}`}>Edit</button><button onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>Delete</button></div></li>)}</ul>{visibleTasks.length === 0 && <p className="empty">Nothing here yet. Add one small thing.</p>}</section><footer><span>{tasks.length} total</span><button onClick={() => setTasks(tasks.map((task) => ({ ...task, done: true })))}>Mark all complete</button></footer></div></main>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
