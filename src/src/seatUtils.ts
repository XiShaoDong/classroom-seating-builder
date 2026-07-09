// ==================== TYPES ====================
export interface Seat {
  id: string;
  x: number;
  y: number;
}

export interface RoomData {
  cols: number;
  rows: number;
  seats: Seat[];
}

// ==================== CONSTANTS ====================
export interface Template {
  name: string;
  seats: { x: number; y: number }[];
}

export const SEAT_TEMPLATES: Record<string, Template> = {
  single: { name: 'Single Seat', seats: [{ x: 0, y: 0 }] },
  double: { name: '双人桌', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }] },
  custom: { name: 'Custom Block', seats: [] },
};

// Generate seat positions for a custom block with gaps
export const generateCustomBlock = (
  rows: number,
  cols: number,
  rowGap: number,
  colGap: number
): { x: number; y: number }[] => {
  const seats: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seats.push({
        x: c * (1 + colGap),
        y: r * (1 + rowGap),
      });
    }
  }
  return seats;
};


// ==================== UTILS ====================
export const generateSeatId = () => `seat-${Date.now()}-${Math.random()}`;

export const findAvailablePosition = (roomData: RoomData, template: { seats: { x: number; y: number }[] }) => {
  for (let y = 0; y <= roomData.rows - Math.max(...template.seats.map((s) => s.y)) - 1; y++) {
    for (let x = 0; x <= roomData.cols - Math.max(...template.seats.map((s) => s.x)) - 1; x++) {
      const canPlace = template.seats.every((templateSeat) => {
        const targetX = x + templateSeat.x;
        const targetY = y + templateSeat.y;
        return !roomData.seats.some(existingSeat =>
          existingSeat.x === targetX && existingSeat.y === targetY
        );
      });

      if (canPlace) {
        return { startX: x, startY: y };
      }
    }
  }
  return { startX: 0, startY: 0 };
};
