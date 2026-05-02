import React, { useEffect, useRef } from 'react';
import useTimerStore from '../store/timerStore';

// Helper to format time
const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
};

const TimerDisplay = () => {
  const { 
    currentTimeInSeconds, 
    totalTimeInSeconds, 
    isRunning, 
    isTimeUp,
    tick,
    beepTimes 
  } = useTimerStore();

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Handle ticking
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  // Audio Beep Logic
  useEffect(() => {
    if (isTimeUp) {
      // Synthesize beep
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const playBeep = () => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        
        const now = audioCtxRef.current.currentTime;
        const beepDuration = 0.1;
        const gap = 0.1;
        
        // Play 3 short beeps to sound like a digital alarm
        for (let i = 0; i < 3; i++) {
          const startTime = now + i * (beepDuration + gap);
          
          const oscillator = audioCtxRef.current.createOscillator();
          const gainNode = audioCtxRef.current.createGain();
          
          // 1000Hz is a standard alert frequency
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(1000, startTime); 
          
          // Louder volume with clean attack and release
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
          gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtxRef.current.destination);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + beepDuration);
        }
      };

      // Play initially and then every second beepTimes times
      playBeep();
      let count = 1;
      const beepInterval = setInterval(() => {
        if (count >= beepTimes) {
          clearInterval(beepInterval);
        } else {
          playBeep();
          count++;
        }
      }, 1000);

      return () => clearInterval(beepInterval);
    }
  }, [isTimeUp, beepTimes]);

  // Determine state class
  let stateClass = '';
  if (isTimeUp) {
    stateClass = 'state-timeup';
  } else if (currentTimeInSeconds > 0 && currentTimeInSeconds <= totalTimeInSeconds / 2) {
    stateClass = 'state-halfway';
  }

  const { hours, minutes, seconds } = formatTime(currentTimeInSeconds);

  return (
    <>
      {isTimeUp && <div className="red-overlay"></div>}
      <div className={`timer-container ${stateClass}`}>
        <div className="digits-wrapper">
          <div className="digit-block">
            <div className="digit-box">{hours}</div>
            <span className="digit-label">Hours</span>
          </div>
          <div className="colon">:</div>
          <div className="digit-block">
            <div className="digit-box">{minutes}</div>
            <span className="digit-label">Minutes</span>
          </div>
          <div className="colon">:</div>
          <div className="digit-block">
            <div className="digit-box">{seconds}</div>
            <span className="digit-label">Seconds</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimerDisplay;
