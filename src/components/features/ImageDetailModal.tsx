import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Maximize2,
  FileText,
  Tag,
  Layers,
  Palette,
  Shapes,
  ExternalLink,
} from "lucide-react";
import designs from "@/lib/data/designs.json";
import treatments from "@/lib/data/treatments.json";
import materials from "@/lib/data/materials.json";
import { cn } from "@/lib/utils";

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: any;
}

export function ImageDetailModal({
  isOpen,
  onClose,
  image,
}: ImageDetailModalProps) {
  if (!image) return null;

  // Find associations
  const associatedDesigns = designs.filter((d) => d.image_id === image.id);
  const associatedTreatments = treatments.filter(
    (t) => t.image_id === image.id,
  );
  const associatedMaterials = materials.filter((m) => m.image_id === image.id);

  const hasAssociations =
    associatedDesigns.length > 0 ||
    associatedTreatments.length > 0 ||
    associatedMaterials.length > 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de l'Asset"
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Preview */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-2 hover:bg-white transition-colors shadow-xl"
              >
                <Maximize2 className="w-4 h-4" /> Voir plein écran
              </a>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              Métadonnées
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Nom du fichier
                </span>
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {image.name}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3" /> Résolution
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {image.resolution}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Catégorie
                </span>
                <div className="pt-0.5">
                  <Badge
                    variant="secondary"
                    className="bg-white text-blue-600 border-blue-50 text-[10px] uppercase font-bold px-2 py-0"
                  >
                    {image.category}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Mis en ligne le
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(image.upload_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Associations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Produits Associés
            </h4>
            {!hasAssociations && (
              <Badge
                variant="outline"
                className="text-slate-400 border-slate-200 text-[10px]"
              >
                Orphelin
              </Badge>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {associatedDesigns.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Palette className="w-4 h-4 text-blue-500" /> Designs
                </div>
                {associatedDesigns.map((d) => (
                  <AssociationItem
                    key={d.id}
                    title={d.name}
                    code={d.code}
                    type="Design"
                  />
                ))}
              </div>
            )}

            {associatedTreatments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Shapes className="w-4 h-4 text-orange-500" /> Traitements
                </div>
                {associatedTreatments.map((t) => (
                  <AssociationItem
                    key={t.id}
                    title={t.name}
                    code={t.code}
                    type="Traitement"
                  />
                ))}
              </div>
            )}

            {associatedMaterials.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-emerald-500" /> Matières
                </div>
                {associatedMaterials.map((m) => (
                  <AssociationItem
                    key={m.id}
                    title={m.name}
                    code={m.code}
                    type="Matière"
                  />
                ))}
              </div>
            )}

            {!hasAssociations && (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <ExternalLink className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Aucun produit associé</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  Asset disponible pour liaison
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AssociationItem({
  title,
  code,
  type,
}: {
  title: string;
  code: string;
  type: string;
}) {
  return (
    <div className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all cursor-default">
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-[10px] text-slate-400 font-mono font-medium">
          {code} • {type}
        </p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
        <ExternalLink className="w-4 h-4" />
      </div>
    </div>
  );
}
