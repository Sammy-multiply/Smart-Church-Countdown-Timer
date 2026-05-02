import React from 'react';
import { Calendar } from 'lucide-react';
import TimerDisplay from './components/TimerDisplay';
import ControlPanel from './components/ControlPanel';
import ScheduleModal from './components/ScheduleModal';
import ThemeToggle from './components/ThemeToggle';
import useTimerStore from './store/timerStore';

function App() {
  const { isTimeUp, isScheduleMinimized, setIsScheduleMinimized, currentProgramTitle } = useTimerStore();

  return (
    <div className="app-container">
      <div className="top-bar" style={{ gap: '1rem' }}>
        {isScheduleMinimized && (
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsScheduleMinimized(false)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '20px' }}
          >
            <Calendar size={18} /> Show Schedule
          </button>
        )}
        <ThemeToggle />
      </div>
      
      <div className="main-content">
        <div className="header-text">
          <h1>
            {currentProgramTitle || "Smart Church Timer"}
          </h1>
          <p>
            Precision and Excellence in Every Session
          </p>
        </div>

        <TimerDisplay />
        
        <ControlPanel />
      </div>

      <ScheduleModal />
    </div>
  );
}

export default App;
