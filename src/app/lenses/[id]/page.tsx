import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonCard } from "@/components/cards/ComparisonCard";
import { cn } from "@/lib/utils";

import lenses from "@/lib/data/lenses.json";
import designs from "@/lib/data/designs.json";

interface LensBadgeProps {
  number: number;
  className?: string;
  badgeRef?: React.RefObject<HTMLDivElement | null>;
}

function LensBadge({ number, className, badgeRef }: LensBadgeProps) {
  return (
    <div
      ref={badgeRef}
      className={cn(
        "w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold border-4 border-white shadow-lg",
        className,
      )}
    >
      {number}
    </div>
  );
}

export default function LensDetailPage() {
  const { id } = useParams();
  const lens = lenses.find((l) => l.id.toString() === id) || lenses[0];
  const design = designs.find((d) => d.id === lens.design_id);

  // Refs for positioning the connectors
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const badgeRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [paths, setPaths] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newPaths = sectionRefs.map((secRef, i) => {
        const badgeRef = badgeRefs[i];
        if (!secRef.current || !badgeRef.current) return "";

        const secRect = secRef.current.getBoundingClientRect();
        const badgeRect = badgeRef.current.getBoundingClientRect();

        // Start point: Center of the badge relative to container
        const startX =
          badgeRect.left + badgeRect.width / 2 - containerRect.left;
        const startY = badgeRect.top + badgeRect.height / 2 - containerRect.top;

        // Target point: Center-left edge of the section div relative to container
        const targetX = secRect.left - containerRect.left;
        const targetY = secRect.top + secRect.height / 2 - containerRect.top;

        // Calculate point 33% of the way over
        const ratio = 0.33;
        const endX = startX + (targetX - startX) * ratio;
        const endY = startY + (targetY - startY) * ratio;

        // Create a subtle curve pointing towards the target
        return `M ${startX} ${startY} Q ${startX + (endX - startX) * 0.5} ${startY} ${endX} ${endY}`;
      });

      setPaths(newPaths);
    };

    // Use a small timeout to ensure layout has settled
    const timeoutId = setTimeout(updatePaths, 100);
    window.addEventListener("resize", updatePaths);
    return () => {
      window.removeEventListener("resize", updatePaths);
      clearTimeout(timeoutId);
    };
  }, [id]); // Update when lens changes

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-10 pt-8 pb-4 flex-shrink-0 z-50">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-slate-400 hover:text-slate-700 text-sm mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Démonstration
            </h1>
            <p className="text-lg text-slate-500">
              {lens.n_complet} |{" "}
              <span className="text-slate-400 font-normal">
                EDI: {lens.code_edi}
              </span>
            </p>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">
              3 éléments majeurs composent votre verre :
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-5 py-5 border-slate-200 hover:bg-slate-50 gap-2 transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-800 text-sm">
              Comprendre votre vision
            </span>
          </Button>
        </div>
      </header>

      {/* Main Layout Area - Adaptive to Window */}
      <main
        ref={containerRef}
        className="flex-1 flex relative px-10 items-end pb-0 overflow-hidden"
      >
        {/* LEFT: Lens Pillar - Anchored Bottom Left with Overlap */}
        <div className="w-[35%] h-full relative pointer-events-none select-none overflow-visible">
          {/* We position the layers absolutely to achieve the "Pillar" overlap */}
          <div className="absolute bottom-[-5%] left-[-40px] w-full h-[85%]">
            {/* Layer 3: Treatment (Back-most / Bottom) */}
            <div className="absolute bottom-[0%] left-[0%] w-[540px] h-[400px] bg-gradient-to-br from-purple-200/80 via-purple-100/60 to-purple-50/30 border border-purple-300/40 rounded-[5rem_5rem_8rem_4rem] backdrop-blur-md shadow-2xl transform rotate-[-3deg] z-10 transition-transform duration-500">
              <LensBadge
                number={3}
                badgeRef={badgeRefs[2]}
                className="absolute right-0 top-12 transform translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-60" />
            </div>

            {/* Layer 2: Material (Middle / Center) */}
            {/* Shifted further left and on top of 3 */}
            <div className="absolute bottom-[25%] left-[-80px] w-[520px] h-[400px] bg-gradient-to-br from-green-200/80 via-green-100/60 to-green-50/30 border border-green-300/40 rounded-[4rem_7rem_6rem_5rem] backdrop-blur-md shadow-2xl transform rotate-[2deg] z-20 transition-transform duration-500">
              <LensBadge
                number={2}
                badgeRef={badgeRefs[1]}
                className="absolute right-0 top-12 transform translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-40" />
            </div>

            {/* Layer 1: Design (Front-most / Top) */}
            {/* Shifted furthest left and on top of 2 */}
            <div className="absolute bottom-[50%] left-[-120px] w-[500px] h-[400px] bg-gradient-to-br from-blue-300/90 via-blue-200/70 to-blue-100/40 border border-blue-400/50 rounded-[6rem_4rem_5rem_7rem] backdrop-blur-md shadow-2xl transform rotate-[-4deg] z-30 transition-transform duration-500">
              <LensBadge
                number={1}
                badgeRef={badgeRefs[0]}
                className="absolute right-0 top-12 transform translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-70" />
            </div>

            {/* Dynamic SVG Connectors Overlay - Managed by Main but inside relative parent if possible */}
          </div>
        </div>

        {/* Dynamic SVG Connectors Overlay - Final Positioning */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-40 opacity-50">
          {paths.map((p, i) => (
            <path
              key={i}
              d={p}
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
          ))}
        </svg>

        {/* RIGHT: Feature Content - Distributed to fit height */}
        <div className="w-[65%] h-full flex flex-col justify-center gap-[4vh] pb-10 pr-10 z-10">
          {/* Section 1: Design */}
          <div ref={sectionRefs[0]} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-slate-300 font-normal">1.</span> Le design
              <span className="h-px flex-1 bg-slate-100 ml-4"></span>
            </h2>
            <ComparisonCard
              title={design?.name || "Design"}
              subtitle={design?.code}
              imageSrc="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
              overlayText="Détails"
              className="h-[18vh] min-h-[140px] max-h-[180px] w-full border-none shadow-md rounded-2xl overflow-hidden"
            />
          </div>

          {/* Section 2: Material */}
          <div ref={sectionRefs[1]} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-slate-300 font-normal">2.</span> La matière
              <span className="h-px flex-1 bg-slate-100 ml-4"></span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <ComparisonCard
                title="Protection"
                subtitle="BlueGuard"
                imageSrc="https://images.unsplash.com/photo-1570222094114-28a9d8896c74?q=80&w=800&auto=format&fit=crop"
                overlayText="Savoir plus"
                className="h-[18vh] min-h-[140px] max-h-[180px] border-none shadow-md rounded-2xl overflow-hidden"
              />
              <ComparisonCard
                title="Esthétisme"
                subtitle="Indice 1.6"
                imageSrc="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
                overlayText="Comparer"
                className="h-[18vh] min-h-[140px] max-h-[180px] border-none shadow-md rounded-2xl overflow-hidden"
              />
            </div>
          </div>

          {/* Section 3: Treatment */}
          <div ref={sectionRefs[2]} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-slate-300 font-normal">3.</span> Le
              traitement
              <span className="h-px flex-1 bg-slate-100 ml-4"></span>
            </h2>
            <ComparisonCard
              title="Platinium Brocode"
              subtitle="Excellence"
              imageSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
              overlayText="Voir plus"
              className="h-[18vh] min-h-[140px] max-h-[180px] w-full border-none shadow-md rounded-2xl overflow-hidden"
            />
          </div>
        </div>
      </main>

      {/* Background Decorative Element */}
      <div className="fixed inset-0 bg-slate-50/20 -z-10 pointer-events-none" />
    </div>
  );
}
