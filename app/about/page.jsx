"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Download, MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react"
import Focusable from "@/components/Focusable"
import Clickable from "@/components/Clickable"

const skills = {
  Frontend: ["React", "Next.js", "Vue.js", "JavaScript", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "Python", "PostgreSQL", "MongoDB", "GraphQL", "REST APIs"],
  Tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code"],
}

const experience = [
  {
    role: "Senior Frontend Engineer",
    company: "TechCorp",
    period: "2023 - Present",
    description:
      "Leading frontend architecture and building scalable design systems. Mentoring junior developers and driving technical decisions.",
  },
  {
    role: "Full Stack Developer",
    company: "StartupXYZ",
    period: "2021 - 2023",
    description:
      "Built and maintained multiple client-facing applications using React and Node.js. Improved performance by 40% through optimization.",
  },
  {
    role: "Frontend Developer",
    company: "DigitalAgency",
    period: "2019 - 2021",
    description:
      "Developed responsive websites and web applications for various clients. Collaborated closely with designers to implement pixel-perfect UIs.",
  },
]

export default function About() {
  const router = useRouter();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="animate-fade-in opacity-0">
              <span className="text-sm font-medium uppercase tracking-widest text-accent">About Me</span>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                I'm Rohit Kumar,
                <br />
                <span className="gradient-text">a Creative Developer</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                I'm a passionate developer focused on crafting accessible, pixel-perfect user interfaces that blend
                thoughtful design with robust engineering. I love building products that make a difference.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  India
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  5+ Years Experience
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Clickable
                  id="get-in-touch"
                  label="Get In Touch"
                  onClick={() => router.push('/contact')}
                  as="button"
                  className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-all hover:bg-accent/90"
                >
                  Get In Touch
                  <ArrowRight className="h-4 w-4" />
                </Clickable>
                <Clickable
                  id="download-cv"
                  label="Download CV"
                  onClick={() => alert('Downloading CV...')}
                  as="button"
                  className="flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium transition-all hover:border-accent hover:bg-accent/5"
                >
                  <Download className="h-4 w-4" />
                  Download CV
                </Clickable>
              </div>
            </div>

            <div className="animate-fade-in opacity-0 animation-delay-200 relative">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 text-xs text-muted-foreground font-mono">rohit@developer:~/about</div>
                </div>

                {/* Terminal Content */}
                <div className="space-y-4 font-mono text-sm leading-relaxed">
                  <div>
                    <span className="text-accent">➜</span> <span className="text-blue-400">~</span> <span className="text-muted-foreground">whoami</span>
                  </div>
                  <div className="text-muted-foreground pl-4">
                    "A creative developer passionate about building digital products that live on the internet."
                  </div>

                  <div>
                    <span className="text-accent">➜</span> <span className="text-blue-400">~</span> <span className="text-muted-foreground">cat</span> current_status.json
                  </div>
                  <div className="pl-4 text-emerald-400">
                    {"{"}
                    <div className="pl-4">
                      <span className="text-orange-300">"status"</span>: <span className="text-green-300">"Open to work"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-orange-300">"focus"</span>: <span className="text-green-300">"React & Next.js"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-orange-300">"coffee"</span>: <span className="text-purple-400">true</span>
                    </div>
                    {"}"}
                  </div>

                  <div>
                    <span className="text-accent">➜</span> <span className="text-blue-400">~</span> <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full border border-accent/20 bg-accent/5 -z-10 blur-xl" />
              <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full border border-blue-500/10 bg-blue-500/5 -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <Focusable id="skills">
        <section className="border-y border-border/50 bg-card/30 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">Skills & Technologies</h2>
              <p className="mt-2 text-muted-foreground">Technologies I work with on a daily basis</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {Object.entries(skills).map(([category, items], categoryIndex) => (
                <div
                  key={category}
                  className="animate-fade-in opacity-0 rounded-2xl border border-border bg-card p-6"
                  style={{ animationDelay: `${categoryIndex * 150}ms` }}
                >
                  <h3 className="mb-4 text-lg font-semibold text-accent">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-accent hover:bg-accent/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Focusable>

      {/* Experience Section */}
      <Focusable id="experience">
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-3xl font-bold">Experience</h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

              {experience.map((item, index) => (
                <div
                  key={item.role}
                  className="animate-fade-in opacity-0 relative mb-12 pl-8 md:pl-0"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`md:flex md:items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Dot */}
                    <div className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-accent bg-background md:left-1/2 md:-translate-x-1/2" />

                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <span className="text-sm text-accent">{item.period}</span>
                      <h3 className="mt-1 text-xl font-semibold">{item.role}</h3>
                      <p className="text-muted-foreground">{item.company}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Focusable>

      {/* Education Section */}
      <Focusable id="education">
        <section className="border-t border-border/50 bg-card/30 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-3xl font-bold">Education</h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">B.Tech Computer Science</h3>
                  <p className="text-muted-foreground">Top University</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Specialized in Software Engineering and Web Development. Graduated with honors and led multiple
                    technical projects.
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm text-accent">2015 - 2019</span>
              </div>
            </div>
          </div>
        </section>
      </Focusable>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Interested in working together?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-medium text-accent-foreground transition-all hover:bg-accent/90"
          >
            Let's Talk
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
