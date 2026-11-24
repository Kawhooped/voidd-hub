# VOID Podcast Studio

A local-first script-to-podcast studio published as a static app in the VOID Hub.

## App
- Open: https://kawhooped.github.io/voidd-hub/apps/void-podcast-studio/
- Scripts and episode metadata: browser localStorage.
- Speech: ElevenLabs through a Cloudflare Worker proxy.
- Audio: sequential turn generation, browser-side decoding/assembly, MP3 encoding with lamejs.
- API credentials are stored only as a Cloudflare Worker secret.

## Deploy the voice API
From \`workers/podcast-studio\`:

1. Install Wrangler: \`npm install -g wrangler\`
2. Authenticate: \`wrangler login\`
3. Set the provider key: \`wrangler secret put ELEVENLABS_API_KEY\`
4. Deploy: \`wrangler deploy\`
5. Copy the resulting \`workers.dev\` URL into Studio → Settings → Worker endpoint URL.
6. Test the connection, then load voices and select two different voices.

The Worker allows requests from the VOID GitHub Pages origin and void.life. Add another exact origin to \`ALLOWED_ORIGINS\` before using a custom domain.

## Current limits
- No server-side episode storage; browser-local data only.
- Audio is generated one dialogue turn at a time. Provider latency and account quotas apply.
- The browser decodes each generated MP3, joins PCM audio, and re-encodes a single 128 kbps MP3. The lamejs encoder is loaded from jsDelivr.
- AI script rewriting, cloud project sync, user accounts, and R2 storage are not included in this first functional slice.
- Never put an ElevenLabs key in the app settings or frontend source.
