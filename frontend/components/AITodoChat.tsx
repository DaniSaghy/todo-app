'use client';

import { useState } from 'react';
import { Bot, Send, X, Loader2, AlertCircle } from 'lucide-react';
import { TodoCreate } from '@/app/page';

interface AITodoChatProps {
  onSubmit: (data: TodoCreate) => void;
  onCancel: () => void;
}

interface AIResponse {
  success: boolean;
  title?: string;
  description?: string;
  fallback_used?: boolean;
  provider_used?: string;
  error?: string;
}

const API_BASE_URL = 'http://localhost:8000';

export default function AITodoChat({ onSubmit, onCancel }: AITodoChatProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);

  const examplePrompts = [
    "remind me to submit taxes next Monday at noon",
    "buy groceries for the weekend",
    "call mom this weekend",
    "schedule dentist appointment",
    "prepare presentation"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setLastResponse(null);

    try {
      const response = await fetch(`${API_BASE_URL}/todos/ai-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: input.trim() }),
      });

      const data: AIResponse = await response.json();

      if (response.ok && data.success) {
        setLastResponse(data);
        
        // Auto-submit the generated todo
        onSubmit({
          title: data.title!,
          description: data.description || undefined
        });
        
        // Reset form
        setInput('');
        setLastResponse(null);
      } else {
        setError(data.error || 'Failed to generate todo');
      }
    } catch (err) {
      console.error('Error generating todo:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Create with AI</h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Describe what you need to do in natural language.
      </p>

      {/* Example prompts */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your todo in natural language..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {lastResponse && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">AI Generated:</span>
              {lastResponse.fallback_used && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  Fallback
                </span>
              )}
            </div>
            <div className="text-sm text-green-700">
              <div className="font-medium">{lastResponse.title}</div>
              {lastResponse.description && (
                <div className="text-gray-600 mt-1">{lastResponse.description}</div>
              )}
            </div>
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Tip: Be specific about timing, context, or details for better results</p>
      </div>
    </div>
  );
}
