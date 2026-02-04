import { useState } from "react";
import imagesData from "@/lib/data/images.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageDetailModal } from "@/components/features/ImageDetailModal";
import {
  MoreVertical,
  Download,
  Trash2,
  Upload as UploadIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImagesPage() {
  const [images, setImages] = useState(imagesData);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredImages = images.filter(
    (img) =>
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      img.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenDetail = (img: any) => {
    setSelectedImage(img);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Gestion des Assets
          </h2>
          <p className="text-slate-500">
            Gérez vos images et associations produits.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un asset..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="gallery"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Galerie
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-0 outline-none">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleOpenDetail(img)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-lg h-9 w-9"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="rounded-full shadow-lg h-9 w-9 text-white bg-blue-600 hover:bg-blue-700 border-none"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate flex-1">
                      {img.name}
                    </h3>
                    <div
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-600 rounded-lg group/menu"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 bottom-full mb-1 bg-white border border-slate-100 rounded-xl shadow-xl p-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-opacity min-w-[140px] z-10">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 h-9 text-xs rounded-lg text-slate-600 hover:bg-slate-50"
                        >
                          <Download className="w-3.5 h-3.5" /> Télécharger
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 h-9 text-xs rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-slate-50 text-[10px] uppercase tracking-wider font-bold"
                    >
                      {img.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {img.resolution}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-0 outline-none">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-blue-400 transition-colors group cursor-pointer relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UploadIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Glissez-déposez vos visuels
                </h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  Supporte les formats JPG, PNG et WEBP. Taille maximale
                  suggérée: 2MB.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-6 h-auto shadow-xl shadow-blue-500/20 border-none">
                  Sélectionner des fichiers
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <ImageIcon className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">
                  Bibliothèque Automatisée
                </h4>
                <p className="text-sm text-slate-500">
                  Les images uploadées sont automatiquement classées par IA pour
                  suggérer des associations pertinentes.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <LinkIcon className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">
                  Synchronisation Cloud
                </h4>
                <p className="text-sm text-slate-500">
                  Vos assets sont optimisés et servis via CDN pour une
                  performance maximale sur le démonstrateur.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ImageDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        image={selectedImage}
      />
    </div>
  );
}
