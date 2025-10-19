"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Lightbulb } from "lucide-react"
import { ColorSuggestionEngine, ColorSuggestion } from "../lib/colorSuggestionEngine"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  colors?: string[]
  suggestions?: ColorSuggestion[]
  timestamp: Date
}

interface ChromaBotProps {
  onColorSelect: (colors: string[]) => void
}

export default function ChromaBot({ onColorSelect }: ChromaBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm ChromaBot, your color inspiration assistant. Tell me about your project, industry, or mood, and I'll suggest colors that bring your ideas to life!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateColorsFromKeyword = async (keyword: string): Promise<ColorSuggestion[]> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const suggestions = ColorSuggestionEngine.generateSuggestions(keyword)
    return suggestions
  }


  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const suggestions = await generateColorsFromKeyword(input.trim())
      const primarySuggestion = suggestions[0] // Use the highest confidence suggestion
      
      const colorCount = primarySuggestion.colorCount || primarySuggestion.colors.length
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `Here are ${colorCount} colors that resonate with "${input.trim()}":`,
        colors: primarySuggestion.colors,
        suggestions: suggestions,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Sorry, I couldn't generate colors for that keyword. Try something else!",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleColorClick = (color: string) => {
    onColorSelect([color])
  }

  const handleApplyAllColors = (colors: string[]) => {
    onColorSelect(colors)
  }

  return (
    <div className="flex flex-col h-96 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <Bot className="w-5 h-5" />
        <h3 className="font-semibold">ChromaBot</h3>
        <Sparkles className="w-4 h-4 ml-auto" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === "bot" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {message.type === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  
                  {message.colors && message.colors.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {/* Primary Color Palette */}
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {message.colors.map((color, index) => (
                            <button
                              key={index}
                              onClick={() => handleColorClick(color)}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => handleApplyAllColors(message.colors!)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          Apply All Colors
                        </button>
                      </div>

                      {/* Show reasoning if available */}
                      {message.suggestions && message.suggestions[0] && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border">
                          <div className="flex items-center space-x-1 mb-2">
                            <Lightbulb className="w-3 h-3" />
                            <span className="font-medium">{message.suggestions[0].category}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              {Math.round(message.suggestions[0].confidence * 100)}% confidence
                            </span>
                            {message.suggestions[0].colorCount && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">
                                  {message.suggestions[0].colorCount} colors
                                </span>
                              </>
                            )}
                          </div>
                          <p className="mb-1">{message.suggestions[0].reasoning}</p>
                          {message.suggestions[0].context && (
                            <p className="text-gray-500 italic">
                              Context: {message.suggestions[0].context.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Alternative Suggestions */}
                      {message.suggestions && message.suggestions.length > 1 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-600">Alternative suggestions:</p>
                          {message.suggestions.slice(1).map((suggestion, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  {suggestion.colors.slice(0, 3).map((color, colorIndex) => (
                                    <div
                                      key={colorIndex}
                                      className="w-4 h-4 rounded-full border border-white"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">{suggestion.category}</span>
                              </div>
                              <button
                                onClick={() => handleApplyAllColors(suggestion.colors)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Use
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your project, industry, or mood..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
