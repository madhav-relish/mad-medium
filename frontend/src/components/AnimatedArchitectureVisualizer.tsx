import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconChevronRight, 
  IconChevronLeft, 
  IconDeviceLaptop, 
  IconServer, 
  IconUsers, 
  IconEye 
} from '@tabler/icons-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  source: string;
  target: string;
  dataPayload: string;
  codeSnippet: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: '1. User Input & Canvas Coordinate Mapping',
    subtitle: 'Client A captures raw mouse down / touch event and transforms screen pixels (X, Y) to canvas viewport space via inverse transformation matrix.',
    source: 'Client A (Draw-App UI)',
    target: 'Local State Buffer',
    dataPayload: '{ event: "MOUSE_DOWN", x: 340, y: 190, tool: "rectangle", color: "#3b82f6" }',
    codeSnippet: 'const localShape = { id: uuid(), type: tool, points: [{ x, y }] };\nrenderBuffer.push(localShape); // Optimistic Instant UI Render',
  },
  {
    id: 2,
    title: '2. WebSocket Delta Dispatch (<2ms latency)',
    subtitle: 'Client A dispatches a lightweight JSON shape delta payload over persistent WebSocket connection to the WS Gateway server.',
    source: 'Client A',
    target: 'WS Backend Gateway',
    dataPayload: '{ type: "DRAW_SHAPE", roomId: "room_12", payload: { shapeId: "s_92", type: "RECT" } }',
    codeSnippet: 'socket.send(JSON.stringify({\n  type: "DRAW_SHAPE",\n  roomId,\n  shape: localShape\n}));',
  },
  {
    id: 3,
    title: '3. Pub/Sub Broadcast & Room Synchronization',
    subtitle: 'Node.js/Hono WS Gateway persists shape to DB / Redis cache and broadcasts the delta packet to all active peers subscribed to room_12.',
    source: 'WS Backend Gateway',
    target: 'Subscribed Clients (Client B, Client C)',
    dataPayload: '{ broadcast: true, room: "room_12", shapeId: "s_92", authorId: "usr_A" }',
    codeSnippet: 'wss.clients.forEach(client => {\n  if (client.roomId === roomId && client !== sender) {\n    client.send(JSON.stringify(broadcastMsg));\n  }\n});',
  },
  {
    id: 4,
    title: '4. Remote Offscreen Double-Buffer Render (60 FPS)',
    subtitle: 'Client B receives shape delta, appends to canvas spatial index, and redraws dirty bounds using double-buffered Canvas context.',
    source: 'WS Receiver',
    target: 'Client B Canvas Engine',
    dataPayload: '{ status: "SYNCED", latencyMs: 14, fps: 60 }',
    codeSnippet: 'offscreenCtx.drawImage(mainCanvas, 0, 0);\nrenderShapes(offscreenCtx, remoteShapes);\nmainCtx.drawImage(offscreenCanvas, 0, 0);',
  },
];

export const AnimatedArchitectureVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % STEPS.length);
      }, 3500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const step = STEPS[currentStep];

  return (
    <div className="my-8 rounded-xl border border-indigo-900/60 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 text-slate-100 p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <IconEye className="text-indigo-400" size={22} />
          <span className="font-bold text-indigo-200 text-sm md:text-base tracking-wide uppercase">
            Animated Architecture Visualizer
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
            Interactive Flow
          </span>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition ${
              isPlaying ? 'bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? <IconPlayerPause size={15} /> : <IconPlayerPlay size={15} />}
            {isPlaying ? 'Pause Motion' : 'Auto Play'}
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStep((prev) => (prev === 0 ? STEPS.length - 1 : prev - 1))}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Previous Step"
            >
              <IconChevronLeft size={18} />
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">
              {currentStep + 1}/{STEPS.length}
            </span>
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) % STEPS.length)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Next Step"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Nodes Pipeline Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {/* Node 1: Client A */}
        <div
          className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center text-center ${
            currentStep === 0 || currentStep === 1
              ? 'border-indigo-400 bg-indigo-950/60 shadow-lg shadow-indigo-500/20 scale-102'
              : 'border-slate-800 bg-slate-900/60 opacity-60'
          }`}
        >
          <IconDeviceLaptop size={28} className={currentStep === 0 || currentStep === 1 ? 'text-indigo-400' : 'text-slate-500'} />
          <h4 className="font-semibold text-xs mt-1 text-slate-200">Client A (Author)</h4>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">Captures Strokes</span>
        </div>

        {/* Node 2: WS Backend */}
        <div
          className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center text-center ${
            currentStep === 1 || currentStep === 2
              ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20 scale-102'
              : 'border-slate-800 bg-slate-900/60 opacity-60'
          }`}
        >
          <IconServer size={28} className={currentStep === 1 || currentStep === 2 ? 'text-cyan-400' : 'text-slate-500'} />
          <h4 className="font-semibold text-xs mt-1 text-slate-200">WS Backend Gateway</h4>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">Broadcasts Deltas</span>
        </div>

        {/* Node 3: Client B */}
        <div
          className={`p-3 rounded-lg border transition-all duration-300 flex flex-col items-center text-center ${
            currentStep === 3
              ? 'border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-500/20 scale-102'
              : 'border-slate-800 bg-slate-900/60 opacity-60'
          }`}
        >
          <IconUsers size={28} className={currentStep === 3 ? 'text-emerald-400' : 'text-slate-500'} />
          <h4 className="font-semibold text-xs mt-1 text-slate-200">Client B (Peer)</h4>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">60 FPS Sync Render</span>
        </div>
      </div>

      {/* Dynamic Content Details Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-900/90 rounded-lg p-4 border border-indigo-900/50"
        >
          <h3 className="text-sm md:text-base font-bold text-amber-300">{step.title}</h3>
          <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">{step.subtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {/* Payload Box */}
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider block mb-1">
                WebSocket Message Payload
              </span>
              <pre className="font-mono text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap">
                {step.dataPayload}
              </pre>
            </div>

            {/* Code Snippet */}
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider block mb-1">
                Implementation Logic
              </span>
              <pre className="font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {step.codeSnippet}
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
