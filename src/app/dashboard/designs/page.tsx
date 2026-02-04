import { useState } from "react";
import { EntityTable } from "@/components/features/EntityTable";
import { EditModal } from "@/components/features/EditModal";
import { DeleteModal } from "@/components/features/DeleteModal";
import designsData from "@/lib/data/designs.json";
import images from "@/lib/data/images.json";

export default function DesignsPage() {
  const [designs, setDesigns] = useState(designsData);
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
      header: "Nom",
      accessor: "name" as const,
      className: "font-semibold text-slate-900",
    },
    {
      header: "Description",
      accessor: "description" as const,
      className: "max-w-xs truncate",
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
    setDesigns(designs.map((d) => (d.id === updated.id ? updated : d)));
    setIsEditOpen(false);
  };

  const confirmDelete = () => {
    setDesigns(designs.filter((d) => d.id !== currentEntity.id));
    setIsDeleteOpen(false);
  };

  return (
    <>
      <EntityTable
        title="Catalogue des Designs"
        data={designs}
        columns={columns}
        onView={(item) => console.log("View", item)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Rechercher un design..."
      />

      {currentEntity && (
        <>
          <EditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSave}
            entity={currentEntity}
            fields={[
              { key: "name", label: "Nom", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />

          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete}
            title={currentEntity.name || currentEntity.code || ""}
          />
        </>
      )}
    </>
  );
}
