export function createWorld() {
  return {
    schemaVersion: 1, turn: 0, location: "The Glass Arcade · Bazaar District",
    scene: { title: "A quiet hour between trades", description: "Lanterns drift beneath the vaulted ceiling. Four merchants consider what the day might bring." },
    credits: 30, artifacts: [{ id: "prism-seed", name: "Prism seed", owner: "market" }],
    discoveries: [], events: [], dialogue: [],
    characters: [
      { id: "vexa", name: "Vexa", emoji: "🦑", role: "Concept merchant", personality: "Curious, quick-witted, and always alert to an unusual opportunity.", goal: "Discover and trade rare concepts.", mood: "intrigued", relationships: "Respects Orun's knowledge; enjoys teasing Takk.", memories: [] },
      { id: "orun", name: "Orun", emoji: "🪐", role: "Knowledge keeper", personality: "Patient, precise, and skeptical of claims without evidence.", goal: "Collect and verify useful knowledge.", mood: "thoughtful", relationships: "Often advises Vexa; finds Miri's leaps intriguing.", memories: [] },
      { id: "miri", name: "Miri", emoji: "🪲", role: "Dimensional explorer", personality: "Playful, adventurous, and fascinated by unfamiliar places.", goal: "Find new locations and bring back curiosities.", mood: "restless", relationships: "Partners with Vexa on expeditions; competes with Takk.", memories: [] },
      { id: "takk", name: "Takk", emoji: "🦊", role: "Collector and trader", personality: "Competitive, persuasive, and secretly sentimental about rare objects.", goal: "Build the marketplace's most valuable collection.", mood: "calculating", relationships: "Rivals Vexa in trade; trusts Orun's appraisals.", memories: [] }
    ]
  };
}
export function resetWorld() { return createWorld(); }
export function getAvailableActions(world, character) {
  const actions = [
    { id: "discover", label: "Search for a strange idea" },
    { id: "trade", label: "Offer a trade" },
    { id: "inspect", label: "Study the prism seed" },
    { id: "travel", label: "Visit the Echo Garden" }
  ];
  if (world.credits < 3) return actions.filter((a) => a.id !== "trade");
  return actions;
}
const outcomes = {
  vexa: {
    discover: ["Vexa finds a folded map that only shows places someone has imagined but never built.", "A tiny glass animal offers Vexa a riddle in exchange for a new name."],
    trade: ["Vexa trades three credits for a rumor about a library that rearranges its shelves according to visitors' questions.", "Vexa offers a sketch of a self-watering city to the market and receives three credits."],
    inspect: ["Vexa notices the prism seed changes color when two nearby people disagree.", "Vexa discovers a faint melody inside the prism seed."],
    travel: ["Vexa visits the Echo Garden and returns with a seed that remembers the weather of places it has never visited."]
  },
  orun: {
    discover: ["Orun finds a catalog of claims, each marked with the evidence needed to test it.", "Orun discovers a pocket-sized observatory that measures questions rather than stars."],
    trade: ["Orun exchanges a verified navigation chart for three credits.", "Orun buys an annotated field note and records which parts remain uncertain."],
    inspect: ["Orun determines that the prism seed's color change is an observation, not proof of its origin.", "Orun records a test: compare the seed's color when people agree, disagree, and say nothing."],
    travel: ["Orun visits the Echo Garden and documents three unusual plants without guessing how they work."]
  },
  miri: {
    discover: ["Miri discovers a doorway drawn in chalk that opens only when someone tells it a new possibility.", "Miri meets a traveler who collects sounds from future machines."],
    trade: ["Miri swaps a curious shell for a map to a floating night market.", "Miri trades a story about a moonlit train for three credits."],
    inspect: ["Miri taps the prism seed and hears a distant market bell.", "Miri notices the seed casts a shadow shaped like a doorway."],
    travel: ["Miri explores the Echo Garden and finds a bridge made from forgotten directions."]
  },
  takk: {
    discover: ["Takk finds a sealed auction notice for an idea that has not been invented yet.", "Takk discovers a collector who values unfinished prototypes more than finished products."],
    trade: ["Takk sells a duplicate trinket for three credits and adds the profit to the ledger.", "Takk negotiates a future exchange for a rare instrument made of magnetic dust."],
    inspect: ["Takk estimates the prism seed could be valuable, but asks Orun to verify its properties.", "Takk spots a tiny maker's mark beneath the prism seed's surface."],
    travel: ["Takk visits the Echo Garden and returns with a pressed flower whose pattern resembles a market map."]
  }
};
const nextScenes = [
  { title: "A rumor crosses the arcade", description: "A traveler whispers about a place where abandoned inventions gather dust and wait for a second chance." },
  { title: "The lanterns change color", description: "The market lights turn pale blue. Somewhere nearby, a door has appeared where no door stood before." },
  { title: "A quiet negotiation", description: "Two merchants compare notes while the bazaar's little mechanisms click and turn overhead." },
  { title: "The Echo Garden calls", description: "A soft chime drifts in from the garden. The path there seems a little longer than it did yesterday." }
];
export function takeTurn(world, characterId, actionId, dialogueOverride = "") {
  const character = world.characters.find((c) => c.id === characterId);
  if (!character) return { ok: false, error: "That resident is not part of this world." };
  const action = getAvailableActions(world, character).find((a) => a.id === actionId);
  if (!action) return { ok: false, error: "That action is unavailable." };
  const options = outcomes[character.id]?.[actionId];
  if (!options) return { ok: false, error: "No local behavior is configured for that action." };
  const text = options[world.turn % options.length];
  const spoken = typeof dialogueOverride === "string" && dialogueOverride.trim()
    ? dialogueOverride.trim().slice(0, 180)
    : text;
  const next = structuredClone(world);
  const nextCharacter = next.characters.find((c) => c.id === characterId);
  next.turn += 1;
  if (actionId === "trade") next.credits = Math.max(0, next.credits + (character.id === "takk" ? 2 : 1));
  if (actionId === "discover" || actionId === "travel") {
    next.discoveries.push({ turn: next.turn, character: character.name, text });
  }
  if (actionId === "travel") next.location = "The Echo Garden · Outer Arcade";
  if (actionId === "inspect") next.location = "The Glass Arcade · Artifact Gallery";
  if (actionId === "discover" || actionId === "trade") next.location = "The Glass Arcade · Bazaar District";
  nextCharacter.memories.push("Turn " + next.turn + ": " + text);
  nextCharacter.mood = ["intrigued", "thoughtful", "restless", "pleased"][(next.turn + next.characters.indexOf(nextCharacter)) % 4];
  next.events.push({ turn: next.turn, text: nextCharacter.name + " — " + action.label + "." });
  next.dialogue.push({ speaker: nextCharacter.name, text: spoken });
  next.scene = nextScenes[(next.turn - 1) % nextScenes.length];
  return { ok: true, world: next, message: character.name + " completed: " + action.label + "." };
}
