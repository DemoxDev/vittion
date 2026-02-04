import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LensTreatment } from "@/lib/types";

interface TraitementCardProps {
  traitement: LensTreatment;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TraitementCard({
  traitement,
  isSelected,
  onClick,
}: TraitementCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${isSelected ? "ring-2 ring-orange-500 bg-orange-50/50" : "hover:bg-slate-50"}`}
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">
            {traitement.name}
          </CardTitle>
          {isSelected && (
            <Badge
              variant="secondary"
              className="bg-orange-200 text-orange-800"
            >
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-slate-500 line-clamp-2">
          {traitement.description}
        </p>
      </CardContent>
    </Card>
  );
}
