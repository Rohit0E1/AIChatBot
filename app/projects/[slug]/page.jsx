"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/projects"

export default function ProjectDetails() {
    const { slug } = useParams()
    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        notFound()
    }

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="mx-auto max-w-4xl animate-fade-in opacity-0">
                <Link
                    href="/projects"
                    className="inline-flex items-center text-muted-foreground hover:text-accent mb-8 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <span className="text-accent font-medium mb-2 block">{project.category}</span>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{project.title}</h1>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            {project.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 border border-border rounded-full px-3 py-1">
                                    <Tag className="h-3 w-3" /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="rounded-full">
                                Visit Live <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="rounded-full">
                                GitHub <Github className="ml-2 h-4 w-4" />
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-border mb-12 shadow-2xl">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full object-cover aspect-video"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6 text-lg leading-relaxed text-muted-foreground">
                        <h2 className="text-2xl font-bold text-foreground font-serif">About the Project</h2>
                        <div className="space-y-4">
                            {/* Rendering description using simple whitespace handling or raw HTML if needed. 
                      For now, sticking to text. */}
                            {project.longDescription ? (
                                project.longDescription.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))
                            ) : (
                                <p>{project.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="font-semibold mb-4">Project Info</h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Category</span>
                                    <span className="font-medium">{project.category}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">2024</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Client</span>
                                    <span className="font-medium">Portfolio</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
