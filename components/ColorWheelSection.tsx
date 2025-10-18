"use client"

import { useState } from "react"
import ColorWheel from "./ColorWheel"
import ColorHarmonySelector from "./ColorHarmonySelector"
import { ColorSchemeGenerator } from "../lib/colorSchemeGenerator"

interface ColorWheelSectionProps {
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
  maxColors?: number
}

export default function ColorWheelSection({ selectedColors, onColorsChange, maxColors = 5 }: ColorWheelSectionProps) {
  const [harmony, setHarmony] = useState("custom")
  const [baseColor, setBaseColor] = useState("#FF6B6B")

  const handleColorSelect = (color: string) => {
    if (harmony === "custom") {
      // For custom mode, just add the color directly
      if (!selectedColors.includes(color) && selectedColors.length < maxColors) {
        onColorsChange([...selectedColors, color])
      }
    } else {
      // For harmony modes, generate a color scheme based on the selected color
      setBaseColor(color)
      const scheme = ColorSchemeGenerator.generateScheme(color, harmony)
      onColorsChange(scheme.colors.slice(0, maxColors))
    }
  }

  const handleHarmonyChange = (newHarmony: string) => {
    setHarmony(newHarmony)
    
    if (newHarmony === "custom") {
      // Keep current colors when switching to custom
      return
    }
    
    // Generate new scheme based on current base color
    const scheme = ColorSchemeGenerator.generateScheme(baseColor, newHarmony)
    onColorsChange(scheme.colors.slice(0, maxColors))
  }

  const handleRemoveColor = (colorToRemove: string) => {
    onColorsChange(selectedColors.filter(color => color !== colorToRemove))
  }

  const handleClearAll = () => {
    onColorsChange([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Color Wheel Selection</h2>
        <p className="text-sm text-gray-600 mb-4">
          Click on the color wheel to select colors. Choose up to {maxColors} colors for your palette.
        </p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Color Wheel */}
          <div className="flex-1">
            <ColorWheel
              selectedColors={selectedColors}
              onColorSelect={handleColorSelect}
              maxColors={maxColors}
            />
          </div>
          
          {/* Harmony Selector */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Harmony
              </label>
              <ColorHarmonySelector
                value={harmony}
                onChange={handleHarmonyChange}
              />
              <p className="mt-2 text-xs text-gray-500">
                {harmony === "custom" 
                  ? "Select colors freely from the wheel"
                  : "Harmony will generate complementary colors automatically"
                }
              </p>
            </div>
            
            {/* Selected Colors Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Colors ({selectedColors.length}/{maxColors})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedColors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-mono text-gray-700">{color}</span>
                    <button
                      onClick={() => handleRemoveColor(color)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {selectedColors.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear All Colors
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
