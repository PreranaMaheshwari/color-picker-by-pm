interface BackgroundStyleSelectorProps {
  value: string
  onChange: (type: string) => void
}

export default function BackgroundStyleSelector({ value, onChange }: BackgroundStyleSelectorProps) {
  const options = [
    { value: "solid", label: "Solid Color" },
    { value: "linear", label: "Linear Gradient" },
    { value: "radial", label: "Radial Gradient" },
    { value: "mesh", label: "Mesh Gradient" },
    { value: "random", label: "Random Mix" },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
            ${
              value === option.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

