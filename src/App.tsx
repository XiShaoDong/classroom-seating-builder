import { useState } from 'react';
import './App.css';
import ClassroomEditor from './src/classroomSeatBuilder/page/ClassroomEditor';
import TaskScheduleEditor from './src/taskScheduleBuilder/page/TaskScheduleEditor';
import CardDeckSliderDemo from './src/classroomSeatBuilder/components/CardDeck/CardDeckSliderDemo';

type View = 'seat' | 'task' | 'deck';

const VIEWS: { key: View; label: string }[] = [
  { key: 'seat', label: 'Seat Builder' },
  { key: 'task', label: 'Task Builder' },
  { key: 'deck', label: 'Card View' },
];

function App() {
  const [view, setView] = useState<View>('seat');

  const renderView = () => {
    switch (view) {
      case 'seat': return <ClassroomEditor />;
      case 'task': return <TaskScheduleEditor />;
      case 'deck': return <CardDeckSliderDemo />;
    }
  };

  return (
    <div>
      {/* Global view switcher */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 1000,
          display: 'flex',
          gap: 6,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 6,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: view === v.key ? '#3b82f6' : '#e5e7eb',
              color: view === v.key ? 'white' : '#374151',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {renderView()}
    </div>
  );
}

export default App;
