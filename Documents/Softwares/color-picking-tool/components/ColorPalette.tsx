interface ColorPaletteProps {
  colors: string[]
  onSelectColor: (color: string) => void
  selectedColors: string[]
}

export default function ColorPalette({ colors, onSelectColor, selectedColors }: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => onSelectColor(color)}
          className={`
            w-12 h-12 rounded-2xl transition-all duration-200
            hover:scale-110 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${selectedColors.includes(color) ? "ring-2 ring-offset-2 ring-blue-500 scale-105" : ""}
          `}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  )
}

