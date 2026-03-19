"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropFieldProps = {
  field?: {
    value?: File | null;
    onChange: (file: File | null) => void;
    onBlur?: () => void;
    ref?: (instance: HTMLInputElement | null) => void;
    name?: string;
  };
  value?: File | null;
  onChange?: (file: File | null) => void;

  aspect?: number;
  cropShape?: "round" | "rect";
  accept?: string;
  maxFileSizeBytes?: number;
  label?: string;
  instruction?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  showGrid?: boolean;
  className?: string;
  style?: React.CSSProperties;

  output?: {
    width: number;
    height: number;
    mime?: string;
    quality?: number;
    fileName?: string;
  };

  allowFreeCrop?: boolean;
  allowCustomResolution?: boolean;
};
function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  options?: {
    width?: number;
    height?: number;
    mime?: string;
    quality?: number;
  },
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const mime = options?.mime || "image/jpeg";
  const quality = options?.quality ?? 0.92;

  const safeArea = Math.max(image.width, image.height) * 2;
  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = safeArea;
  rotatedCanvas.height = safeArea;
  const rctx = rotatedCanvas.getContext("2d");
  if (!rctx) throw new Error("Canvas 2D context not available");
  rctx.translate(safeArea / 2, safeArea / 2);
  rctx.rotate(getRadianAngle(rotation));
  rctx.translate(-safeArea / 2, -safeArea / 2);
  rctx.drawImage(
    image,
    (safeArea - image.width) / 2,
    (safeArea - image.height) / 2,
  );

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = Math.round(pixelCrop.width);
  cropCanvas.height = Math.round(pixelCrop.height);
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("Canvas 2D context not available");

  const offsetX = Math.round(-safeArea / 2 + image.width / 2 - pixelCrop.x);
  const offsetY = Math.round(-safeArea / 2 + image.height / 2 - pixelCrop.y);
  const imgData = rctx.getImageData(0, 0, safeArea, safeArea);
  cropCtx.putImageData(imgData, offsetX, offsetY);
  const outW = options?.width ?? pixelCrop.width;
  const outH = options?.height ?? pixelCrop.height;
  let outputCanvas = cropCanvas;
  if (
    Math.round(outW) !== Math.round(pixelCrop.width) ||
    Math.round(outH) !== Math.round(pixelCrop.height)
  ) {
    const scaled = document.createElement("canvas");
    scaled.width = Math.round(outW);
    scaled.height = Math.round(outH);
    const sctx = scaled.getContext("2d");
    if (!sctx) throw new Error("Canvas 2D context not available");
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high" as ImageSmoothingQuality;
    sctx.drawImage(
      cropCanvas,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height,
      0,
      0,
      scaled.width,
      scaled.height,
    );
    outputCanvas = scaled;
  }

  return new Promise((resolve) => {
    outputCanvas.toBlob((blob) => resolve(blob as Blob), mime, quality);
  });
}

/**
 * Componente de upload e recorte de imagens com interface intuitiva
 *
 * Este componente permite que o usuário selecione uma imagem do seu dispositivo,
 * visualize uma prévia e faça recortes personalizados com controles de zoom e rotação.
 * É totalmente compatível com React Hook Form e pode ser usado como um campo controlado.
 *
 * ## Funcionalidades Principais:
 *
 * 1. **Upload de Imagem**: Interface de seleção de arquivos com validação de tamanho
 * 2. **Editor de Recorte**: Modal com controles interativos para recortar a imagem
 * 3. **Corte Livre**: Opção para desativar a proporção fixa e recortar livremente
 * 4. **Resolução Manual**: Permite que o usuário defina largura/altura exatas no editor
 * 5. **Controles Avançados**: Zoom (0.5x a 5x) e rotação (-45° a +45°)
 * 6. **Formatos de Saída**: Suporte a JPEG e PNG com qualidade configurável
 * 7. **Integração com Formulários**: Totalmente compatível com React Hook Form
 * 8. **Responsivo**: Interface adaptável a dispositivos móveis e desktop
 *
 * @param {ImageCropFieldProps} props - Propriedades do componente
 * @param {object} [props.field] - Campo do React Hook Form (obtido via Controller)
 * @param {File|null} [props.value] - Valor controlado da imagem (alternativa ao field)
 * @param {function} [props.onChange] - Callback de mudança (alternativa ao field)
 * @param {number} [props.aspect=1] - Proporção do recorte (1 = quadrado, 16/9 = widescreen)
 * @param {"round"|"rect"} [props.cropShape="round"] - Formato do recorte (circular ou retangular)
 * @param {string} [props.accept="image/*"] - Tipos de arquivo aceitos
 * @param {number} [props.maxFileSizeBytes=5MB] - Tamanho máximo do arquivo em bytes
 * @param {string} [props.label="Selecionar imagem"] - Texto do botão de upload
 * @param {string} [props.instruction="Arraste para reposicionar"] - Instrução no editor
 * @param {number} [props.viewportWidth=420] - Largura da área de preview
 * @param {number} [props.viewportHeight=320] - Altura da área de preview
 * @param {number} [props.minZoom=1] - Zoom mínimo permitido
 * @param {number} [props.maxZoom=3] - Zoom máximo permitido
 * @param {number} [props.initialZoom=1] - Zoom inicial do editor
 * @param {boolean} [props.showGrid=true] - Exibir grade no editor
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.CSSProperties} [props.style] - Estilos CSS inline
 * @param {object} [props.output] - Configurações de saída da imagem
 * @param {number} props.output.width - Largura da imagem final
 * @param {number} props.output.height - Altura da imagem final
 * @param {string} [props.output.mime="image/jpeg"] - Tipo MIME da saída
 * @param {number} [props.output.quality=0.92] - Qualidade da compressão (0-1)
 * @param {string} [props.output.fileName] - Nome do arquivo gerado
 * @param {boolean} [props.allowFreeCrop=true] - Permitir que o usuário escolha o modo de corte livre
 *
 * @returns {JSX.Element} Componente de upload e recorte de imagens
 *
 * @example
 * // Uso básico com React Hook Form
 * <Controller
 *   name="avatar"
 *   control={control}
 *   render={({ field }) => (
 *     <ImageCropField
 *       field={field}
 *       aspect={1}
 *       cropShape="round"
 *       output={{ width: 400, height: 400 }}
 *       allowFreeCrop={false}
 *     />
 *   )}
 * />
 *
 * @example
 * // Configuração para Corte Livre
 * <ImageCropField
 *   value={image}
 *   onChange={setImage}
 *   allowFreeCrop={true}
 *   label="Upload com Corte Livre"
 * />
 *
 * @example
 * // Banner Retangular Customizado
 * <ImageCropField
 *   aspect={16/9}
 *   cropShape="rect"
 *   viewportWidth={500}
 *   viewportHeight={280}
 *   output={{
 *     width: 1920,
 *     height: 1080,
 *     quality: 0.95
 *   }}
 *   allowFreeCrop={false}
 * />
 *
 * @example
 * // Corte com Resolução Fixa (220x200)
 * <ImageCropField
 *   value={customResImage}
 *   onChange={setCustomResImage}
 *   output={{ width: 220, height: 200 }}
 *   label="Corte 220x200"
 *   viewportWidth={220}
 *   viewportHeight={200}
 *   allowFreeCrop={false}
 * />
 *
 * ---
 * [FullStack Software Engineer - Jonatas Silva](github.com/JsCodeDevlopment)
 */
const ImageCropField = ({
  field,
  value,
  onChange,
  aspect = 1,
  cropShape = "round",
  accept = "image/*",
  maxFileSizeBytes = 5 * 1024 * 1024,
  label = "Selecionar imagem",
  instruction = "Arraste para reposicionar",
  viewportWidth = 420,
  viewportHeight = 320,
  minZoom = 1,
  maxZoom = 3,
  initialZoom = 1,
  showGrid = true,
  className,
  style,
  output,
  allowFreeCrop = false,
}: ImageCropFieldProps) => {
  const controlledValue = field?.value ?? value ?? null;
  const controlledOnChange = useMemo(
    () => field?.onChange || onChange || (() => {}),
    [field?.onChange, onChange],
  );

  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (controlledValue instanceof File) {
      const url = URL.createObjectURL(controlledValue);
      setInternalPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof controlledValue === "string") {
      setInternalPreviewUrl(controlledValue);
    } else {
      setInternalPreviewUrl(null);
    }
  }, [controlledValue]);

  const finalAspect = useMemo(() => {
    if (aspect) return aspect;
    if (output?.width && output?.height) return output.width / output.height;
    return 1;
  }, [aspect, output]);

  const finalViewportWidth = useMemo(() => {
    const val = output?.width || viewportWidth || 420;
    return typeof val === "number" ? val : parseInt(String(val)) || 420;
  }, [output?.width, viewportWidth]);

  const finalViewportHeight = useMemo(() => {
    if (output?.height)
      return typeof output.height === "number"
        ? output.height
        : parseInt(String(output.height)) || 420;
    if (viewportHeight && viewportHeight !== 320)
      return typeof viewportHeight === "number"
        ? viewportHeight
        : parseInt(String(viewportHeight));
    return finalViewportWidth / finalAspect;
  }, [finalViewportWidth, finalAspect, output?.height, viewportHeight]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ricCrop, setRicCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [aspectType, setAspectType] = useState<"fixed" | "free">(
    allowFreeCrop ? "free" : "fixed",
  );

  useEffect(() => {
    if (allowFreeCrop) {
      setAspectType("free");
    } else {
      setAspectType("fixed");
    }
  }, [allowFreeCrop]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
        setError("Arquivo muito grande");
        return;
      }
      const localUrl = URL.createObjectURL(file);
      setImageSrc(localUrl);
      setZoom(initialZoom);
      setRotation(0);
      setIsEditorOpen(true);
    },
    [initialZoom, maxFileSizeBytes],
  );

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialAspect =
      aspectType === "fixed"
        ? output?.width && output?.height
          ? output.width / output.height
          : aspect
        : width / height;

    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, initialAspect, width, height),
      width,
      height,
    );
    setRicCrop(crop);
  };

  const onCropComplete = useCallback(
    (
      _area: { x: number; y: number; width: number; height: number },
      areaPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(areaPixels);
    },
    [],
  );

  const currentAspect = useMemo(() => {
    if (aspectType === "free") return undefined;
    if (output?.width && output?.height) return output.width / output.height;
    return aspect;
  }, [aspectType, output, aspect]);

  const confirmCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const finalWidth = aspectType === "fixed" ? output?.width : undefined;
    const finalHeight = aspectType === "fixed" ? output?.height : undefined;

    const opts = {
      width: finalWidth,
      height: finalHeight,
      mime: output?.mime || "image/jpeg",
      quality: output?.quality ?? 0.92,
    } as const;

    let finalCroppedPixels = croppedAreaPixels;

    if (aspectType === "free" && imgRef.current && croppedAreaPixels) {
      const img = imgRef.current;
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      finalCroppedPixels = {
        x: croppedAreaPixels.x * scaleX,
        y: croppedAreaPixels.y * scaleY,
        width: croppedAreaPixels.width * scaleX,
        height: croppedAreaPixels.height * scaleY,
      };
    }

    const blob = await getCroppedImageBlob(
      imageSrc,
      finalCroppedPixels!,
      rotation,
      opts,
    );
    const fileName =
      output?.fileName ||
      (opts.mime === "image/png" ? "image.png" : "image.jpg");
    const file = new File([blob], fileName, { type: opts.mime });
    controlledOnChange(file);
    setImageSrc(null);
    setIsEditorOpen(false);
  }, [
    controlledOnChange,
    croppedAreaPixels,
    imageSrc,
    rotation,
    output,
    aspectType,
  ]);

  const clearSelection = useCallback(() => {
    setImageSrc(null);
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    controlledOnChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [controlledOnChange]);

  const hasValue = !!controlledValue;

  const cancelEdit = useCallback(() => {
    setIsEditorOpen(false);
    if (!controlledValue && imageSrc) {
      setImageSrc(null);
    }
  }, [controlledValue, imageSrc]);

  return (
    <div className={className} style={{ display: "grid", gap: 12, ...style }}>
      <div style={{ display: "none" }}>
        <input
          ref={(node) => {
            inputRef.current = node;
            if (field?.ref) field.ref(node);
          }}
          name={field?.name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          onBlur={field?.onBlur}
        />
      </div>

      <div
        style={{
          width: `${finalViewportWidth}px`,
          height: `${finalViewportHeight}px`,
          border: "2px dashed #374151",
          borderRadius: 24,
          background: "#111827",
          color: "#9ca3af",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          margin: "0 auto",
          flexShrink: 0,
        }}
        className="group hover:border-blue-500/50 hover:bg-gray-800/50"
      >
        {!hasValue && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-white transition-colors"
            style={{ background: "transparent" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
              🖼️
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {label || "Selecionar imagem"}
            </span>
          </button>
        )}
        {hasValue && internalPreviewUrl && (
          <>
            <Image
              src={internalPreviewUrl}
              alt="preview"
              fill
              unoptimized
              style={{ objectFit: "cover" }}
              className="animate-in fade-in zoom-in-95 duration-500"
            />
            <button
              type="button"
              onClick={clearSelection}
              title="Remover imagem"
              aria-label="Remover imagem"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-400 transition-all duration-300 z-10"
            >
              ×
            </button>
          </>
        )}
      </div>

      {error && <p style={{ color: "#e11d48" }}>{error}</p>}

      {isEditorOpen && imageSrc && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: Math.max(520, viewportWidth),
              maxWidth: "95vw",
              background: "#0f172a",
              color: "white",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                width: "100%",
                height: Math.max(360, viewportHeight),
                position: "relative",
                background: "#111",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {aspectType === "fixed" ? (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={currentAspect}
                  cropShape={cropShape}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  showGrid={showGrid}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 group">
                  <ReactCrop
                    crop={ricCrop}
                    onChange={(c) => setRicCrop(c)}
                    onComplete={(c) => setCroppedAreaPixels(c)}
                    className="max-h-full"
                  >
                    <Image
                      ref={imgRef}
                      src={imageSrc}
                      alt="Crop"
                      onLoad={onImageLoad}
                      width={1000}
                      height={1000}
                      unoptimized
                      style={{
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                        maxHeight: `${Math.max(360, finalViewportHeight)}px`,
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </ReactCrop>
                </div>
              )}
              {instruction && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: "white",
                    textShadow: "0 1px 2px rgba(0,0,0,.6)",
                    fontSize: 12,
                  }}
                >
                  {instruction}
                </div>
              )}
            </div>
            {!allowFreeCrop && (
              <div style={{ display: "grid", gap: 8 }}>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}
                >
                  Controle de Proporção
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setAspectType("fixed")}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background:
                        aspectType === "fixed" ? "#3b82f6" : "#334155",
                      color: "white",
                      border: "1px solid",
                      borderColor:
                        aspectType === "fixed" ? "#60a5fa" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        aspectType === "fixed" ? "#2563eb" : "#475569")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        aspectType === "fixed" ? "#3b82f6" : "#334155")
                    }
                  >
                    Travado (
                    {output ? `${output.width}x${output.height}` : "Padrão"})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectType("free")}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: aspectType === "free" ? "#3b82f6" : "#334155",
                      color: "white",
                      border: "1px solid",
                      borderColor:
                        aspectType === "free" ? "#60a5fa" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        aspectType === "free" ? "#2563eb" : "#475569")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        aspectType === "free" ? "#3b82f6" : "#334155")
                    }
                  >
                    Livre (Ajustável)
                  </button>
                </div>
              </div>
            )}
            {allowFreeCrop && (
              <div style={{ display: "grid", gap: 8 }}>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}
                >
                  Modo de Edição
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#3b82f6",
                      color: "white",
                      border: "1px solid #60a5fa",
                      textAlign: "center",
                    }}
                  >
                    Corte Livre Ativo
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 13 }}>Zoom</span>
                <input
                  type="range"
                  min={minZoom}
                  max={maxZoom}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ cursor: "pointer" }}
                />
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 13 }}>Rotação</span>
                <input
                  type="range"
                  min={-45}
                  max={45}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  style={{ cursor: "pointer" }}
                />
              </label>
            </div>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "#334155",
                  color: "white",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "#0ea5e9",
                  color: "white",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropField;
