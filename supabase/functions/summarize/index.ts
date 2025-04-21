// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

interface SummarizeRequest {
  content: string
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const { content } = await req.json() as SummarizeRequest

    if (!content || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    // Using DeepSeek API for summarization
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text concisely. Keep summaries clear and brief, capturing the main points.'
          },
          {
            role: 'user',
            content: `Please summarize the following text in 2-3 sentences:\n\n${content}`
          }
        ],
        max_tokens: 150
      })
    })

    const data = await response.json()
    const summary = data.choices[0].message.content.trim()

    return new Response(
      JSON.stringify({ summary }),
      {
        status: 200,
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error('Error in summarize function:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to summarize content' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
})