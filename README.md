# Image Crop Field

Componente moderno e reutilizável para upload, recorte, zoom e rotação de imagens, construído com Next.js, TypeScript, React Hook Form, Zod e `react-easy-crop`. Fornece uma experiência de edição em modal com preview e suporte a dimensões de saída exatas.

<h1 align="center">
  <img alt="Preview" title="#Preview" style="object-fit: cover; border-radius: 10px;" src="https://img001.prntscr.com/file/img001/4Kgf7Kp3QoW_qN0Ze-hrFA.png" />
</h1>

## Funcionalidades

- 🖼️ Upload de imagem com validação de tamanho
- ✂️ Editor em modal com recorte interativo
- 🔍 Zoom e ↻ rotação controláveis
- 🟢 Suporte a preview e botão para remover imagem
- 🧩 Integração simples com React Hook Form + Zod
- 📐 Saída em dimensões exatas (ex.: 800x800) mantendo aspecto
- 🟣 Suporte a formato circular (visual) ou retangular
- ⚙️ Configurável: aspecto, grid, limites de zoom e rótulos
- ♿ Acessível e responsivo

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── image-upload.tsx      # ImageCropField (componente principal)
│   └── form-exemple.tsx      # Exemplo de uso com RHF + Zod
└── public/
    └── preview.png           # Imagem de preview (opcional)
```

## Arquitetura e Design

### Visão Geral

O componente foi projetado para ser plugável em qualquer formulário e para exportar um `File` válido para validação com Zod.

1. **Componentização**
   - Componente controlado via RHF (`Controller`) ou `value`/`onChange`
   - Propriedades tipadas em TypeScript
   - API de configuração enxuta e extensível

2. **Performance**
   - Recorte feito via Canvas API
   - Redimensionamento com suavização
   - Geração do arquivo final sob demanda (Confirmar)

3. **UX/UI**
   - Modal de edição com grid opcional
   - Preview preenchendo a área (cover)
   - Botão “×” para remover no preview

### Fluxo de Dados

```mermaid
graph LR
    A[Input File] -->|URL local| B[Editor (Modal)]
    B -->|Crop + Zoom + Rotate| C[Canvas]
    C -->|Blob → File| D[RHF Field]
    D -->|value| E[Preview]
```

### Decisões de Design

1. **Dimensões de Saída**
   - `output.width`/`output.height` padronizam o arquivo final
   - Mantêm o aspecto travado para o usuário no editor

2. **Integração com Formulários**
   - O `File` resultante atende `z.instanceof(File)`
   - Funciona com `Controller` ou de forma controlada

3. **Acessibilidade e UX**
   - Foco em interações claras e feedback imediato
   - Botões semanticamente corretos e com rótulos

## Tecnologias Utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/react--easy--crop-00A884?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
</div>

## Como Usar

### Com React Hook Form + Zod

```tsx
import ImageCropField from "@/components/image-upload";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

export default function Example() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <ImageCropField
            field={field}
            label="Enviar imagem"
            viewportWidth={460}
            viewportHeight={260}
            cropShape="round"
            output={{ width: 800, height: 800, quality: 0.92 }}
          />
        )}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Props Principais

- `aspect`: proporção do recorte (se `output` não for usado)
- `cropShape`: `"round" | "rect"`
- `viewportWidth`/`viewportHeight`: dimensões do preview
- `minZoom`/`maxZoom`/`initialZoom`: controles de zoom
- `output`: `{ width, height, mime?, quality?, fileName? }`
- `label`, `instruction`, `accept`, `maxFileSizeBytes`

## Desenvolvedor

| Foto | Nome | Cargo |
|------|------|-------|
| <img src="https://avatars.githubusercontent.com/u/100796752?s=400&u=ae99bd456c6b274cd934d85a374a44340140e222&v=4" width="100"> | [Jonatas Silva](https://github.com/JsCodeDevlopment) | FullStack Developer |

## Licença

Este projeto está sob a licença MIT.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/JsCodeDevlopment">Jonatas Silva</a></sub>
</div>
