import { useState, useEffect } from "react";
import { EntityTable } from "@/components/features/EntityTable";
import { EditModal } from "@/components/features/EditModal";
import { DeleteModal } from "@/components/features/DeleteModal";
import {
  fetchTreatments,
  fetchImages,
  updateTreatment,
  deleteTreatment,
} from "@/lib/api";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [treatmentsData, imagesData] = await Promise.all([
        fetchTreatments(),
        fetchImages(),
      ]);
      setTreatments(treatmentsData);
      setImages(imagesData);
    } catch (error) {
      console.error("Failed to load treatments data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      header: "Image Associée",
      accessor: (item: any) => {
        const image = images.find((img) => img.id === item.image_id);
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            {image ? (
              <img
                src={image.url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                N/A
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Code",
      accessor: "code" as const,
      className: "font-mono font-bold text-orange-600",
    },
    {
      header: "Description",
      accessor: "description" as const,
      className: "max-w-xs truncate text-slate-500",
    },
  ];

  const handleEdit = (item: any) => {
    setCurrentEntity(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item: any) => {
    setCurrentEntity(item);
    setIsDeleteOpen(true);
  };

  const handleSave = async (updated: any) => {
    try {
      await updateTreatment(updated.id, updated);
      await loadData();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to save treatment:", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const confirmDelete = async () => {
    if (!currentEntity) return;
    try {
      await deleteTreatment(currentEntity.id);
      await loadData();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete treatment:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <>
      <EntityTable
        title="Traitements de surface"
        data={treatments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un traitement..."
      />

      {currentEntity && (
        <>
          <EditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSave}
            entity={currentEntity}
            fields={[
              { key: "code", label: "Code", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />

          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete}
            title={currentEntity.code || currentEntity.name || ""}
          />
        </>
      )}
    </>
  );
}
