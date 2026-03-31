import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Trash2, Calendar, Clock } from 'lucide-react';

const PersonalTaskTracker = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit OS Lab Report', module: 'Operating Systems', due: 'Today, 11:59 PM', completed: false, priority: 'High' },
    { id: 2, text: 'Read Chapter 4 for DBMS', module: 'Databases', due: 'Tomorrow, 9:00 AM', completed: false, priority: 'Medium' },
    { id: 3, text: 'Register for Tech Symposium', module: 'General', due: 'Oct 15, 5:00 PM', completed: true, priority: 'Low' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('All');

  const handleToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      module: 'Custom Task',
      due: 'Pending Deadline',
      completed: false,
      priority: 'Normal'
    };
    
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  return (
    <div className="animate-fade-in mx-auto" style={{ maxWidth: '800px' }}>
      <div className="mb-4 text-center">
        <h2 className="fw-bold m-0 text-text-main">Personal Task Tracker 🔥</h2>
        <p className="text-muted m-0">Organize your assignments, writeups, and deadlines.</p>
      </div>

      <div className="premium-card p-4 mx-auto border-0 shadow-md">
        
        {/* Add Task Form */}
        <form onSubmit={handleAdd} className="mb-4">
          <div className="position-relative">
            <input 
              type="text" 
              className="form-control form-control-lg premium-input pe-5" 
              placeholder="What do you need to get done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={{ fontSize: '16px', borderRadius: '12px' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary position-absolute top-50 translate-middle-y end-0 me-2 rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              <Plus size={20} />
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="d-flex gap-2 mb-4 bg-light p-1 rounded-pill d-inline-flex border" style={{ width: 'fit-content' }}>
          {['All', 'Active', 'Completed'].map(f => (
            <button 
              key={f} 
              className={`btn btn-sm rounded-pill fw-bold px-3 ${filter === f ? 'btn-primary text-white shadow-sm' : 'btn-transparent text-muted'} border-0`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="task-list d-flex flex-column gap-3">
          {filteredTasks.length === 0 ? (
             <div className="text-center py-5 text-muted">
                <CheckCircle size={48} className="mb-3 opacity-25" />
                <h5>You're all caught up!</h5>
                <p>No {filter.toLowerCase()} tasks pending right now.</p>
             </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`d-flex align-items-center justify-content-between p-3 border rounded-3 transition-all ${task.completed ? 'bg-light border-light' : 'bg-white hover-shadow-sm'}`}
                style={{ transition: 'var(--transition)' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <button 
                    onClick={() => handleToggle(task.id)} 
                    className={`btn border-0 p-0 hover-scale text-${task.completed ? 'success' : 'muted'}`}
                  >
                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div>
                    <h6 className={`mb-1 fw-bold ${task.completed ? 'text-muted text-decoration-line-through' : 'text-text-main'}`} style={{ transition: 'color 0.3s' }}>
                      {task.text}
                    </h6>
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                      <span className="badge bg-secondary opacity-75 rounded-pill px-2">{task.module}</span>
                      <span className={`text-muted d-flex align-items-center gap-1 ${task.completed ? 'opacity-50' : ''}`}>
                        <Calendar size={12} /> {task.due}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(task.id)}
                  className="btn btn-sm text-danger opacity-50 hover-opacity-100 hover-bg-danger-light border-0 rounded p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalTaskTracker;
