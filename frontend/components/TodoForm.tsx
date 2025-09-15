'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { TodoCreate } from '@/app/page';

interface TodoFormProps {
  initialData?: {
    title: string;
    description: string;
  };
  onSubmit: (data: TodoCreate) => void;
  onCancel: () => void;
}

export default function TodoForm({ initialData, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-agent-text mb-1">
          Task Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-agent-gray-light border border-agent-gray-lighter rounded-lg text-agent-text placeholder-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-orange focus:border-transparent transition-all duration-200"
          placeholder="Enter task title..."
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-agent-text mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-agent-gray-light border border-agent-gray-lighter rounded-lg text-agent-text placeholder-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-orange focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Enter description (optional)..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-agent-orange-gradient hover:shadow-agent-orange text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-agent"
        >
          <Check size={16} />
          Save Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-agent-gray-light hover:bg-agent-gray-lighter text-agent-text px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 border border-agent-gray-lighter"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
}
