export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
        Vittion <br />
        <span className="text-blue-600 italic">Rewired</span>
      </h1>
      <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
        L'excellence de l'optique augmentée par l'innovation logicielle. Gérez
        votre catalogue et explorez vos produits en haute-fidélité.
      </p>
      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="px-6 py-3 bg-primary-blue text-white rounded-full hover:bg-blue-600 transition shadow-lg"
        >
          Go to Dashboard
        </a>
        <a
          href="/lenses/1"
          className="px-6 py-3 bg-white text-primary-blue border border-primary-blue rounded-full hover:bg-blue-50 transition shadow-md"
        >
          View Demo Lens
        </a>
      </div>
    </div>
  );
}
