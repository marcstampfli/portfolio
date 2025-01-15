"use client"

import React from "react"

interface ProgressDotsProps {
  total: number
  current: number
  onSelect: (index: number) => void
}

export function ProgressDots({ total, current, onSelect }: ProgressDotsProps) {
  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-2 transition-all ${
            index === current
              ? "w-8 bg-primary"
              : "w-2 bg-primary/20 hover:bg-primary/40"
          } rounded-full`}
        >
          <span className="sr-only">Go to slide {index + 1}</span>
        </button>
      ))}
    </div>
  )
} 