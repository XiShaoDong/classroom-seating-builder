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
export const SEAT_TEMPLATES = {
  single: { name: 'Single Seat', seats: [{ x: 0, y: 0 }] },
  row: { name: 'Row of Seats (1x4)', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }] },
  column: { name: 'Column of Seats (4x1)', seats: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }] },
  block: { name: 'Block of 4 (2x2)', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] }
};


// ==================== UTILS ====================
export const generateSeatId = () => `seat-${Date.now()}-${Math.random()}`;

export const findAvailablePosition = (roomData: RoomData, template: any) => {
  // 相当于for(let y=0; y<= roomData.rows - maxTemplateY - 1;y++)
    //                      房间的边界 - 模板的高度 - 1 因为index从0开始 10 row = [0-9] 
  // 遍历每个座位 x,y坐标 in range of [0, 房间的边界 - 模板的高度 - 1 ] 可放置的范围
    // 再通过计算 模板的宽度和高度 找到合适的位置去放下
  for (let y = 0; y <= roomData.rows - Math.max(...template.seats.map((s: { y: any; }) => s.y)) - 1; y++) {
    for (let x = 0; x <= roomData.cols - Math.max(...template.seats.map((s: { x: any; }) => s.x)) - 1; x++) {
      // { x: number; y: number; } 只是注解 帮助TypeScript 注释
      /*every, foreach和 some 三者的区别
        every: 可以提前中断；要求 所有元素 都满足条件
          eg: const allEven = [2, 4, 5].every(num => num % 2 === 0); console.log(allEven); // false  (因为 5 不是偶数)
        some: 可以提前中断； 要求 至少一个 符合条件
          eg: const allEven = [2, 4, 5].some(num => num % 2 === 0); console.log(allEven); // true  (因为 只要有偶数 就行)
        forEach: 不可以中断，要遍历所有元素 对他们进行统一操作 
          eg：[1, 2, 3].forEach(num => {console.log(num);  // 打印 1 2 3});
      */
      const canPlace = template.seats.every((templateSeat: { x: number; y: number; }) => {
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
