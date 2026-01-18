"use client"

import { useState } from "react"
import { Send, Mail, MapPin, Clock, Github, Linkedin, Twitter, CheckCircle } from "lucide-react"

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@rohitkumar.dev", href: "mailto:hello@rohitkumar.dev" },
  { icon: MapPin, label: "Location", value: "India", href: null },
  { icon: Clock, label: "Availability", value: "Open to opportunities", href: null },
]

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
]

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({ name: "", email: "", subject: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="animate-fade-in opacity-0 max-w-3xl">
            <span className="text-sm font-medium uppercase tracking-widest text-accent">Contact</span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Let's Work <span className="gradient-text">Together</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a project in mind or just want to chat? I'd love to hear from you. Fill out the form below or reach
              out through any of my social channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="animate-fade-in opacity-0 lg:col-span-2">
              <div className="sticky top-32">
                <h2 className="font-serif text-2xl font-bold">Get in touch</h2>
                <p className="mt-2 text-muted-foreground">
                  I'm always excited to take on new projects and collaborate with creative people.
                </p>

                <div className="mt-8 space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="rounded-full border border-border bg-card p-3">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="font-medium transition-colors hover:text-accent">
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <p className="text-sm text-muted-foreground">Find me on</p>
                  <div className="mt-4 flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-card p-3 transition-all hover:border-accent hover:bg-accent/10"
                        aria-label={link.label}
                      >
                        <link.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in opacity-0 animation-delay-200 lg:col-span-3">
              <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8">
                {isSubmitted && (
                  <div className="mb-6 flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/10 p-4 text-accent">
                    <CheckCircle className="h-5 w-5" />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-4 font-medium text-accent-foreground transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map or decorative section */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-2xl font-bold">Based in India</h2>
          <p className="mt-2 text-muted-foreground">Available for remote work worldwide and local projects.</p>
          <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl border border-border">
            <img src="/dark-minimal-map-india.jpg" alt="India" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border-4 border-accent bg-accent/20 p-4">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
