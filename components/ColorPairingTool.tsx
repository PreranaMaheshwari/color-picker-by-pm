"use client"

import { useState } from "react"
import ColorPalette from "./ColorPalette"
import PostPreview from "./PostPreview"
import BackgroundStyleSelector from "./BackgroundStyleSelector"
import ColorWheelSection from "./ColorWheelSection"

// Expanded color palette inspired by modern UI design
const colorPalette = [
  // Row 1 - Light tones
  "#F8F9FA", // Snow White
  "#FFE4E1", // Misty Rose
  "#E8F4F8", // Arctic Blue
  "#F0FFF4", // Honeydew
  "#FFF5E6", // Cream

  // Row 2 - Medium tones
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Turquoise
  "#95A5A6", // Concrete
  "#F7D794", // Mellow Yellow
  "#786FA6", // Mountain Lavender

  // Row 3 - Deep tones
  "#2C3E50", // Deep Blue
  "#E17055", // Burnt Sienna
  "#27AE60", // Emerald
  "#8E44AD", // Purple
  "#D35400", // Pumpkin

  // Row 4 - Vibrant accents
  "#3498DB", // Clear Blue
  "#E74C3C", // Pure Red
  "#2ECC71", // Green
  "#F1C40F", // Yellow
  "#9B59B6", // Amethyst
]

export default function ColorPairingTool() {
  const [posts, setPosts] = useState([
    { id: 1, colors: [], gradientType: "solid" },
    { id: 2, colors: [], gradientType: "solid" },
    { id: 3, colors: [], gradientType: "solid" },
  ])
  const [selectedPostId, setSelectedPostId] = useState(1)
  const [activeTab, setActiveTab] = useState<"swatches" | "wheel">("swatches")

  const handleSelectColor = (color: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedPostId
          ? {
              ...post,
              colors: post.colors.includes(color)
                ? post.colors.filter((c) => c !== color)
                : [...post.colors, color].slice(-5), // Increased to 5 colors
            }
          : post,
      ),
    )
  }

  const handleWheelColorsChange = (colors: string[]) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedPostId
          ? { ...post, colors }
          : post,
      ),
    )
  }

  const handleResetColors = () => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === selectedPostId ? { ...post, colors: [] } : post)))
  }

  const handleChangeGradientType = (type: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === selectedPostId ? { ...post, gradientType: type } : post)),
    )
  }

  const selectedPost = posts.find((post) => post.id === selectedPostId)!

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium text-gray-900 mb-6">Color Pairing Tool</h1>
        <div className="mb-6 space-y-2">
          <p className="text-gray-600 leading-relaxed">
            Create custom backgrounds for your posts by selecting colors from swatches or using the color wheel. Choose up to five colors and
            experiment with different gradient styles.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Click on a post to select it, then use the controls on the right to customize its background. Your changes
            will appear in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Posts */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-700">Posts</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <PostPreview
                  key={post.id}
                  colors={post.colors}
                  gradientType={post.gradientType}
                  isSelected={post.id === selectedPostId}
                  onClick={() => setSelectedPostId(post.id)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-8">
            {/* Color Selection Tabs */}
            <div>
              <div className="flex space-x-1 mb-4">
                <button
                  onClick={() => setActiveTab("swatches")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "swatches"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Color Swatches
                </button>
                <button
                  onClick={() => setActiveTab("wheel")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "wheel"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Color Wheel
                </button>
              </div>

              {activeTab === "swatches" && (
                <div>
                  <h2 className="text-lg font-medium text-gray-700 mb-4">Select Colors (up to 5)</h2>
                  <ColorPalette
                    colors={colorPalette}
                    onSelectColor={handleSelectColor}
                    selectedColors={selectedPost.colors}
                  />
                  <p className="mt-2 text-sm text-gray-500">Selected: {selectedPost.colors.length}/5 colors</p>
                </div>
              )}

              {activeTab === "wheel" && (
                <ColorWheelSection
                  selectedColors={selectedPost.colors}
                  onColorsChange={handleWheelColorsChange}
                  maxColors={5}
                />
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-4">Background Style</h2>
              <BackgroundStyleSelector value={selectedPost.gradientType} onChange={handleChangeGradientType} />
            </div>

            <button
              onClick={handleResetColors}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Reset Colors
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

