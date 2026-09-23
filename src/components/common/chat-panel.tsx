'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '@/context/chat'
import type { PageKey } from '@/lib/constants'

interface ChatPanelProps {
  pageKey: PageKey
}

export function ChatPanel({ pageKey }: ChatPanelProps) {
  const { messages, sendMessage } = useChat(pageKey)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const content = input.trim()
    if (!content) return
    setInput('')
    sendMessage(content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="bg-[var(--sur)] border-l border-[var(--b0)] flex flex-col overflow-hidden min-h-0">
      {/* Header */}
      <div className="px-4 py-[13px] border-b border-[var(--b0)] flex items-center gap-[9px] bg-[var(--elv)]">
        <div className="w-2 h-2 rounded-full bg-[var(--green)] flex-shrink-0 pulse-dot" />
        <span className="text-[12px] font-bold tracking-[0.04em] uppercase text-[var(--t2)]">Data Agent</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="px-2 py-0.5 rounded-[10px] text-[10px] font-bold bg-[var(--blue-lt)] text-[var(--blue)] border border-[var(--blue-bd)]">
            AI
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-[14px] bg-[var(--bg)]">
        {messages.length === 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex flex-col items-start gap-1">
              <div className="px-[13px] py-[9px] rounded-[var(--rmd)] rounded-bl-[2px] bg-[var(--sur)] border border-[var(--b0)] text-[var(--t1)] text-[12.5px] leading-[1.65] max-w-[92%] shadow-[var(--shc)]">
                Hello! I&apos;m your Data Agent. I can help you analyze cash positions, forecast trends, and answer treasury questions.
              </div>
              <span className="text-[10px] text-[var(--tm)] font-[var(--mono)] px-0.5">
                {formatTime(new Date().toISOString())}
              </span>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${msg.role === 'agent' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={
                msg.role === 'agent'
                  ? 'px-[13px] py-[9px] rounded-[var(--rmd)] rounded-bl-[2px] bg-[var(--sur)] border border-[var(--b0)] text-[var(--t1)] text-[12.5px] leading-[1.65] max-w-[92%] shadow-[var(--shc)]'
                  : 'px-[13px] py-[9px] rounded-[var(--rmd)] rounded-br-[2px] bg-[var(--blue)] text-white text-[12.5px] leading-[1.65] max-w-[92%]'
              }
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-[var(--tm)] font-[var(--mono)] px-0.5">
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-[14px] py-3 border-t border-[var(--b0)] flex flex-col gap-2 bg-[var(--sur)]">
        <div className="flex gap-[7px] items-end">
          <textarea
            className="flex-1 bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rmd)] px-3 py-2 text-[var(--t1)] font-[var(--ui)] text-[12.5px] resize-none outline-none min-h-[36px] max-h-[80px] placeholder:text-[var(--tm)] focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(0,87,217,0.1)]"
            placeholder="Ask about your cash position..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            onClick={handleSend}
            className="w-[34px] h-[34px] bg-[var(--blue)] border-none rounded-[var(--rsm)] text-white cursor-pointer flex items-center justify-center text-sm flex-shrink-0 hover:bg-[#004BBD]"
          >
            ↑
          </button>
        </div>
        <p className="text-[10px] text-[var(--tm)] text-center">
          AI-generated responses. Always verify with your team.
        </p>
      </div>
    </div>
  )
}
