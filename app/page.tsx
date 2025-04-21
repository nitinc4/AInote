import Link from 'next/link'
import { Pen, Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Smart Notes for Smart Thinkers
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Transform the way you capture and organize your thoughts with our AI-powered note-taking app.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full">
                <div className="absolute -left-8 -top-8 z-0 h-full w-full rounded-lg bg-muted" />
                <div className="relative z-10 overflow-hidden rounded-lg border bg-background p-6 shadow-xl">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">Meeting Notes</h3>
                      <p className="text-sm text-muted-foreground">Updated 5 minutes ago</p>
                    </div>
                    <Pen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="py-4">
                    <p className="mb-2">Discussed new feature implementation:</p>
                    <ul className="ml-6 list-disc space-y-2">
                      <li>Frontend using React and TypeScript</li>
                      <li>Backend integration with Node.js</li>
                      <li>Launch timeline: Next quarter</li>
                      <li>Timeline overview and resource allocation</li>
                    </ul>
                    <div className="mt-4 rounded-md bg-secondary p-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-medium">AI Summary:</p>
                      </div>
                      <p className="mt-1 text-sm italic">
                        Team will implement a new feature using React, TypeScript, and Node.js, targeting launch next quarter. Resource allocation and timeline discussed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Features that Empower You
            </h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed">
              Our app is designed to help you capture, organize, and enhance your notes with powerful AI.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8 mt-12">
            {[
              {
                title: "Advanced Note Taking",
                description: "Create, edit, and organize your notes with a powerful yet intuitive interface.",
                icon: <Pen className="h-6 w-6" />,
              },
              {
                title: "AI Summarization",
                description: "Let our AI generate concise summaries of your lengthy notes in seconds.",
                icon: <Sparkles className="h-6 w-6" />,
              },
              {
                title: "Secure Storage",
                description: "Your notes are securely stored and accessible from any device, anytime.",
                icon: <Check className="h-6 w-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-center text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}