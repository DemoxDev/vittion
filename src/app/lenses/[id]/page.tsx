import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonCard } from "@/components/cards/ComparisonCard";
import { cn } from "@/lib/utils";
import { fetchLens } from "@/lib/api";

interface LensBadgeProps {
  number: number;
  className?: string;
  badgeRef?: React.RefObject<HTMLDivElement | null>;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function LensBadge({
  number,
  className,
  badgeRef,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: LensBadgeProps) {
  return (
    <div
      ref={badgeRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold border-4 border-white shadow-lg transition-all duration-300 cursor-pointer pointer-events-auto",
        isHovered &&
          "scale-125 bg-blue-600 border-blue-100 shadow-blue-200/50 shadow-2xl",
        className,
      )}
    >
      {number}
    </div>
  );
}

export default function LensDetailPage() {
  const { id } = useParams();
  const [lens, setLens] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const loadLensData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLens(parseInt(id));
      setLens(data);
    } catch (err) {
      console.error("Failed to load lens:", err);
      setError("Impossible de charger les données du verre.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLensData();
  }, [id]);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current || !lens) return;

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

    if (!isLoading && lens) {
      const timeoutId = setTimeout(updatePaths, 150);
      window.addEventListener("resize", updatePaths);
      return () => {
        window.removeEventListener("resize", updatePaths);
        clearTimeout(timeoutId);
      };
    }
  }, [isLoading, lens, id]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">
          Chargement du démonstrateur...
        </p>
      </div>
    );
  }

  if (error || !lens) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oups !</h2>
        <p className="text-slate-500 mb-6">{error || "Verre introuvable."}</p>
        <Link to="/dashboard">
          <Button className="bg-blue-600 rounded-xl px-8">
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    );
  }

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
              {lens.name} |{" "}
              <span className="text-slate-400 font-normal">
                EDI: {lens.edi_code}
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
          <div className="absolute bottom-[-5%] left-[-40px] w-full h-[85%]">
            {/* Layer 3: Treatment (Back-most / Bottom) */}
            <div
              onMouseEnter={() => setHoveredIndex(2)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "absolute bottom-[0%] left-[0%] w-[540px] h-[400px] bg-gradient-to-br from-purple-200/80 via-purple-100/60 to-purple-50/30 border border-purple-300/40 rounded-[5rem_5rem_8rem_4rem] backdrop-blur-md shadow-2xl transform rotate-[-3deg] z-10 transition-all duration-500 pointer-events-auto cursor-pointer",
                hoveredIndex === 2 &&
                  "scale-[1.03] rotate-[-2deg] from-purple-300/90 via-purple-200/80 to-purple-100/50 border-purple-400/60 shadow-purple-200/40",
              )}
            >
              <LensBadge
                number={3}
                badgeRef={badgeRefs[2]}
                isHovered={hoveredIndex === 2}
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="absolute right-0 top-12 transform translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-60" />
            </div>

            {/* Layer 2: Material (Middle / Center) */}
            <div
              onMouseEnter={() => setHoveredIndex(1)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "absolute bottom-[25%] left-[-80px] w-[520px] h-[400px] bg-gradient-to-br from-green-200/80 via-green-100/60 to-green-50/30 border border-green-300/40 rounded-[4rem_7rem_6rem_5rem] backdrop-blur-md shadow-2xl transform rotate-[2deg] z-20 transition-all duration-500 pointer-events-auto cursor-pointer",
                hoveredIndex === 1 &&
                  "scale-[1.03] rotate-[3deg] from-green-300/90 via-green-200/80 to-green-100/50 border-green-400/60 shadow-green-200/40",
              )}
            >
              <LensBadge
                number={2}
                badgeRef={badgeRefs[1]}
                isHovered={hoveredIndex === 1}
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="absolute right-0 top-12 transform translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-40" />
            </div>

            {/* Layer 1: Design (Front-most / Top) */}
            <div
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "absolute bottom-[50%] left-[-120px] w-[500px] h-[400px] bg-gradient-to-br from-blue-300/90 via-blue-200/70 to-blue-100/40 border border-blue-400/50 rounded-[6rem_4rem_5rem_7rem] backdrop-blur-md shadow-2xl transform rotate-[-4deg] z-30 transition-all duration-500 pointer-events-auto cursor-pointer",
                hoveredIndex === 0 &&
                  "scale-[1.03] rotate-[-3deg] from-blue-400/95 via-blue-300/80 to-blue-200/50 border-blue-500/70 shadow-blue-200/40",
              )}
            >
              <LensBadge
                number={1}
                badgeRef={badgeRefs[0]}
                isHovered={hoveredIndex === 0}
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="absolute right-0 top-12 transform translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-70" />
            </div>
          </div>
        </div>

        {/* Dynamic SVG Connectors Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-40">
          {paths.map((p, i) => (
            <path
              key={i}
              d={p}
              fill="none"
              stroke={hoveredIndex === i ? "#3b82f6" : "#64748b"}
              strokeWidth={hoveredIndex === i ? "4" : "2.5"}
              strokeDasharray={hoveredIndex === i ? "" : "6 6"}
              className="transition-all duration-300"
              opacity={
                hoveredIndex === null || hoveredIndex === i ? "0.6" : "0.2"
              }
            />
          ))}
        </svg>

        {/* RIGHT: Feature Content */}
        <div className="w-[65%] h-full flex flex-col justify-center gap-[4vh] pb-10 pr-10 z-10">
          {/* Section 1: Design */}
          <div
            ref={sectionRefs[0]}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex flex-col gap-3 p-4 -m-4 rounded-3xl transition-all duration-300",
              hoveredIndex === 0 &&
                "bg-blue-50/50 shadow-sm ring-1 ring-blue-100/50",
            )}
          >
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span
                className={cn(
                  "transition-colors duration-300",
                  hoveredIndex === 0
                    ? "text-blue-600"
                    : "text-slate-300 font-normal",
                )}
              >
                1.
              </span>{" "}
              Le design
              <span
                className={cn(
                  "h-px flex-1 ml-4 transition-colors duration-300",
                  hoveredIndex === 0 ? "bg-blue-200" : "bg-slate-100",
                )}
              ></span>
            </h2>
            <ComparisonCard
              title={lens.design_info?.name || "Design Standard"}
              subtitle={lens.design_info?.code || "SVD"}
              isHighlighted={hoveredIndex === 0}
              imageSrc={
                lens.design_info?.image_url ||
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
              }
              overlayText="Détails"
              className="h-[18vh] min-h-[140px] max-h-[180px] w-full border-none shadow-md rounded-2xl overflow-hidden"
            />
          </div>

          {/* Section 2: Material */}
          <div
            ref={sectionRefs[1]}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex flex-col gap-3 p-4 -m-4 rounded-3xl transition-all duration-300",
              hoveredIndex === 1 &&
                "bg-green-50/50 shadow-sm ring-1 ring-green-100/50",
            )}
          >
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span
                className={cn(
                  "transition-colors duration-300",
                  hoveredIndex === 1
                    ? "text-green-600"
                    : "text-slate-300 font-normal",
                )}
              >
                2.
              </span>{" "}
              La matière
              <span
                className={cn(
                  "h-px flex-1 ml-4 transition-colors duration-300",
                  hoveredIndex === 1 ? "bg-green-200" : "bg-slate-100",
                )}
              ></span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <ComparisonCard
                title="Protection"
                subtitle="BlueGuard"
                isHighlighted={hoveredIndex === 1}
                imageSrc="https://images.unsplash.com/photo-1570222094114-28a9d8896c74?q=80&w=800&auto=format&fit=crop"
                overlayText="Savoir plus"
                className="h-[18vh] min-h-[140px] max-h-[180px] border-none shadow-md rounded-2xl overflow-hidden"
              />
              <ComparisonCard
                title="Esthétisme"
                subtitle={
                  lens.material_info?.code
                    ? `Indice ${lens.material_info.code}`
                    : "Indice 1.5"
                }
                isHighlighted={hoveredIndex === 1}
                imageSrc={
                  lens.material_info?.image_url ||
                  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
                }
                overlayText="Comparer"
                className="h-[18vh] min-h-[140px] max-h-[180px] border-none shadow-md rounded-2xl overflow-hidden"
              />
            </div>
          </div>

          {/* Section 3: Treatment */}
          <div
            ref={sectionRefs[2]}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex flex-col gap-3 p-4 -m-4 rounded-3xl transition-all duration-300",
              hoveredIndex === 2 &&
                "bg-purple-50/50 shadow-sm ring-1 ring-purple-100/50",
            )}
          >
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span
                className={cn(
                  "transition-colors duration-300",
                  hoveredIndex === 2
                    ? "text-purple-600"
                    : "text-slate-300 font-normal",
                )}
              >
                3.
              </span>{" "}
              Le traitement
              <span
                className={cn(
                  "h-px flex-1 ml-4 transition-colors duration-300",
                  hoveredIndex === 2 ? "bg-purple-200" : "bg-slate-100",
                )}
              ></span>
            </h2>
            <ComparisonCard
              title={lens.treatment_info?.name || "Premium AR"}
              subtitle={lens.treatment_info?.code || "EXC"}
              isHighlighted={hoveredIndex === 2}
              imageSrc={
                lens.treatment_info?.image_url ||
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
              }
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
