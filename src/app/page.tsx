import ExamplesSection from "@/components/examples-section";
import Footer from "@/components/footer";
import FormWithImageUpload from "@/components/form-exemple";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-[#020617] text-gray-100 selection:bg-blue-500/30">
      {/* Background blobs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-4xl px-6 pt-24 pb-16 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nova Versão 2.0 disponível
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Image Crop <span className="text-blue-500">Field</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Componente moderno para upload e recorte de imagens com suporte a 
            <span className="text-white font-medium"> Corte Livre</span>, 
            <span className="text-white font-medium"> Resolução Manual</span> e 
            integração nativa com <span className="text-white font-medium">React Hook Form</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#examples" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:scale-105">
              Ver Exemplos
            </a>
            <a href="https://github.com/JsCodeDevlopment" target="_blank" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl border border-gray-700 transition-all hover:scale-105">
              GitHub
            </a>
          </div>
        </section>

        {/* Featured Card (Primary Demo) */}
        <div id="demo" className="w-full max-w-md px-6 mb-24">
          <div className="p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 text-center">Demo Principal</h2>
            <FormWithImageUpload />
          </div>
        </div>

        {/* Examples Section */}
        <div id="examples" className="w-full bg-gray-900/20 border-t border-gray-800/50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12 text-center lg:text-left ml-4">
              <h2 className="text-3xl font-bold text-white mb-2">Casos de Uso</h2>
              <p className="text-gray-400">Implementações versáteis para qualquer necessidade de projeto.</p>
            </div>
            <ExamplesSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
