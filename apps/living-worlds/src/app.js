import { createWorld, takeTurn, resetWorld, getAvailableActions } from "./world.js";

const STORAGE_KEY = "void-living-worlds-v1";
let world = loadWorld();
let selectedId = world.characters[0].id;
let autoTimer = null;

const $ = (id) => document.getElementById(id);
function loadWorld() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.schemaVersion === 1 && Array.isArray(saved.characters)) return saved;
  } catch (_) {}
  return createWorld();
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(world)); }
  catch (_) { $("status").textContent = "Storage unavailable; this session may not persist after closing."; }
}
function selected() { return world.characters.find((c) => c.id === selectedId) || world.characters[0]; }
function render() {
  $("turnNumber").textContent = world.turn;
  $("location").textContent = world.location;
  $("sceneTitle").textContent = world.scene.title;
  $("sceneText").textContent = world.scene.description;
  $("credits").textContent = world.credits;
  $("artifacts").textContent = world.artifacts.length;
  $("discoveries").textContent = world.discoveries.length;
  $("characters").innerHTML = world.characters.map((c) =>
    '<button class="character ' + (c.id === selectedId ? "selected" : "") + '" data-character="' + c.id + '">' +
    '<div class="portrait">' + c.emoji + '</div><strong>' + escapeHtml(c.name) + '</strong><small>' +
    escapeHtml(c.role) + " · " + escapeHtml(c.mood) + "</small></button>"
  ).join("");
  document.querySelectorAll("[data-character]").forEach((button) => button.addEventListener("click", () => {
    selectedId = button.dataset.character; render();
  }));
  const c = selected();
  $("profile").innerHTML = "<div class='tag'>" + escapeHtml(c.role) + "</div><h3>" + escapeHtml(c.emoji + " " + c.name) +
    "</h3><p>" + escapeHtml(c.personality) + "</p><p><b>Goal:</b> " + escapeHtml(c.goal) +
    "</p><p><b>Relationship notes:</b> " + escapeHtml(c.relationships) + "</p><h3>Recent memories</h3><div class='memory'>" +
    (c.memories.slice(-5).reverse().map(escapeHtml).join("\n") || "No memories yet.") + "</div>";
  const actions = getAvailableActions(world, c);
  $("actions").innerHTML = actions.map((a) => '<button data-action="' + a.id + '">' + escapeHtml(a.label) + "</button>").join("");
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
    performTurn(selectedId, button.dataset.action);
  }));
  $("dialogue").innerHTML = world.dialogue.slice(-8).reverse().map((line) =>
    '<article class="entry"><strong>' + escapeHtml(line.speaker) + '</strong><p>' + escapeHtml(line.text) + "</p></article>"
  ).join("") || '<p class="memory">The market is waiting for its first visitor.</p>';
  $("eventLog").innerHTML = world.events.slice(-10).reverse().map((e) =>
    "<div><b>Turn " + e.turn + ":</b> " + escapeHtml(e.text) + "</div>"
  ).join("");
  save();
}
function performTurn(characterId, actionId) {
  const result = takeTurn(world, characterId, actionId);
  if (!result.ok) { $("status").textContent = result.error; return; }
  world = result.world;
  selectedId = characterId;
  $("status").textContent = result.message;
  render();
}
function runNext() {
  const c = world.characters[world.turn % world.characters.length];
  const actions = getAvailableActions(world, c);
  const choice = chooseLocalAction(world, c, actions);
  performTurn(c.id, choice.id);
}
function chooseLocalAction(state, character, actions) {
  const preferences = {
    vexa: ["discover", "trade", "inspect", "travel"],
    orun: ["inspect", "discover", "trade", "travel"],
    miri: ["travel", "discover", "inspect", "trade"],
    takk: ["trade", "inspect", "discover", "travel"]
  };
  const preferred = preferences[character.id] || [];
  const ordered = [...actions].sort((a, b) => preferred.indexOf(a.id) - preferred.indexOf(b.id));
  const offset = (state.turn + character.memories.length) % Math.min(2, ordered.length);
  return ordered[offset] || actions[0];
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
$("nextTurn").addEventListener("click", runNext);
$("runFive").addEventListener("click", () => { for (let i = 0; i < 5; i++) runNext(); });
$("autoRun").addEventListener("click", () => {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; $("autoRun").textContent = "Start auto"; $("status").textContent = "Simulation paused."; }
  else { autoTimer = setInterval(runNext, 1800); $("autoRun").textContent = "Pause auto"; $("status").textContent = "Simulation running. Watch the event ledger."; }
});
$("reset").addEventListener("click", () => {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; $("autoRun").textContent = "Start auto"; }
  world = resetWorld(); selectedId = world.characters[0].id; $("status").textContent = "The marketplace has been reset."; render();
});
render();

// Future model adapter contract: send only the current character's relevant context and
// allowed action IDs. Validate the returned action against getAvailableActions before use.
// Never let model-generated text directly mutate world state or perform external actions.
export const modelAdapter = {
  async chooseAction(_context) {
    return null; // null means use the deterministic local fallback above
  }
};