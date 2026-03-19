"use client";

import ImageCropField from "@/components/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { z } from "zod";

// Schemas para os exemplos
const basicSchema = z.object({
  avatar: z.instanceof(File).optional(),
  advanced: z.instanceof(File).optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  image: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: "A imagem não pode ser maior que 5MB",
  }),
});

type BasicFormData = z.infer<typeof basicSchema>;
type FormData = z.infer<typeof formSchema>;

const ExamplesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [standaloneImage, setStandaloneImage] = useState<File | null>(null);
  const [freeCropImage, setFreeCropImage] = useState<File | null>(null);
  const [customResImage, setCustomResImage] = useState<File | null>(null);
  const [playgroundImage, setPlaygroundImage] = useState<File | null>(null);

  // Playground state
  const [pgProps, setPgProps] = useState({
    aspect: 1,
    cropShape: "round" as "round" | "rect",
    allowFreeCrop: true,
    showGrid: true,
  });

  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicSchema),
  });
  const completeForm = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const tabs = [
    {
      id: "basic",
      label: "Básico",
      title: "Avatar Circular (RHF)",
      description:
        "Ideal para fotos de perfil, com proporção 1:1 travada e saída otimizada.",
      code: `// Integração com React Hook Form
<Controller
  name="avatar"
  control={control}
  render={({ field }) => (
    <ImageCropField
      field={field}
      aspect={1}
      cropShape="round"
      output={{ width: 200, height: 200, quality: 0.8 }}
    />
  )}
/>`,
      component: (
        <Controller
          name="avatar"
          control={basicForm.control}
          render={({ field }) => (
            <ImageCropField
              field={field}
              aspect={1}
              cropShape="round"
              viewportWidth={260}
              viewportHeight={260}
              output={{ width: 200, height: 200, quality: 0.8 }}
              allowFreeCrop={false}
            />
          )}
        />
      ),
    },
    {
      id: "free",
      label: "Corte Livre",
      title: "Flexibilidade Total",
      description:
        "Permite ao usuário definir qualquer área de corte sem restrição de proporção.",
      code: `<ImageCropField
  value={image}
  onChange={setImage}
  allowFreeCrop={true}
  cropShape="rect"
  label="Upload Livre"
/>`,
      component: (
        <ImageCropField
          value={freeCropImage}
          onChange={setFreeCropImage}
          allowFreeCrop={true}
          cropShape="rect"
          label="Tentar Corte Livre"
          viewportWidth={320}
          viewportHeight={200}
        />
      ),
    },
    {
      id: "scaled",
      label: "Escalonado",
      title: "Resolução Fixa (Saída)",
      description:
        "O desenvolvedor define no código a dimensão exata da imagem final (ex: 220x200), e o editor força esse aspecto.",
      code: `<ImageCropField
  value={image}
  onChange={setImage}
  // Força o aspecto 1.1:1 baseado no output
  output={{ width: 220, height: 200 }} 
  label="Corte 220x200"
/>`,
      component: (
        <ImageCropField
          value={customResImage}
          onChange={setCustomResImage}
          output={{ width: 220, height: 200 }}
          label="Corte 220x200"
          viewportWidth={220}
          viewportHeight={200}
          allowFreeCrop={false}
        />
      ),
    },
    {
      id: "banner",
      label: "Banner",
      title: "Formato Widescreen",
      description:
        "Configuração para banners 16:9 retangulares de alta resolução.",
      code: `<ImageCropField
  value={banner}
  onChange={setBanner}
  aspect={16/9}
  cropShape="rect"
  output={{ width: 1280, height: 720, mime: "image/png" }}
/>`,
      component: (
        <ImageCropField
          value={standaloneImage}
          onChange={setStandaloneImage}
          aspect={16 / 9}
          cropShape="rect"
          label="Banner 16:9"
          viewportWidth={360}
          viewportHeight={202}
          output={{ width: 300, height: 169, mime: "image/png" }}
          allowFreeCrop={false}
        />
      ),
    },
    {
      id: "form",
      label: "Validação",
      title: "Formulário Completo",
      description:
        "Integração robusta com Zod para validar a existência e o tamanho da imagem cortada.",
      code: `// Schema de validação Zod
const schema = z.object({
  name: z.string().min(1, "Obrigatório"),
  image: z.instanceof(File).refine(f => f.size < 5MB)
});

// No componente
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("name")} />
  <Controller
    name="image"
    control={control}
    render={({ field }) => <ImageCropField field={field} />}
  />
  <button type="submit">Enviar</button>
</form>`,
      component: (
        <form
          onSubmit={completeForm.handleSubmit((data) => {
            console.log(data);
            alert("Formulário validado com sucesso!");
          })}
          className="space-y-4 w-full max-w-sm"
        >
          <input
            {...completeForm.register("name")}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
            placeholder="Seu nome"
          />
          <Controller
            name="image"
            control={completeForm.control}
            render={({ field }) => (
              <ImageCropField
                field={field}
                aspect={1}
                cropShape="round"
                viewportWidth={200}
                viewportHeight={200}
                allowFreeCrop={false}
              />
            )}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Validar Form
          </button>
        </form>
      ),
    },
    {
      id: "playground",
      label: "Laboratório",
      title: "Playground Interativo",
      description:
        "Experimente todas as configurações do componente livremente neste laboratório.",
      code: `// Playground Interactive
<ImageCropField
  aspect={${pgProps.aspect.toFixed(2)}}
  cropShape="${pgProps.cropShape}"
  allowFreeCrop={${pgProps.allowFreeCrop}}
  showGrid={${pgProps.showGrid}}
/>`,
      component: (
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50 shadow-inner">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-1">
                Aspecto
              </span>
              <select
                value={pgProps.aspect}
                onChange={(e) =>
                  setPgProps((p) => ({ ...p, aspect: Number(e.target.value) }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2 px-3 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value={1}>1:1 (Quadrado)</option>
                <option value={1.7777777777777777}>16:9 (Vídeo)</option>
                <option value={0.8}>4:5 (Retrato)</option>
              </select>
            </div>
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-1">
                Forma
              </span>
              <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                <button
                  onClick={() =>
                    setPgProps((p) => ({ ...p, cropShape: "round" }))
                  }
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${pgProps.cropShape === "round" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                >
                  Círculo
                </button>
                <button
                  onClick={() =>
                    setPgProps((p) => ({ ...p, cropShape: "rect" }))
                  }
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${pgProps.cropShape === "rect" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                >
                  Retângulo
                </button>
              </div>
            </div>
            <div className="col-span-2 flex flex-wrap gap-4 pt-2 border-t border-gray-700/30">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={pgProps.allowFreeCrop}
                  onChange={(e) =>
                    setPgProps((p) => ({
                      ...p,
                      allowFreeCrop: e.target.checked,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-9 h-5 rounded-full transition-all duration-300 relative ${pgProps.allowFreeCrop ? "bg-blue-500 shadow-md shadow-blue-500/20" : "bg-gray-700"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${pgProps.allowFreeCrop ? "left-5" : "left-1"}`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-200 transition-colors uppercase tracking-tight">
                  Corte Livre
                </span>
              </label>
            </div>
          </div>
          <ImageCropField
            value={playgroundImage}
            onChange={setPlaygroundImage}
            {...pgProps}
            label="Área de Testes"
            viewportWidth={320}
            viewportHeight={200}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
        {/* Tab Header */}
        <div className="flex border-b border-gray-700/50 bg-gray-900/50 p-2 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === idx
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-2">
          {/* Info + Component */}
          <div className="p-8 border-r border-gray-700/50 space-y-8 flex flex-col items-center justify-center min-h-[500px]">
            <div className="space-y-3 w-full text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {tabs[activeTab].title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {tabs[activeTab].description}
              </p>
            </div>

            <div className="flex justify-center bg-gray-900/30 p-6 rounded-2xl border border-gray-700/30 w-full">
              {tabs[activeTab].component}
            </div>
          </div>

          {/* Code Area */}
          <div className="bg-gray-900/40 p-0 flex flex-col border-t lg:border-t-0">
            <div className="px-6 py-4 border-b border-gray-700/50 flex justify-between items-center bg-gray-900/20">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                Code Snippet
              </span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
            </div>
            <div className="flex-1 overflow-auto max-h-[400px] lg:max-h-[500px] custom-scrollbar">
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  background: "transparent",
                  padding: "1.5rem",
                  margin: 0,
                  fontSize: "12px",
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  lineHeight: "1.6",
                }}
              >
                {tabs[activeTab].code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Features Banner */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Corte Livre", icon: "✂️" },
          { label: "Resolução Manual", icon: "📐" },
          { label: "Otimizado RHF", icon: "🧩" },
          { label: "Next.js 15 Ready", icon: "⚡" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-2xl flex items-center gap-3 hover:bg-gray-800/50 transition-colors group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExamplesSection;
