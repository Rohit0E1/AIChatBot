import { google } from "@ai-sdk/google";
import { generateText, tool, toolCall } from "ai";
import { z } from "zod";

export const POST = async (req, res) => {
    try {
        const { prompt, context, links } = await req.json();

        const systemPrompt = `
    You are an intelligent portfolio assistant capable of browsing this website.

    CURRENT PAGE CONTEXT:
    """
    ${context}
    """

    AVAILABLE NAVIGATION LINKS:
    ${JSON.stringify(links, null, 2)}

    INSTRUCTIONS:
    1. If the user asks a question and the answer is on the CURRENT PAGE, answer it immediately.
    2. If the answer is NOT on the current page, check the "AVAILABLE NAVIGATION LINKS".
       - If you see a relevant link, you MAY use the 'changePage' tool.
       - IMPORTANT: You MUST provide the 'path' argument. Do NOT call the tool without a 'path'. 
       - The 'path' MUST be one of the hrefs from the "AVAILABLE NAVIGATION LINKS" list.
       - Tell the user "I'm navigating to the [Page Name] page to check that for you."
    3. If you want to go back, use the 'goBack' tool.
    4. If the user asks to see more content, read further, or scroll up/down generally, use the 'scrollPage' tool with direction 'up' or 'down'.
    5. If the user asks to scroll to a specific section or project (e.g. "Go to projects", "Scroll to contact", "show me the last project"), use the 'scrollToSection' tool.
       - IMPORTANT: You MUST provide the 'section' argument. For example: section: "last project" or section: "Projects" or section: "Contact".
       - NEVER call 'scrollToSection' with empty arguments.
    6. If the user asks to fill a form or input fields (e.g. "fill my email as test@test.com", "put John in the name field"), use the 'fillInput' tool.
       - Provide the 'inputs' parameter which must be an array of objects with 'selector' and 'value'.
       - Example: inputs: [{ selector: "email", value: "test@test.com" }]
    7. If the user asks to highlight specific text, content, or an element on the page (e.g. "highlight React", "highlight the skills section", "show me where Python is mentioned"), use the 'highlightText' tool.
       - Provide the 'query' parameter with the text or keyword to search for and highlight.
       - Example: query: "React" or query: "Python"
    8. If you can't find the answer and can't find a link, say you don't know.
    9. NEVER call any tool with empty arguments.
  `;
        console.log("-------------------------", systemPrompt);

        console.log("links----------------", links);
        const { text, toolCalls } = await generateText({
            model: google("gemini-3-flash-preview"),
            system: systemPrompt,
            prompt: `${prompt}`,
            tools: {
                changePage: tool({
                    description: 'Navigate to a different page in the application',
                    parameters: z.object({
                        path: z.string().describe('The path to navigate to (e.g., /about, /projects)'),
                        reason: z.string().describe('The reason for navigating to this page'),
                    }),
                }),
                goBack: tool({
                    description: 'Navigate back to the previous page',
                    parameters: z.object({
                        reason: z.string().describe('The reason for navigating back'),
                    }),
                }),
                scrollPage: tool({
                    description: 'Scrolls the page up or down to show more content. Use this when user says "scroll down", "scroll up", "show me more", etc.',
                    parameters: z.object({
                        direction: z.enum(['up', 'down']).describe('The direction to scroll'),
                    }),
                }),
                scrollToSection: tool({
                    description: 'Scrolls to a specific section, element, or project on the page. Use this when user asks to go to a specific section like "Projects", "Contact", or a specific project name like "show me the portfolio project" or "scroll to the last project".',
                    parameters: z.object({
                        section: z.string().describe('The name, ID, or text of the section/project to scroll to (e.g., "Projects", "Contact", "Portfolio Project", "last project")'),
                    }),
                }),
                fillInput: tool({
                    description: 'Fills input fields on the page. Use this when the user asks to fill a form or set specific field values.',
                    parameters: z.object({
                        inputs: z.array(z.object({
                            selector: z.string().describe('The ID, name, or label of the input field (e.g., "email", "name", "subject").'),
                            value: z.string().describe('The value to fill into the input field.'),
                        })).describe('Array of input fields to fill'),
                    }),
                }),
                highlightText: tool({
                    description: 'Highlights text or elements on the page. Use this when the user asks to highlight, show, or point out specific text, skills, keywords, or sections (e.g., "highlight React", "show me Python", "point out the skills").',
                    parameters: z.object({
                        query: z.string().describe('The text, keyword, or section name to search for and highlight on the page.'),
                    }),
                }),
            },
        });
        console.log("text-----------------", text);
        console.log("toolCalls-----------------", toolCalls);
        return Response.json({ text, toolCalls });
    } catch (error) {
        console.log("error-----------------", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}