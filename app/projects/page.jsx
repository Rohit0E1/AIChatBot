"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Github, ExternalLink } from "lucide-react"
import { projects } from "@/lib/projects"

const categories = ["All", "Web App", "Mobile", "Design", "Open Source"]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="animate-fade-in opacity-0 max-w-3xl">
            <span className="text-sm font-medium uppercase tracking-widest text-accent">Portfolio</span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Selected <span className="gradient-text">Projects</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A collection of projects I've worked on, ranging from web applications to design systems. Each project
              represents a unique challenge and learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-30 border-b border-border/50 bg-background/80 backdrop-blur-lg px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "border border-border hover:border-accent hover:bg-accent/5"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <article
                key={project.slug}
                className="animate-fade-in opacity-0 group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/50 hover:glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-sm text-accent">{project.category}</span>
                      <Link href={`/projects/${project.slug}`}>
                        <h3 className="mt-1 font-serif text-xl font-bold hover:underline decoration-accent underline-offset-4">{project.title}</h3>
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.githubUrl}
                        className="rounded-full border border-border p-2 transition-all hover:border-accent hover:bg-accent/10"
                        aria-label="View on GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a
                        href={project.liveUrl}
                        className="rounded-full border border-border p-2 transition-all hover:border-accent hover:bg-accent/10"
                        aria-label="View live site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Featured
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Want to see more?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Check out my GitHub for more projects and open-source contributions.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 font-medium transition-all hover:border-accent hover:bg-accent/5"
          >
            <Github className="h-5 w-5" />
            View GitHub Profile
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
