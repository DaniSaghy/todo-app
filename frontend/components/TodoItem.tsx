'use client';

import { Edit2, Trash2, Check } from 'lucide-react';
import { Todo } from '@/app/page';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TodoItem({ todo, onEdit, onDelete, onToggle }: TodoItemProps) {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      todo.completed 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-gray-300 hover:border-gray-400'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {todo.completed && <Check size={12} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${
            todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-sm mt-1 ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            title="Edit todo"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Delete todo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
