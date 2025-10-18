"use client"

import { useState, useRef, useEffect } from "react"

interface ColorWheelProps {
  selectedColors: string[]
  onColorSelect: (color: string) => void
  maxColors?: number
}

export default function ColorWheel({ selectedColors, onColorSelect, maxColors = 5 }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [wheelSize] = useState(300)

  useEffect(() => {
    drawColorWheel()
  }, [])

  const drawColorWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = wheelSize / 2
    const centerY = wheelSize / 2
    const radius = wheelSize / 2 - 20

    // Clear canvas
    ctx.clearRect(0, 0, wheelSize, wheelSize)

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle * Math.PI) / 180
      const endAngle = ((angle + 1) * Math.PI) / 180

      // Calculate hue based on angle
      const hue = angle
      const saturation = 100
      const lightness = 50

      // Convert HSL to RGB
      const color = hslToRgb(hue / 360, saturation / 100, lightness / 100)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.fill()
    }

    // Draw center circle (white)
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw selected color indicators
    selectedColors.forEach((color, index) => {
      const angle = (index * 72) * (Math.PI / 180) // Distribute around circle
      const x = centerX + Math.cos(angle) * (radius - 30)
      const y = centerY + Math.sin(angle) * (radius - 30)

      // Draw selection circle
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()
    })
  }

  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const getColorFromPosition = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const centerX = wheelSize / 2
    const centerY = wheelSize / 2
    const radius = wheelSize / 2 - 20

    const mouseX = x - rect.left
    const mouseY = y - rect.top

    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2)

    if (distance < 20 || distance > radius) return null // Outside wheel or in center

    const angle = Math.atan2(mouseY - centerY, mouseX - centerX)
    let degrees = (angle * 180) / Math.PI
    if (degrees < 0) degrees += 360

    const hue = degrees
    const saturation = 100
    const lightness = 50

    return hslToRgb(hue / 360, saturation / 100, lightness / 100)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleColorSelect(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleColorSelect(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleColorSelect = (e: React.MouseEvent) => {
    const color = getColorFromPosition(e.clientX, e.clientY)
    if (color && selectedColors.length < maxColors) {
      const hexColor = rgbToHex(color.r, color.g, color.b)
      onColorSelect(hexColor)
    }
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={wheelSize}
          height={wheelSize}
          className="cursor-crosshair rounded-full shadow-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-sm font-medium text-gray-600 bg-white/80 px-2 py-1 rounded">
            {selectedColors.length}/{maxColors}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {selectedColors.map((color, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono text-gray-600">{color}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
