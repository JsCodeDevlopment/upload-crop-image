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
  const [activeExample, setActiveExample] = useState(0);
  const [standaloneImage, setStandaloneImage] = useState<File | null>(null);

  // Form básico
  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicSchema),
  });

  // Form completo
  const completeForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const examples = [
    {
      title: "Uso Básico - Avatar Circular",
      description: "Exemplo simples para upload de avatar com formato circular",
      code: `import ImageCropField from '@/components/image-upload';
import { Controller, useForm } from 'react-hook-form';

const MyComponent = () => {
  const { control } = useForm();

  return (
    <Controller
      name="avatar"
      control={control}
      render={({ field }) => (
        <ImageCropField
          field={field}
          aspect={1}
          cropShape="round"
          label="Foto do Perfil"
          output={{
            width: 200,
            height: 200,
            quality: 0.8
          }}
        />
      )}
    />
  );
};`,
      component: (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-white text-sm font-medium mb-3">Preview:</h4>
          <Controller
            name="avatar"
            control={basicForm.control}
            render={({ field }) => (
              <ImageCropField
                field={field}
                aspect={1}
                cropShape="round"
                label="Foto do Perfil"
                viewportWidth={200}
                viewportHeight={200}
                output={{
                  width: 200,
                  height: 200,
                  quality: 0.8,
                }}
              />
            )}
          />
        </div>
      ),
    },
    {
      title: "Banner Retangular",
      description: "Upload de banner com proporção 16:9 e formato retangular",
      code: `import ImageCropField from '@/components/image-upload';
import { useState } from 'react';

const BannerUpload = () => {
  const [banner, setBanner] = useState(null);

  return (
    <ImageCropField
      value={banner}
      onChange={setBanner}
      aspect={16/9}
      cropShape="rect"
      label="Banner da Página"
      viewportWidth={400}
      viewportHeight={225}
      output={{
        width: 1200,
        height: 675,
        mime: "image/png"
      }}
    />
  );
};`,
      component: (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-white text-sm font-medium mb-3">Preview:</h4>
          <ImageCropField
            value={standaloneImage}
            onChange={setStandaloneImage}
            aspect={16 / 9}
            cropShape="rect"
            label="Banner da Página"
            viewportWidth={300}
            viewportHeight={169}
            output={{
              width: 1200,
              height: 675,
              mime: "image/png",
            }}
          />
        </div>
      ),
    },
    {
      title: "Formulário Completo com Validação",
      description: "Integração completa com React Hook Form e validação Zod",
      code: `import ImageCropField from '@/components/image-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  image: z.instanceof(File).refine((file) => file.size < 5000000, {
    message: "A imagem não pode ser maior que 5MB",
  }),
});

type FormData = z.infer<typeof schema>;

const FormWithImageUpload = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Formulário enviado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Nome:
        </label>
        <input 
          type="text" 
          {...register("name")} 
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Imagem:
        </label>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageCropField 
              field={field} 
              aspect={1} 
              cropShape="round" 
            />
          )}
        />
        {errors.image && (
          <p className="text-red-400 text-sm mt-1">
            {errors.image.message}
          </p>
        )}
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Enviar
      </button>
    </form>
  );
};`,
      component: (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-white text-sm font-medium mb-3">Preview:</h4>
          <form
            onSubmit={completeForm.handleSubmit((data) => {
              console.log(data);
              alert("Formulário enviado com sucesso!");
            })}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nome:
              </label>
              <input
                type="text"
                {...completeForm.register("name")}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                placeholder="Digite seu nome"
              />
              {completeForm.formState.errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {completeForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Imagem:
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-gray-800">
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
                    />
                  )}
                />
              </div>
              {completeForm.formState.errors.image && (
                <p className="text-red-400 text-sm mt-1">
                  {completeForm.formState.errors.image.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors font-medium"
            >
              Enviar
            </button>
          </form>
        </div>
      ),
    },
    {
      title: "Configuração Avançada",
      description: "Exemplo com todas as opções de configuração disponíveis",
      code: `<ImageCropField
  field={field}
  aspect={1}
  cropShape="round"
  maxFileSizeBytes={2 * 1024 * 1024} // 2MB
  label="Foto do Perfil"
  instruction="Posicione seu rosto no centro"
  viewportWidth={300}
  viewportHeight={300}
  minZoom={0.5}
  maxZoom={5}
  initialZoom={1.2}
  showGrid={true}
  output={{
    width: 400,
    height: 400,
    mime: "image/jpeg",
    quality: 0.9,
    fileName: "avatar.jpg"
  }}
/>`,
      component: (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-white text-sm font-medium mb-3">Preview:</h4>
          <Controller
            name="advanced"
            control={basicForm.control}
            render={({ field }) => (
              <ImageCropField
                field={field}
                aspect={1}
                cropShape="round"
                maxFileSizeBytes={2 * 1024 * 1024}
                label="Foto do Perfil"
                instruction="Posicione seu rosto no centro"
                viewportWidth={250}
                viewportHeight={250}
                minZoom={0.5}
                maxZoom={5}
                initialZoom={1.2}
                showGrid={true}
                output={{
                  width: 400,
                  height: 400,
                  mime: "image/jpeg",
                  quality: 0.9,
                  fileName: "avatar.jpg",
                }}
              />
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Exemplos de Uso
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Veja como implementar o ImageCropField em diferentes cenários
          </p>
        </div>

        {/* Navegação dos exemplos */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveExample(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeExample === index
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        {/* Exemplo ativo */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Código */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {examples[activeExample].title}
              </h3>
              <p className="text-gray-300 mb-4">
                {examples[activeExample].description}
              </p>
            </div>

            <div className="relative">
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                className="rounded-lg border border-gray-700"
                customStyle={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  maxHeight: "500px",
                  overflow: "auto",
                  background: "#1f2937",
                }}
              >
                {examples[activeExample].code}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resultado</h4>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl">
              {examples[activeExample].component}
            </div>
          </div>
        </div>

        {/* Dicas adicionais */}
        <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            💡 Dicas de Implementação
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              • Use{" "}
              <code className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-sm text-blue-300">
                aspect={1}
              </code>{" "}
              para imagens quadradas (avatares)
            </li>
            <li>
              • Configure{" "}
              <code className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-sm text-blue-300">
                output
              </code>{" "}
              para definir o tamanho final da imagem
            </li>
            <li>• Combine com React Hook Form para validação automática</li>
            <li>
              • Ajuste{" "}
              <code className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-sm text-blue-300">
                viewportWidth/Height
              </code>{" "}
              conforme seu layout
            </li>
            <li>
              • Use{" "}
              <code className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-sm text-blue-300">
                maxFileSizeBytes
              </code>{" "}
              para limitar o tamanho dos uploads
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;
