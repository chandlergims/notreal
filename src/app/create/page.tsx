'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Only set canvas background to white on initial load
    if (!canvas.dataset.initialized) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.dataset.initialized = 'true';
    }
    
    // Set drawing styles
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [brushColor, brushSize]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const drawing = canvas.toDataURL('image/png');
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          drawing,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Product created successfully!');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (error) {
      setMessage('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Fantasy Product
          </h1>
          <p className="text-gray-400 text-sm">
            Design and describe your innovative fantasy product
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Form Fields Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Left Column - Text Fields */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-white text-sm font-medium mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 10))}
                    className="w-full px-4 py-3 bg-[#0f0f0f] text-white rounded-lg focus:outline-none transition-all text-sm"
                    placeholder="Enter product name..."
                    maxLength={10}
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {title.length}/10 characters
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-white text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                    rows={10}
                    className="w-full px-4 py-3 bg-[#0f0f0f] text-white rounded-lg focus:outline-none transition-all text-sm resize-none"
                    placeholder="Describe your fantasy product in detail..."
                    maxLength={100}
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {description.length}/100 characters
                  </div>
                </div>
              </div>

              {/* Right Column - Canvas */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Product Design
                </label>
                
                {/* Drawing Tools */}
                <div className="mb-4 p-4 bg-[#0f0f0f] rounded-lg">
                  {/* Color Palette */}
                  <div className="mb-3">
                    <span className="text-white text-xs font-medium mb-2 block">Colors</span>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBrushColor(color)}
                          className={`w-6 h-6 rounded cursor-pointer border-2 transition-all hover:scale-110 ${
                            brushColor === color ? 'border-white' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Brush Size */}
                  <div className="flex items-center gap-3">
                    <span className="text-white text-xs font-medium">Size</span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-gray-400 text-xs w-6">{brushSize}px</span>
                  </div>
                </div>

                {/* Canvas */}
                <div className="bg-white rounded-lg p-3">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={350}
                    className="border border-gray-200 cursor-crosshair w-full rounded shadow-sm"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ touchAction: 'none' }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors cursor-pointer"
                  >
                    Clear Canvas
                  </button>
                  <span className="text-gray-500 text-xs">
                    Click and drag to draw
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t border-[#333] pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  {message && (
                    <div className={`text-sm p-3 rounded-lg ${
                      message.includes('successfully') 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                        : 'bg-red-600/20 text-red-400 border border-red-600/30'
                    }`}>
                      {message}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all cursor-pointer min-w-[140px] backdrop-blur-sm border border-white/20 hover:border-white/30"
                >
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
