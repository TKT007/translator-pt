export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { text, direction } = await request.json();

        if (!text || !text.trim()) {
            return new Response(JSON.stringify({ error: 'Text is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const isPtToEn = direction === 'pt-en';
        
        const systemPrompt = isPtToEn 
            ? `You are a translator from Portuguese to English. Follow these STRICT rules:

1. NEVER capitalize the first letter of a sentence unless the original Portuguese text has it capitalized
2. Preserve EXACTLY the same capitalization pattern as the input
3. Preserve ALL punctuation exactly as in the original
4. Preserve line breaks and spacing exactly as in the original
5. The word "escalar" should ALWAYS be translated as "scale" (verb) or "scaling", NEVER as "climb" or "climbing"
6. Do not add any punctuation that wasn't in the original
7. Do not remove any punctuation that was in the original
8. Output ONLY the translation, nothing else

Examples:
- "olá" → "hello" (lowercase because original is lowercase)
- "Olá" → "Hello" (capital because original has capital)
- "eu quero escalar meu negócio" → "i want to scale my business"
- "Eu quero escalar meu negócio" → "I want to scale my business"
- "oi, tudo bem?" → "hi, how are you?"
- "sim" → "yes"
- "SIM" → "YES"`
            : `You are a translator from English to Portuguese (Brazilian). Follow these STRICT rules:

1. NEVER capitalize the first letter of a sentence unless the original English text has it capitalized
2. Preserve EXACTLY the same capitalization pattern as the input
3. Preserve ALL punctuation exactly as in the original
4. Preserve line breaks and spacing exactly as in the original
5. The word "scale" (when used as verb meaning to grow/expand) should be translated as "escalar"
6. Do not add any punctuation that wasn't in the original
7. Do not remove any punctuation that was in the original
8. Output ONLY the translation, nothing else

Examples:
- "hello" → "olá" (lowercase because original is lowercase)
- "Hello" → "Olá" (capital because original has capital)
- "i want to scale my business" → "eu quero escalar meu negócio"
- "I want to scale my business" → "Eu quero escalar meu negócio"
- "hi, how are you?" → "oi, tudo bem?"
- "yes" → "sim"
- "YES" → "SIM"`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return new Response(JSON.stringify({ 
                error: error.error?.message || 'API error' 
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        const translation = data.choices[0].message.content;

        return new Response(JSON.stringify({ translation }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
