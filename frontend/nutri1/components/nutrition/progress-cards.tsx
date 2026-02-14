"use client"

import { Flame, Beef, Wheat, Droplets } from "lucide-react"

interface MacroCardProps {
  icon: React.ReactNode
  label: string
  current: number
  goal: number
  unit: string
  color: string
  bgColor: string
}

function MacroCard({ icon, label, current, goal, unit, color, bgColor }: MacroCardProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  const circumference = 2 * Math.PI * 28
  const dashOffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card shadow-sm">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center rounded-full`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{ backgroundColor: bgColor }}>
            {icon}
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-foreground">
          {current}<span className="text-muted-foreground font-normal">/{goal}{unit}</span>
        </p>
      </div>
    </div>
  )
}

export function ProgressCards() {
  return (
    <section className="px-4" aria-label="Nutrition progress">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">{"Today's Progress"}</h2>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Feb 13</span>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
        {/* Main calorie ring */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#1ab394"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 - (68 / 100) * 2 * Math.PI * 34}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground leading-none">1,360</span>
              <span className="text-[10px] text-muted-foreground">kcal</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground mb-1">Calories</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {"You've consumed 68% of your daily goal. Keep it up!"}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: "68%" }} />
            </div>
          </div>
        </div>

        {/* Macros grid */}
        <div className="grid grid-cols-3 gap-2">
          <MacroCard
            icon={<Beef className="w-4 h-4" style={{ color: "#1ab394" }} />}
            label="Protein"
            current={85}
            goal={130}
            unit="g"
            color="#1ab394"
            bgColor="#e2fcfc"
          />
          <MacroCard
            icon={<Wheat className="w-4 h-4" style={{ color: "#e8a838" }} />}
            label="Carbs"
            current={180}
            goal={250}
            unit="g"
            color="#e8a838"
            bgColor="#fef3e2"
          />
          <MacroCard
            icon={<Droplets className="w-4 h-4" style={{ color: "#5b8def" }} />}
            label="Fat"
            current={42}
            goal={65}
            unit="g"
            color="#5b8def"
            bgColor="#e5f1ff"
          />
        </div>
      </div>

      {/* Water intake */}
      <div className="mt-3 bg-card rounded-2xl p-4 shadow-[0_5px_20px_rgba(0,0,0,0.05)] flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e5f8fd" }}>
          <Flame className="w-5 h-5" style={{ color: "#1ab394" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Water Intake</p>
          <p className="text-xs text-muted-foreground">6 of 8 glasses</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-6 rounded-full transition-colors ${
                i < 6 ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
