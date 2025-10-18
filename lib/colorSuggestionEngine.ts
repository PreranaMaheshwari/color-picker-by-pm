export interface ColorSuggestion {
  colors: string[]
  reasoning: string
  category: string
  confidence: number
}

export class ColorSuggestionEngine {
  private static industryMappings: Record<string, ColorSuggestion> = {
    technology: {
      colors: ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#F59E0B"],
      reasoning: "Tech companies often use blues for trust, purples for innovation, and accent colors for energy",
      category: "Industry",
      confidence: 0.95
    },
    healthcare: {
      colors: ["#059669", "#0EA5E9", "#F8FAFC", "#DC2626", "#7C2D12"],
      reasoning: "Healthcare uses greens for growth/healing, blues for trust, and reds for urgency/importance",
      category: "Industry",
      confidence: 0.92
    },
    finance: {
      colors: ["#1F2937", "#059669", "#F59E0B", "#DC2626", "#6B7280"],
      reasoning: "Financial services favor dark colors for stability, green for money/growth, and gold for premium",
      category: "Industry",
      confidence: 0.90
    },
    food: {
      colors: ["#DC2626", "#F59E0B", "#059669", "#7C2D12", "#F97316"],
      reasoning: "Food industry uses warm colors like reds and oranges to stimulate appetite and convey energy",
      category: "Industry",
      confidence: 0.88
    },
    fashion: {
      colors: ["#EC4899", "#7C3AED", "#F59E0B", "#DC2626", "#059669"],
      reasoning: "Fashion brands often use vibrant, trend-forward colors that evoke emotion and style",
      category: "Industry",
      confidence: 0.85
    }
  }

  private static moodMappings: Record<string, ColorSuggestion> = {
    energetic: {
      colors: ["#DC2626", "#F59E0B", "#7C3AED", "#059669", "#F97316"],
      reasoning: "Energetic moods benefit from warm, vibrant colors that convey movement and excitement",
      category: "Mood",
      confidence: 0.90
    },
    calm: {
      colors: ["#0EA5E9", "#7C3AED", "#059669", "#6B7280", "#F8FAFC"],
      reasoning: "Calm moods work well with cool, muted tones that promote relaxation and peace",
      category: "Mood",
      confidence: 0.88
    },
    professional: {
      colors: ["#1F2937", "#6B7280", "#059669", "#DC2626", "#F59E0B"],
      reasoning: "Professional settings use sophisticated, muted colors that convey competence and reliability",
      category: "Mood",
      confidence: 0.92
    },
    romantic: {
      colors: ["#EC4899", "#7C3AED", "#DC2626", "#F59E0B", "#F97316"],
      reasoning: "Romantic themes use warm, passionate colors like pinks, purples, and deep reds",
      category: "Mood",
      confidence: 0.85
    },
    luxury: {
      colors: ["#1F2937", "#7C3AED", "#F59E0B", "#DC2626", "#6B7280"],
      reasoning: "Luxury brands use rich, sophisticated colors that convey exclusivity and premium quality",
      category: "Mood",
      confidence: 0.90
    }
  }

  private static themeMappings: Record<string, ColorSuggestion> = {
    nature: {
      colors: ["#059669", "#16A34A", "#84CC16", "#F59E0B", "#7C2D12"],
      reasoning: "Nature themes use earth tones, greens, and organic colors that connect with the environment",
      category: "Theme",
      confidence: 0.95
    },
    ocean: {
      colors: ["#0EA5E9", "#0891B2", "#06B6D4", "#F8FAFC", "#1E40AF"],
      reasoning: "Ocean themes use various shades of blue and white to evoke water, depth, and tranquility",
      category: "Theme",
      confidence: 0.93
    },
    sunset: {
      colors: ["#F59E0B", "#DC2626", "#EC4899", "#7C3AED", "#F97316"],
      reasoning: "Sunset themes use warm, gradient colors that capture the beauty of golden hour",
      category: "Theme",
      confidence: 0.90
    },
    urban: {
      colors: ["#1F2937", "#6B7280", "#9CA3AF", "#DC2626", "#F59E0B"],
      reasoning: "Urban themes use grays, blacks, and accent colors that reflect city life and modernity",
      category: "Theme",
      confidence: 0.85
    },
    vintage: {
      colors: ["#7C2D12", "#DC2626", "#F59E0B", "#059669", "#1F2937"],
      reasoning: "Vintage themes use muted, aged colors that evoke nostalgia and classic aesthetics",
      category: "Theme",
      confidence: 0.88
    }
  }

  static generateSuggestions(keyword: string): ColorSuggestion[] {
    const suggestions: ColorSuggestion[] = []
    const lowerKeyword = keyword.toLowerCase()

    // Check industry mappings
    for (const [key, suggestion] of Object.entries(this.industryMappings)) {
      if (lowerKeyword.includes(key)) {
        suggestions.push(suggestion)
      }
    }

    // Check mood mappings
    for (const [key, suggestion] of Object.entries(this.moodMappings)) {
      if (lowerKeyword.includes(key)) {
        suggestions.push(suggestion)
      }
    }

    // Check theme mappings
    for (const [key, suggestion] of Object.entries(this.themeMappings)) {
      if (lowerKeyword.includes(key)) {
        suggestions.push(suggestion)
      }
    }

    // If no specific matches, generate contextual suggestions
    if (suggestions.length === 0) {
      suggestions.push(this.generateContextualSuggestion(keyword))
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }

  private static generateContextualSuggestion(keyword: string): ColorSuggestion {
    // Analyze keyword characteristics
    const wordLength = keyword.length
    const hasNumbers = /\d/.test(keyword)
    const isPlural = keyword.endsWith('s')
    
    // Generate colors based on keyword characteristics
    const colors = this.generateColorsFromCharacteristics(keyword, wordLength, hasNumbers, isPlural)
    
    return {
      colors,
      reasoning: `Generated colors based on the characteristics of "${keyword}" - length, complexity, and linguistic patterns`,
      category: "Contextual",
      confidence: 0.70
    }
  }

  private static generateColorsFromCharacteristics(
    keyword: string, 
    length: number, 
    hasNumbers: boolean, 
    isPlural: boolean
  ): string[] {
    const colors: string[] = []
    
    // Base hue from keyword hash
    let hash = 0
    for (let i = 0; i < keyword.length; i++) {
      hash = keyword.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const baseHue = Math.abs(hash) % 360
    
    // Adjust saturation and lightness based on characteristics
    let baseSaturation = 60
    let baseLightness = 50
    
    if (length > 8) {
      baseSaturation += 20 // Longer words get more vibrant colors
    }
    
    if (hasNumbers) {
      baseLightness -= 10 // Words with numbers get darker colors
    }
    
    if (isPlural) {
      baseSaturation -= 10 // Plural words get slightly muted colors
    }
    
    // Generate 5 colors with variations
    for (let i = 0; i < 5; i++) {
      const hue = (baseHue + i * 72) % 360
      const saturation = Math.max(20, Math.min(100, baseSaturation + (i - 2) * 10))
      const lightness = Math.max(20, Math.min(80, baseLightness + (i - 2) * 5))
      
      colors.push(this.hslToHex(hue, saturation, lightness))
    }
    
    return colors
  }

  private static hslToHex(h: number, s: number, l: number): string {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Method to integrate with external AI services
  static async generateAISuggestions(keyword: string, apiKey?: string): Promise<ColorSuggestion[]> {
    // This would integrate with services like OpenAI, Claude, or custom AI models
    // For now, we'll use the local engine as a fallback
    
    if (!apiKey) {
      return this.generateSuggestions(keyword)
    }

    try {
      // Example integration with OpenAI (commented out for now)
      /*
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Generate 5 hex color codes that would work well for a brand or project related to "${keyword}". Consider color psychology, industry standards, and visual appeal. Return only the hex codes separated by commas.`
          }],
          max_tokens: 100,
          temperature: 0.7
        })
      })

      const data = await response.json()
      const aiColors = data.choices[0].message.content.split(',').map((c: string) => c.trim())
      
      return [{
        colors: aiColors,
        reasoning: `AI-generated colors based on analysis of "${keyword}"`,
        category: "AI Generated",
        confidence: 0.95
      }]
      */
      
      // Fallback to local engine
      return this.generateSuggestions(keyword)
    } catch (error) {
      console.error('AI service error:', error)
      return this.generateSuggestions(keyword)
    }
  }
}
