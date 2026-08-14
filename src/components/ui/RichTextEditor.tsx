import { useMemo } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Sementara menggunakan textarea native karena react-quill tidak kompatibel dengan React 19
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Tulis isi konten di sini... (Mode Editor Teks Sedang Diperbaiki)'}
        className="w-full min-h-[300px] p-4 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
      />
      <div className="p-2 bg-yellow-50 text-yellow-700 text-xs text-center border-t border-slate-200 font-medium">
        Catatan: Tombol format teks (Tebal, Miring, dll) sedang dinonaktifkan sementara untuk perbaikan sistem.
      </div>
    </div>
  );
}
