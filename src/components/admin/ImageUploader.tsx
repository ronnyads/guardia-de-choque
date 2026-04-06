'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface Props {
  initialImages?: string[];
  name?: string;
}

interface ImageItem {
  id: string;
  url: string;
  uploading: boolean;
  error?: string;
}

export default function ImageUploader({ initialImages = [], name = 'images' }: Props) {
  const [images, setImages] = useState<ImageItem[]>(
    initialImages.map((url, i) => ({ id: `init-${i}`, url, uploading: false }))
  );
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro no upload');
    return data.url as string;
  };

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files);

    const newItems: ImageItem[] = fileArr.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      uploading: true,
    }));

    setImages(prev => [...prev, ...newItems]);

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      const item = newItems[i];
      try {
        const url = await uploadFile(file);
        setImages(prev => prev.map(img =>
          img.id === item.id ? { ...img, url, uploading: false } : img
        ));
      } catch (err) {
        const e = err as Error;
        setImages(prev => prev.map(img =>
          img.id === item.id ? { ...img, uploading: false, error: e.message } : img
        ));
      }
    }
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const finalUrls = images.filter(img => !img.uploading && !img.error).map(img => img.url);

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden input para submit do form */}
      <input type="hidden" name={name} value={JSON.stringify(finalUrls)} />

      {/* Grid de miniaturas */}
      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={img.id} className="relative w-20 h-20 rounded-lg border border-[#E2E8F0] overflow-hidden bg-[#F8FAFC] group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover" />

              {/* Spinner de upload */}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Erro */}
              {img.error && (
                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-1">
                  <p className="text-white text-[9px] text-center leading-tight">{img.error}</p>
                </div>
              )}

              {/* Botão remover */}
              {!img.uploading && (
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}

              {/* Badge "principal" */}
              {i === 0 && !img.uploading && (
                <div className="absolute bottom-0 inset-x-0 bg-[#0F172A]/70 text-white text-[9px] text-center py-0.5 font-medium">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Zona de upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          dragging
            ? 'border-[#0F172A] bg-[#F8FAFC]'
            : 'border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
        }`}
      >
        <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center">
          {dragging ? <Upload className="w-5 h-5 text-[#0F172A]" /> : <ImageIcon className="w-5 h-5 text-[#94A3B8]" />}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#0F172A]">Arraste ou clique para enviar</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">JPEG, PNG, WebP ou GIF — máx. 5MB por imagem</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => { if (e.target.files) addFiles(e.target.files); }}
      />

      <p className="text-xs text-[#94A3B8]">A primeira imagem será a principal. Você também pode colar uma URL abaixo.</p>
    </div>
  );
}
