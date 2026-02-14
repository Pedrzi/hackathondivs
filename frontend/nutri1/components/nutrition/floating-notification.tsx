"use client"

import { useState, useEffect } from "react"
import { X, Droplets, TrendingUp, Apple } from "lucide-react"

const notifications = [
  {
    id: 1,
    icon: <Droplets className="w-4 h-4 text-primary-foreground" />,
    title: "Hydration Reminder",
    message: "Time to drink a glass of water!",
    bg: "bg-primary",
  },
  {
    id: 2,
    icon: <TrendingUp className="w-4 h-4 text-primary-foreground" />,
    title: "Goal Progress",
    message: "You're 80% towards your protein goal today.",
    bg: "bg-primary",
  },
  {
    id: 3,
    icon: <Apple className="w-4 h-4 text-primary-foreground" />,
    title: "Meal Reminder",
    message: "Don't forget your afternoon snack!",
    bg: "bg-primary",
  },
]

export function FloatingNotification() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true)
    }, 2000)

    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible || dismissed) return

    const autoHide = setTimeout(() => {
      if (currentIndex < notifications.length - 1) {
        setVisible(false)
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1)
          setVisible(true)
        }, 500)
      } else {
        setVisible(false)
      }
    }, 5000)

    return () => clearTimeout(autoHide)
  }, [visible, currentIndex, dismissed])

  if (dismissed || currentIndex >= notifications.length) return null

  const notification = notifications[currentIndex]

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-50 transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`${notification.bg} rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-primary/20`}>
        <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
          {notification.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-primary-foreground">{notification.title}</p>
          <p className="text-xs text-primary-foreground/80 truncate">{notification.message}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>
    </div>
  )
}
