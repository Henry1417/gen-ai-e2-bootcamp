import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';
import { ReportEntry } from '../types';

interface ChatBotProps {
  currentReports: ReportEntry[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ currentReports }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hola. Soy tu auditor virtual. Puedo revisar el estatus de tus reportes. Por ejemplo: "¿Qué reportes tienen error?" o "¿Qué falta de Riesgos?"'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Call Service
    const responseText = await sendMessageToAI(userText, currentReports);

    setIsLoading(false);
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', text: responseText }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`
          pointer-events-auto bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none h-0'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm">Auditor Virtual AI</h3>
              <p className="text-xs text-indigo-100 opacity-90">Powered by Llama 3 (Groq)</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                  ${msg.role === 'user' ? 'bg-gray-200 dark:bg-slate-700' : 'bg-indigo-100 dark:bg-indigo-900/50'}
                `}
              >
                {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              </div>
              
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-none'}
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                 <span className="text-xs text-gray-500 dark:text-gray-400">Analizando reportes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            className="flex-1 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-transparent"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-full transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          pointer-events-auto p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center
          ${isOpen ? 'bg-gray-500 hover:bg-gray-600 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-110'}
          text-white
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatBot;