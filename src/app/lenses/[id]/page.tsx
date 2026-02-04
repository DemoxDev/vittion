import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureRow } from "@/components/layout/feature-row";
import { ComparisonCard } from "@/components/cards/ComparisonCard";
import { ExplodedLens } from "@/components/features/exploded-lens";

import lenses from "@/lib/data/lenses.json";
import designs from "@/lib/data/designs.json";

export default function LensDetailPage() {
  const { id } = useParams();
  const lens = lenses.find((l) => l.id.toString() === id) || lenses[0];
  const design = designs.find((d) => d.id === lens.design_id);

  const [activeLayer, setActiveLayer] = useState<number>(0);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* LEFT COLUMN - Visual/Sticky */}
      <div className="w-full md:w-[45%] lg:w-[40%] bg-gradient-to-br from-slate-50 to-white relative flex flex-col items-center justify-center p-8 sticky top-0 h-screen overflow-hidden">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="absolute top-8 left-8 p-3 rounded-full bg-white shadow-sm hover:shadow-md transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>

        {/* Lens Visualization */}
        <div className="w-full max-w-[500px] h-[600px] relative">
          <ExplodedLens activeLayer={activeLayer} />
        </div>
      </div>

      {/* RIGHT COLUMN - Scrollable Content */}
      <div className="w-full md:w-[55%] lg:w-[60%] p-8 md:p-12 lg:p-16 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Démonstration</h1>
            <h2 className="text-xl text-slate-700 font-medium">
              {lens.n_complet} - {lens.code_edi}
            </h2>
            <p className="text-slate-500">
              3 éléments majeurs composent votre verre :
            </p>
          </div>
          <Button variant="secondary" className="hidden md:flex gap-2">
            <Eye className="w-4 h-4" /> Comprendre votre vision
          </Button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* 1. Design */}
          <div
            onMouseEnter={() => setActiveLayer(1)}
            onMouseLeave={() => setActiveLayer(0)}
          >
            <FeatureRow title="Le design" description="Pour corriger votre vue">
              <ComparisonCard
                title={design?.name || "Design"}
                subtitle={design?.code}
                imageSrc="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
                overlayText="Comparer"
              />
            </FeatureRow>
          </div>

          {/* 2. Material */}
          <div
            onMouseEnter={() => setActiveLayer(2)}
            onMouseLeave={() => setActiveLayer(0)}
          >
            <FeatureRow
              title="La matière"
              description="Pour protéger votre vue et améliorer l'esthétique"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ComparisonCard
                  title="Protection"
                  subtitle="BlueGuard"
                  imageSrc="https://images.unsplash.com/photo-1570222094114-28a9d8896c74?q=80&w=800&auto=format&fit=crop"
                  overlayText="Comparer"
                  className="h-[140px]"
                />
                <ComparisonCard
                  title="Esthétisme"
                  subtitle="Indice 1.6"
                  imageSrc="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
                  overlayText="Comparer"
                  className="h-[140px]"
                />
              </div>
            </FeatureRow>
          </div>

          {/* 3. Treatment */}
          <div
            onMouseEnter={() => setActiveLayer(3)}
            onMouseLeave={() => setActiveLayer(0)}
          >
            <FeatureRow
              title="Le traitement"
              description="Pour protéger votre vue, améliorer l'esthétique et la durabilité"
            >
              <ComparisonCard
                title="DuraVision® Platinum"
                imageSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
                overlayText="Comparer"
              />
            </FeatureRow>
          </div>
        </div>
      </div>
    </div>
  );
}
