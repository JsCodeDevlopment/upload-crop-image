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
    console.log(data);
    alert("Formulário enviado com sucesso! Confira o console.");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Nome do Usuário
          </label>
          <input 
            type="text" 
            {...register("name")} 
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 rounded-2xl shadow-inner text-white placeholder-gray-500 outline-none transition-all"
            placeholder="Ex: Jonatas Silva"
          />
          {errors.name && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
            Foto de Perfil
          </label>
          <div className="flex justify-center">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageCropField 
                  field={field} 
                  aspect={1} 
                  cropShape="round" 
                  viewportWidth={280}
                  viewportHeight={280}
                  label="Selecionar Foto"
                />
              )}
            />
          </div>
          {errors.image && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight mt-1 text-center">{errors.image.message}</p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
        >
          Salvar Perfil
        </button>
      </form>
    </div>
  );
};

export default FormWithImageUpload;
