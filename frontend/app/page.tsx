'use client';

import { useState, useEffect } from 'react';
import { Plus, Bot } from 'lucide-react';
import TodoItem from '@/components/TodoItem';
import TodoForm from '@/components/TodoForm';
import AITodoChat from '@/components/AITodoChat';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

const API_BASE_URL = 'http://localhost:8000';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

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

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Bot size={20} />
                Create with AI
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Todo
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
            <div className="mb-6">
              <TodoForm
                onSubmit={createTodo}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No todos yet. Add one to get started!
              </div>
            ) : (
              todos.map((todo) => (
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

          {editingTodo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
                <TodoForm
                  initialData={{
                    title: editingTodo.title,
                    description: editingTodo.description || '',
                  }}
                  onSubmit={(data) => updateTodo(editingTodo.id, data)}
                  onCancel={() => setEditingTodo(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
