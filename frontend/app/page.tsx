'use client';

import { useState, useEffect } from 'react';
import { Plus, Bot, X, ArrowUpDown } from 'lucide-react';
import TodoItem from '@/components/TodoItem';
import TodoForm from '@/components/TodoForm';
import AITodoChat from '@/components/AITodoChat';
import PriorityIcon from '@/components/PriorityIcon';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at?: string;
  priority: number; // 0=low, 1=medium, 2=high
}

export interface TodoCreate {
  title: string;
  description?: string;
  priority?: number;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [sortByPriority, setSortByPriority] = useState(false);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (todoData: TodoCreate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([newTodo, ...todos]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Update todo
  const updateTodo = async (id: number, todoData: TodoUpdate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
        setEditingTodo(null);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  };

  // Filter and sort todos
  const filteredAndSortedTodos = todos
    .filter(todo => selectedPriority === null || todo.priority === selectedPriority)
    .sort((a, b) => {
      if (sortByPriority) {
        // Sort by priority (high to low), then by creation date (newest first)
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        // Default: newest first
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-agent-gradient">
        <div className="text-agent-text text-xl font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agent-gradient py-4">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gradient mb-1">Agent Todo</h1>
          <p className="text-agent-text-secondary text-sm">AI-Powered Task Management</p>
        </div>

        {/* Main Card */}
        <div className="bg-agent-card-gradient rounded-xl shadow-agent-lg p-4 border border-agent-gray-lighter">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-agent-text mb-0">Your Tasks</h2>
              <p className="text-agent-text-muted text-sm">Manage your productivity with AI assistance</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-agent-orange-gradient hover:shadow-agent-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-agent"
              >
                <Bot size={16} />
                Create with AI
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-agent-gray-light hover:bg-agent-gray-lighter text-agent-text px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 border border-agent-gray-lighter"
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>
          </div>

          {showAIChat && (
            <AITodoChat
              onSubmit={createTodo}
              onCancel={() => setShowAIChat(false)}
            />
          )}

          {showForm && (
            <div className="mb-4">
              <div className="bg-agent-card-gradient border border-agent-gray-lighter rounded-xl p-4 shadow-agent">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-agent-gray-light rounded-lg flex items-center justify-center border border-agent-gray-lighter">
                      <Plus className="h-5 w-5 text-agent-text" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-agent-text">Create New Task</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 text-agent-text-muted hover:text-agent-text hover:bg-agent-gray-light rounded-lg transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                <TodoForm
                  onSubmit={createTodo}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          {/* Filter and Sort Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-agent-gray-light rounded-lg border border-agent-gray-lighter">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-agent-text-secondary">Filter by priority:</span>
              <div className="flex gap-1">
                  {[
                    { value: 0, label: 'Low', hoverColor: 'hover:bg-blue-600', selectedColor: 'bg-blue-500' },
                    { value: 1, label: 'Medium', hoverColor: 'hover:bg-yellow-600', selectedColor: 'bg-yellow-500' },
                    { value: 2, label: 'High', hoverColor: 'hover:bg-red-600', selectedColor: 'bg-red-500' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedPriority(selectedPriority === option.value ? null : option.value)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-all duration-200 ${
                        selectedPriority === option.value
                          ? `border-agent-orange ${option.selectedColor}`
                          : `border-agent-gray-lighter bg-agent-gray-light hover:border-agent-gray-lighter ${option.hoverColor}`
                      }`}
                  >
                    <PriorityIcon priority={option.value} size={12} />
                    <span className="text-agent-text">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setSortByPriority(!sortByPriority)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                sortByPriority
                  ? 'border-agent-orange bg-agent-orange/10 text-agent-orange'
                  : 'border-agent-gray-lighter bg-agent-gray-light hover:border-agent-gray-lighter text-agent-text-secondary hover:text-agent-text'
              }`}
            >
              <ArrowUpDown size={14} />
              <span className="text-xs font-medium">Sort by Priority</span>
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredAndSortedTodos.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-agent-gray-light rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-agent-text-muted" />
                </div>
                <h3 className="text-agent-text-secondary text-base font-medium mb-1">
                  {todos.length === 0 ? 'No tasks yet' : 'No tasks match your filter'}
                </h3>
                <p className="text-agent-text-muted text-sm">
                  {todos.length === 0 ? 'Create your first task to get started!' : 'Try adjusting your priority filter'}
                </p>
              </div>
            ) : (
              filteredAndSortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={setEditingTodo}
                  onDelete={deleteTodo}
                  onToggle={toggleTodo}
                />
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-agent-card-gradient rounded-xl p-6 w-full max-w-md shadow-agent-lg border border-agent-gray-lighter">
              <h2 className="text-xl font-semibold text-agent-text mb-4">Edit Task</h2>
              <TodoForm
                initialData={{
                  title: editingTodo.title,
                  description: editingTodo.description || '',
                  priority: editingTodo.priority,
                }}
                onSubmit={(data) => updateTodo(editingTodo.id, data)}
                onCancel={() => setEditingTodo(null)}
              />
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-agent-text-muted text-sm">
            <div className="w-2 h-2 bg-agent-orange rounded-full"></div>
            <span>Powered by AI Agents</span>
            <div className="w-2 h-2 bg-agent-accent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
