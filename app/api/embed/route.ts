import { GoogleGenAI } from "@google/genai";
import { Ollama } from "ollama";

// const ollama = new Ollama({
//      host: 'https://ollama.com', // Replace with your self-hosted URL if not using Ollama Cloud
//         headers: {
//             'Authorization': `Bearer ${process.env.OLLAMA_KEY}` // Only required if your host enforces auth
//         }
// });

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY!,
});

export async function GET(request: Request) {
  try {

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: 'What is the meaning of life?',
        config: {
            outputDimensionality: 2048,
        }
    });

    console.log(response.embeddings);
    // //  const response = await ollama.embed({
    //   model: "qwen3-embedding:4b",
    //   input: "This is a test embedding request"
    // });

    console.log("Embedding response:", response?.embeddings?.[0].values?.length);
    return new Response(JSON.stringify(response.embeddings), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate embedding" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export async function POST(request: Request) {
  try {

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: 'What is the meaning of life?',
        config: {
            outputDimensionality: 2048,
        }
    });

    console.log(response.embeddings);
    // //  const response = await ollama.embed({
    //   model: "qwen3-embedding:4b",
    //   input: "This is a test embedding request"
    // });

    console.log("Embedding response:", response?.embeddings?.[0].values?.length);
    return new Response(JSON.stringify(response.embeddings), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate embedding" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
