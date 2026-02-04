import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { ImagePicker } from "@/components/features/ImagePicker";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import imagesData from "@/lib/data/images.json";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  entity: any;
  fields: { key: string; label: string; type: "text" | "textarea" }[];
}

export function EditModal({
  isOpen,
  onClose,
  onSave,
  entity,
  fields,
}: EditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (entity) setFormData(entity);
  }, [entity]);

  const selectedImage = imagesData.find((img) => img.id === formData.image_id);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Modifier ${entity?.name || entity?.code || ""}`}
        className="max-w-2xl"
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 min-h-[120px] transition-all"
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Image Associée
              </label>

              <div className="group relative aspect-[4/3] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-blue-400">
                {selectedImage ? (
                  <>
                    <img
                      src={selectedImage.url}
                      alt="Current"
                      className="w-full h-full object-cover group-hover:blur-[2px] transition-all"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full h-10 w-10 border-none"
                        onClick={() => setIsPickerOpen(true)}
                      >
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-rose-500/80 hover:bg-rose-600 text-white rounded-full h-10 w-10 border-none"
                        onClick={() =>
                          setFormData({ ...formData, image_id: null })
                        }
                      >
                        <Unlink className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <button
                    className="flex flex-col items-center gap-2 p-6"
                    onClick={() => setIsPickerOpen(true)}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlusIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      Ajouter une image
                    </span>
                  </button>
                )}
              </div>
              {selectedImage && (
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  {selectedImage.name} ({selectedImage.resolution})
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              variant="ghost"
              className="rounded-full h-12 w-12 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-0 border-none"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
            <Button
              className="rounded-full h-12 w-12 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 p-0 border-none"
              onClick={handleSave}
            >
              <Check className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </Modal>

      <ImagePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedId={formData.image_id}
        onSelect={(id) => setFormData({ ...formData, image_id: id })}
      />
    </>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
