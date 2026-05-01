import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, PlayCircle, Plus, X, Check, Minus } from 'lucide-react';
import useTimerStore from '../store/timerStore';

const ScheduleModal = () => {
  const { schedule, addProgram, updateProgram, removeProgram, loadProgram, isScheduleMinimized, setIsScheduleMinimized } = useTimerStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [h, setH] = useState('');
  const [m, setM] = useState('');
  const [s, setS] = useState('');

  const resetForm = () => {
    setTitle('');
    setH('');
    setM('');
    setS('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const programData = {
      title,
      hours: parseInt(h) || 0,
      minutes: parseInt(m) || 0,
      seconds: parseInt(s) || 0,
    };

    if (editingId) {
      updateProgram(editingId, programData);
    } else {
      addProgram(programData);
    }
    resetForm();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setH(p.hours === 0 ? '' : p.hours.toString());
    setM(p.minutes === 0 ? '' : p.minutes.toString());
    setS(p.seconds === 0 ? '' : p.seconds.toString());
    setIsAdding(true);
  };

  const formatTimeText = (hr, min, sec) => {
    const parts = [];
    if (hr > 0) parts.push(`${hr}h`);
    if (min > 0) parts.push(`${min}m`);
    if (sec > 0 || parts.length === 0) parts.push(`${sec}s`);
    return parts.join(' ');
  };

  if (isScheduleMinimized) {
    return null;
  }

  return (
    <motion.div 
      className="schedule-modal glass-panel"
      drag
      dragMomentum={false}
      // Keeps the modal within the screen bounds roughly
      dragConstraints={{ top: 0, bottom: 500, left: -1000, right: 0 }}
    >
      <div className="schedule-header">
        <h3>Schedule</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isAdding && (
            <button className="icon-btn" onClick={() => setIsAdding(true)} title="Add Program">
              <Plus size={20} />
            </button>
          )}
          <button className="icon-btn" onClick={() => setIsScheduleMinimized(true)} title="Minimize">
            <Minus size={20} />
          </button>
        </div>
      </div>

      <div className="program-list">
        {schedule.length === 0 && !isAdding && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>
            No programs scheduled.
          </p>
        )}
        
        {schedule.map(p => (
          <div key={p.id} className="program-item" onDoubleClick={() => loadProgram(p)}>
            <div className="program-info">
              <span className="program-title">{p.title}</span>
              <span className="program-time">{formatTimeText(p.hours, p.minutes, p.seconds)}</span>
            </div>
            <div className="program-actions">
              <button className="icon-btn" onClick={() => loadProgram(p)} title="Load to Timer">
                <PlayCircle size={18} />
              </button>
              <button className="icon-btn" onClick={() => startEdit(p)} title="Edit">
                <Edit2 size={16} />
              </button>
              <button className="icon-btn delete" onClick={() => removeProgram(p.id)} title="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="add-program-form">
          <input 
            type="text" 
            placeholder="Program Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            autoFocus
          />
          <div className="add-program-inputs">
            <input 
              type="number" 
              placeholder="Hr" 
              value={h} 
              onChange={e => setH(e.target.value)} 
              min="0" max="99" 
            />
            <input 
              type="number" 
              placeholder="Min" 
              value={m} 
              onChange={e => setM(e.target.value)} 
              min="0" max="59" 
            />
            <input 
              type="number" 
              placeholder="Sec" 
              value={s} 
              onChange={e => setS(e.target.value)} 
              min="0" max="59" 
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={handleSave}>
              <Check size={18} /> {editingId ? 'Update' : 'Save'}
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={resetForm}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ScheduleModal;
