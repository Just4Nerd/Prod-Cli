'use client';

// Import necessary hooks and extensions from Tiptap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import React, { useEffect } from 'react';

type Props = {
    content: string;
    onChange: (value: string) => void;
};

// This component is used to provide WYSIWYG input field using TipTap
export default function TiptapEditor({ content, onChange }: Props) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
        bulletList: false,
      }),
      Underline,
      BulletList,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content from parent when it changes externally
  useEffect(() => {
  if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content, false);
  }}, [content, editor]);

  // Prevent rendering until the editor is ready
  if (!editor) return null;

  return (
    <div className="space-y-2 border p-2 rounded">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('bold') ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('italic') ? 'btn-secondary' : 'btn-outline-secondary'} mx-1`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button type="button"
          className={`btn btn-sm ${editor.isActive('underline') ? 'btn-success' : 'btn-outline-success'} mx-1`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-warning' : 'btn-outline-warning'} mx-1`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
        <select
          className="form-select form-select-sm w-auto mx-1 d-inline"
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          defaultValue="default"
        >
          <option value="default">Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>

      <EditorContent editor={editor} className="min-h-[150px] border rounded p-2 bg-body" />
    </div>
  );
}
