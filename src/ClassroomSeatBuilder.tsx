import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Save, Upload, Trash2, GripVertical } from 'lucide-react';

// ==================== TYPES ====================
interface Seat {
  id: string;
  x: number;
  y: number;
}

interface RoomData {
  cols: number;
  rows: number;
  seats: Seat[];
}

// ==================== CONSTANTS ====================
const SEAT_TEMPLATES = {
  single: { name: 'Single Seat', seats: [{ x: 0, y: 0 }] },
  row: { name: 'Row of Seats (1x4)', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }] },
  column: { name: 'Column of Seats (4x1)', seats: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }] },
  block: { name: 'Block of 4 (2x2)', seats: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] }
};

// ==================== STYLES ====================
const styles = {
  container: {
    minHeight: '500vh',
    backgroundColor: '#f3f4f6',
    padding: '24px',
    width: '100vw',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '32px',
    textAlign: 'center' as const
  },
  controlPanel: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  },
  controlFlex: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: '16px'
  },
  mainPanel: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center'
  },
  seat: {
    position: 'absolute' as const,
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid #2563eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    zIndex: 1
  },
  seatHover: {
    backgroundColor: '#2563eb',
    transform: 'scale(1.05)'
  },
  seatDragging: {
    opacity: 0.5,
    transform: 'scale(1.1)',
    zIndex: 1000
  },
  gridContainer: {
    position: 'relative' as const,
    border: '2px solid #d1d5db',
    backgroundColor: 'white',
    minWidth: '320px',
    minHeight: '200px',
    width: "100%",
    height: "100%"
  },
  gridCell: {
    position: 'absolute' as const,
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    width: '40px',
    height: '40px'
  },
  trashBin: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 50
  },
  trashBinInactive: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280'
  },
  trashBinActive: {
    backgroundColor: '#ef4444',
    color: 'white',
    transform: 'scale(1.1)',
    animation: 'pulse 1s infinite'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    color: 'black',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  buttonGreen: {
    backgroundColor: '#10b981'
  },
  buttonBlue: {
    backgroundColor: '#3b82f6'
  },
  buttonPurple: {
    backgroundColor: '#8b5cf6'
  },
  buttonGray: {
    backgroundColor: '#6b7280'
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    minWidth: '192px',
    // padding: '8px'
  },
  dropdownContent: {
    padding: '8px'
  },
  dropdownLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  input: {
    width: '64px',
    padding: '4px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px'
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '400px',
    width: '100%',
    margin: '16px'
  },
  instructionBox: {
    marginTop: '24px',
    backgroundColor: '#eff6ff',
    padding: '16px',
    borderRadius: '8px'
  }
};

// ==================== HOOKS ====================
// Custom hook for room data management
// 自定义hook帮助其他func 在需要获取roomData时直接调用对应hook来修改/获取对应state
const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData>({
    cols: 8,
    rows: 5,
    seats: []
  });

  //使用了函数式更新 也就是使用pre总获取最新版本的旧值
  const addSeats = useCallback((newSeats: Seat[]) => {
    setRoomData(prev => ({
      // 再通过seats: [] 覆盖 获取到的...prev 旧值
      ...prev,
      seats: [...prev.seats, ...newSeats]
    }));
  }, []); 

  const updateSeat = useCallback((seatId: string, x: number, y: number) => {
    setRoomData(prev => ({
      ...prev,
      // 神奇的巧思 通过map获取了每个seat的data
      seats: prev.seats.map(seat =>
        // 核对每个seatID 选取正确的对象
        // 再对那个seat 通过 ...seat 获取到之前 的 seatId,x,y
          // 最后再使用x，y 覆盖旧的之前的值
        seat.id === seatId ? { ...seat, x, y } : seat
      )
    }));
  }, []);

  const removeSeat = useCallback((seatId: string) => {
    setRoomData(prev => ({
      ...prev,
      seats: prev.seats.filter(seat => seat.id !== seatId)
    }));
  }, []);

  // 使用了ES6的新技术 "computed property name"@
  const updateRoomSize = useCallback((dimension: 'cols' | 'rows', value: number) => {
    //设置上限20 下限1
    const newValue = Math.max(1, Math.min(20, value));
    setRoomData(prev => {
      // @ES6 使用[property name]：value 减少If else
          //如果不使用[] 会产生 一个属性再roomState：{...prev, dimension:$newvlaue}
      const newRoomData = { ...prev, [dimension]: newValue };

      // Remove seats outside boundaries
      if (dimension === 'cols' && newValue < prev.cols) {
        newRoomData.seats = prev.seats.filter(seat => seat.x < newValue);
      }
      if (dimension === 'rows' && newValue < prev.rows) {
        newRoomData.seats = prev.seats.filter(seat => seat.y < newValue);
      }

      return newRoomData;
    });
  }, []);

  return {
    roomData,
    setRoomData,
    addSeats,
    updateSeat,
    removeSeat,
    updateRoomSize
  };
};

// Custom hook for drag and drop
  //对于一个 DragDrop操作完整流程是：
  /* HTML5 拖拽 API 的工作流程：

  1. dragstart  → 拖拽开始（当前函数处理）
  2. drag       → 拖拽进行中（连续触发）
  3. dragenter  → 进入可放置区域
  4. dragover   → 在可放置区域上方移动
  5. dragleave  → 离开可放置区域
  6. drop       → 在可放置区域释放
  7. dragend    → 拖拽结束

  每个阶段都有对应的事件和处理函数：
  - dragstart → handleDragStart
  - dragend   → handleDragEnd  
  - drop      → handleGridDrop / handleTrashDrop
  - dragover  → preventDefault (允许放置)
  */
  
  //所以我们至少需要拥有dragStart -> dragEnd -> drop 完成的循环
  //假设我们只考虑前两个dragStart -> dragEnd
    //那么结果就是我们没有真的drop 虽然drag 发生了并且有移动动画 但是没有handle drop什么效果都没有

  // 除此之外 它默认移动式的虚化img其实是HMTL原生的 我们也可以改变 详情看下面
  /*  还可以设置的属性：
  // 设置拖拽数据（可选）
  e.dataTransfer.setData('text/plain', seat.id);
  e.dataTransfer.setData('application/json', JSON.stringify(seat));

  // 设置拖拽图像（可选）
  const dragImage = new Image();
  dragImage.src = 'seat-icon.png';
  e.dataTransfer.setDragImage(dragImage, 16, 16);

  // 设置允许的放置效果
  e.dataTransfer.effectAllowed = 'move';

  为什么我们只设置 effectAllowed？
  - 简单够用：我们通过 React 状态传递数据，不需要 setData
  - 性能考虑：避免不必要的数据序列化
  - 跨浏览器：简单设置兼容性更好
  - 维护性：减少复杂性
  */

const useDragDrop = (roomData: RoomData, updateSeat: Function, removeSeat: Function) => {
  //这三个虽然不都需要但是有助于UI或者后续特殊情况处理 
    //最需要的就是draggSeat Seat|null Seat 表示用户点击并长按了(等同于isDragging=True,也可以判断isTrashActive=True)
    //如果为draggSeat=null(等同于刚才两个相反)
    //所以理论上来说 其他两个不是必要的 但是如果我们有特殊情况 trash不被激活 比如锁定按钮激活 isTrash加个逻辑..
  const [draggedSeat, setDraggedSeat] = useState<Seat | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTrashActive, setIsTrashActive] = useState(false);

  //props很直观 e是sytheticEvent是合成event：原生HTML + 可能其他React额外的
    // seat就是前面定义的Seatinterface
  const handleDragStart = useCallback((e: React.DragEvent, seat: Seat) => {
    setDraggedSeat(seat);
    setIsDragging(true);
    setIsTrashActive(true);
    // 这个event自带的一些属性，dataTransfer就是转移 有其他很多比如 copy:变成加号光标
      //意思就是说这里不是移动一个seat 而是添加一个或者说放置一个
      //但是逻辑需要写在handleDrop里 它只给你了光标样式的改变
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  //相同的逻辑 就是不需要任何的props 目的就是要把数据从内存中清空防止泄露 比如Seat数据之类的
  const handleDragEnd = useCallback(() => {
    setDraggedSeat(null);
    setIsDragging(false);
    setIsTrashActive(false);
  }, []);

  //重中之中啊 处理drop的逻辑
  /*还是先说props 第一个还是React的sytheticEvent合成event有对drag的光标坐标位置..
    第二个prop很关键！！ 就是useRef创建出来的Ref：字面意思reference用于索引的 
      eg:比如父组件控制->子组件需要现在父组件创建一个 const ref = useRef<T>(null) (T各种类型填写助于Type检查)
      eg:我们这次是自我引用了，在RoomGrid上里自己创建了Ref 然后以供HandleDrop来用
  */
  /*关于功能需要认识到如何计算位置 
    clientX, clientY :为用户光标坐标 
    rect = gridRef.current.getBoundingClientRect() 
    rect.left：x坐标 距离window左边多远
    rect.top ：y坐标 距离window上边多远
    获取到的是div元素的坐标：
  */
    /*getBoundingClientRect() 详解：

      返回的 DOMRect 对象包含：
      {
        left: 100,    // 元素左边相对于视口的位置
        top: 200,     // 元素顶部相对于视口的位置  
        right: 500,   // 元素右边相对于视口的位置
        bottom: 400,  // 元素底部相对于视口的位置
        width: 400,   // 元素宽度
        height: 200,  // 元素高度
        x: 100,       // 等同于 left
        y: 200        // 等同于 top
      }
    */
  const handleGridDrop = useCallback((e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement|null>) => {
    
    e.preventDefault();
    if (!draggedSeat || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    //这里的计算col,row的方式就是 之所以除以40是Css定的40px
      //  x = floor(光标位置x-grid框x/40px)  
        // 这样子相当于获取了从gridwindow的最左边到光标的距离再看能放下几个格子
      // y 同理 
    const x = Math.floor((e.clientX - rect.left) / 40);
    const y = Math.floor((e.clientY - rect.top) / 40);

    //异常处理 如何处理在光标移动到超出GridArea时的操作
      //就是直接忽视，也可以额外处理比如map到最边缘的格子
    
    if (x >= 0 && x < roomData.cols && y >= 0 && y < roomData.rows) {
      //占领检查 是否已经有了Seat
      //@TODO:可以使用Set来优化 现在TimeComplex=O(N)
        //如果使用Set可以变成O(1)
      const isOccupied = roomData.seats.some(seat =>
        seat.id !== draggedSeat.id && seat.x === x && seat.y === y
      );

      if (!isOccupied) {
        //@TODO: if updateSeat() Faild
          // need warp try-catch 
        updateSeat(draggedSeat.id, x, y);
      }
    }
    //@TODO: 可以额外处理超出GridArea时,map到最边缘的格子
      // x超了就等于1 ：updateSeat(draggedSeat.id, 1, y);
      // 需要if 小于0：const mapX = Math.max(1, x) else if：大于边界 min(40,x)
  }, [draggedSeat, roomData, updateSeat]);

  const handleTrashDrop = useCallback(() => {
    if (draggedSeat) {
      removeSeat(draggedSeat.id);
    }
  }, [draggedSeat, removeSeat]);

  return {
    draggedSeat,
    isDragging,
    isTrashActive,
    handleDragStart,
    handleDragEnd,
    handleGridDrop,
    handleTrashDrop
  };
};

// ==================== UTILS ====================
const generateSeatId = () => `seat-${Date.now()}-${Math.random()}`;

const findAvailablePosition = (roomData: RoomData, template: any) => {
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

// ==================== COMPONENTS ====================

// components/RoomGrid/Seat.tsx
interface SeatProps {
  seat: Seat;
  onDragStart: (e: React.DragEvent, seat: Seat) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const Seat = ({ seat, onDragStart, onDragEnd, isDragging }: SeatProps) => {
  // 为什么不把hover 放入 useDragDrop：hover局部state 只针对于Seat 不需要放入全局
    // 如果放入会导致全局产生没必要的re-render
  const [isHovered, setIsHovered] = useState(false);

  const seatStyle = {
    ...styles.seat,
    left: `${seat.x * 40 + 3}px`,
    top: `${seat.y * 40 + 3}px`,
    // style的先后可以 保证isDragging 覆盖了 isHover 毕竟拖拽优先级更高
    ...(isHovered && !isDragging ? styles.seatHover : {}),
    ...(isDragging ? styles.seatDragging : {})
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, seat)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={seatStyle}
    >
      <GripVertical size={12} />
    </div>
  );
};

// components/RoomGrid/TrashBin.tsx
interface TrashBinProps {
  isActive: boolean;
  onDrop: () => void;
}

const TrashBin = ({ isActive, onDrop }: TrashBinProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  const trashStyle = {
    ...styles.trashBin,
    ...(isActive ? styles.trashBinActive : styles.trashBinInactive)
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={trashStyle}
      >
        <Trash2 size={24} />
      </div>
    </>
  );
};

// components/RoomGrid/RoomGrid.tsx
interface RoomGridProps {
  roomData: RoomData;
  draggedSeat: Seat | null;
  isDragging: boolean;
  isTrashActive: boolean;
  onDragStart: (e: React.DragEvent, seat: Seat) => void;
  onDragEnd: () => void;
  onGridDrop: (e: React.DragEvent, gridRef: React.RefObject<HTMLDivElement|null>) => void;
  onTrashDrop: () => void;
}

const RoomGrid = ({
  roomData,
  draggedSeat,
  isDragging,
  isTrashActive,
  onDragStart,
  onDragEnd,
  onGridDrop,
  onTrashDrop
}: RoomGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < roomData.rows; y++) {
      for (let x = 0; x < roomData.cols; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            style={{
              ...styles.gridCell,
              left: `${x * 40}px`,
              top: `${y * 40}px`
            }}
          />
        );
      }
    }
    return cells;
  };

  const gridStyle = {
    ...styles.gridContainer,
    width: `${roomData.cols * 40}px`,
    height: `${roomData.rows * 40}px`
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={gridRef}
        style={gridStyle}
        onDrop={(e) => onGridDrop(e, gridRef)}
        onDragOver={handleDragOver}
      >
        {renderGrid()}
        {roomData.seats.map(seat => (
          <Seat
            key={seat.id}
            seat={seat}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedSeat?.id === seat.id}
          />
        ))}
      </div>
      <TrashBin
        isActive={isTrashActive}
        onDrop={onTrashDrop}
      />
    </div>
  );
};

// components/Controls/AddSeatButton.tsx
interface AddSeatButtonProps {
  onAddSeats: (newSeats: Seat[]) => void;
  roomData: RoomData;
}

const AddSeatButton = ({ onAddSeats, roomData }: AddSeatButtonProps) => {
  // 相当于 让TemplateKey  = 'single'|'double'|...|...|
  type TemplateKey = keyof typeof SEAT_TEMPLATES;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('single');

  const handleAddSeats = () => {
    const template = SEAT_TEMPLATES[selectedTemplate];
    const { startX, startY } = findAvailablePosition(roomData, template);

    const newSeats = template.seats.map(templateSeat => ({
      id: generateSeatId(),
      x: startX + templateSeat.x,
      y: startY + templateSeat.y
    }));

    onAddSeats(newSeats);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...styles.button, ...styles.buttonGreen }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
      >
        <Plus size={20} />
        Add Seats
      </button>

      {isOpen && (
        //经典双层结构 外层做定位大小 内层padding撑起内容  
        <div style={styles.dropdown}>
          <div style={styles.dropdownContent}>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Select Template:
            </div>
            {Object.entries(SEAT_TEMPLATES).map(([key, template]) => (
              <label
                key={key}
                style={styles.dropdownLabel}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <input
                  type="radio"
                  name="template"
                  value={key}
                  checked={selectedTemplate === key}
                  onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
                  style={{ accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '14px' }}>{template.name}</span>
              </label>
            ))}
            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddSeats}
                style={{
                  flex: 1,
                  padding: '4px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  padding: '4px 12px',
                  backgroundColor: '#d1d5db',
                  color: '#374151',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// components/Controls/RoomSizeInput.tsx
interface RoomSizeInputProps {
  roomData: RoomData;
  onSizeChange: (dimension: 'cols' | 'rows', value: number) => void;
}

const RoomSizeInput = ({ roomData, onSizeChange }: RoomSizeInputProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="input-col" style={{ fontSize: '14px', fontWeight: '500' }}>Columns:</label>
        <input
          id='input-col'
          type="number"
          min="1"
          max="20"
          value={roomData.cols}
          onChange={(e) => onSizeChange('cols', parseInt(e.target.value) || 1)}
          style={styles.input}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor='input-row' style={{ fontSize: '14px', fontWeight: '500' }}>Rows:</label>
        <input
          id='input-row'
          type="number"
          min="1"
          max="20"
          value={roomData.rows}
          onChange={(e) => onSizeChange('rows', parseInt(e.target.value) || 1)}
          style={styles.input}
        />
      </div>
    </div>
  );
};

// components/Controls/SaveLoadButtons.tsx
interface SaveLoadButtonsProps {
  roomData: RoomData;
  setRoomData: (data: RoomData) => void;
}

const SaveLoadButtons = ({ roomData, setRoomData }: SaveLoadButtonsProps) => {
  const [savedLayouts, setSavedLayouts] = useState<string[]>([]);
  const [layoutName, setLayoutName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  // @TODO:考虑替换为 loadStorage
  // const [memoryStorage, setMemoryStorage] = useState<Record<string, string>>({});

  //添加一个刷新函数来更新列表
  const refreshSavedLayouts = () => {
    const saved = Object.keys(localStorage)
      .filter(key => key.startsWith('classroom-layout-'))
      .map(key => key.replace('classroom-layout-', ''));
    setSavedLayouts(saved);
  };
  
  useEffect(() => {
    refreshSavedLayouts();
  }, []);


  const handleSave = () => {
    if (!layoutName.trim()) {
      alert('Please name the template');
      return;
    }

    const key = `classroom-layout-${layoutName}`;
    const roomDataToSave = {
      cols: roomData.cols,
      rows: roomData.rows,
      seats: roomData.seats.map(seat => ({
        id: seat.id,
        x: seat.x,
        y: seat.y
      }))
    };

    localStorage.setItem(key, JSON.stringify(roomDataToSave));

    setLayoutName('');
    setShowSaveDialog(false);
    refreshSavedLayouts();
    alert('Save Template Success!');
    console.log(roomDataToSave)
  };

  const handleLoad = (name: string) => {
    const key = `classroom-layout-${name}`;
    const savedData = localStorage.getItem(key); 

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        if (data.cols && data.rows && Array.isArray(data.seats)) {
          setRoomData({
            cols: data.cols,
            rows: data.rows,
            seats: data.seats
          });
          setShowLoadDialog(false);
          alert('Loaded Template!');
        } else {
          alert('Data fromat error, unable to load Template');
        }
      } catch (error) {
        alert('Failed to load, data format error');
        console.error('Load error:', error);
      }
    } else {
      alert('No template');
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`Comfirm to delte template "${name}" ？`)) {
      const key = `classroom-layout-${name}`;
      localStorage.removeItem(key);
      refreshSavedLayouts();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={() => setShowSaveDialog(true)}
        style={{ ...styles.button, ...styles.buttonBlue }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        <Save size={20} />
        Save Template
      </button>

      {savedLayouts.length > 0 && (
        <button
          onClick={() => setShowLoadDialog(true)}
          style={{ ...styles.button, ...styles.buttonPurple }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
        >
          <Upload size={20} />
          Load Template
        </button>
      )}

      {showSaveDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Save Template</h3>
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Name Template"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSave}
                style={{ ...styles.button, ...styles.buttonBlue, flex: 1, justifyContent: 'center' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                style={{ ...styles.button, ...styles.buttonGray, flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Load Template</h3>
            <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
              {savedLayouts.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>Unable to Save Template</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedLayouts.map(name => (
                    <div
                      key={name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      <button
                        onClick={() => handleLoad(name)}
                        style={{
                          flex: 1,
                          textAlign: 'left',
                          fontWeight: '500',
                          color: '#1f2937',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0'
                        }}
                      >
                        {name}
                      </button>
                      <button
                        onClick={() => handleDelete(name)}
                        style={{
                          marginLeft: '8px',
                          padding: '8px',
                          color: '#ef4444',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setShowLoadDialog(false)}
                style={{ ...styles.button, ...styles.buttonGray, width: '100%', justifyContent: 'center' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

// pages/ClassroomEditor.tsx
const ClassroomEditor = () => {
  const {
    roomData,
    setRoomData,
    addSeats,
    updateSeat,
    removeSeat,
    updateRoomSize
  } = useRoomData();

  const {
    draggedSeat,
    isDragging,
    isTrashActive,
    handleDragStart,
    handleDragEnd,
    handleGridDrop,
    handleTrashDrop
  } = useDragDrop(roomData, updateSeat, removeSeat);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <h1 style={styles.title}>Classroom Seating Layout Editor</h1>

        <div style={styles.controlPanel}>
          <div style={styles.controlFlex}>
            <AddSeatButton onAddSeats={addSeats} roomData={roomData} />
            <RoomSizeInput roomData={roomData} onSizeChange={updateRoomSize} />
            <SaveLoadButtons roomData={roomData} setRoomData={setRoomData} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '14px', color: '#4b5563' }}>
                Total Seats: <span style={{ fontWeight: '600' }}>{roomData.seats.length}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={styles.mainPanel}>
          <div style={styles.centerContent}>
            <RoomGrid
              roomData={roomData}
              draggedSeat={draggedSeat}
              isDragging={isDragging}
              isTrashActive={isTrashActive}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onGridDrop={handleGridDrop}
              onTrashDrop={handleTrashDrop}
            />
          </div>
        </div>

        <div style={styles.instructionBox}>
          <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Instructions:</h3>
          <ul style={{ fontSize: '14px', color: '#1e40af', margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '4px' }}>Click the "Add Seat" button to choose a template and add seats</li>
            <li style={{ marginBottom: '4px' }}>Drag seats to change their positions</li>
            <li style={{ marginBottom: '4px' }}>Drag seats to the trash icon to delete them</li>
            <li style={{ marginBottom: '4px' }}>Adjust the number of columns and rows to change the room size</li>
            <li>Use the save and load features to manage multiple layouts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassroomEditor;