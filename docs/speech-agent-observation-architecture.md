# Speech-to-Agent Observation Architecture

**Status:** Architecture specification  
**Date:** 2026-11-24  
**Network:** VOID Network  
**Primary objective:** Reverse the default speech/agent relationship so speech systems are observable information sources and agents can understand their spoken output, interpret the conversation, and take authorized actions.

## 1. Core design

Speech systems produce audio and/or text. A capture layer turns every relevant utterance into a normalized conversation event. A shared conversation bus distributes those events to subscribed agents. Agents interpret the conversation and, when appropriate, invoke tools through a controlled action gateway.

The speech model does not need to know which agents are listening. Agents do not need to join the live audio session. Both connect through the event layer.

**Important distinction:** When a speech provider exposes the text associated with generated speech, capture that text directly. Do not run a second speech-recognition pass over audio when an authoritative text event already exists. Use ASR only when the source provides audio without usable text.

## 2. Logical architecture

```text
 HUMAN / EXTERNAL SPEAKER
          |
          v
   SPEECH SESSION / MODEL
      |             |
      |             +---- generated text / agent message callback
      |                            |
      +---- incoming audio         |
                   |               |
                   v               v
             ASR ADAPTER       TEXT CAPTURE
                   |               |
                   +-------+-------+
                           |
                           v
                 TRANSCRIPT NORMALIZER
                           |
                           v
                 CONVERSATION EVENT BUS
                   |       |       |
                   v       v       v
                OBSERVER INTERPRETER RESEARCHER
                   |       |       |
                   +-------+-------+
                           |
                           v
                    ACTION PLANNER
                           |
                    POLICY / APPROVAL
                           |
                           v
                    ACTION GATEWAY
                           |
                    APIs / DATABASE /
                    AUTOMATIONS / UI
                           |
                           v
                   RESULT + AUDIT EVENT
                           |
                           +----> CONVERSATION BUS
```

## 3. Capture both directions

Every session should capture both sides of the exchange:

| Direction | Source | Capture method |
|---|---|---|
| Inbound | Human or external speaker → speech model | Provider user-transcript callback or ASR |
| Outbound | Speech model → human | Provider agent-message/text callback; ASR fallback for audio-only output |
| Agent-to-speech | Agent instruction → speech model | Record the instruction as an event |
| Speech-to-agent | Speech model event → agent network | Publish normalized transcript/event |

For the existing ElevenLabs client integration, the documented `onUserTranscript` callback captures user transcripts and `onMessage` captures agent messages. Treat these as provider adapters, not as the permanent event schema. Confirm the exact message roles and callback behavior against the installed SDK version during implementation.

If a model's generated audio is not accompanied by its text, send the audio through a streaming ASR adapter. Preserve the audio source timestamp and ASR confidence. Do not silently treat uncertain partial recognition as a finalized instruction.

## 4. Canonical event contract

All providers publish the same envelope. Provider-specific payloads remain available as optional metadata, not as the shared interface.

```json
{
  "schema_version": 1,
  "event_id": "uuid",
  "session_id": "session-id",
  "sequence": 42,
  "occurred_at": "2026-11-24T12:00:00.000Z",
  "received_at": "2026-11-24T12:00:00.050Z",
  "source": {
    "provider": "elevenlabs",
    "model_id": "provider-model-or-agent-id",
    "channel": "conversation"
  },
  "speaker": {
    "id": "speaker-id",
    "type": "speech_model",
    "label": "VOID Network Operator"
  },
  "direction": "outbound",
  "content": {
    "text": "The exact recognized or generated words.",
    "modality": "text",
    "language": "en",
    "is_final": true,
    "confidence": 1.0
  },
  "causation_id": "optional-parent-event-id",
  "correlation_id": "conversation-turn-id",
  "privacy": {
    "retention_class": "transcript",
    "consent_state": "configured"
  }
}
```

Rules:
- `direction` is relative to the speech session: `inbound` or `outbound`.
- `speaker.type` distinguishes human, speech_model, agent, and system.
- Partial and final transcript events are distinct; final events supersede partials for the same utterance.
- Keep original timestamps, provider identity, confidence, and sequence.
- Use stable event IDs and idempotent consumers to prevent duplicate actions.
- Never store credentials, access tokens, or secrets in transcript events.

## 5. Conversation bus and storage

Use a small gateway service as the live event broker. It should expose:
- Authenticated event ingestion over HTTPS.
- Live subscriptions over WebSocket or Server-Sent Events.
- Session-scoped access control.
- Replay from a durable event log after reconnect.
- Per-agent subscriptions and filters.
- Health, delivery, retry, and dead-letter visibility.

Keep the first implementation portable:
1. Static VOID Network UI hosted from GitHub Pages.
2. Workshop Gateway as the authenticated server-side boundary.
3. A lightweight append-only event store behind the gateway.
4. In-memory pub/sub for live delivery, with durable writes before acknowledging finalized events.

Do not make Supabase or another paid database a prerequisite. The storage adapter should be replaceable. A local SQLite-backed service is a suitable first durable store if the gateway host supports persistent disk; otherwise select a durable store supported by the chosen host before implementation. GitHub files are configuration/source-of-truth records, not a live transcript database.

## 6. Agent subscription model

Agents subscribe to event types and sessions rather than receiving every raw event by default.

| Agent role | Reads | Produces |
|---|---|---|
| Observer | All permitted finalized transcript events | Conversation summaries, notable events |
| Interpreter | Relevant utterances and context | Intent, entities, requests, uncertainty |
| Researcher | Routed questions and references | Evidence and findings |
| Planner | Interpreted intent, state, policy | Proposed action with rationale |
| Executor | Approved, typed action requests | Tool calls and execution results |
| Auditor | Events, approvals, tool results | Audit records and verification |

Each agent receives a bounded context window plus a way to retrieve earlier session events. Agents should not independently execute arbitrary actions just because a phrase appears in a transcript.

## 7. Action pipeline and safety

Use a strict sequence:

1. **Capture:** receive speech text or transcribe audio.
2. **Finalize:** distinguish partial recognition from a completed utterance.
3. **Interpret:** extract intent, entities, requested operation, and confidence.
4. **Plan:** produce a typed action proposal.
5. **Authorize:** check identity, permissions, risk class, and approval requirement.
6. **Execute:** call only allowlisted tools through Workshop Gateway.
7. **Verify:** inspect the actual tool result.
8. **Record:** publish action result and audit event back to the bus.

Action classes:
- Read-only: may run automatically within granted scope.
- Reversible low-impact writes: may run under explicit preauthorization.
- External communication, purchases, destructive changes, credential/security changes, or other high-impact actions: require human confirmation.
- Unclear, low-confidence, conflicting, or partial speech: ask for clarification; do not execute.

A transcript is evidence of what was said, not proof of authorization. Speaker identification is not authentication.

## 8. Loop prevention and concurrency

Because agents may speak through the same speech system they observe:
- Tag every event with speaker type, direction, source, and causation ID.
- Mark agent-generated speech as agent-originated even when rendered by a speech model.
- Do not let an agent react to its own action/result event as a new user instruction.
- Use correlation IDs, idempotency keys, and bounded event depth.
- Separate transcript observation from command authorization.
- Define one owner for each action type to avoid competing agents executing the same task.
- Add cooldowns or explicit turn boundaries for agent-to-agent speech.

## 9. Privacy and retention

- Capture only sessions for which the relevant participants have been informed and the required consent has been obtained.
- Make transcript capture, storage, replay, and deletion policies visible.
- Default to text-only storage; retain raw audio only when a defined feature requires it.
- Apply session-level access control and encryption in transit and at rest.
- Define retention periods and deletion behavior before enabling persistent recording.
- Keep private conversation content out of public project registries and public Git repositories.

## 10. Implementation phases

### Phase A — Observe existing speech
- Inspect the current VOID Network Operator agent and voice-network client.
- Verify which inbound and outbound transcript callbacks are available.
- Capture both sides in a local session timeline.
- Confirm speaker labels, event ordering, partial/final behavior, and reconnect behavior.

**Exit test:** A single test conversation displays both the human's words and the speech model's words as separate, correctly ordered events.

### Phase B — Normalize and distribute
- Implement the canonical event schema.
- Add authenticated ingestion and live subscriptions to Workshop Gateway.
- Add session event persistence and replay.
- Add one read-only Observer agent subscription.

**Exit test:** Observer receives each finalized event once, including after reconnect/replay, without needing to join the voice session.

### Phase C — Understand
- Add Interpreter extraction for intent, entities, questions, commitments, and uncertainty.
- Link interpretations to source event IDs.
- Add searchable session history and summaries.

**Exit test:** Given a test conversation, the system extracts the requested task and cites the exact transcript events supporting it.

### Phase D — Act safely
- Add Planner and typed action proposals.
- Add allowlisted read-only tools first.
- Add approval gates, idempotency, result verification, and audit events.
- Enable limited preauthorized writes only after successful tests.

**Exit test:** A spoken request can trigger an approved test action, with a trace from transcript event to authorization, tool call, and verified result.

### Phase E — Multi-agent operation
- Add role-based subscriptions and routing.
- Add conflict resolution and task ownership.
- Add dashboard controls for sessions, listeners, events, actions, and failures.

**Exit test:** Multiple agents can observe one conversation and coordinate without duplicate or unauthorized execution.

## 11. Initial acceptance tests

1. Human speech is transcribed and delivered to Observer.
2. Speech-model output is captured from its text callback without redundant ASR.
3. Audio-only model output is transcribed by ASR and marked with ASR provenance/confidence.
4. Partial transcripts never trigger actions.
5. A finalized utterance is delivered once, even after retry.
6. Agent-generated speech does not create an execution feedback loop.
7. An ambiguous instruction produces a clarification request.
8. A read-only request executes through an allowlisted tool and its result is verified.
9. A high-impact request waits for explicit human approval.
10. Unauthorized agents cannot read another session's events.
11. Reconnecting subscribers can replay missed events in order.
12. Transcript retention and deletion policies are enforced.

## 12. First implementation target

Start with the existing **VOID Network Operator** and its current voice-network page. Do not create a new fleet of speech agents yet.

Build the smallest vertical slice:
- Capture ElevenLabs inbound and outbound text callbacks.
- Normalize them into the event envelope.
- Display both speaker streams in a session timeline.
- Deliver finalized events to one Observer.
- Keep all actions disabled initially.

Once observation is reliable, add interpretation and then controlled execution.

## Key architectural principle

**Speech is an input/output channel. The conversation stream is shared intelligence infrastructure. Agents are independent observers and operators of that stream.**
