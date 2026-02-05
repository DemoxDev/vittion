import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface ComparisonCardProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  onCompare?: () => void;
  className?: string;
  overlayText?: string;
  isHighlighted?: boolean;
}

export function ComparisonCard({
  imageSrc,
  title,
  subtitle,
  onCompare,
  className,
  overlayText = "Comparer",
  isHighlighted = false,
}: ComparisonCardProps) {
  return (
    <div
      className={cn(
        "relative group rounded-2xl overflow-hidden h-[180px] shadow-sm hover:shadow-md transition-all cursor-pointer bg-white border border-slate-100",
        isHighlighted &&
          "ring-2 ring-blue-500 shadow-xl scale-[1.02] border-blue-200 z-10",
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={title}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
          isHighlighted && "scale-105",
        )}
      />

      {/* Overlay Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent transition-opacity",
          isHighlighted ? "opacity-100" : "opacity-100",
        )}
      />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-center items-start">
        <h4 className="text-lg font-bold text-slate-900 max-w-[60%]">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-slate-600 max-w-[60%] mt-1">{subtitle}</p>
        )}
      </div>

      {/* Compare Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
        <Button
          variant="secondary"
          className="shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onCompare?.();
          }}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {overlayText}
        </Button>
      </div>
      {/* Always visible small icon for mobile/indication */}
      <div className="absolute bottom-4 right-4 md:hidden">
        <SlidersHorizontal className="h-5 w-5 text-slate-700" />
      </div>
    </div>
  );
}
