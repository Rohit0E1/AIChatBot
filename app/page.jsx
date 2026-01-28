"use client"

import Link from "next/link"
import { ArrowRight, Github, ExternalLink, Code2, Palette, Smartphone, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

import { projects } from "@/lib/projects"
const featuredProjects = projects.filter(p => p.featured)

const services = [
  {
    title: "Web Development",
    description: "Building scalable, responsive web applications used React and Next.js.",
    icon: <Code2 className="h-6 w-6" />,
  },
  {
    title: "UI/UX Design",
    description: "Crafting intuitive and accessible user interfaces with a focus on experience.",
    icon: <Palette className="h-6 w-6" />,
  },
  {
    title: "Mobile Apps",
    description: "Developing cross-platform mobile applications using React Native.",
    icon: <Smartphone className="h-6 w-6" />,
  },
  {
    title: "Backend Systems",
    description: "Designing robust APIs and database architectures for data-heavy apps.",
    icon: <Terminal className="h-6 w-6" />,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] px-4 text-center space-y-8 pt-20">
        <div className="space-y-4 animate-fade-in opacity-0">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl xl:text-8xl gradient-text">
            Creative Developer
          </h1>
          <p className="max-w-[700px] text-muted-foreground text-xl sm:text-2xl mx-auto leading-relaxed">
            Building digital experiences that blend <span className="text-foreground font-medium">design</span> and{" "}
            <span className="text-foreground font-medium">technology</span>.
          </p>
        </div>

        <div className="flex gap-4 animate-fade-in opacity-0 animation-delay-200">
          <Link href="/projects">
            <Button size="lg" className="rounded-full px-8 h-12 text-base">
              View Work <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
              Contact Me
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-transparent via-muted-foreground to-transparent" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">What I Do</h2>
            <p className="mt-4 text-muted-foreground text-lg">Specialized skills for modern digital products</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-card border border-border/50 p-6 rounded-2xl hover:border-accent/40 transition-colors duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">Featured Work</h2>
              <p className="mt-4 text-muted-foreground text-lg">A selection of my recent projects</p>
            </div>
            <Link href="/projects" className="hidden sm:inline-flex items-center text-accent font-medium hover:underline">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <div
                key={project.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-accent text-sm font-medium">{project.category}</span>
                      <h3 className="text-2xl font-bold font-serif mt-1">{project.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/projects">
              <Button variant="outline" size="lg" className="w-full">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-accent/5 border-t border-border/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-serif mb-6">
            Ready to start your next project?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let's collaborate to bring your ideas to life with modern technology and improved design.
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-accent/20">
              Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}