import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
      className="max-w-md"
    >
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">
            Êtes-vous sûr ?
          </h4>
          <p className="text-sm text-slate-500">
            Vous êtes sur le point de supprimer{" "}
            <span className="font-bold text-slate-900">"{title}"</span>. Cette
            action est irréversible.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="ghost"
            className="rounded-xl px-6 py-3 h-auto text-slate-500 hover:bg-slate-50 border-none"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 py-3 h-auto shadow-lg shadow-rose-500/20 gap-2 border-none"
            onClick={onConfirm}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer l'élément
          </Button>
        </div>
      </div>
    </Modal>
  );
}
