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
    
    const colorData = {
      colors: colors,
      gradientType: gradientType,
      css: getCSSString(colors, gradientType),
      timestamp: new Date().toISOString(),
      hexColors: colors,
      rgbColors: colors.map(color => hexToRgb(color)),
    }
    
    const dataStr = JSON.stringify(colorData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `color-combination-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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

function getCSSString(colors: string[], gradientType: string): string {
  if (colors.length === 0) return "background: #F0F0F0;"

  const gradientColors = colors.join(", ")

  switch (gradientType) {
    case "linear":
      return `background: linear-gradient(135deg, ${gradientColors});`
    case "radial":
      return `background: radial-gradient(circle, ${gradientColors});`
    case "mesh":
      return `background: radial-gradient(circle at 33% 33%, ${gradientColors}), radial-gradient(circle at 66% 66%, ${gradientColors});`
    case "solid":
      return `background: ${colors[0]};`
    default:
      return `background: ${colors[0]};`
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

