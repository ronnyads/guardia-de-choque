'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote } from 'lucide-react';

interface Props {
  defaultValue?: string;
  name?: string;
  placeholder?: string;
}

export default function RichTextEditor({
  defaultValue = '',
  name = 'long_description',
  placeholder = 'Descrição completa exibida na página do produto...',
}: Props) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] px-4 py-3 text-sm text-[#0F172A] focus:outline-none prose prose-sm max-w-none',
      },
    },
  });

  const btnCls = (active: boolean) =>
    `p-1.5 rounded-lg transition-colors ${active ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'}`;

  if (!editor) return null;

  return (
    <div className="border border-[#CBD5E1] rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#0F172A]/20 focus-within:border-[#0F172A] transition-colors">
      {/* Hidden input sincronizado com o conteúdo do editor */}
      <input type="hidden" name={name} value={html} />

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] flex-wrap">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnCls(editor.isActive('bold'))} title="Negrito">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnCls(editor.isActive('italic'))} title="Itálico">
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#E2E8F0] mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnCls(editor.isActive('heading', { level: 2 }))} title="Título">
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnCls(editor.isActive('heading', { level: 3 }))} title="Subtítulo">
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#E2E8F0] mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnCls(editor.isActive('bulletList'))} title="Lista">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnCls(editor.isActive('orderedList'))} title="Lista numerada">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnCls(editor.isActive('blockquote'))} title="Citação">
          <Quote className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
