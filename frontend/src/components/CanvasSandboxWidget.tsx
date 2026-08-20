import React, { useRef, useState, useEffect } from 'react';
import { 
  IconPencil, 
  IconSquare, 
  IconCircle, 
  IconEraser, 
  IconTrash, 
  IconCode, 
  IconFlame 
} from '@tabler/icons-react';

interface Shape {
  id: string;
  type: 'freehand' | 'rectangle' | 'circle';
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  strokeWidth: number;
}

export const CanvasSandboxWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'freehand' | 'rectangle' | 'circle' | 'eraser'>('freehand');
  const [color, setColor] = useState<string>('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState<boolean>(true);

  // Redraw canvas on shapes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Background
    ctx.strokeStyle = 'rgba(200, 200, 220, 0.15)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const allShapes = currentShape ? [...shapes, currentShape] : shapes;

    allShapes.forEach((shape) => {
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color + '22'; // 13% opacity fill
      ctx.lineWidth = shape.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (shape.type === 'freehand' && shape.points && shape.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        shape.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (shape.type === 'rectangle' && shape.x !== undefined && shape.y !== undefined && shape.width !== undefined && shape.height !== undefined) {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === 'circle' && shape.x !== undefined && shape.y !== undefined && shape.radius !== undefined) {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    });
  }, [shapes, currentShape]);

  const addLog = (msg: string) => {
    setLogs((prev) => [ `[${new Date().toISOString().slice(11, 19)}] ${msg}`, ...prev.slice(0, 19) ]);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    setIsDrawing(true);
    const shapeId = 'shape_' + Math.random().toString(36).substring(2, 7);

    if (tool === 'eraser') {
      // Find shape hit and remove
      const remaining = shapes.filter((s) => {
        if (s.type === 'rectangle' && s.x !== undefined && s.y !== undefined && s.width !== undefined && s.height !== undefined) {
          return !(x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height);
        }
        return true;
      });
      setShapes(remaining);
      addLog(`WS: DISPATCH { type: "DELETE_SHAPE", mousePos: { x: ${Math.round(x)}, y: ${Math.round(y)} } }`);
      return;
    }

    if (tool === 'freehand') {
      const newShape: Shape = {
        id: shapeId,
        type: 'freehand',
        points: [{ x, y }],
        color,
        strokeWidth,
      };
      setCurrentShape(newShape);
    } else if (tool === 'rectangle') {
      const newShape: Shape = {
        id: shapeId,
        type: 'rectangle',
        x,
        y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
      };
      setCurrentShape(newShape);
    } else if (tool === 'circle') {
      const newShape: Shape = {
        id: shapeId,
        type: 'circle',
        x,
        y,
        radius: 0,
        color,
        strokeWidth,
      };
      setCurrentShape(newShape);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentShape) return;
    const { x, y } = getCanvasCoords(e);

    if (currentShape.type === 'freehand' && currentShape.points) {
      setCurrentShape({
        ...currentShape,
        points: [...currentShape.points, { x, y }],
      });
    } else if (currentShape.type === 'rectangle' && currentShape.x !== undefined && currentShape.y !== undefined) {
      setCurrentShape({
        ...currentShape,
        width: x - currentShape.x,
        height: y - currentShape.y,
      });
    } else if (currentShape.type === 'circle' && currentShape.x !== undefined && currentShape.y !== undefined) {
      const radius = Math.sqrt(Math.pow(x - currentShape.x, 2) + Math.pow(y - currentShape.y, 2));
      setCurrentShape({
        ...currentShape,
        radius,
      });
    }
  };

  const handleMouseUp = () => {
    if (currentShape) {
      setShapes((prev) => [...prev, currentShape]);
      addLog(`WS: BROADCAST { room: "figment_demo", event: "DRAW_${currentShape.type.toUpperCase()}", id: "${currentShape.id}" }`);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    setShapes([]);
    setCurrentShape(null);
    addLog(`WS: BROADCAST { room: "figment_demo", event: "CLEAR_CANVAS" }`);
  };

  return (
    <div className="my-8 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-slate-800/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <IconFlame className="text-amber-400" size={20} />
          <span className="font-semibold text-sm tracking-wide text-amber-300 uppercase">Live Canvas Sandbox</span>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Interactive Demo</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTool('freehand')}
            className={`p-1.5 rounded transition ${tool === 'freehand' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Freehand Pencil"
          >
            <IconPencil size={18} />
          </button>
          <button
            onClick={() => setTool('rectangle')}
            className={`p-1.5 rounded transition ${tool === 'rectangle' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Draw Rectangle"
          >
            <IconSquare size={18} />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-1.5 rounded transition ${tool === 'circle' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Draw Circle"
          >
            <IconCircle size={18} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded transition ${tool === 'eraser' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Eraser / Click Shape"
          >
            <IconEraser size={18} />
          </button>
          <div className="w-px h-5 bg-slate-800 mx-1" />
          
          {/* Color Palette */}
          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#a855f7', '#f43f5e'].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition ${color === c ? 'scale-125 border-white shadow' : 'border-transparent opacity-80 hover:opacity-100'}`}
              style={{ backgroundColor: c }}
            />
          ))}

          {/* Stroke Width Selector */}
          <div className="w-px h-5 bg-slate-800 mx-1" />
          {[2, 4, 6].map((sw) => (
            <button
              key={sw}
              onClick={() => setStrokeWidth(sw)}
              className={`px-1.5 py-0.5 rounded text-xs font-mono transition ${strokeWidth === sw ? 'bg-slate-700 text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              title={`Stroke width ${sw}px`}
            >
              {sw}px
            </button>
          ))}

          <div className="w-px h-5 bg-slate-800 mx-1" />
          <button
            onClick={handleClear}
            className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition"
            title="Clear Canvas"
          >
            <IconTrash size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div className="relative bg-slate-950 flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={720}
          height={380}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="cursor-crosshair w-full max-w-full touch-none"
        />
        
        {shapes.length === 0 && !currentShape && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500 opacity-60">
            <IconPencil size={36} className="mb-2 animate-bounce" />
            <p className="text-sm font-medium">Click and drag inside this box to test real-time canvas rendering!</p>
          </div>
        )}
      </div>

      {/* WebSocket State Sync Monitor */}
      <div className="border-t border-slate-800 bg-slate-950 px-4 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => setShowLogs(!showLogs)} 
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <IconCode size={14} className="text-cyan-400" />
            <span className="font-mono text-cyan-300">Simulated WebSocket State Sync Stream</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800">{logs.length} events</span>
          </button>
          <span className="text-[11px] text-slate-500 font-mono">Shapes count: {shapes.length}</span>
        </div>

        {showLogs && (
          <div className="font-mono text-xs max-h-28 overflow-y-auto bg-slate-900/90 rounded p-2 text-emerald-400 space-y-1 border border-slate-800/80">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">Waiting for canvas user interaction...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="leading-tight hover:bg-slate-800/50 rounded px-1">
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
