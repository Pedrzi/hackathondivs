"use client"

import { Header } from "@/components/nutrition/header"
import { ProgressCards } from "@/components/nutrition/progress-cards"
import { MealPlanSlider } from "@/components/nutrition/meal-plan-slider"
import { ChatPreview } from "@/components/nutrition/chat-preview"
import { OnboardingForm } from "@/components/nutrition/onboarding-form"
import { FaqAccordion } from "@/components/nutrition/faq-accordion"
import { FloatingNotification } from "@/components/nutrition/floating-notification"
import { BottomNav } from "@/components/nutrition/bottom-nav"

export default function Page() {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <Header />

      <main className="pb-24 pt-4">
        <ProgressCards />
        <MealPlanSlider />
        <ChatPreview />
        <OnboardingForm />
        <FaqAccordion />

        {/* Footer spacing */}
        <div className="h-8" />
      </main>

      <FloatingNotification />
      <BottomNav />
    </div>
  )
}
