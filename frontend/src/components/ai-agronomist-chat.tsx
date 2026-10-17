"use client";

import {
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Diagnosis } from "@/lib/api";
import {
  answerAgronomistQuestion,
  getDiseaseGuidance,
  type DiseaseGuidance,
} from "@/lib/disease-knowledge";

interface AiAgronomistChatProps {
  currentScan: Diagnosis | null;
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function AiAgronomistChat({
  currentScan,
  isOpen = true,
  onClose,
  isFloating = false,
}: AiAgronomistChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "initial-greeting",
      sender: "ai",
      text: currentScan
        ? `Hello! I'm **Verdant AI**, your 24/7 digital agronomist. 🌿\n\nI see your assessment for **${currentScan.prediction.crop}** with **${currentScan.prediction.disease}** (${Math.round(currentScan.prediction.confidence * 100)}% match).\n\nFeel free to tap any question below or ask me anything about organic remedies, chemical dosages, watering, or pruning!`
        : `Hello! I'm **Verdant AI**, your digital agronomist. 🌿\n\nUpload a leaf scan or ask me any question about crop health, organic pest control, soil care, or seasonal disease prevention.`,
      timestamp: "",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageSequenceRef = useRef(0);

  const guidance: DiseaseGuidance = currentScan
    ? getDiseaseGuidance(
        currentScan.prediction.crop,
        currentScan.prediction.disease,
        currentScan.prediction.is_healthy,
      )
    : getDiseaseGuidance("General", "Crop Advisory", false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (questionText?: string) => {
    const query = (questionText || inputText).trim();
    if (!query || isThinking) return;

    messageSequenceRef.current += 1;
    const userMessage: Message = {
      id: `user-${messageSequenceRef.current}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsThinking(true);

    // Simulate AI agronomist formulating plain-language advice
    setTimeout(() => {
      const answer = answerAgronomistQuestion(query, guidance);
      messageSequenceRef.current += 1;
      const aiMessage: Message = {
        id: `ai-${messageSequenceRef.current}`,
        sender: "ai",
        text: answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 650);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`ai-agronomist-container ${isFloating ? "floating-chat-container" : "embedded-chat-container"}`}
      id="ask-verdant-ai"
    >
      {/* Chat Header */}
      <div className="ai-chat-header">
        <div className="flex items-center gap-2.5">
          <div className="ai-avatar-icon">
            <Sparkles size={18} className="text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-base font-semibold text-emerald-950">
                🌱 Ask Verdant AI Agronomist
              </strong>
              <span className="ai-online-badge">Online</span>
            </div>
            <p className="text-xs text-emerald-800">
              Immediate, zero-jargon answers for your crops
            </p>
          </div>
        </div>

        {isFloating && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="chat-toggle-btn"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {onClose && (
              <button
                type="button"
                className="chat-toggle-btn"
                onClick={onClose}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Quick Questions Suggestion Chips */}
          <div className="quick-questions-strip">
            <span className="quick-label">⚡ Quick questions:</span>
            <div className="chips-scroll">
              {guidance.quickQuestions.map((chip, idx) => (
                <button
                  type="button"
                  key={idx}
                  className="quick-chip-btn"
                  onClick={() => handleSend(chip)}
                  disabled={isThinking}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
              >
                {msg.sender === "ai" && (
                  <div className="chat-avatar-mini ai-mini">🌱</div>
                )}
                <div
                  className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "ai-bubble"}`}
                >
                  <div className="chat-text-content whitespace-pre-line text-sm leading-relaxed">
                    {msg.text}
                  </div>
                  {msg.timestamp && (
                    <span className="chat-timestamp">{msg.timestamp}</span>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="chat-avatar-mini user-mini">🧑‍🌾</div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="chat-bubble-row ai-row">
                <div className="chat-avatar-mini ai-mini">🌱</div>
                <div className="chat-bubble ai-bubble flex items-center gap-2 py-3 px-4">
                  <LoaderCircle size={16} className="spin text-emerald-700" />
                  <span className="text-xs text-emerald-800">
                    Verdant AI is thinking…
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            className="ai-chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask about ${currentScan?.prediction.crop || "your crop"}, organic spray, watering...`}
              className="ai-text-input"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="ai-send-btn"
              title="Send question"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
