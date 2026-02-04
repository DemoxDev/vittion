import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Maximize2,
  FileText,
  Tag,
  Layers,
  Palette,
  Shapes,
  ExternalLink,
  Link2Off,
  ChevronLeft,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import designsData from "@/lib/data/designs.json";
import treatmentsData from "@/lib/data/treatments.json";
import materialsData from "@/lib/data/materials.json";

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: any;
}

interface Entity {
  id: number;
  code: string;
  name?: string;
  description: string;
  image_id: number | null;
}

export function ImageDetailModal({
  isOpen,
  onClose,
  image,
}: ImageDetailModalProps) {
  const [view, setView] = useState<
    "details" | "edit-product" | "confirm-unlink"
  >("details");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [unlinkingProduct, setUnlinkingProduct] = useState<any>(null);

  const [localDesigns, setLocalDesigns] = useState<Entity[]>(
    designsData as Entity[],
  );
  const [localTreatments, setLocalTreatments] = useState<Entity[]>(
    treatmentsData as Entity[],
  );
  const [localMaterials, setLocalMaterials] = useState<Entity[]>(
    materialsData as Entity[],
  );

  if (!image) return null;

  const associatedDesigns = localDesigns.filter((d) => d.image_id === image.id);
  const associatedTreatments = localTreatments.filter(
    (t) => t.image_id === image.id,
  );
  const associatedMaterials = localMaterials.filter(
    (m) => m.image_id === image.id,
  );

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

  const handleEdit = (product: any, type: string) => {
    setEditingProduct({ ...product, type });
    setView("edit-product");
  };

  const handleUnlinkRequest = (product: any, type: string) => {
    setUnlinkingProduct({ ...product, type });
    setView("confirm-unlink");
  };

  const handleConfirmUnlink = () => {
    const { id, type } = unlinkingProduct;
    if (type === "Design") {
      setLocalDesigns((prev) =>
        prev.map((d) => (d.id === id ? { ...d, image_id: null } : d)),
      );
    } else if (type === "Traitement") {
      setLocalTreatments((prev) =>
        prev.map((t) => (t.id === id ? { ...t, image_id: null } : t)),
      );
    } else if (type === "Matière") {
      setLocalMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, image_id: null } : m)),
      );
    }
    setView("details");
    setUnlinkingProduct(null);
  };

  const handleBack = () => {
    setView("details");
    setEditingProduct(null);
    setUnlinkingProduct(null);
  };

  const getTitle = () => {
    if (view === "details") return "Détails de l'Asset";
    if (view === "edit-product") return `Modifier ${editingProduct?.type}`;
    if (view === "confirm-unlink") return "Confirmation";
    return "";
  };

  const getDescription = () => {
    if (view === "edit-product") {
      return `Edition de l'association pour l'asset "${image.name}"`;
    }
    return undefined;
  };

  const getLeading = () => {
    if (view !== "details") {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-xl hover:bg-slate-100 -ml-2"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </Button>
      );
    }
    return null;
  };

  const renderDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
                  title={d.name || d.code}
                  code={d.code}
                  type="Design"
                  onEdit={() => handleEdit(d, "Design")}
                  onUnlink={() => handleUnlinkRequest(d, "Design")}
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
                  title={t.name || t.code}
                  code={t.code}
                  type="Traitement"
                  onEdit={() => handleEdit(t, "Traitement")}
                  onUnlink={() => handleUnlinkRequest(t, "Traitement")}
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
                  title={m.name || m.code}
                  code={m.code}
                  type="Matière"
                  onEdit={() => handleEdit(m, "Matière")}
                  onUnlink={() => handleUnlinkRequest(m, "Matière")}
                />
              ))}
            </div>
          )}

          {!hasAssociations && (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Link2Off className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Aucun produit associé</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                Asset disponible pour liaison
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEditProduct = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              Nom / Code
            </label>
            <input
              type="text"
              defaultValue={editingProduct.name || editingProduct.code}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              Description
            </label>
            <textarea
              rows={4}
              defaultValue={editingProduct.description}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 shadow-lg shadow-blue-500/20 border-none px-6"
              onClick={handleBack}
            >
              <Check className="w-4 h-4 mr-2" /> Valider
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-2xl h-12 border-slate-200 px-6"
              onClick={handleBack}
            >
              <X className="w-4 h-4 mr-2" /> Annuler
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
              Aperçu du lien
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white">
                <img src={image.url} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <Badge className="bg-blue-600 text-[10px] uppercase border-none text-white px-2 py-0.5">
                  {editingProduct.type}
                </Badge>
                <p className="text-sm font-bold text-slate-900">
                  {editingProduct.code}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
              Ce produit sera automatiquement mis à jour sur le démonstrateur
              client dès validation des changements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmUnlink = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Confirmer la désassociation
      </h3>
      <p className="text-slate-500 text-center mb-8 max-w-sm leading-relaxed">
        Êtes-vous sûr de vouloir retirer l'image{" "}
        <span className="font-bold text-slate-900">"{image.name}"</span>
        du produit{" "}
        <span className="font-bold text-slate-900">
          "{unlinkingProduct.name || unlinkingProduct.code}"
        </span>{" "}
        ?
      </p>

      <div className="flex gap-4 w-full max-w-xs">
        <Button
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-12 shadow-lg shadow-rose-500/20 border-none px-6"
          onClick={handleConfirmUnlink}
        >
          Confirmer
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-2xl h-12 border-slate-200 px-6"
          onClick={handleBack}
        >
          Annuler
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setTimeout(() => {
          setView("details");
          setEditingProduct(null);
          setUnlinkingProduct(null);
        }, 200);
      }}
      title={getTitle()}
      description={getDescription()}
      leading={getLeading()}
      className="max-w-4xl"
    >
      {view === "details" && renderDetails()}
      {view === "edit-product" && renderEditProduct()}
      {view === "confirm-unlink" && renderConfirmUnlink()}
    </Modal>
  );
}

interface AssociationItemProps {
  title: string;
  code: string;
  type: string;
  onEdit: () => void;
  onUnlink: () => void;
}

function AssociationItem({
  title,
  code,
  type,
  onEdit,
  onUnlink,
}: AssociationItemProps) {
  return (
    <div className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all cursor-default">
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-[10px] text-slate-400 font-mono font-medium">
          {code} • {type}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onUnlink();
          }}
          className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
          title="Désassocier l'image"
        >
          <Link2Off className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
          title="Modifier les infos du produit"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
