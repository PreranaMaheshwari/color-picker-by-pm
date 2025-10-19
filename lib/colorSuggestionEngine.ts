export interface ColorSuggestion {
  colors: string[]
  reasoning: string
  category: string
  confidence: number
  colorCount?: number
  context?: string
}

export class ColorSuggestionEngine {
  // Emotional associations based on color psychology research
  private static emotionMappings: Record<string, ColorSuggestion> = {
    anger: {
      colors: ["#DC2626", "#B91C1C", "#991B1B"],
      reasoning: "Anger is associated with intense reds that convey passion, urgency, and strong emotions",
      category: "Emotion",
      confidence: 0.95,
      colorCount: 3
    },
    calm: {
      colors: ["#0EA5E9", "#0891B2", "#0C4A6E"],
      reasoning: "Calmness evokes peaceful blues that promote relaxation and tranquility",
      category: "Emotion",
      confidence: 0.93,
      colorCount: 3
    },
    joy: {
      colors: ["#F59E0B", "#F97316", "#EF4444", "#84CC16", "#8B5CF6"],
      reasoning: "Joy is expressed through vibrant, warm colors that energize and uplift",
      category: "Emotion",
      confidence: 0.92,
      colorCount: 5
    },
    trust: {
      colors: ["#2563EB", "#1D4ED8"],
      reasoning: "Trust is deeply associated with blue tones that convey reliability and stability",
      category: "Emotion",
      confidence: 0.94,
      colorCount: 2
    },
    creativity: {
      colors: ["#F59E0B", "#8B5CF6", "#EC4899"],
      reasoning: "Creativity flows through vibrant oranges, purples, and pinks that inspire innovation",
      category: "Emotion",
      confidence: 0.90,
      colorCount: 3
    },
    hope: {
      colors: ["#84CC16", "#22C55E", "#F59E0B"],
      reasoning: "Hope manifests in fresh greens and warm yellows that symbolize growth and optimism",
      category: "Emotion",
      confidence: 0.88,
      colorCount: 3
    },
    mystery: {
      colors: ["#6B21A8", "#1F2937", "#374151"],
      reasoning: "Mystery is shrouded in deep purples and dark grays that evoke intrigue and depth",
      category: "Emotion",
      confidence: 0.91,
      colorCount: 3
    }
  }

  // Texture and tactile associations
  private static textureMappings: Record<string, ColorSuggestion> = {
    rough: {
      colors: ["#92400E", "#A16207", "#78350F", "#451A03"],
      reasoning: "Rough textures are represented by earthy browns and deep tans that feel organic and weathered",
      category: "Texture",
      confidence: 0.93,
      colorCount: 4
    },
    smooth: {
      colors: ["#F8FAFC", "#F1F5F9", "#E2E8F0"],
      reasoning: "Smooth surfaces are conveyed through soft whites and light grays that feel polished and refined",
      category: "Texture",
      confidence: 0.92,
      colorCount: 3
    },
    metallic: {
      colors: ["#6B7280", "#9CA3AF", "#D1D5DB"],
      reasoning: "Metallic textures shine through cool grays and silvers that reflect light and sophistication",
      category: "Texture",
      confidence: 0.89,
      colorCount: 3
    },
    velvet: {
      colors: ["#7C2D12", "#991B1B", "#B91C1C"],
      reasoning: "Velvet's luxurious depth is captured in rich, deep reds and burgundies",
      category: "Texture",
      confidence: 0.87,
      colorCount: 3
    },
    silk: {
      colors: ["#FBBF24", "#F59E0B", "#D97706"],
      reasoning: "Silk's lustrous sheen is represented by golden yellows and warm ambers",
      category: "Texture",
      confidence: 0.85,
      colorCount: 3
    }
  }

  private static industryMappings: Record<string, ColorSuggestion> = {
    technology: {
      colors: ["#2563EB", "#7C3AED", "#059669", "#DC2626", "#F59E0B"],
      reasoning: "Tech companies often use blues for trust, purples for innovation, and accent colors for energy",
      category: "Industry",
      confidence: 0.95,
      colorCount: 5
    },
    healthcare: {
      colors: ["#059669", "#0EA5E9", "#F8FAFC"],
      reasoning: "Healthcare uses greens for growth/healing, blues for trust, and whites for cleanliness",
      category: "Industry",
      confidence: 0.92,
      colorCount: 3
    },
    finance: {
      colors: ["#1F2937", "#059669", "#F59E0B"],
      reasoning: "Financial services favor dark colors for stability, green for money/growth, and gold for premium",
      category: "Industry",
      confidence: 0.90,
      colorCount: 3
    },
    food: {
      colors: ["#DC2626", "#F59E0B", "#059669"],
      reasoning: "Food industry uses warm colors like reds and oranges to stimulate appetite and convey energy",
      category: "Industry",
      confidence: 0.88,
      colorCount: 3
    },
    fashion: {
      colors: ["#EC4899", "#7C3AED", "#F59E0B", "#DC2626", "#059669"],
      reasoning: "Fashion brands often use vibrant, trend-forward colors that evoke emotion and style",
      category: "Industry",
      confidence: 0.85,
      colorCount: 5
    }
  }

  // Seasonal associations
  private static seasonalMappings: Record<string, ColorSuggestion> = {
    spring: {
      colors: ["#84CC16", "#22C55E", "#FBBF24"],
      reasoning: "Spring bursts with fresh pastel greens and warm yellows that symbolize renewal and growth",
      category: "Seasonal",
      confidence: 0.94,
      colorCount: 3
    },
    summer: {
      colors: ["#F59E0B", "#F97316", "#EF4444", "#84CC16"],
      reasoning: "Summer radiates with bright oranges, warm reds, and vibrant greens that capture energy and warmth",
      category: "Seasonal",
      confidence: 0.92,
      colorCount: 4
    },
    autumn: {
      colors: ["#92400E", "#DC2626", "#F59E0B"],
      reasoning: "Autumn is painted in rich browns, deep reds, and golden oranges that evoke harvest and change",
      category: "Seasonal",
      confidence: 0.93,
      colorCount: 3
    },
    winter: {
      colors: ["#F8FAFC", "#E5E7EB", "#6B7280"],
      reasoning: "Winter is characterized by icy whites, cool grays, and muted tones that reflect stillness and calm",
      category: "Seasonal",
      confidence: 0.91,
      colorCount: 3
    }
  }

  private static moodMappings: Record<string, ColorSuggestion> = {
    energetic: {
      colors: ["#DC2626", "#F59E0B", "#7C3AED", "#059669", "#F97316"],
      reasoning: "Energetic moods benefit from warm, vibrant colors that convey movement and excitement",
      category: "Mood",
      confidence: 0.90,
      colorCount: 5
    },
    professional: {
      colors: ["#1F2937", "#6B7280", "#059669"],
      reasoning: "Professional settings use sophisticated, muted colors that convey competence and reliability",
      category: "Mood",
      confidence: 0.92,
      colorCount: 3
    },
    romantic: {
      colors: ["#EC4899", "#7C3AED", "#DC2626"],
      reasoning: "Romantic themes use warm, passionate colors like pinks, purples, and deep reds",
      category: "Mood",
      confidence: 0.85,
      colorCount: 3
    },
    luxury: {
      colors: ["#1F2937", "#7C3AED", "#F59E0B"],
      reasoning: "Luxury brands use rich, sophisticated colors that convey exclusivity and premium quality",
      category: "Mood",
      confidence: 0.90,
      colorCount: 3
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

    // Check emotion mappings first (highest priority for nuanced responses)
    for (const [key, suggestion] of Object.entries(this.emotionMappings)) {
      if (lowerKeyword.includes(key)) {
        suggestions.push(suggestion)
      }
    }

    // Check texture mappings
    for (const [key, suggestion] of Object.entries(this.textureMappings)) {
      if (lowerKeyword.includes(key)) {
        suggestions.push(suggestion)
      }
    }

    // Check seasonal mappings
    for (const [key, suggestion] of Object.entries(this.seasonalMappings)) {
      if (lowerKeyword.includes(key)) {
        suggestions.push(suggestion)
      }
    }

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

    // Sort by confidence and return top suggestions
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
  }

  private static generateContextualSuggestion(keyword: string): ColorSuggestion {
    // Analyze keyword characteristics for adaptive color count
    const wordLength = keyword.length
    const hasNumbers = /\d/.test(keyword)
    const isPlural = keyword.endsWith('s')
    const wordCount = keyword.split(' ').length
    
    // Determine color count based on context complexity
    let colorCount = 3 // Default
    if (wordCount === 1 && wordLength <= 4) {
      colorCount = 2 // Simple single words get fewer colors
    } else if (wordCount > 2 || wordLength > 12) {
      colorCount = 5 // Complex concepts get more colors
    }
    
    // Generate colors based on keyword characteristics
    const colors = this.generateColorsFromCharacteristics(keyword, wordLength, hasNumbers, isPlural, colorCount)
    
    return {
      colors,
      reasoning: `Generated ${colorCount} colors based on the semantic analysis of "${keyword}" - considering complexity, emotional resonance, and contextual associations`,
      category: "Contextual",
      confidence: 0.75,
      colorCount,
      context: this.analyzeContextualTheme(keyword)
    }
  }

  private static analyzeContextualTheme(keyword: string): string {
    const lowerKeyword = keyword.toLowerCase()
    
    // Analyze for contextual themes
    if (lowerKeyword.includes('dark') || lowerKeyword.includes('night') || lowerKeyword.includes('shadow')) {
      return 'dark_mysterious'
    } else if (lowerKeyword.includes('bright') || lowerKeyword.includes('light') || lowerKeyword.includes('sun')) {
      return 'bright_energetic'
    } else if (lowerKeyword.includes('soft') || lowerKeyword.includes('gentle') || lowerKeyword.includes('quiet')) {
      return 'soft_calm'
    } else if (lowerKeyword.includes('bold') || lowerKeyword.includes('strong') || lowerKeyword.includes('power')) {
      return 'bold_powerful'
    }
    
    return 'balanced_harmonious'
  }

  private static generateColorsFromCharacteristics(
    keyword: string, 
    length: number, 
    hasNumbers: boolean, 
    isPlural: boolean,
    colorCount: number
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
    
    // Generate colors with variations based on adaptive count
    const hueStep = colorCount === 2 ? 180 : colorCount === 3 ? 120 : colorCount === 4 ? 90 : 72
    
    for (let i = 0; i < colorCount; i++) {
      const hue = (baseHue + i * hueStep) % 360
      const saturation = Math.max(20, Math.min(100, baseSaturation + (i - Math.floor(colorCount/2)) * 8))
      const lightness = Math.max(20, Math.min(80, baseLightness + (i - Math.floor(colorCount/2)) * 4))
      
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
