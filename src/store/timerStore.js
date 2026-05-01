import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useTimerStore = create(
  persist(
    (set, get) => ({
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalTimeInSeconds: 0,
      currentTimeInSeconds: 0,
      isRunning: false,
      isTimeUp: false,
      schedule: [],
      beepTimes: 5,
      isScheduleMinimized: false,
      currentProgramTitle: null,
      
      // Update inputs
      setInputs: (hours, minutes, seconds) => {
        const total = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
        set({
          hours: parseInt(hours) || 0,
          minutes: parseInt(minutes) || 0,
          seconds: parseInt(seconds) || 0,
          totalTimeInSeconds: total,
          currentTimeInSeconds: total,
          isTimeUp: false
        });
      },

      // Timer Controls
      startTimer: () => {
        const state = get();
        if (state.currentTimeInSeconds > 0) {
          set({ isRunning: true, isTimeUp: false });
        }
      },
      
      pauseTimer: () => set({ isRunning: false }),
      
      resetTimer: () => {
        const state = get();
        set({
          currentTimeInSeconds: state.totalTimeInSeconds,
          isRunning: false,
          isTimeUp: false,
          currentProgramTitle: null
        });
      },

      // Called every second by the active component
      tick: () => {
        const state = get();
        if (state.isRunning && state.currentTimeInSeconds > 0) {
          const newTime = state.currentTimeInSeconds - 1;
          if (newTime === 0) {
            set({ currentTimeInSeconds: 0, isRunning: false, isTimeUp: true, currentProgramTitle: null });
          } else {
            set({ currentTimeInSeconds: newTime });
          }
        }
      },
      
      // Schedule Management
      addProgram: (program) => set((state) => ({
        schedule: [...state.schedule, { ...program, id: Date.now().toString() }]
      })),
      
      updateProgram: (id, updatedProgram) => set((state) => ({
        schedule: state.schedule.map(p => p.id === id ? { ...p, ...updatedProgram } : p)
      })),
      
      removeProgram: (id) => set((state) => ({
        schedule: state.schedule.filter(p => p.id !== id)
      })),
      
      loadProgram: (program) => {
        get().setInputs(program.hours, program.minutes, program.seconds);
        set({ currentProgramTitle: program.title });
        // Do not auto-start, wait for user to click start so audio context is ready
      },
      
      // Settings
      setBeepTimes: (times) => set({ beepTimes: times }),
      setIsScheduleMinimized: (isMinimized) => set({ isScheduleMinimized: isMinimized })
    }),
    {
      name: 'smart-timer-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTimerStore;
