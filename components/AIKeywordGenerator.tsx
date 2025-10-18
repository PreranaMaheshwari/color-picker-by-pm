"use client"

import { useState } from "react"
import { Lightbulb, Sparkles, Copy, Check } from "lucide-react"

interface AIKeywordGeneratorProps {
  onKeywordSelect: (keyword: string) => void
}

export default function AIKeywordGenerator({ onKeywordSelect }: AIKeywordGeneratorProps) {
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateKeywords = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    const keywordCategories = [
      // Industries
      ["Technology", "Healthcare", "Finance", "Education", "E-commerce"],
      ["Fashion", "Food & Beverage", "Travel", "Real Estate", "Automotive"],
      ["Entertainment", "Sports", "Beauty", "Home & Garden", "Pet Care"],
      
      // Moods & Emotions
      ["Energetic", "Calm", "Professional", "Playful", "Sophisticated"],
      ["Warm", "Cool", "Vibrant", "Minimalist", "Bold"],
      ["Romantic", "Adventurous", "Trustworthy", "Creative", "Luxurious"],
      
      // Themes & Concepts
      ["Nature", "Urban", "Vintage", "Modern", "Futuristic"],
      ["Ocean", "Forest", "Sunset", "Night", "Spring"],
      ["Corporate", "Startup", "Artistic", "Scientific", "Cultural"],
      
      // Brand Personalities
      ["Innovative", "Reliable", "Friendly", "Premium", "Accessible"],
      ["Bold", "Elegant", "Dynamic", "Stable", "Inspiring"],
      ["Youthful", "Mature", "Exclusive", "Inclusive", "Trendy"]
    ]
    
    const randomCategory = keywordCategories[Math.floor(Math.random() * keywordCategories.length)]
    const shuffledKeywords = [...randomCategory].sort(() => Math.random() - 0.5)
    const selectedKeywords = shuffledKeywords.slice(0, 5)
    
    setGeneratedKeywords(selectedKeywords)
    setIsGenerating(false)
  }

  const handleKeywordClick = (keyword: string) => {
    onKeywordSelect(keyword)
  }

  const handleCopyKeyword = (keyword: string, index: number) => {
    navigator.clipboard.writeText(keyword)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span>AI Keyword Generator</span>
        </h4>
        <button
          onClick={generateKeywords}
          disabled={isGenerating}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>{isGenerating ? "Generating..." : "Generate Ideas"}</span>
        </button>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      )}

      {generatedKeywords.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Click any keyword to get color suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {generatedKeywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-gray-50 rounded-lg px-2 py-1 group"
              >
                <button
                  onClick={() => handleKeywordClick(keyword)}
                  className="text-sm text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {keyword}
                </button>
                <button
                  onClick={() => handleCopyKeyword(keyword, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isGenerating && generatedKeywords.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Click "Generate Ideas" to get AI-suggested keywords for color inspiration
          </p>
        </div>
      )}
    </div>
  )
}
