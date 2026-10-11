import { GoogleGenAI } from "@google/genai";
import { Ollama } from "ollama";

import { PDFParse } from "pdf-parse";
import { getPath } from "pdf-parse/worker";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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
      model: "gemini-embedding-2",
      contents: "What is the meaning of life?",
      config: {
        outputDimensionality: 2048,
      },
    });

    console.log(response.embeddings);
    // //  const response = await ollama.embed({
    //   model: "qwen3-embedding:4b",
    //   input: "This is a test embedding request"
    // });

    console.log(
      "Embedding response:",
      response?.embeddings?.[0].values?.length,
    );
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
    if (
      !request.headers
        .get("content-type")
        ?.toLowerCase()
        .startsWith("multipart/form-data")
    ) {
      return Response.json(
        { error: "Expected multipart/form-data with a file field" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file: any = formData.get("file");

    console.log(file);

    if (!(file && file?.size > 0)) {
      return Response.json(
        { error: "A non-empty file is required in the file field" },
        { status: 400 },
      );
    }

    let text: string;

    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      PDFParse.setWorker(getPath());

      const parser = new PDFParse({
        data: new Uint8Array(await file.arrayBuffer()),
      });

      try {
        const result = await parser.getText({ pageJoiner: "\n" });
        text = result.text;
      } catch (error) {
        console.error("Error parsing PDF:", error);
        return Response.json(
          { error: "Could not extract text from the PDF" },
          { status: 400 },
        );
      } finally {
        await parser.destroy();
      }
    } else if (
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      text = await file.text();
    } else {
      return Response.json(
        { error: "Only PDF and plain text files are supported" },
        { status: 415 },
      );
    }

    console.log("Extracted text:", text);
    if (!text.trim()) {
      return Response.json(
        { error: "The file contains no extractable text" },
        { status: 400 },
      );
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 400,
      separators: ["\n\n", "\n", ". ", " ", ""],
    });

    const chunks = await splitter.splitText(text);

    console.log("Chunks:", chunks.length);

    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: chunks[i],
        config: {
          taskType: "QUESTION_ANSWERING",
        },
      });
      embeddedChunks.push({
        rawChunkText: chunks[i],
        chunkIndex: i,
        embedding: response.embeddings?.[0]?.values,
      });
    }

    return Response.json({
      file: {
        name:file.name,
        type:file.type,
        size: file.size,
      }
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
