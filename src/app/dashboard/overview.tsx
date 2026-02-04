import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Layers, Shapes, ImageIcon } from "lucide-react";
import designs from "@/lib/data/designs.json";
import lenses from "@/lib/data/lenses.json";
import treatments from "@/lib/data/treatments.json";
import materials from "@/lib/data/materials.json";

export default function DashboardOverview() {
  const stats = [
    {
      title: "Total Designs",
      value: designs.length,
      icon: Palette,
      color: "text-blue-500",
    },
    {
      title: "Active Treatments",
      value: treatments.length,
      icon: Shapes,
      color: "text-orange-500",
    },
    {
      title: "Materials",
      value: materials.length,
      icon: Layers,
      color: "text-green-500",
    },
    {
      title: "Lenses in Catalog",
      value: lenses.length,
      icon: ImageIcon,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-slate-500">
          Overview of your optical product catalog.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-slate-500">+2 from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-slate-400">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
