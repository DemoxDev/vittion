import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Info, Layers, Beaker, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchLenses } from "@/lib/api";

export default function LensesIndexPage() {
  const [lenses, setLenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLenses = async () => {
      try {
        const data = await fetchLenses();
        setLenses(data);
      } catch (error) {
        console.error("Failed to fetch lenses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLenses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-slate-400 hover:text-slate-600 text-sm mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour au Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Catalogue de Démonstration
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Sélectionnez un équipement pour lancer l'expérience immersive
                NextVision.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-10 py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-[2.5rem] bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lenses.map((lens) => (
                <LensCard key={lens.id} lens={lens} />
              ))}
            </div>
          )}

          {!isLoading && lenses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
              <Layers className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">
                Aucun verre disponible
              </h3>
              <p className="text-slate-500 mt-2">
                Initialisez votre catalogue dans le dashboard admin.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="py-12 px-10">
        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-8 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
          NextVision UI © 2026 Immersive Experience
        </div>
      </footer>
    </div>
  );
}

function LensCard({ lens }: { lens: any }) {
  return (
    <div className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-inner">
            <Layers className="w-7 h-7" />
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            EDI: {lens.edi_code}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {lens.name}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
          {lens.description ||
            "Une expérience visuelle premium combinant précision de design et clarté de traitement."}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
            <Palette className="w-4 h-4 text-blue-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              Design
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
            <Beaker className="w-4 h-4 text-green-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              Matière
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
            <Info className="w-4 h-4 text-purple-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              Info
            </span>
          </div>
        </div>

        <Link to={`/lenses/${lens.id}`}>
          <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-14 font-bold gap-3 shadow-xl transition-all active:scale-95 group-hover:shadow-blue-500/20">
            <Play className="w-4 h-4 fill-current" />
            Lancer la Démo
          </Button>
        </Link>
      </div>
    </div>
  );
}
