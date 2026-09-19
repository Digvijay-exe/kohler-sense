import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AiChatMessage, Facility, Zone } from '../../types';
import { sendCopilotChatMessage } from '../../services/aiReasoning';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Trash2,
  MessageSquare,
} from 'lucide-react';

interface Props {
  facility: Facility;
  selectedZone: Zone;
  activeLeaksCount: number;
  activeWastageLpm: number;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export const AiCopilotChat: React.FC<Props> = ({
  facility,
  selectedZone,
  activeLeaksCount,
  activeWastageLpm,
  isOpen,
  onClose,
  onOpen,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString(),
      text: `Hello! I am your KOHLER SENSE Facility Copilot. I have real-time visibility into high-frequency telemetry, leak detection pipelines, and hygiene demand scores across ${facility.name}. How can I assist your engineering or custodial operations today?`,
      source: 'gemini-2.5-flash',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const quickPrompts = [
    'Summarize current water wastage and active leaks',
    'Which restrooms require immediate custodial turnaround?',
    'What replacement parts are required for Stall 1 flushometer?',
    'Explain the Hygiene Demand Index (HDI) weighting formula',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const response = await sendCopilotChatMessage(text, {
      facility,
      selectedZone,
      activeLeaksCount,
      activeWastageLpm,
    });

    const botMsg: AiChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString(),
      text: response.reply,
      source: response.source as any,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && onOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-black dark:bg-[#c29b38] text-white dark:text-black shadow-2xl border border-zinc-700 dark:border-amber-400/50 flex items-center gap-2.5 font-bold text-xs cursor-pointer group"
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-[#c29b38] dark:text-black group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span>Ask Kohler Copilot</span>
            <span className="text-[10px] bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded-full font-mono">
              AI
            </span>
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[560px] transition-colors"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-black dark:bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-[#c29b38] flex items-center justify-center text-[#c29b38] dark:text-black border border-zinc-800 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                    KOHLER SENSE Copilot
                    <span className="text-[9px] bg-[#c29b38] text-black font-bold px-1.5 py-0.2 rounded-xs">
                      AI Powered
                    </span>
                  </h3>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {facility.name.split('(')[0]} • {selectedZone.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([messages[0]])}
                  className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Clear Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50 dark:bg-zinc-950/80 text-xs"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        isUser
                          ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black font-bold'
                          : 'bg-black dark:bg-[#c29b38] text-[#c29b38] dark:text-black'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`p-3 rounded-xl max-w-[82%] ${
                        isUser
                          ? 'bg-black dark:bg-[#c29b38] text-white dark:text-black rounded-tr-xs font-medium'
                          : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                      <div
                        className={`mt-1 text-[9px] flex items-center justify-between ${
                          isUser ? 'text-zinc-400 dark:text-black/70' : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.source && <span className="font-mono text-[9px]">Grounded ({msg.source})</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-zinc-400 text-xs pl-8"
                >
                  <div className="w-2 h-2 rounded-full bg-[#c29b38] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-[#c29b38] animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-[#c29b38] animate-pulse delay-150" />
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Querying facility telemetry...
                  </span>
                </motion.div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 bg-white dark:bg-[#111111] border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] whitespace-nowrap bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white dark:bg-[#111111] border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ask Kohler Sense AI about leaks, parts, hygiene..."
                className="flex-1 text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#c29b38] placeholder-zinc-400 dark:placeholder-zinc-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-lg bg-black dark:bg-[#c29b38] text-white dark:text-black hover:bg-zinc-850 dark:hover:bg-[#d4af37] disabled:opacity-40 transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
