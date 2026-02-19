
import React, { useRef, useState, useEffect } from 'react';

type ToolMode = 'line' | 'rect' | 'circle' | 'selection';

interface MeasurementCanvasProps {
  imageSrc: string;
  onSave: (base64: string) => void;
  onClose: () => void;
}

export const MeasurementCanvas: React.FC<MeasurementCanvasProps> = ({ imageSrc, onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<ToolMode>('line');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!canvas || !drawingCanvas) return;
    const ctx = canvas.getContext('2d');
    const dctx = drawingCanvas.getContext('2d');
    if (!ctx || !dctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawingCanvas.width = img.width;
      drawingCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      dctx.lineCap = 'round';
      dctx.lineJoin = 'round';
      // Store initial blank state
      setHistory([dctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height)]);
    };
  }, [imageSrc]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    setStartPos(pos);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const dCanvas = drawingCanvasRef.current;
    if (!dCanvas) return;
    const dctx = dCanvas.getContext('2d');
    if (!dctx) return;

    const currentPos = getPos(e);
    
    // Restore state from before current shape started
    if (history.length > 0) {
      dctx.putImageData(history[history.length - 1], 0, 0);
    }

    dctx.strokeStyle = '#58A6FF';
    dctx.lineWidth = dCanvas.width / 150;
    dctx.fillStyle = 'rgba(88, 166, 255, 0.2)';

    const width = currentPos.x - startPos.x;
    const height = currentPos.y - startPos.y;

    if (mode === 'line') {
      dctx.beginPath();
      dctx.moveTo(startPos.x, startPos.y);
      dctx.lineTo(currentPos.x, currentPos.y);
      dctx.stroke();
      
      const angle = Math.atan2(height, width);
      const tickLen = dCanvas.width / 60;
      const drawTick = (x: number, y: number) => {
        dctx.moveTo(x - Math.cos(angle + Math.PI/2) * tickLen, y - Math.sin(angle + Math.PI/2) * tickLen);
        dctx.lineTo(x + Math.cos(angle + Math.PI/2) * tickLen, y + Math.sin(angle + Math.PI/2) * tickLen);
      };
      dctx.beginPath();
      drawTick(startPos.x, startPos.y);
      drawTick(currentPos.x, currentPos.y);
      dctx.stroke();
    } else if (mode === 'rect') {
      dctx.beginPath();
      dctx.rect(startPos.x, startPos.y, width, height);
      dctx.fill();
      dctx.stroke();
    } else if (mode === 'circle') {
      const radius = Math.sqrt(width * width + height * height);
      dctx.beginPath();
      dctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      dctx.fill();
      dctx.stroke();
    } else if (mode === 'selection') {
      dctx.lineWidth = dCanvas.width / 40;
      dctx.strokeStyle = 'rgba(88, 166, 255, 0.4)';
      // Selection is special - it doesn't clear the preview in real-time easily with this history method 
      // without more complexity, but for simple highlighting it works if we append to history.
      dctx.beginPath();
      dctx.moveTo(startPos.x, startPos.y);
      dctx.lineTo(currentPos.x, currentPos.y);
      dctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const dCanvas = drawingCanvasRef.current;
    const dctx = dCanvas?.getContext('2d');
    if (dctx && dCanvas) {
      setHistory(prev => [...prev, dctx.getImageData(0, 0, dCanvas.width, dCanvas.height)]);
    }
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      const dctx = drawingCanvasRef.current?.getContext('2d');
      if (dctx) {
        dctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
      }
    }
  };

  const clearDrawing = () => {
    const dCanvas = drawingCanvasRef.current;
    const dctx = dCanvas?.getContext('2d');
    if (dctx && dCanvas) {
      dctx.clearRect(0, 0, dCanvas.width, dCanvas.height);
      setHistory([dctx.getImageData(0, 0, dCanvas.width, dCanvas.height)]);
    }
  };

  const handleComplete = () => {
    const canvas = canvasRef.current;
    const dCanvas = drawingCanvasRef.current;
    if (canvas && dCanvas) {
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const fctx = finalCanvas.getContext('2d');
      if (fctx) {
        fctx.drawImage(canvas, 0, 0);
        fctx.drawImage(dCanvas, 0, 0);
        onSave(finalCanvas.toDataURL('image/png'));
      }
    }
  };

  const tools: { id: ToolMode; name: string }[] = [
    { id: 'line', name: 'Line' },
    { id: 'rect', name: 'Box' },
    { id: 'circle', name: 'Circle' },
    { id: 'selection', name: 'Highlight' }
  ];

  return (
    <div className="fixed inset-0 z-[250] bg-brand-bg/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="bg-brand-surface rounded-[2rem] p-8 w-full max-w-6xl flex flex-col gap-6 shadow-2xl border border-brand-border h-[90vh]">
        <div className="flex justify-between items-center border-b border-brand-border pb-4">
          <div className="flex flex-col">
            <h3 className="text-brand-text-primary text-sm font-black uppercase tracking-[0.2em]">Spatial Drawing Tool</h3>
            <p className="text-[10px] text-brand-text-secondary uppercase tracking-widest mt-1">Define structural modifications with precision</p>
          </div>
          
          <div className="flex bg-brand-bg p-1 rounded-xl border border-brand-border">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setMode(tool.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === tool.id ? 'bg-brand-accent text-brand-bg shadow-lg' : 'text-brand-text-secondary hover:text-white'}`}
              >
                {tool.name}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
          </button>
        </div>

        <div className="relative flex-grow flex items-center justify-center bg-brand-bg/60 rounded-[2rem] overflow-hidden border border-brand-border/30">
          <canvas ref={canvasRef} className="absolute max-w-full max-h-full object-contain pointer-events-none" />
          <canvas 
            ref={drawingCanvasRef} 
            onMouseDown={startDrawing} 
            onMouseMove={draw} 
            onMouseUp={stopDrawing} 
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing} 
            onTouchMove={draw} 
            onTouchEnd={stopDrawing} 
            className="relative z-10 max-w-full max-h-full object-contain cursor-crosshair touch-none" 
          />
        </div>

        <div className="flex justify-between items-center border-t border-brand-border pt-4">
          <div className="flex gap-4">
            <button onClick={undo} disabled={history.length <= 1} className="text-[10px] font-black uppercase text-brand-text-secondary hover:text-brand-accent disabled:opacity-30 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth="2"/></svg>
                Undo
            </button>
            <button onClick={clearDrawing} className="text-[10px] font-black uppercase text-red-400">Clear All</button>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase text-brand-text-secondary">Cancel</button>
            <button onClick={handleComplete} className="bg-brand-accent text-brand-bg px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-accent/20">Apply Guides</button>
          </div>
        </div>
      </div>
    </div>
  );
};
