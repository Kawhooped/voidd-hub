# AI World Starter

This is a reusable, model-independent simulation foundation.

## Included

- \`template.json\`: starter configuration and architecture contract.
- \`src/world-engine.js\`: simulation state, action validation, rule-mediated state updates, and compact agent context builder.

## Quick start

1. Copy this folder into a new application.
2. Create a configuration with a world object and at least one character.
3. Define a fixed action catalog with stable action IDs.
4. Create a simulation with \`createSimulation(config)\`.
5. Build the character's prompt/context with \`buildAgentContext(...)\`.
6. Ask a model to select one action ID.
7. Pass the proposal to \`applyAction(...)\`; only trusted simulation rules may change world state.

## Model contract

Input is the object returned by \`buildAgentContext\`. Expected output:

\`\`\`json
{ "actionId": "discover", "dialogue": "I found something unusual." }
\`\`\`

Treat model output as untrusted. Validate the action ID. Ignore unexpected fields. Keep external actions, purchases, messages, and account changes behind explicit application-level authorization.

## Persistence

Persist the returned simulation object in your chosen storage layer. The model does not own the authoritative world state or character memory.

## Runtime

Uses modern JavaScript modules and \`structuredClone\`. For older runtimes, provide a compatible clone implementation.
