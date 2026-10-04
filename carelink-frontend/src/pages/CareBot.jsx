import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bot, Send, User, Plus, Paperclip, X, Sparkles, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ChatMessageItem from '../components/carebot/ChatMessageItem';
import toast from 'react-hot-toast';

export default function CareBot() {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const initialPatientId = searchParams.get('patientId') || '';

  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am **CareBot**, CareLink's AI care workflow coordinator.\n\n` +
        `I assist with:\n` +
        `• Tracking stalled referrals and SLA transition delays\n` +
        `• Reconstructing patient handoff timelines across health facilities\n` +
        `• Finding facility beds and specialist availability in Madhya Pradesh\n\n` +
        `*Note: I do not offer clinical diagnoses or prescribe treatments.* How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState(initialPrompt);
  const [streaming, setStreaming] = useState(false);

  // Patient Context Selection
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  // Load patients list for context attachment
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients');
        if (res.data?.data) {
          setPatients(res.data.data);
          if (initialPatientId) {
            const found = res.data.data.find(p => p._id === initialPatientId);
            if (found) setSelectedPatient(found);
          }
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };
    fetchPatients();
  }, [initialPatientId]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || streaming) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setStreaming(true);

    const botMessagePlaceholder = {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/carebot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('carelink_token') || ''}`
        },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          patientId: selectedPatient?._id || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to CareBot streaming service');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.includes('[DONE]')) break;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.text) {
                accumulated += data.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: accumulated
                  };
                  return updated;
                });
              }
            } catch (e) {
              // chunk parse pass
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Unable to stream response at this time. Please verify backend connection and try again.'
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  const starterChips = [
    'Which referrals are currently overdue or at risk?',
    'Show pending urgent diagnostic lab results',
    'Summarize patient Suresh Kumar journey and referrals',
    'Is there an ICU bed and cardiologist available in Jabalpur?'
  ];

  return (
    <PageContainer className="h-[calc(100vh-6rem)] flex flex-col p-4 sm:p-6">
      <div className="flex-1 bg-bgCard border border-borderColor rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-borderColor bg-bgElevated/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-textPrimary">CareBot AI Coordinator</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-success bg-successDim px-2 py-0.5 rounded-full border border-success/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" /> Online
                </span>
              </div>
              <p className="text-[11px] text-textSecondary">Ground-truth evidence & SLA monitoring assistant</p>
            </div>
          </div>

          {/* Patient Context Tag Pill */}
          <div className="flex items-center gap-2">
            {selectedPatient ? (
              <div className="flex items-center gap-2 bg-accentTealDim border border-accentTeal/30 px-3 py-1 rounded-full text-xs text-accentTeal">
                <User className="w-3.5 h-3.5" />
                <span className="font-bold truncate max-w-[130px]">{selectedPatient.name}</span>
                <button onClick={() => setSelectedPatient(null)} className="hover:text-danger">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPatientModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bgElevated hover:border-accentTeal border border-borderColor text-xs text-textSecondary hover:text-textPrimary transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5 text-accentTeal" /> Attach Patient Context
              </button>
            )}

            <button
              onClick={() => {
                setSessionId(`session_${Date.now()}`);
                setMessages([
                  {
                    role: 'assistant',
                    content: 'Started new care coordination session. How can I assist you?',
                    timestamp: new Date()
                  }
                ]);
              }}
              className="p-2 rounded-lg bg-bgElevated hover:bg-bgElevated/80 border border-borderColor text-textSecondary hover:text-textPrimary"
              title="New Chat Session"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream View */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessageItem key={idx} message={msg} />
          ))}

          {streaming && (
            <div className="flex items-center gap-2 text-xs text-textSecondary italic animate-pulse">
              <Bot className="w-3.5 h-3.5 text-accentTeal" /> CareBot is analyzing referral timelines...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions Chips */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 border-t border-borderColor/60 flex flex-wrap gap-2 items-center bg-bgElevated/20">
            <span className="text-[10px] uppercase font-bold text-textSecondary flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accentTeal" /> Suggested:
            </span>
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-bgCard hover:bg-accentTealDim border border-borderColor hover:border-accentTeal/40 text-textSecondary hover:text-accentTeal transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input Form */}
        <div className="p-4 border-t border-borderColor bg-bgElevated/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              disabled={streaming}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask CareBot about referrals, care gaps, test follow-ups, or hospital status..."
              className="flex-1 bg-bgElevated border border-borderColor rounded-xl px-4 py-3 text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-accentTeal disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={streaming || !inputText.trim()}
              className="px-5 py-3 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Attach Patient Context Modal */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Select Patient for CareBot Context"
      >
        <div className="space-y-3 text-xs">
          <p className="text-textSecondary">
            When a patient is attached, CareBot retrieves their active referrals, medication list, and lab results into context.
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {patients.map(p => (
              <div
                key={p._id}
                onClick={() => {
                  setSelectedPatient(p);
                  setIsPatientModalOpen(false);
                  toast.success(`Context attached: ${p.name}`);
                }}
                className="p-3 rounded-lg border border-borderColor bg-bgElevated hover:border-accentTeal cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-textPrimary">{p.name}</span>
                  <span className="text-textSecondary font-mono">{p.abhaId}</span>
                </div>
                <p className="text-[11px] text-textSecondary mt-0.5">{p.conditions?.join(', ') || 'No conditions listed'}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
