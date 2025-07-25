import { TopicInput } from "@/components/topic-input"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        <div className="mt-16">
          <TopicInput />
        </div>
      </div>
    </main>
  )
}
