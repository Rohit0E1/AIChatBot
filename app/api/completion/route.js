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
       - If you see a relevant link, use the 'changePage' tool.
       - YOU MUST provide the 'path' argument from the link's href.
       - Tell the user "I'm navigating to the [Page Name] page to check that for you."
    3. Never make up facts. If you can't find it and can't find a link to it, say you don't know.
  `;
        console.log("-------------------------", systemPrompt);

        console.log("links----------------", links);
        const { text, toolCalls } = await generateText({
            model: google("gemini-2.5-flash"),
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
            },
        });
        console.log("text-----------------", text);
        console.log("toolCalls-----------------", toolCalls);
        return Response.json({ text, toolCalls });
    } catch (error) {
        console.log("error-----------------", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}