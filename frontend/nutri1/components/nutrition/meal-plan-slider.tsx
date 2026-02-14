"use client"

import Image from "next/image"
import { Clock, ChevronRight } from "lucide-react"
import { useRef } from "react"

const meals = [
  {
    id: 1,
    name: "Mediterranean Salad",
    calories: 380,
    time: "12:30 PM",
    image: "/images/meal-salad.jpg",
    tag: "Lunch",
    tagColor: "#1ab394",
    tagBg: "#e2fcfc",
  },
  {
    id: 2,
    name: "Green Smoothie Bowl",
    calories: 220,
    time: "8:00 AM",
    image: "/images/meal-smoothie.jpg",
    tag: "Breakfast",
    tagColor: "#5b8def",
    tagBg: "#e5f1ff",
  },
  {
    id: 3,
    name: "Grilled Chicken",
    calories: 450,
    time: "7:00 PM",
    image: "/images/meal-chicken.jpg",
    tag: "Dinner",
    tagColor: "#e8a838",
    tagBg: "#fef3e2",
  },
  {
    id: 4,
    name: "Overnight Oats",
    calories: 310,
    time: "7:30 AM",
    image: "/images/meal-oatmeal.jpg",
    tag: "Snack",
    tagColor: "#1ab394",
    tagBg: "#e2fcfc",
  },
]

export function MealPlanSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="mt-6" aria-label="Meal plan">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Meal Plan</h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary">
          See all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {meals.map((meal) => (
          <article
            key={meal.id}
            className="flex-shrink-0 w-44 snap-start bg-card rounded-2xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] group cursor-pointer"
          >
            <div className="relative h-28 overflow-hidden">
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ color: meal.tagColor, backgroundColor: meal.tagBg }}
              >
                {meal.tag}
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-foreground truncate">{meal.name}</h3>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-medium text-primary">{meal.calories} kcal</span>
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {meal.time}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
