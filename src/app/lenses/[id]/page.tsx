import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureRow } from "@/components/layout/feature-row";
import { ComparisonCard } from "@/components/cards/ComparisonCard";
import { cn } from "@/lib/utils";

import lenses from "@/lib/data/lenses.json";
import designs from "@/lib/data/designs.json";

function LensLayer({
  index,
  color,
}: {
  index: number;
  color: "blue" | "green" | "purple";
}) {
  const colorStyles = {
    blue: "from-blue-100 to-transparent border-blue-200 ring-blue-400",
    green: "from-green-50 to-transparent border-green-200 ring-green-400",
    purple:
      "from-purple-100/80 to-blue-50/50 border-purple-200 ring-purple-400",
  };

  return (
    <div className="relative flex items-center justify-center h-full min-h-[220px]">
      {/* Connector Line */}
      <div className="absolute right-0 top-1/2 w-full h-[2px] border-t-2 border-dashed border-slate-300 z-0 translate-x-[50%] hidden md:block" />

      {/* The Lens Shape */}
      <div
        className={cn(
          "relative w-48 h-48 md:w-56 md:h-56 rounded-[3rem] bg-gradient-to-br border backdrop-blur-md shadow-xl transition-all duration-500 z-10",
          colorStyles[color],
          "transform hover:scale-105",
          "flex items-center justify-center",
        )}
      >
        {/* Number Badge */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-lg z-20">
          {index}
        </div>
      </div>
    </div>
  );
}

export default function LensDetailPage() {
  const { id } = useParams();
  const lens = lenses.find((l) => l.id.toString() === id) || lenses[0];
  const design = designs.find((d) => d.id === lens.design_id);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="w-full max-w-[96%] mx-auto pt-8 px-8 flex justify-between items-start">
        <div className="space-y-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Démonstration</h1>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
              {lens.n_complet}
            </span>
          </div>
          <p className="text-slate-500 max-w-xl">
            3 éléments majeurs composent votre verre :
          </p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Eye className="w-4 h-4" /> Comprendre votre vision
        </Button>
      </div>

      {/* Unified Grid Layout */}
      <div className="w-full max-w-[96%] mx-auto p-4 md:p-8 mt-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* ROW 1: Design */}
        {/* Left: Lens Layer 1 */}
        <div className="md:col-span-4 lg:col-span-3 flex justify-center">
          <LensLayer index={1} color="blue" />
        </div>
        {/* Right: Content */}
        <div className="md:col-span-8 lg:col-span-9">
          <FeatureRow title="Le design" description="Pour corriger votre vue">
            <ComparisonCard
              title={design?.name || "Design"}
              subtitle={design?.code}
              imageSrc="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
              overlayText="Comparer"
              className="h-[200px]"
            />
          </FeatureRow>
        </div>

        {/* ROW 2: Material */}
        {/* Left: Lens Layer 2 */}
        <div className="md:col-span-4 lg:col-span-3 flex justify-center">
          <LensLayer index={2} color="green" />
        </div>
        {/* Right: Content */}
        <div className="md:col-span-8 lg:col-span-9">
          <FeatureRow title="La matière" description="Pour protéger votre vue">
            <div className="grid grid-cols-2 gap-4">
              <ComparisonCard
                title="Protection"
                subtitle="BlueGuard"
                imageSrc="https://images.unsplash.com/photo-1570222094114-28a9d8896c74?q=80&w=800&auto=format&fit=crop"
                overlayText="Simuler"
                className="h-[200px]"
              />
              <ComparisonCard
                title="Esthétisme"
                subtitle="Indice 1.6"
                imageSrc="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
                overlayText="Comparer"
                className="h-[200px]"
              />
            </div>
          </FeatureRow>
        </div>

        {/* ROW 3: Treatment */}
        {/* Left: Lens Layer 3 */}
        <div className="md:col-span-4 lg:col-span-3 flex justify-center">
          <LensLayer index={3} color="purple" />
        </div>
        {/* Right: Content */}
        <div className="md:col-span-8 lg:col-span-9">
          <FeatureRow title="Le traitement" description="Pour la durabilité">
            <ComparisonCard
              title="DuraVision® Platinum"
              imageSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
              overlayText="Comparer"
              className="h-[200px]"
            />
          </FeatureRow>
        </div>
      </div>
    </div>
  );
}
