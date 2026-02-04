import { useState } from "react";
import imagesData from "@/lib/data/images.json";
import { Modal } from "@/components/ui/Modal";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageId: number) => void;
  selectedId?: number;
}

export function ImagePicker({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}: ImagePickerProps) {
  const [search, setSearch] = useState("");

  const filteredImages = imagesData.filter(
    (img) =>
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      img.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionner une image"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un asset..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className={cn(
                "group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all",
                selectedId === img.id
                  ? "border-blue-600 shadow-lg shadow-blue-500/10"
                  : "border-transparent hover:border-slate-200",
              )}
              onClick={() => {
                onSelect(img.id);
                onClose();
              }}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              {selectedId === img.id && (
                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-[10px] text-white font-medium truncate">
                  {img.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
