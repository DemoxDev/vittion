import { cn } from "@/lib/utils";

interface ExplodedLensProps {
  activeLayer?: number;
}

export function ExplodedLens({ activeLayer = 0 }: ExplodedLensProps) {
  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Dotted Connections - Simplified SVG paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 500 800"
      >
        {/* Lines connecting layers to labels or focal point if needed */}
        <path
          d="M250,200 Q350,150 400,100"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="opacity-50"
        />
        <path
          d="M250,400 Q350,450 400,500"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="opacity-50"
        />
      </svg>

      {/* Layer 1: Design (Top/Back) */}
      <div
        className={cn(
          "absolute top-[10%] left-[10%] w-64 h-64 rounded-[3rem] bg-gradient-to-br from-blue-100 to-transparent border border-blue-200 backdrop-blur-sm shadow-lg transition-all duration-500 transform hover:scale-105",
          activeLayer === 1
            ? "scale-105 ring-4 ring-blue-400 z-30"
            : "z-10 opacity-80",
        )}
      >
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-lg">
          1
        </div>
      </div>

      {/* Layer 2: Material (Middle) */}
      <div
        className={cn(
          "absolute top-[25%] left-[15%] w-64 h-64 rounded-[3rem] bg-gradient-to-br from-green-50 to-transparent border border-green-200 backdrop-blur-md shadow-xl transition-all duration-500 transform hover:scale-105",
          activeLayer === 2
            ? "scale-105 ring-4 ring-green-400 z-30"
            : "z-20 opacity-90",
        )}
      >
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-lg">
          2
        </div>
      </div>

      {/* Layer 3: Treatment (Bottom/Front) */}
      <div
        className={cn(
          "absolute top-[40%] left-[20%] w-64 h-64 rounded-[3rem] bg-gradient-to-br from-purple-100/80 to-blue-50/50 border border-purple-200 backdrop-blur-lg shadow-2xl transition-all duration-500 transform hover:scale-105",
          activeLayer === 3 ? "scale-105 ring-4 ring-purple-400 z-30" : "z-30",
        )}
      >
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-lg">
          3
        </div>
      </div>

      {/* Visual Guide Text */}
      <div className="absolute bottom-10 left-10 text-slate-400 text-sm italic">
        Interactive Layer View
      </div>
    </div>
  );
}
