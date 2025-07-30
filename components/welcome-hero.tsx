"use client"

interface WelcomeHeroProps {
  userName?: string | null
}

export function WelcomeHero({ userName }: WelcomeHeroProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {userName ? `Welcome back, ${userName}` : "Welcome to Training Videos"}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Discover high-quality training videos on web development, programming, and modern technologies.
      </p>
    </div>
  )
} 