import { useState } from "react";
import { EntityTable } from "@/components/features/EntityTable";
import { EditModal } from "@/components/features/EditModal";
import { DeleteModal } from "@/components/features/DeleteModal";
import materialsData from "@/lib/data/materials.json";
import images from "@/lib/data/images.json";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState(materialsData);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<any>(null);

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
      className: "font-mono font-bold text-blue-600",
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

  const handleSave = (updated: any) => {
    setMaterials(materials.map((m) => (m.id === updated.id ? updated : m)));
    setIsEditOpen(false);
  };

  const confirmDelete = () => {
    setMaterials(materials.filter((m) => m.id !== currentEntity.id));
    setIsDeleteOpen(false);
  };

  return (
    <>
      <EntityTable
        title="Index de réfraction (Matières)"
        data={materials}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Rechercher une matière..."
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
