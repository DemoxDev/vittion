import { useParams } from "react-router-dom";

export default function LensDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Lens Demo: {id}</h1>
      <p className="text-gray-600">
        Visual demonstration of the lens features will be shown here.
      </p>
    </div>
  );
}
