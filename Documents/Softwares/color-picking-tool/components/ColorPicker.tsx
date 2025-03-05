import type { ChangeEvent } from "react"

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input type="color" value={color} onChange={handleChange} className="h-8 w-8 border-0 rounded-md shadow-sm" />
        <input
          type="text"
          value={color}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
    </div>
  )
}

