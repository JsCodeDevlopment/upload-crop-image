"use client";

import ImageCropField from "@/components/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Definindo o esquema Zod para validação do formulário
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
    console.log(data); // Aqui você pode enviar a imagem cortada e outros dados para o servidor
    alert("Formulário enviado com sucesso!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Formulário com Upload de Imagem
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Nome:
          </label>
          <input 
            type="text" 
            {...register("name")} 
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
            placeholder="Digite seu nome"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Imagem:
          </label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-gray-800">
                <ImageCropField field={field} aspect={1} cropShape="round" />
              </div>
            )}
          />
          {errors.image && (
            <p className="text-red-400 text-sm mt-1">{errors.image.message}</p>
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
  );
};

export default FormWithImageUpload;
