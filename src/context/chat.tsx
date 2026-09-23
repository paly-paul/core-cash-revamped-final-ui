'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Message } from '@/lib/types'

interface ChatContextType {
  messages: Record<string, Message[]>
  sendMessage: (pageKey: string, content: string) => void
  clearMessages: (pageKey: string) => void
}

const AGENT_RESPONSES: Record<string, string[]> = {
  default: [
    "I'm analyzing your treasury data. How can I assist?",
    "Based on current cash positions, your liquidity looks stable. Would you like a detailed breakdown?",
    "I can help you review forecast accuracy or run scenario analysis. What would you like to explore?",
  ],
}

let msgCounter = 0

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({})

  const sendMessage = useCallback((pageKey: string, content: string) => {
    const userMsg: Message = {
      id: `msg-${++msgCounter}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => ({
      ...prev,
      [pageKey]: [...(prev[pageKey] ?? []), userMsg],
    }))

    // Simulate agent response
    setTimeout(() => {
      const responses = AGENT_RESPONSES.default
      const agentMsg: Message = {
        id: `msg-${++msgCounter}`,
        role: 'agent',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => ({
        ...prev,
        [pageKey]: [...(prev[pageKey] ?? []), agentMsg],
      }))
    }, 800)
  }, [])

  const clearMessages = useCallback((pageKey: string) => {
    setMessages(prev => ({ ...prev, [pageKey]: [] }))
  }, [])

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat(pageKey: string) {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return {
    messages: ctx.messages[pageKey] ?? [],
    sendMessage: (content: string) => ctx.sendMessage(pageKey, content),
    clearMessages: () => ctx.clearMessages(pageKey),
  }
}
