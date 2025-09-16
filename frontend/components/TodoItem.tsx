'use client';

import { Edit2, Trash2, Check } from 'lucide-react';
import { Todo } from '@/app/page';
import PriorityIcon from './PriorityIcon';

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
    <div className={`glass-effect rounded-lg p-3 transition-all duration-200 ${
      todo.completed 
        ? 'opacity-60' 
        : 'hover:shadow-agent hover:border-agent-orange'
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-agent-success border-agent-success text-white shadow-agent'
              : 'border-agent-gray-lighter hover:border-agent-orange hover:shadow-agent-orange'
          }`}
        >
          {todo.completed && <Check size={12} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium text-base ${
              todo.completed ? 'text-agent-text-muted line-through' : 'text-agent-text'
            }`}>
              {todo.title}
            </h3>
            <PriorityIcon priority={todo.priority} size={18} />
          </div>
          {todo.description && (
            <p className={`text-sm mt-1 ${
              todo.completed ? 'text-agent-text-muted line-through' : 'text-agent-text-secondary'
            }`}>
              {todo.description}
            </p>
          )}
          <div className="text-xs text-agent-text-muted mt-2 flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-agent-orange rounded-full"></div>
              Created: {new Date(todo.created_at).toLocaleDateString()}
            </span>
            {todo.updated_at && (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-agent-accent rounded-full"></div>
                Updated: {new Date(todo.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleEdit}
            className="p-2 text-agent-text-muted hover:text-agent-orange hover:bg-agent-gray-light rounded-md transition-all duration-200"
            title="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-agent-text-muted hover:text-agent-error hover:bg-agent-gray-light rounded-md transition-all duration-200"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
