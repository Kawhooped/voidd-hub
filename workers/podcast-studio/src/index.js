const ALLOWED_ORIGINS = new Set([
  "https://kawhooped.github.io",
  "https://void.life"
]);
const json = (data, status = 200, origin = "*") => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "Content-Type",
    "vary": "Origin", "cache-control": "no-store" }
});
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const corsOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "null";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: {
      "access-control-allow-origin": corsOrigin, "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type", "access-control-max-age": "86400", "vary": "Origin"
    }});
    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, configured: !!env.ELEVENLABS_API_KEY, provider: "elevenlabs" }, 200, corsOrigin);
    if (!env.ELEVENLABS_API_KEY) return json({ error: "Worker secret ELEVENLABS_API_KEY is not configured." }, 503, corsOrigin);
    if (url.pathname === "/voices" && request.method === "GET") {
      const upstream = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": env.ELEVENLABS_API_KEY } });
      const body = await upstream.json();
      if (!upstream.ok) return json({ error: body.detail?.message || "ElevenLabs voice lookup failed." }, upstream.status, corsOrigin);
      return json({ voices: (body.voices || []).map(v => ({ voice_id: v.voice_id, name: v.name, category: v.category })) }, 200, corsOrigin);
    }
    if (url.pathname === "/generate" && request.method === "POST") {
      let input;
      try { input = await request.json(); } catch { return json({ error: "Request body must be valid JSON." }, 400, corsOrigin); }
      const text = typeof input.text === "string" ? input.text.trim() : "";
      const voiceId = typeof input.voice_id === "string" ? input.voice_id.trim() : "";
      if (!text || text.length > 4500 || !voiceId) return json({ error: "Provide text (1–4,500 characters) and a voice_id." }, 400, corsOrigin);
      const upstream = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voiceId) + "?output_format=mp3_44100_128", {
        method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "content-type": "application/json", "accept": "audio/mpeg" },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
      });
      if (!upstream.ok) {
        const message = await upstream.text();
        return json({ error: "ElevenLabs error (" + upstream.status + "): " + message.slice(0, 500) }, upstream.status, corsOrigin);
      }
      const bytes = new Uint8Array(await upstream.arrayBuffer());
      let binary = "";
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return json({ audio: btoa(binary), content_type: "audio/mpeg" }, 200, corsOrigin);
    }
    return json({ error: "Not found." }, 404, corsOrigin);
  }
};