import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Palette,
  Layers,
  Shapes,
  ImageIcon,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  fetchDesigns,
  fetchLenses,
  fetchTreatments,
  fetchMaterials,
} from "@/lib/api";

export default function DashboardOverview() {
  const [data, setData] = useState({
    designs: 0,
    lenses: 0,
    treatments: 0,
    materials: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [d, l, t, m] = await Promise.all([
          fetchDesigns(),
          fetchLenses(),
          fetchTreatments(),
          fetchMaterials(),
        ]);
        setData({
          designs: d.length,
          lenses: l.length,
          treatments: t.length,
          materials: m.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const stats = [
    {
      title: "Total Designs",
      value: data.designs,
      icon: Palette,
      color: "text-blue-500",
      trend: "+4.5%",
      trendUp: true,
      href: "/dashboard/designs",
    },
    {
      title: "Active Treatments",
      value: data.treatments,
      icon: Shapes,
      color: "text-orange-500",
      trend: "+2.1%",
      trendUp: true,
      href: "/dashboard/treatments",
    },
    {
      title: "Materials",
      value: data.materials,
      icon: Layers,
      color: "text-green-500",
      trend: "0%",
      trendUp: true,
      href: "/dashboard/materials",
    },
    {
      title: "Lenses in Catalog",
      value: data.lenses,
      icon: ImageIcon,
      color: "text-purple-500",
      trend: "+12.3%",
      trendUp: true,
      href: "/lenses",
    },
  ];

  const distributionData = [
    { name: "Designs", value: data.designs, color: "#3b82f6" },
    { name: "Treatments", value: data.treatments, color: "#f97316" },
    { name: "Materials", value: data.materials, color: "#22c55e" },
    { name: "Lenses", value: data.lenses, color: "#a855f7" },
  ];

  const monthlyData = [
    { month: "Sep", count: 45 },
    { month: "Oct", count: 52 },
    { month: "Nov", count: 48 },
    { month: "Dec", count: 61 },
    { month: "Jan", count: 55 },
    { month: "Feb", count: 67 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Vue d'ensemble
          </h2>
          <p className="text-slate-500 mt-1">
            Statistiques globales du catalogue optique.
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
          {isLoading ? (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          )}
          <span className="text-sm font-medium text-slate-600">
            {isLoading ? "Synchronisation..." : "Système opérationnel"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} to={stat.href}>
              <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors`}
                  >
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {isLoading ? "..." : stat.value}
                  </div>
                  <div className="flex items-center mt-1 gap-1">
                    {stat.trendUp ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-rose-500" />
                    )}
                    <span
                      className={`text-xs font-semibold ${stat.trendUp ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {stat.trend}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">
                      vs mois dernier
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">
              Croissance du Catalogue
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-sm h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">
              Répartition par Type
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
