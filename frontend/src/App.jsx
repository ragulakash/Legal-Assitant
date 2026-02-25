import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  FileText,
  Search,
  Gavel,
  Settings,
  Send,
  User,
  Bot,
  PlusCircle,
  Clock,
  ChevronRight,
  Sparkles,
  BookOpen,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function App() {
  const [view, setView] = useState('chat');
  const [messages, setMessages] = useState([
    { id: 1, text: "# Welcome to Legal Assistant AI\n\nI am your intelligent partner for legal research and drafting. How may I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('summary');
  const [draftFacts, setDraftFacts] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() && view === 'chat') return;

    const payload = {
      text: view === 'chat' ? input : draftFacts,
      template: view === 'drafting' ? selectedTemplate : null
    };

    if (view === 'chat') {
      const userMessage = { id: Date.now(), text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }

    setLoading(true);

    try {
      const endpoint = view === 'chat' ? 'http://localhost:8000/query' : 'http://localhost:8000/draft';
      const response = await axios.post(endpoint, payload);

      const botMessage = {
        id: Date.now(),
        text: response.data.answer,
        sender: 'bot',
        citations: response.data.citations,
        isDraft: view === 'drafting'
      };

      setMessages(prev => [...prev, botMessage]);
      if (view === 'drafting') setView('chat');

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now(),
        text: "## Connectivity Error\n\nI'm having trouble reaching the Legal Intelligence Server. Please ensure the backend is running and the API key is valid.",
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Gavel size={28} />
          Legal Assistant
        </div>

        <nav className="nav-links">
          <div
            className={`nav-item ${view === 'chat' ? 'active' : ''}`}
            onClick={() => setView('chat')}
          >
            <MessageSquare size={20} />
            <span>AI Consultant</span>
          </div>
          <div
            className={`nav-item ${view === 'drafting' ? 'active' : ''}`}
            onClick={() => setView('drafting')}
          >
            <FileText size={20} />
            <span>Drafting Hub</span>
          </div>
          <div className="nav-item">
            <Search size={20} />
            <span>Case Search</span>
          </div>
          <div className="nav-item">
            <Clock size={20} />
            <span>Recent Audits</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item">
            <PlusCircle size={20} />
            <span>New Session</span>
          </div>
          <div className="nav-item">
            <Settings size={20} />
            <span>Configuration</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Workspace</span>
            <ChevronRight size={14} color="var(--text-secondary)" />
            <span style={{ fontWeight: '600' }}>
              {view === 'chat' ? 'General Research' : 'Document Synthesis'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="glass" style={{ padding: '6px 14px', borderRadius: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
              <Sparkles size={16} />
              <span style={{ fontWeight: 600 }}>Gemini 1.5 Intelligence</span>
            </div>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(45deg, var(--bg-tertiary), var(--bg-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <User size={20} color="var(--text-primary)" />
            </div>
          </div>
        </header>

        <section className="content-area">
          {view === 'chat' ? (
            <div className="chat-container">
              <div className="messages">
                {messages.map((m) => (
                  <div key={m.id} className={`message ${m.sender} fade-in shadow-premium`}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: m.sender === 'bot' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {m.sender === 'bot' ? <Bot size={18} color="var(--accent-primary)" /> : <User size={18} />}
                      </div>
                      <div className="markdown-content" style={{ flex: 1 }}>
                        <ReactMarkdown>{m.text}</ReactMarkdown>

                        {m.citations && m.citations.length > 0 && (
                          <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border-color)'
                          }}>
                            <p style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--accent-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <BookOpen size={14} /> Legal Precedents & Sources
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {m.citations.map((c, i) => (
                                <span key={i} className="glass" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px' }}>
                                  {c.source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', opacity: 0.6 }}>
                          <button
                            className="nav-item"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleCopy(m.text, m.id)}
                          >
                            {copiedId === m.id ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          {m.isDraft && (
                            <button className="nav-item" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                              <Download size={14} />
                              <span>Export PDF</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message bot fade-in glass">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <Bot size={18} color="var(--accent-primary)" />
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Synthesizing Legal Logic...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSend}>
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask a legal question or request research..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                  />
                  <button type="submit" className="send-button" disabled={loading || !input.trim()}>
                    <Send size={18} />
                    <span>Inquire</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="drafting-container fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <FileText size={32} color="var(--accent-primary)" />
                  </div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Legal Draftsman</h1>
                  <p style={{ color: 'var(--text-secondary)' }}>Select a professional template and provide case details</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Available Templates</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {['summary', 'petition', 'notice'].map(t => (
                      <div
                        key={t}
                        className={`template-card ${selectedTemplate === t ? 'active' : ''}`}
                        onClick={() => setSelectedTemplate(t)}
                      >
                        <div style={{ fontWeight: '700', marginBottom: '4px' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                          {t === 'summary' && 'Case Breakdown'}
                          {t === 'petition' && 'Court Filing'}
                          {t === 'notice' && 'Legal Notice'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Case Facts & Instructions</label>
                  <textarea
                    style={{
                      width: '100%',
                      height: '220px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '1rem',
                      color: 'white',
                      padding: '1.25rem',
                      outline: 'none',
                      resize: 'none',
                      fontSize: '0.95rem',
                      transition: 'var(--transition-smooth)'
                    }}
                    placeholder="Describe the legal situation, parties involved, and specific demands..."
                    value={draftFacts}
                    onChange={(e) => setDraftFacts(e.target.value)}
                  />
                </div>

                <button
                  className="send-button"
                  style={{ width: '100%', padding: '1.25rem', justifyContent: 'center', fontSize: '1.1rem' }}
                  onClick={() => handleSend()}
                  disabled={loading || !draftFacts.trim()}
                >
                  {loading ? (
                    <>
                      <div className="typing-indicator" style={{ marginRight: '12px' }}>
                        <span style={{ background: '#0f172a' }}></span><span style={{ background: '#0f172a' }}></span>
                      </div>
                      Generating Draft...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} style={{ marginRight: '8px' }} />
                      Synthesize Legal Document
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
