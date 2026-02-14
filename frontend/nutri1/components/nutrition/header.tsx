"use client"

import { Globe, Bell, Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [notificationCount] = useState(3)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">Nutri</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted"
            aria-label="Change language"
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-muted"
            aria-label={`Notifications: ${notificationCount} unread`}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
