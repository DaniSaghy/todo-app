'use client';

import { useState } from 'react';
import { Bot, Send, X, Loader2, AlertCircle } from 'lucide-react';
import { TodoCreate } from '@/app/page';
import PriorityIcon from './PriorityIcon';

interface AITodoChatProps {
  onSubmit: (data: TodoCreate) => void;
  onCancel: () => void;
}

interface AIResponse {
  success: boolean;
  title?: string;
  description?: string;
  priority?: number;
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
    "urgent: fix the server issue immediately",
    "schedule team meeting for next week",
    "read a book before bed"
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
        
        // Auto-submit the generated todo with AI-determined priority
        onSubmit({
          title: data.title!,
          description: data.description || undefined,
          priority: data.priority || 0
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
    <div className="bg-agent-card-gradient border border-agent-gray-lighter rounded-xl p-4 mb-4 shadow-agent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-agent-orange-gradient rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-agent-text">AI Task Creator</h3>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-agent-text-muted hover:text-agent-text hover:bg-agent-gray-light rounded-lg transition-all duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-agent-text-secondary mb-3 text-sm">
        Describe what you need to do in natural language and let our AI agents create the perfect task for you.
      </p>

      {/* Example prompts */}
      <div className="mb-4">
        <p className="text-xs text-agent-text-secondary mb-2 font-medium">Try these examples:</p>
        <div className="flex flex-wrap gap-1">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-xs bg-agent-gray-light hover:bg-agent-gray-lighter text-agent-text-secondary hover:text-agent-text px-3 py-1 rounded-md transition-all duration-200 border border-agent-gray-lighter hover:border-agent-orange"
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
            placeholder="Describe your task in natural language..."
            className="w-full px-3 py-3 pr-12 bg-agent-gray-light border border-agent-gray-lighter rounded-lg text-agent-text placeholder-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-orange focus:border-transparent resize-none transition-all duration-200"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-agent-orange-gradient hover:shadow-agent-orange disabled:bg-agent-gray-lighter text-white rounded-md transition-all duration-200 shadow-agent"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-agent-error/10 border border-agent-error/20 rounded-lg">
            <AlertCircle size={16} className="text-agent-error" />
            <span className="text-sm text-agent-error font-medium">{error}</span>
          </div>
        )}

        {lastResponse && (
          <div className="p-3 bg-agent-success/10 border border-agent-success/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-agent-success rounded-md flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-agent-success">AI Generated Task:</span>
              {lastResponse.fallback_used && (
                <span className="text-xs bg-agent-warning/20 text-agent-warning px-2 py-0.5 rounded-full font-medium">
                  Fallback Mode
                </span>
              )}
            </div>
            <div className="text-sm text-agent-text">
              <div className="font-semibold text-agent-text mb-1">{lastResponse.title}</div>
              {lastResponse.description && (
                <div className="text-agent-text-secondary">{lastResponse.description}</div>
              )}
            </div>
          </div>
        )}
      </form>

      <div className="mt-4 p-3 bg-agent-gray-light rounded-lg border border-agent-gray-lighter">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 bg-agent-orange rounded-full"></div>
          <span className="text-sm font-semibold text-agent-text">Pro Tip</span>
        </div>
        <p className="text-xs text-agent-text-secondary">
          For better AI results, give specific timing, context, and details.
        </p>
      </div>
    </div>
  );
}
