"use client"

import { Home, UtensilsCrossed, BarChart3, User, Plus } from "lucide-react"
import { useState } from "react"

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: UtensilsCrossed, label: "Meals", active: false },
  { icon: null, label: "Add", active: false },
  { icon: BarChart3, label: "Stats", active: false },
  { icon: User, label: "Profile", active: false },
]

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("Home")

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {navItems.map((item) => {
          if (!item.icon) {
            return (
              <button
                key={item.label}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/30 -mt-6 hover:brightness-110 active:scale-95 transition-all"
                aria-label="Add meal"
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </button>
            )
          }

          const isActive = activeTab === item.label
          const Icon = item.icon

          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
