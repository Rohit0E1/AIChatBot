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
import { useFocus } from "@/context/FocusContext"
import { useClick } from "@/context/ClickContext"

export default function Chat() {
    const router = useRouter();
    const { fillField } = useAIForm();
    const { focusOnSection } = useFocus();
    const { triggerClick } = useClick();
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: '👋 Hi! How can I help you with this portfolio?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef(null)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [messages, isLoading])

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { id: Date.now(), role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        const bodyClone = document.body.cloneNode(true);

        bodyClone.querySelectorAll('script, style, noscript, [hidden], [aria-hidden="true"]').forEach(el => el.remove());

        const chatElement = bodyClone.querySelector('.fixed.bottom-4.right-4');
        if (chatElement) {
            chatElement.remove();
        }

        bodyClone.querySelectorAll('[data-nextjs-scroll-focus-boundary], [id^="__next"]').forEach(el => el.remove());

        const mainContent = bodyClone.querySelector('main') || bodyClone;
        const context = mainContent.innerText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

        const links = Array.from(document.querySelectorAll('a'))
            .map(a => ({
                text: a.innerText.trim(),
                href: a.getAttribute('href')
            }))
            .filter(link => link.text && link.href && link.href.startsWith('/'));

        const uniqueLinks = Array.from(new Set(links.map(JSON.stringify))).map(JSON.parse);
        console.log("context ===========", context)
        console.log("links sent to API:", uniqueLinks);
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
                        const direction = args?.direction || 'down';
                        const scrollAmount = window.innerHeight * 0.8;
                        const y = direction === 'down' ? scrollAmount : -scrollAmount;

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

                        if (!args?.section) {
                            console.warn("scrollToSection called without section argument, scrolling to bottom");
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            return;
                        }

                        const sectionName = args.section.toLowerCase();

                        let element = document.getElementById(args.section) || document.getElementById(sectionName);

                        if (!element) {
                            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                            element = headings.find(h => h.innerText.toLowerCase().includes(sectionName));
                        }

                        if (!element) {
                            const projectCards = document.querySelectorAll('[class*="project"], [class*="card"], [class*="grid"] > div, article, section > div');
                            console.log("Found project cards:", projectCards.length);

                            if (sectionName.includes('last')) {
                                if (projectCards.length > 0) {
                                    element = projectCards[projectCards.length - 1];
                                }
                            } else if (sectionName.includes('first')) {
                                if (projectCards.length > 0) {
                                    element = projectCards[0];
                                }
                            } else {
                                const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="project"], [class*="card"], article, section, div[class]');
                                element = Array.from(allElements).find(el => el.innerText.toLowerCase().includes(sectionName));
                            }
                        }


                        if (element) {
                            console.log(`Found element:`, element);

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
                    } else if (toolCall.toolName === 'highlightText') {
                        console.log("Executing highlightText tool", args);
                        const query = args?.query;

                        if (query) {
                            const lowerQuery = query.toLowerCase();

                            const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, a, div, section, article');
                            let foundElements = [];

                            allElements.forEach(el => {
                                const directText = Array.from(el.childNodes)
                                    .filter(node => node.nodeType === Node.TEXT_NODE)
                                    .map(node => node.textContent)
                                    .join('');

                                if (directText.toLowerCase().includes(lowerQuery) ||
                                    el.innerText?.toLowerCase().includes(lowerQuery)) {
                                    foundElements.push(el);
                                }
                            });

                            if (foundElements.length > 0) {
                                foundElements.sort((a, b) => (a.innerText?.length || 0) - (b.innerText?.length || 0));

                                const element = foundElements[0];
                                console.log(`Found element to highlight:`, element);

                                element.classList.add('ai-highlight');

                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                setTimeout(() => {
                                    element.classList.remove('ai-highlight');
                                }, 3000);
                            } else {
                                console.warn(`No element found containing: ${query}`);
                            }
                        }
                    } else if (toolCall.toolName === 'focusSection') {
                        console.log("Executing focusSection tool", args);
                        const sectionName = args?.section;

                        if (sectionName) {
                            const success = focusOnSection(sectionName);

                            if (!success) {
                                console.log(`Section not in registry, trying DOM fallback for: ${sectionName}`);
                                const lowerSection = sectionName.toLowerCase();

                                let targetElement = null;

                                targetElement = document.getElementById(sectionName) ||
                                    document.getElementById(lowerSection);

                                if (!targetElement) {
                                    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                                    const matchingHeading = Array.from(headings).find(h =>
                                        h.innerText.toLowerCase().includes(lowerSection)
                                    );
                                    if (matchingHeading) {
                                        targetElement = matchingHeading.closest('article') ||
                                            matchingHeading.closest('section') ||
                                            matchingHeading.parentElement;
                                    }
                                }

                                if (!targetElement) {
                                    const allElements = document.querySelectorAll('article, [class*="card"], [class*="project"], section > div');
                                    targetElement = Array.from(allElements).find(el =>
                                        el.innerText?.toLowerCase().includes(lowerSection)
                                    );
                                }

                                if (targetElement) {
                                    console.log(`Found element via DOM fallback:`, targetElement);

                                    const existingOverlay = document.getElementById('ai-focus-overlay');
                                    if (existingOverlay) existingOverlay.remove();

                                    const overlay = document.createElement('div');
                                    overlay.className = 'ai-focus-overlay';
                                    overlay.id = 'ai-focus-overlay';
                                    document.body.appendChild(overlay);

                                    targetElement.classList.add('ai-focused');

                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                    const dismissFocus = () => {
                                        overlay.remove();
                                        targetElement.classList.remove('ai-focused');
                                        document.removeEventListener('click', dismissFocus);
                                    };

                                    setTimeout(dismissFocus, 5000);
                                    setTimeout(() => {
                                        document.addEventListener('click', dismissFocus);
                                    }, 500);
                                } else {
                                    console.warn(`Section not found anywhere: ${sectionName}`);
                                }
                            }
                        }
                    } else if (toolCall.toolName === 'clickElement') {
                        console.log("Executing clickElement tool", args);
                        const target = args?.target;

                        if (target) {
                            const success = triggerClick(target);

                            if (!success) {
                                console.log(`Clickable not in registry, trying DOM fallback for: ${target}`);
                                const lowerTarget = target.toLowerCase().trim();

                                const isVisible = (el) => {
                                    const rect = el.getBoundingClientRect();
                                    return rect.width > 0 && rect.height > 0 &&
                                        window.getComputedStyle(el).visibility !== 'hidden' &&
                                        window.getComputedStyle(el).display !== 'none';
                                };

                                const allClickables = document.querySelectorAll('button, a[href], [role="button"], input[type="submit"]');

                                const candidates = Array.from(allClickables)
                                    .filter(isVisible)
                                    .map(el => {
                                        const text = el.innerText?.toLowerCase().trim() || '';
                                        const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
                                        const value = el.value?.toLowerCase() || '';

                                        let score = 0;

                                        if (text === lowerTarget || ariaLabel === lowerTarget || value === lowerTarget) {
                                            score = 100;
                                        }
                                        else if (text.startsWith(lowerTarget) || ariaLabel.startsWith(lowerTarget)) {
                                            score = 80;
                                        }
                                        else if (text.includes(lowerTarget) || ariaLabel.includes(lowerTarget)) {
                                            score = 60;
                                        }
                                        else if (lowerTarget.includes(text) && text.length > 3) {
                                            score = 40;
                                        }

                                        if (score > 0 && (el.tagName === 'BUTTON' || el.type === 'submit')) {
                                            score += 10;
                                        }

                                        return { el, score, text };
                                    })
                                    .filter(c => c.score > 0)
                                    .sort((a, b) => b.score - a.score);

                                console.log('Click candidates:', candidates.map(c => ({ score: c.score, text: c.text, tag: c.el.tagName })));

                                const targetElement = candidates[0]?.el;

                                if (targetElement) {
                                    console.log(`Found clickable via DOM fallback:`, targetElement);

                                    const originalTransform = targetElement.style.transform;
                                    const originalBoxShadow = targetElement.style.boxShadow;

                                    targetElement.style.transition = 'all 0.2s ease';
                                    targetElement.style.transform = 'scale(0.95)';
                                    targetElement.style.boxShadow = '0 0 0 3px rgba(100, 255, 218, 0.5)';

                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                    setTimeout(() => {
                                        targetElement.style.transform = originalTransform;
                                        targetElement.style.boxShadow = originalBoxShadow;

                                        if (targetElement.type === 'submit' ||
                                            (targetElement.tagName === 'BUTTON' && targetElement.closest('form'))) {
                                            const form = targetElement.closest('form');
                                            if (form) {
                                                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                                            } else {
                                                targetElement.click();
                                            }
                                        } else {
                                            targetElement.click();
                                        }
                                    }, 300);
                                } else {
                                    console.warn(`Clickable element not found: ${target}`);
                                }
                            }
                        }
                    }
                });
            }

            if (res.text && res.text.trim()) {
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    role: 'assistant',
                    content: res.text
                }])
            } else if (res.toolCalls && res.toolCalls.length > 0) {
                const toolMessages = {
                    scrollToSection: "Sure! Taking you there now... 🚀",
                    scrollPage: "Scrolling for you... 📜",
                    changePage: "Navigating to that page... 🧭",
                    goBack: "Going back... ⬅️",
                    fillInput: "Filling that form for you... ✍️",
                    highlightText: "Highlighting that for you... ✨",
                    focusSection: "Focusing on that section... 🔍",
                    clickElement: "Clicking that for you... 👆"
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
                                <div ref={messagesEndRef} />
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
