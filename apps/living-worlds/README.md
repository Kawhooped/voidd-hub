# VOID Living Worlds

First runnable simulation prototype for the VOID AI World Engine.

## Run

Open `index.html` through a static web server or deploy this folder as a static site. ES modules and browser storage may not work when opening the file directly with a `file://` URL.

## Run with a local model

1. Open the deployed page in a browser with WebGPU support.
2. Select **Load Qwen 0.8B** and wait for the model files to download and initialize.
3. Use **Run next turn** or **Start auto**. Vexa is the first model-driven character; the other residents use scripted behavior.
4. The browser caches model assets for later sessions where supported.

Inference runs in the browser; no model API key or inference server is required. The model and Transformers.js runtime are downloaded from Hugging Face/CDN on first load. WebGPU availability and device memory determine whether it can run. If loading fails, the simulation remains usable with scripted fallback behavior.

## Current capabilities

- Four distinct marketplace residents.
- Manual actions and automatic turn progression.
- Optional Qwen 3.5 0.8B browser-local inference for Vexa.
- Scripted fallback behavior for every resident.
- Separate world state, character profiles, memories, dialogue, discoveries, and event ledger.
- Browser-local persistence using localStorage.
- Action validation: only configured action IDs can be applied.

## Architecture

- `src/world.js`: world state, character definitions, available actions, and deterministic simulation rules.
- `src/app.js`: browser interface, persistence, turn scheduling, rendering, model selection, and fallback.
- `src/qwen-adapter.js`: optional Transformers.js / Qwen 3.5 0.8B WebGPU adapter.
- `index.html`: responsive application shell.

## Agent safety boundary

The model receives a compact character context and the current allowed action list. It proposes an action ID and optional dialogue. The app validates the ID against the current action list before the simulation applies it. Model-generated text cannot directly mutate world state or trigger external actions.

## Known limitations

- Model weights are downloaded to the user's browser; the first load may be large and slow.
- WebGPU support varies by browser and device. This has not yet been verified on every target device.
- Only Vexa uses the model; the other three residents use deterministic local behavior.
- Memories persist only in the current browser and are not synchronized across devices.
- Model dialogue is separate from the deterministic world outcome text.
- Characters act sequentially, not concurrently.
