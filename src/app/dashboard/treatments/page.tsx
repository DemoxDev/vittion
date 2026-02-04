import { EntityTable } from "@/components/features/EntityTable";
import treatments from "@/lib/data/treatments.json";
import images from "@/lib/data/images.json";

export default function TreatmentsPage() {
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

  return (
    <EntityTable
      title="Traitements de surface"
      data={treatments}
      columns={columns}
      onEdit={(item) => console.log("Edit", item)}
      onDelete={(item) => console.log("Delete", item)}
      searchPlaceholder="Rechercher un traitement..."
    />
  );
}
