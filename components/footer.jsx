import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

const socialLinks = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@rohitkumar.dev", icon: Mail, label: "Email" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="text-xl font-bold tracking-tight transition-colors hover:text-accent">
              RK<span className="text-accent">.</span>
            </Link>
            <p className="text-sm text-muted-foreground">Crafting digital experiences</p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full border border-border p-2 transition-all hover:border-accent hover:bg-accent/10"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">{new Date().getFullYear()} Rohit Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
