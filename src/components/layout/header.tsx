import { ArrowLeft, Glasses } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function DemoHeader() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary-blue">
            <Glasses size={18} />
          </div>
          <span className="font-semibold text-lg">Vision Simulator</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">Patient Mode</span>
        <Button size="sm">Save Configuration</Button>
      </div>
    </header>
  );
}
