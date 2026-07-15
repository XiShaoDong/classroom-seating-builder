import { useState } from 'react';
import './App.css';
import ClassroomEditor from './src/classroomSeatBuilder/page/ClassroomEditor';
import CardDeckSliderDemo from './src/classroomSeatBuilder/components/CardDeck/CardDeckSliderDemo';

function App() {
  const [view, setView] = useState<'editor' | 'deck'>('editor');

  return (
    <div>
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
        <button
          type="button"
          onClick={() => setView('editor')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: view === 'editor' ? '#3b82f6' : '#e5e7eb',
            color: view === 'editor' ? 'white' : '#374151',
          }}
        >
          Seat Builder
        </button>
        <button
          type="button"
          onClick={() => setView('deck')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: view === 'deck' ? '#3b82f6' : '#e5e7eb',
            color: view === 'deck' ? 'white' : '#374151',
          }}
        >
          Card Deck
        </button>
      </div>

      {view === 'editor' ? <ClassroomEditor /> : <CardDeckSliderDemo />}
    </div>
  );
}

export default App;
