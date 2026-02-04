import { cn } from "@/lib/utils";

interface GlassLensesProps {
  color?: string;
  showGlare?: boolean;
  showBlueLight?: boolean;
}

export function GlassLenses({
  color = "bg-blue-100/30",
  showGlare = true,
  showBlueLight = false,
}: GlassLensesProps) {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Main Lens Shape */}
      <div
        className={cn(
          "w-3/4 h-3/4 rounded-full border-4 border-slate-200 shadow-2xl backdrop-blur-sm relative overflow-hidden transition-all duration-500",
          color,
        )}
      >
        {/* Reflection/Glare Effect */}
        {showGlare && (
          <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-gradient-to-br from-white/40 to-transparent rounded-full rotate-12 filter blur-md animate-pulse" />
        )}

        {/* Blue Light Ray Visualization (if active) */}
        {showBlueLight && (
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
        )}

        {/* Mock Scene Behind Lens */}
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
      </div>

      {/* Frame/Rim (Mock) */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-slate-300/50 rounded-full w-3/4 h-3/4 m-auto" />
    </div>
  );
}
