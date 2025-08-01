import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import './QuillEditor.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

export default function QuillEditor({ 
  value, 
  onChange, 
  placeholder, 
  minHeight = 150, 
  maxHeight = 600 
}: QuillEditorProps) {
  const [height, setHeight] = useState(minHeight);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);

  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ],
    },
    placeholder: placeholder || 'Start typing...',
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        onChange(html);
      });
    }
  }, [quill, onChange]);

  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.root.innerHTML = value || '';
    }
  }, [value, quill]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = height;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - startY.current;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight.current + deltaY));
    setHeight(newHeight);
  }, [isResizing, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="quill-editor-container">
      <div 
        ref={quillRef} 
        style={{ height: `${height}px` }}
        className="quill-editor-content"
      />
      <div 
        ref={resizeRef}
        className="quill-resize-handle"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
} 