import type { CSSProperties } from "react"

interface PostPreviewProps {
  colors: string[]
  gradientType: string
  isSelected: boolean
  onClick: () => void
}

export default function PostPreview({ colors, gradientType, isSelected, onClick }: PostPreviewProps) {
  const style = getBackgroundStyle(colors, gradientType)

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the onClick for the post selection
    
    generateColorPaletteImage(colors, gradientType)
  }

  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md
        ${isSelected ? "ring-2 ring-blue-500 shadow-lg scale-[1.02]" : "hover:scale-[1.01]"}
      `}
    >
      <div style={style} className="h-48 w-full transition-all duration-300">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Download Button */}
        {colors.length > 0 && (
          <button
            onClick={handleDownload}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Download color combination"
          >
            <svg
              className="w-4 h-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">
            Post {colors.length > 0 ? "with Background" : "without Background"}
          </p>
          <div className="flex -space-x-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getBackgroundStyle(colors: string[], gradientType: string): CSSProperties {
  if (colors.length === 0) return { background: "#F0F0F0" }

  const gradientColors = colors.join(", ")

  switch (gradientType) {
    case "linear":
      return { background: `linear-gradient(135deg, ${gradientColors})` }
    case "radial":
      return { background: `radial-gradient(circle, ${gradientColors})` }
    case "mesh":
      return {
        background: `radial-gradient(circle at 33% 33%, ${gradientColors}), radial-gradient(circle at 66% 66%, ${gradientColors})`,
      }
    case "solid":
      return { background: colors[0] }
    default:
      return { background: colors[0] }
  }
}

function generateColorPaletteImage(colors: string[], gradientType: string) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  // Set canvas dimensions
  const width = 800
  const height = 600
  canvas.width = width
  canvas.height = height
  
  // Create gradient based on type
  let gradient: CanvasGradient
  
  if (colors.length === 0) {
    // Default gray background
    ctx.fillStyle = '#F0F0F0'
    ctx.fillRect(0, 0, width, height)
  } else {
    switch (gradientType) {
      case "linear":
        gradient = ctx.createLinearGradient(0, 0, width, height)
        colors.forEach((color, index) => {
          gradient.addColorStop(index / (colors.length - 1), color)
        })
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        break
        
      case "radial":
        gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
        colors.forEach((color, index) => {
          gradient.addColorStop(index / (colors.length - 1), color)
        })
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        break
        
      case "mesh":
        // Create multiple radial gradients for mesh effect
        colors.forEach((color, index) => {
          const x = (width / (colors.length + 1)) * (index + 1)
          const y = height / 2
          const radius = Math.min(width, height) / 3
          
          const meshGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
          meshGradient.addColorStop(0, color)
          meshGradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = meshGradient
          ctx.fillRect(0, 0, width, height)
        })
        break
        
      case "solid":
        ctx.fillStyle = colors[0]
        ctx.fillRect(0, 0, width, height)
        break
        
      default:
        ctx.fillStyle = colors[0]
        ctx.fillRect(0, 0, width, height)
    }
  }
  
  // Add color swatches at the bottom
  const swatchSize = 60
  const swatchSpacing = 80
  const startX = (width - (colors.length * swatchSpacing)) / 2
  const swatchY = height - 100
  
  colors.forEach((color, index) => {
    const x = startX + (index * swatchSpacing)
    
    // Draw swatch background
    ctx.fillStyle = color
    ctx.fillRect(x - swatchSize/2, swatchY - swatchSize/2, swatchSize, swatchSize)
    
    // Draw border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.strokeRect(x - swatchSize/2, swatchY - swatchSize/2, swatchSize, swatchSize)
    
    // Draw color code
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(color, x, swatchY + swatchSize/2 + 20)
  })
  
  // Add title
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Color Palette', width/2, 50)
  
  // Add gradient type
  ctx.font = '16px Arial'
  ctx.fillText(`${gradientType.charAt(0).toUpperCase() + gradientType.slice(1)} Gradient`, width/2, 80)
  
  // Convert to PNG and download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `color-palette-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }, 'image/png')
}

