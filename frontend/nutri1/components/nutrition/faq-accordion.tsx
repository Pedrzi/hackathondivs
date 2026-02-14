"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "How does the meal plan work?",
    answer:
      "Our AI-powered system creates personalized meal plans based on your nutritional goals, dietary preferences, and health conditions. Plans are updated weekly based on your progress.",
  },
  {
    question: "Can I customize my macros?",
    answer:
      "Absolutely! You can set custom targets for calories, protein, carbs, and fat. Go to Settings > Nutrition Goals to adjust your daily targets.",
  },
  {
    question: "How do I track water intake?",
    answer:
      "Tap the water glasses on your dashboard to log each glass. You can also set reminders to stay hydrated throughout the day.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your health data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.",
  },
]

export function FaqAccordion() {
  return (
    <section className="px-4 mt-6" aria-label="Frequently asked questions">
      <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">FAQ</h2>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#eef3fb" }}>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border-b border-border/50 last:border-b-0"
            >
              <AccordionTrigger className="px-4 py-3.5 text-sm font-bold text-foreground hover:no-underline hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
