interface GradientTypeSelectorProps {
  value: string
  onChange: (type: string) => void
}

export default function GradientTypeSelector({ value, onChange }: GradientTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Background Type</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="linear">Linear Gradient</option>
        <option value="radial">Radial Gradient</option>
        <option value="angular">Angular Gradient</option>
        <option value="mesh">Mesh Gradient</option>
        <option value="solid">Solid Color</option>
      </select>
    </div>
  )
}

