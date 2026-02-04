import * as React from "react";
import type { ReactNode } from "react";

interface ComparisonViewerProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}

export function ComparisonViewer({
  leftContent,
  rightContent,
  leftLabel = "Standard",
  rightLabel = "Premium",
}: ComparisonViewerProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-200 shadow-inner group"
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchStart={() => (isDragging.current = true)}
      onTouchEnd={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Right Content (Background) */}
      <div className="absolute inset-0">
        {rightContent}
        <span className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
          {rightLabel}
        </span>
      </div>

      {/* Left Content (Clipped) */}
      <div
        className="absolute inset-0 border-r-2 border-white/80 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        style={{ width: `${sliderPosition}%`, overflow: "hidden" }}
      >
        <div className="absolute inset-0 w-full h-full">
          {/* We need the inner content to maintain full width to align correctly */}
          <div className="w-[calc(100vw_-_theme(spacing.8)*2)] md:w-[calc(100vw-theme(spacing.64)-theme(spacing.8)*2)] lg:w-full h-full relative">
            {leftContent}
          </div>
        </div>
        <span className="absolute top-4 left-4 bg-white/50 text-slate-900 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
          {leftLabel}
        </span>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize flex items-center justify-center group-hover:bg-white transition-colors"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-600"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
