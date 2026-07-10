import { useState, useCallback, useRef } from 'react';
import useRoomData from '../hooks/useRoomData';
import useDragDrop from '../hooks/useDrragDrop';
import RoomGrid from '../components/RoomGrid/RoomGrid';
import AddSeatButton from '../components/Controls/AddSeatButton';
import RoomSizeInput from '../components/Controls/RoomSizeInput';
import SaveLoadButtons from '../components/Controls/SaveLoadButtons';
import TrashBin from '../components/RoomGrid/TrashBin';
import { styles } from '../style/styles';

const ClassroomEditor = () => {
  const { roomData, setRoomData, addSeats, updateSeat, removeSeat, updateRoomSize } = useRoomData();
  const { draggedSeat, isTrashActive, handleDragStart, handleDragEnd, handleTrashDrop } = useDragDrop(roomData, updateSeat, removeSeat);
  const [isDragOutsideGrid, setIsDragOutsideGrid] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());
  const roomGridRef = useRef<{ startMarquee: (clientX: number, clientY: number) => void }>(null);

  // Selection management
  const handleToggleSelect = useCallback((seatId: string) => {
    setSelectedSeatIds(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else next.add(seatId);
      return next;
    });
  }, []);

  const handleSetSelection = useCallback((ids: Set<string>) => {
    setSelectedSeatIds(new Set(ids));
  }, []);

  // Bulk delete: if dragging a selected seat, delete all selected
  const handleBulkDelete = useCallback(() => {
    if (selectedSeatIds.size > 0 && draggedSeat && selectedSeatIds.has(draggedSeat.id)) {
      selectedSeatIds.forEach(id => removeSeat(id));
      setSelectedSeatIds(new Set());
    } else if (draggedSeat) {
      handleTrashDrop();
    }
  }, [selectedSeatIds, draggedSeat, removeSeat, handleTrashDrop]);

  // Batch move: when dragging a selected seat to a new grid position, move all selected
  const handleGridDropWrapper = useCallback((e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement | null>) => {
    e.preventDefault();
    if (!draggedSeat || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const newX = Math.floor((e.clientX - rect.left) / 40);
    const newY = Math.floor((e.clientY - rect.top) / 40);
    if (newX < 0 || newX >= roomData.cols || newY < 0 || newY >= roomData.rows) return;

    const dx = newX - draggedSeat.x;
    const dy = newY - draggedSeat.y;

    if (selectedSeatIds.has(draggedSeat.id)) {
      // Batch move: validate all new positions before applying
      const updates: { id: string; x: number; y: number }[] = [];
      const targets = new Set<string>();
      let valid = true;

      for (const seat of roomData.seats) {
        if (selectedSeatIds.has(seat.id)) {
          const tx = seat.x + dx;
          const ty = seat.y + dy;
          const key = `${tx},${ty}`;
          if (tx < 0 || tx >= roomData.cols || ty < 0 || ty >= roomData.rows) { valid = false; break; }
          if (targets.has(key)) { valid = false; break; }
          targets.add(key);
          const collide = roomData.seats.some(s => !selectedSeatIds.has(s.id) && s.x === tx && s.y === ty);
          if (collide) { valid = false; break; }
          updates.push({ id: seat.id, x: tx, y: ty });
        }
      }

      if (valid) updates.forEach(u => updateSeat(u.id, u.x, u.y));
    } else {
      // Single seat move (existing logic)
      const occupied = roomData.seats.some(s => s.id !== draggedSeat.id && s.x === newX && s.y === newY);
      if (!occupied) updateSeat(draggedSeat.id, newX, newY);
    }
  }, [draggedSeat, roomData, selectedSeatIds, updateSeat]);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.componentCard}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <h1 style={styles.cardTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            Classroom Seating
          </h1>
          <span style={styles.badge}>
            {roomData.seats.length} {roomData.seats.length === 1 ? 'seat' : 'seats'}
            {selectedSeatIds.size > 0 && (
              <span style={{ marginLeft: '8px', color: '#2563eb' }}>
                &middot; {selectedSeatIds.size} selected
              </span>
            )}
          </span>
        </div>

        {/* Controls toolbar */}
        <div style={styles.controlsRow}>
          <AddSeatButton onAddSeats={addSeats} roomData={roomData} />
          <div style={styles.separator} />
          <RoomSizeInput roomData={roomData} onSizeChange={updateRoomSize} />
          <div style={styles.separator} />
          <SaveLoadButtons roomData={roomData} setRoomData={setRoomData} />
        </div>

        {/* Grid area with drop-zone overlay */}
        <div
          style={styles.gridPanel as React.CSSProperties}
          onMouseDown={(e) => {
            // Only start marquee from padding area, not from inside RoomGrid
            if ((e.target as HTMLElement).closest('[data-seat-id]')) return;
            if ((e.target as HTMLElement).closest('[data-roomgrid]')) return;
            roomGridRef.current?.startMarquee(e.clientX, e.clientY);
          }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedSeat) {
              handleBulkDelete();
              handleDragEnd();
              setIsDragOutsideGrid(false);
            }
          }}
        >
          {/* Overlay shown when dragging outside grid */}
          {isDragOutsideGrid && (
            <div style={{
              position: 'absolute' as const,
              inset: 0,
              borderRadius: '0 0 12px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              border: '2px dashed rgba(239, 68, 68, 0.25)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <RoomGrid ref={roomGridRef}
              roomData={roomData}
              draggedSeat={draggedSeat}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onGridDrop={handleGridDropWrapper}
              onDragOutsideChange={setIsDragOutsideGrid}
              selectedSeatIds={selectedSeatIds}
              onToggleSelect={handleToggleSelect}
              onSetSelection={handleSetSelection}
            />
          </div>

          <TrashBin
            isActive={isTrashActive}
            isDragOutside={isDragOutsideGrid}
            onDrop={handleBulkDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassroomEditor
