'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { chatApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { ChatMessage, ChatSession } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import {
  Send, Plus, Trash2, MessageSquare, Bot, User,
  Brain, Sparkles, ChevronDown, Menu, X
} from 'lucide-react';

const quickPrompts = [
  "Machine Learning nima?",
  "Prompt engineering qanday?",
  "Python list comprehension",
  "Groq API bilan chatbot yoz",
  "Neural network tushuntir",
  "AI career yo'li qanday?",
];

export default function ChatPage() {
  const { user, initFromStorage } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    initFromStorage();
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    }
  }, [initFromStorage, router]);

  useEffect(() => {
    if (user) {
      chatApi.getSessions().then(({ data }) => setSessions(data));
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectSession = async (session: ChatSession) => {
    setActiveSession(session);
    const { data } = await chatApi.getMessages(session.id);
    setMessages(data);
  };

  const createNewSession = async () => {
    const { data } = await chatApi.createSession();
    setSessions(prev => [data, ...prev]);
    setActiveSession(data);
    setMessages([]);
  };

  const deleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await chatApi.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
    toast.success("Suhbat o'chirildi");
  };

  const sendMessage = async (content?: string) => {
    const text = content || input.trim();
    if (!text || sending) return;

    let session = activeSession;
    if (!session) {
      const { data } = await chatApi.createSession();
      session = data;
      setSessions(prev => [data, ...prev]);
      setActiveSession(data);
    }

    const userMsg: ChatMessage = {
      id: Date.now(),
      session_id: session!.id,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const { data } = await chatApi.sendMessage(text, session!.id);
      setMessages(prev => [...prev, data]);
      // Update session title
      if (sessions.find(s => s.id === session!.id)?.title === 'Yangi suhbat') {
        setSessions(prev => prev.map(s =>
          s.id === session!.id ? { ...s, title: text.slice(0, 40) } : s
        ));
      }
    } catch {
      toast.error("Xato yuz berdi");
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16 h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0 border-r border-white/[0.06] bg-[#06060F]/50 backdrop-blur-xl flex flex-col`}>
          <div className="p-4 border-b border-white/[0.06]">
            <button
              onClick={createNewSession}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl btn-glow text-white text-sm font-medium"
            >
              <Plus size={16} />
              Yangi suhbat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-sm">
                <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                Suhbatlar yo'q
              </div>
            ) : (
              sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session)}
                  className={`w-full text-left p-3 rounded-xl transition-all group flex items-center gap-2 ${
                    activeSession?.id === session.id
                      ? 'bg-violet-600/20 border border-violet-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <MessageSquare size={14} className={activeSession?.id === session.id ? 'text-violet-400' : 'text-slate-600'} />
                  <span className="text-xs text-slate-300 truncate flex-1">{session.title}</span>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#06060F]/30 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showSidebar ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                  <Brain size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">AITeacher Mentor</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-500">Online • Llama 3.3 70B</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles size={12} className="text-violet-400" />
              <span className="text-xs text-violet-300 font-medium">Groq Powered</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mb-4 animate-float shadow-glow-purple">
                  <Brain size={28} className="text-white" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-2">AI Mentor bilan suhbat</h2>
                <p className="text-slate-400 mb-8 text-sm max-w-md">
                  AI, Machine Learning, Python yoki dasturlash haqida istalgan savolni bering.
                  Men 24/7 yordam berishga tayyorman!
                </p>

                {/* Quick prompts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl">
                  {quickPrompts.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-3 py-2.5 rounded-xl glass-card text-xs text-slate-400 hover:text-slate-200 hover:border-violet-500/30 transition-all text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white ml-auto rounded-tr-sm'
                        : 'glass-card rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose-space text-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              const isInline = !match;
                              return !isInline ? (
                                <SyntaxHighlighter
                                  style={atomDark as Record<string, React.CSSProperties>}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    margin: '0.5rem 0',
                                  }}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>{children}</code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <div className={`text-[10px] text-slate-600 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="flex gap-3 justify-start animate-slide-up">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-4 border-t border-white/[0.06] bg-[#06060F]/30 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3 glass-card rounded-2xl p-3 neon-border">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="AI haqida savol bering... (Enter - yuborish, Shift+Enter - yangi qator)"
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 resize-none outline-none leading-relaxed max-h-32"
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || sending}
                  className="flex-shrink-0 w-10 h-10 rounded-xl btn-glow flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={16} className="text-white" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-700 text-center mt-2">
                AI javoblari noto'g'ri bo'lishi mumkin. Muhim ma'lumotlarni tekshiring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
