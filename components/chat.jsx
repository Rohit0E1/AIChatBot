"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Loader2, User, Bot, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { useAIForm } from "@/context/AIFormContext"

export default function Chat() {
    const router = useRouter();
    const { fillField } = useAIForm();
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: '👋 Hi! How can I help you with this portfolio?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth'
                })
            }, 100)
        }
    }, [messages, isLoading])

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        // Add user message
        const userMessage = { id: Date.now(), role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        // Clone the body and clean it before extracting text
        const bodyClone = document.body.cloneNode(true);

        // Remove scripts, styles, and hidden elements
        bodyClone.querySelectorAll('script, style, noscript, [hidden], [aria-hidden="true"]').forEach(el => el.remove());

        // Remove the chat component
        const chatElement = bodyClone.querySelector('.fixed.bottom-4.right-4');
        if (chatElement) {
            chatElement.remove();
        }

        // Remove Next.js internal elements
        bodyClone.querySelectorAll('[data-nextjs-scroll-focus-boundary], [id^="__next"]').forEach(el => el.remove());

        // Get only the main content area if it exists, otherwise use cleaned body
        const mainContent = bodyClone.querySelector('main') || bodyClone;
        const context = mainContent.innerText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

        const links = Array.from(document.querySelectorAll('a'))
            .map(a => ({
                text: a.innerText.trim(),
                href: a.getAttribute('href')
            }))
            .filter(link => link.text && link.href && link.href.startsWith('/')); // Only internal links

        const uniqueLinks = Array.from(new Set(links.map(JSON.stringify))).map(JSON.parse);
        console.log("context ===========", context)
        console.log("links sent to API:", uniqueLinks);
        // TODO: give context here 
        try {
            const data = await fetch("/api/completion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: input,
                    context: context,
                    links: uniqueLinks
                })
            })

            const res = await data.json()
            console.log("data :", data)
            console.log("res full object:", res)
            console.log("res.toolCalls:", res.toolCalls)

            if (!data.ok) {
                throw new Error(res.error || "Failed to fetch AI response")
            }

            if (res.toolCalls) {
                res.toolCalls.forEach(toolCall => {
                    const args = toolCall.args || toolCall.input;
                    if (toolCall.toolName === 'changePage') {
                        console.log("Navigation tool called with args:", args);
                        if (args && args.path) {
                            console.log("Navigating to:", args.path);
                            router.push(args.path);
                        } else {
                            console.error("Navigation failed: No path provided in arguments", toolCall);
                        }
                    } else if (toolCall.toolName === 'goBack') {
                        console.log("Executing goBack tool");
                        router.back();
                    }
                    else if (toolCall.toolName === 'scrollPage') {
                        console.log("Executing scrollPage tool");
                        // Default to 'down' if direction is not provided
                        const direction = args?.direction || 'down';
                        const scrollAmount = window.innerHeight * 0.8;
                        const y = direction === 'down' ? scrollAmount : -scrollAmount;

                        // Try multiple scroll methods
                        try {
                            window.scrollBy({ top: y, behavior: 'smooth' });
                        } catch (e) {
                            console.log("window.scrollBy failed trying alternate");
                            document.documentElement.scrollBy({ top: y, behavior: 'smooth' });
                            document.body.scrollBy({ top: y, behavior: 'smooth' });
                        }

                        console.log(`Scrolled ${direction}`);
                    } else if (toolCall.toolName === 'scrollToSection') {
                        console.log("Executing scrollToSection tool");

                        // Handle missing section argument
                        if (!args?.section) {
                            console.warn("scrollToSection called without section argument, scrolling to bottom");
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            return;
                        }

                        const sectionName = args.section.toLowerCase();

                        // Try to find element by ID first
                        let element = document.getElementById(args.section) || document.getElementById(sectionName);

                        // If not found by ID, try to find by text content in headings
                        if (!element) {
                            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                            element = headings.find(h => h.innerText.toLowerCase().includes(sectionName));
                        }

                        // If still not found, try to find in project cards or any element with matching text
                        if (!element) {
                            // Get all potential project/card elements
                            const projectCards = document.querySelectorAll('[class*="project"], [class*="card"], [class*="grid"] > div, article, section > div');
                            console.log("Found project cards:", projectCards.length);

                            // Handle "last project" case
                            if (sectionName.includes('last')) {
                                if (projectCards.length > 0) {
                                    element = projectCards[projectCards.length - 1];
                                }
                            } else if (sectionName.includes('first')) {
                                if (projectCards.length > 0) {
                                    element = projectCards[0];
                                }
                            } else {
                                // Search for matching text in any visible element
                                const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="project"], [class*="card"], article, section, div[class]');
                                element = Array.from(allElements).find(el => el.innerText.toLowerCase().includes(sectionName));
                            }
                        }


                        if (element) {
                            console.log(`Found element:`, element);

                            // Visual highlight for debugging
                            const originalBorder = element.style.border;
                            const originalBoxShadow = element.style.boxShadow;
                            const originalTransition = element.style.transition;

                            element.style.transition = 'all 0.5s ease';
                            element.style.border = '2px solid #64ffda';
                            element.style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.5)';

                            setTimeout(() => {
                                element.style.border = originalBorder;
                                element.style.boxShadow = originalBoxShadow;
                                element.style.transition = originalTransition;
                            }, 2000);

                            // Try standard scrollIntoView
                            try {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            } catch (e) {
                                console.warn("scrollIntoView failed, trying manual scroll");
                                const rect = element.getBoundingClientRect();
                                const absoluteTop = window.scrollY + rect.top - (window.innerHeight / 2);
                                window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
                            }

                            console.log(`Scrolled to section: ${args.section}`);
                        } else {
                            console.warn(`Section not found: ${args.section}`);
                            // Fallback to top/bottom if "top" or "bottom" mentioned
                            if (sectionName.includes('top')) {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else if (sectionName.includes('bottom') || sectionName.includes('end')) {
                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            }
                        }
                    } else if (toolCall.toolName === 'fillInput') {
                        console.log("Executing fillInput tool", args);
                        const inputs = args.inputs || args.fields;

                        if (inputs && Array.isArray(inputs)) {
                            inputs.forEach(input => {
                                const selector = input.selector.toLowerCase();
                                const value = input.value;

                                const success = fillField(selector, value);

                                if (!success) {
                                    console.warn(`Could not find active field for: ${selector}`);
                                }
                            });
                        }
                    }
                });
            }

            // Only add message if there's text content (not just tool calls)
            if (res.text && res.text.trim()) {
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    role: 'assistant',
                    content: res.text
                }])
            } else if (res.toolCalls && res.toolCalls.length > 0) {
                // Add a friendly confirmation message based on the tool used
                const toolMessages = {
                    scrollToSection: "Sure! Taking you there now... 🚀",
                    scrollPage: "Scrolling for you... 📜",
                    changePage: "Navigating to that page... 🧭",
                    goBack: "Going back... ⬅️",
                    fillInput: "Filling that form for you... ✍️"
                };

                const toolCall = res.toolCalls[0];
                const message = toolMessages[toolCall.toolName] || "Done! Action completed. ✅";

                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    role: 'assistant',
                    content: message
                }])
            }
            setIsLoading(false);

            console.log("response", res)
        } catch (error) {
            console.log("error", error)
            setIsLoading(false);
            setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: 'Sorry, I am not able to understand you. Please try again.' }])
        } finally {
            console.log("finally")
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {isOpen && (
                <Card className="w-[400px] sm:w-[500px] h-[600px] flex flex-col shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 h-10 border-b">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                            <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-4 w-8 rounded-full">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full p-2" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3",
                                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={cn(
                                                "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                                                message.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            <div className="text-sm prose dark:prose-invert max-w-none break-words [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 last:[&>*]:mb-0">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4" {...props} />,
                                                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                        a: ({ node, ...props }) => <a className="text-primary underline underline-offset-4" {...props} />,
                                                        code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback className="bg-muted">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 border-t">
                        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            )}
        </div>
    )
}
