import { corsHeaders } from '../_shared/cors'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()

    if (!content || content.trim().length < 50) {
      return new Response(
        JSON.stringify({ 
          error: 'Content must be at least 50 characters long'
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create a simple summary by extracting key sentences
    const sentences = content.split(/[.!?]+/).filter(Boolean)
    const summary = sentences.slice(0, 2).join('. ') + '.'

    return new Response(
      JSON.stringify({ summary }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in summarize function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate summary',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})