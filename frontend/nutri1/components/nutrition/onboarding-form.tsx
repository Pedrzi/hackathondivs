"use client"

import { useState } from "react"
import { User, Mail, Target, ArrowRight, Check } from "lucide-react"

export function OnboardingForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <section className="px-4 mt-6" aria-label="Demo submitted">
        <div className="bg-card/60 backdrop-blur-xl rounded-2xl p-6 shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Check className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">{"You're all set!"}</h3>
          <p className="text-sm text-muted-foreground">
            Welcome aboard! Your personalized plan is being prepared.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 mt-6" aria-label="Onboarding">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Get Started</h2>
        <span className="text-xs font-medium text-muted-foreground">Free trial</span>
      </div>

      <div className="bg-card/60 backdrop-blur-xl rounded-2xl p-5 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Start your journey to better nutrition. Tell us about yourself.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Your name"
              required
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card/80 backdrop-blur border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card/80 backdrop-blur border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              required
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card/80 backdrop-blur border border-border text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              defaultValue=""
            >
              <option value="" disabled>
                Select your goal
              </option>
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain weight</option>
              <option value="gain">Build muscle</option>
              <option value="health">Improve health</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-1 w-full h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  )
}
