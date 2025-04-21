import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleAuth } from "https://esm.sh/google-auth-library@9.4.1";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

console.log("Edge Function 'summarize' is running...");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const body = await req.json();
    const content = body.content;

    if (!content || content.trim().length < 50) {
      return new Response(JSON.stringify({ error: "Content too short." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Load service account credentials from file
    const raw = await Deno.readTextFile("./fine-citadel-457514-m2-f1cac54bca68.json");
    const creds = JSON.parse(raw);

    const auth = new GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await fetch(
      "https://us-central1-aiplatform.googleapis.com/v1/projects/fine-citadel-457514/locations/us-central1/publishers/google/models/text-bison:predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.token}`,
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: `Summarize the following note:\n\n${content}`,
            },
          ],
          parameters: {
            temperature: 0.7,
            maxOutputTokens: 256,
            topP: 0.8,
            topK: 40,
          },
        }),
      }
    );

    const result = await response.json();
    const summary = result?.predictions?.[0]?.content ?? "No summary generated.";

    return new Response(JSON.stringify({ summary }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  } catch (err) {
    console.error("Error in summarize function:", err);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
