import type { CSSProperties } from "react"

interface PostPreviewProps {
  colors: string[]
  gradientType: string
  isSelected: boolean
  onClick: () => void
}

export default function PostPreview({ colors, gradientType, isSelected, onClick }: PostPreviewProps) {
  const style = getBackgroundStyle(colors, gradientType)

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

