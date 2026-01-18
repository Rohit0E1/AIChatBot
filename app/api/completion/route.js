import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const POST = async (req, res) => {
    try {
        const { prompt } = await req.json();
        console.log("prompt", prompt);
        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: `${prompt}`
        });
        console.log("text", text);
        return Response.json({ text });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}