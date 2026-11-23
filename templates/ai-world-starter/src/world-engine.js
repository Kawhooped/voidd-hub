// Model-independent simulation core for VOID AI World Starter.
// The model proposes an action; this module validates and applies it.
export function createSimulation(config) {
  if (!config || !Array.isArray(config.characters) || config.characters.length === 0) {
    throw new Error("Simulation config requires at least one character.");
  }
  return {
    schemaVersion: 1,
    turn: 0,
    world: structuredClone(config.world || { name: "New World", location: "Starting area" }),
    characters: config.characters.map((character) => ({
      ...structuredClone(character),
      memories: [],
      relationships: character.relationships || {}
    })),
    events: []
  };
}
export function getCharacter(simulation, characterId) {
  return simulation.characters.find((character) => character.id === characterId) || null;
}
export function validateProposal(simulation, characterId, proposal, actionCatalog) {
  const character = getCharacter(simulation, characterId);
  if (!character) return { ok: false, reason: "unknown_character" };
  if (!proposal || typeof proposal.actionId !== "string") return { ok: false, reason: "invalid_proposal" };
  const allowed = actionCatalog.filter((action) =>
    action.enabled !== false && (!action.roles || action.roles.includes(character.role))
  );
  const action = allowed.find((candidate) => candidate.id === proposal.actionId);
  if (!action) return { ok: false, reason: "action_not_allowed" };
  return { ok: true, action, character };
}
export function applyAction(simulation, characterId, proposal, actionCatalog, rules = {}) {
  const validation = validateProposal(simulation, characterId, proposal, actionCatalog);
  if (!validation.ok) return { ok: false, reason: validation.reason, simulation };
  const next = structuredClone(simulation);
  const character = getCharacter(next, characterId);
  const action = validation.action;
  const result = typeof rules.resolve === "function"
    ? rules.resolve({ simulation: next, character, action, proposal })
    : { description: action.description || character.name + " performed " + action.label + "." };
  if (!result || result.accepted === false) {
    return { ok: false, reason: result?.reason || "world_rule_rejected", simulation };
  }
  next.turn += 1;
  if (result.worldPatch && typeof result.worldPatch === "object") {
    next.world = { ...next.world, ...result.worldPatch };
  }
  const description = String(result.description || action.label).slice(0, 500);
  character.memories.push({ turn: next.turn, text: description });
  character.memories = character.memories.slice(-30);
  next.events.push({ turn: next.turn, characterId, actionId: action.id, description });
  return { ok: true, simulation: next, event: next.events[next.events.length - 1] };
}
export function buildAgentContext(simulation, characterId, actionCatalog, knowledge = []) {
  const character = getCharacter(simulation, characterId);
  if (!character) throw new Error("Unknown character: " + characterId);
  const availableActions = actionCatalog.filter((action) =>
    action.enabled !== false && (!action.roles || action.roles.includes(character.role))
  ).map(({ id, label, description }) => ({ id, label, description }));
  return {
    world: simulation.world,
    turn: simulation.turn,
    character: {
      id: character.id, name: character.name, role: character.role,
      personality: character.personality, goal: character.goal,
      memories: character.memories.slice(-8)
    },
    availableActions,
    relevantKnowledge: knowledge.slice(0, 8)
  };
}
// Expected model output: { "actionId": "known-action-id", "dialogue": "optional short line" }
// Never apply model-generated world patches directly. Resolve all effects in trusted rules code.
