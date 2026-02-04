import { useState, useEffect } from "react";
import { EntityTable } from "@/components/features/EntityTable";
import { EditModal } from "@/components/features/EditModal";
import { DeleteModal } from "@/components/features/DeleteModal";
import { fetchLenses, createLens, updateLens, deleteLens } from "@/lib/api";

export default function LensesDashboardPage() {
  const [lenses, setLenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<any>(null);

  // For select options in EditModal (if EditModal supports select types, otherwise we use text/number)
  // EditModal doesn't seem to support 'select' yet based on previous views, but I can check or assume it's text for now
  // and maybe improve it.

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLenses();
      setLenses(data);
    } catch (error) {
      console.error("Failed to load lenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      header: "Nom Complet",
      accessor: "name" as const,
      className: "font-semibold text-slate-900",
    },
    {
      header: "Code EDI",
      accessor: "edi_code" as const,
      className: "font-mono text-sm text-slate-500",
    },
    {
      header: "Design ID",
      accessor: "design_id" as const,
    },
    {
      header: "Matière ID",
      accessor: "material_id" as const,
    },
    {
      header: "Traitement ID",
      accessor: "treatment_id" as const,
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
      if (updated.id) {
        await updateLens(updated.id, updated);
      } else {
        await createLens(updated);
      }
      await loadData();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to save lens:", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const confirmDelete = async () => {
    if (!currentEntity) return;
    try {
      await deleteLens(currentEntity.id);
      await loadData();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete lens:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestion des Verres (Catalog)
        </h1>
        <Button
          className="bg-primary-blue hover:bg-blue-600 text-white rounded-xl px-6"
          onClick={() => {
            setCurrentEntity({});
            setIsEditOpen(true);
          }}
        >
          Nouveau Verre
        </Button>
      </div>

      <EntityTable
        title="Catalogue des Verres"
        data={lenses}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un verre..."
      />

      {currentEntity && (
        <>
          <EditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSave}
            entity={currentEntity}
            fields={[
              { key: "name", label: "Nom Complet", type: "text" },
              { key: "edi_code", label: "Code EDI", type: "text" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "design_id", label: "Design ID", type: "number" },
              { key: "material_id", label: "Matière ID", type: "number" },
              { key: "treatment_id", label: "Traitement ID", type: "number" },
            ]}
          />

          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete}
            title={currentEntity.name || currentEntity.edi_code || "ce verre"}
          />
        </>
      )}
    </>
  );
}

// Simple Button component if not imported correctly or if I need it here
import { Button } from "@/components/ui/button";
