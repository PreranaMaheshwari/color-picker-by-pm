"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface ColorHarmonySelectorProps {
  value: string
  onChange: (harmony: string) => void
}

const harmonyOptions = [
  { value: "custom", label: "Custom" },
  { value: "analogous", label: "Analogous" },
  { value: "triad", label: "Triad" },
  { value: "complementary", label: "Complementary" },
  { value: "splitComplementary", label: "Split Complementary" },
  { value: "shades", label: "Shades" },
  { value: "monochromatic", label: "Monochromatic" },
]

export default function ColorHarmonySelector({ value, onChange }: ColorHarmonySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = harmonyOptions.find(option => option.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate">{selectedOption?.label}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {harmonyOptions.map((option) => (
              <button
                key={option.value}
                className={`${
                  option.value === value ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                } cursor-default select-none relative py-2 pl-3 pr-9 w-full text-left hover:bg-gray-50`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <span className="block truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
