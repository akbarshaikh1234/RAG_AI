import ollama from "ollama";

export async function GET(request: Request) {
  try {
    const response = await ollama.embed({
      model: "qwen3-embedding:4b",
      input: "This is a test embedding request",
      dimensions: 1536,
    });

    console.log("Embedding response:", response.embeddings[0].length);
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
