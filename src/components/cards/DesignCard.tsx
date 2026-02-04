import { ArrowRight, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { LensDesign } from "@/lib/types";

interface DesignCardProps {
  design: LensDesign;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function DesignCard({ design, isSelected, onSelect }: DesignCardProps) {
  // Parse description for bullet points
  const features = design.description
    ? design.description
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.replace("-", "").trim())
    : [];

  // Extract main description (first line usually)
  const mainDescription = design.description
    ? design.description.split("\n")[0]
    : "";

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isSelected ? "ring-2 ring-primary-blue shadow-md" : "hover:border-blue-200"}`}
    >
      <CardHeader className="bg-gradient-to-br from-blue-50 to-white pb-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-slate-800">
            {design.name}
          </CardTitle>
          <Badge variant={isSelected ? "default" : "secondary"}>
            {design.code}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-slate-600 leading-relaxed">{mainDescription}</p>

        {features.length > 0 && (
          <div className="space-y-2">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full group"
          variant={isSelected ? "default" : "outline"}
          onClick={onSelect}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Selected
            </>
          ) : (
            <>
              Select Design{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
