import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import useTimerStore from '../store/timerStore';

const ControlPanel = () => {
  const { 
    hours: storeHours, 
    minutes: storeMinutes, 
    seconds: storeSeconds,
    setInputs, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    isRunning,
    beepTimes,
    setBeepTimes
  } = useTimerStore();

  const [localHours, setLocalHours] = useState('00');
  const [localMinutes, setLocalMinutes] = useState('00');
  const [localSeconds, setLocalSeconds] = useState('00');

  // Sync local inputs with store when store changes (e.g., loaded from schedule or other tab)
  useEffect(() => {
    setLocalHours(String(storeHours).padStart(2, '0'));
    setLocalMinutes(String(storeMinutes).padStart(2, '0'));
    setLocalSeconds(String(storeSeconds).padStart(2, '0'));
  }, [storeHours, storeMinutes, storeSeconds]);

  const handleApply = () => {
    setInputs(localHours, localMinutes, localSeconds);
  };

  const handleStart = () => {
    // If user changed inputs without hitting "Apply" first, we might want to auto-apply
    // For now, we trust the inputs were applied via setInputs
    startTimer();
  };

  const handleChange = (e, setter) => {
    // Only allow numbers and max length of 2
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setter(val);
  };

  const handleBlur = () => {
    handleApply();
  };

  return (
    <div className="control-panel glass-panel">
      <div className="input-group">
        <div className="input-field">
          <label>Hours</label>
          <input 
            type="text" 
            value={localHours} 
            onChange={(e) => handleChange(e, setLocalHours)}
            onBlur={handleBlur}
            disabled={isRunning}
          />
        </div>
        <div className="input-field">
          <label>Minutes</label>
          <input 
            type="text" 
            value={localMinutes} 
            onChange={(e) => handleChange(e, setLocalMinutes)}
            onBlur={handleBlur}
            disabled={isRunning}
          />
        </div>
        <div className="input-field">
          <label>Seconds</label>
          <input 
            type="text" 
            value={localSeconds} 
            onChange={(e) => handleChange(e, setLocalSeconds)}
            onBlur={handleBlur}
            disabled={isRunning}
          />
        </div>
        <div className="input-field" style={{ marginLeft: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
          <label>Beeps</label>
          <input 
            type="number" 
            value={beepTimes} 
            onChange={(e) => setBeepTimes(Math.max(1, parseInt(e.target.value) || 1))}
            min="1" max="20"
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="button-group" style={{ marginTop: '1.5rem' }}>
        {!isRunning ? (
          <button className="btn btn-primary" onClick={handleStart}>
            <Play size={20} fill="currentColor" /> Start
          </button>
        ) : (
          <button className="btn btn-stop" onClick={pauseTimer}>
            <Square size={20} fill="currentColor" /> Stop
          </button>
        )}
        <button className="btn btn-secondary" onClick={resetTimer}>
          <RotateCcw size={20} /> Reset
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
