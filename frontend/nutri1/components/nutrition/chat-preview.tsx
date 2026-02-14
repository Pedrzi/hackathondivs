"use client"

import { MessageCircle, ChevronRight } from "lucide-react"

const messages = [
  {
    id: 1,
    sender: "Dr. Sarah",
    avatar: "S",
    message: "Great progress on your protein intake! Try adding more legumes.",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: 2,
    sender: "Nutritionist",
    avatar: "N",
    message: "Your meal plan for next week is ready to review.",
    time: "Yesterday",
    unread: false,
  },
]

export function ChatPreview() {
  return (
    <section className="px-4 mt-6" aria-label="Messages">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Messages</h2>
        <button className="flex items-center gap-1 text-xs font-medium text-primary">
          Open chat <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
              idx < messages.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{msg.avatar}</span>
              </div>
              {msg.unread && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-bold text-foreground">{msg.sender}</p>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
          <MessageCircle className="w-4 h-4" />
          Start a conversation
        </button>
      </div>
    </section>
  )
}
