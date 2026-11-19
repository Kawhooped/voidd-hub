# Context Is Not Memory

*Memory records what happened. Context describes the situation that matters now. Useful AI systems need ways to represent both without confusing them.*

When an AI system loses track of a conversation, the obvious response is often to give it more memory. But remembering more facts does not automatically produce a better understanding of the current situation.

A system may retain that a person owns a car, for example, while failing to represent that the car is currently unavailable, that a repair is pending, or that a particular decision depends on the repair being completed. The missing piece is not necessarily another biographical fact. It is a representation of the present situation and the relationships that make the facts relevant.

## Memory and context answer different questions

**Memory** helps answer: what was observed, said, decided, or learned before?

**Context** helps answer: what is happening, which entities and conditions matter, how are they related, and what evidence supports the current picture?

These functions overlap, but they are not interchangeable. A memory can supply evidence for a context model. The context model can also mark a fact as stale, uncertain, or irrelevant to the current task.

## Situations have structure

Research on language and integrated understanding offers a useful starting point: situations can be represented as collections of entities, their properties and relations, and patterns of change. A situation may be physical, social, legal, conceptual, or even imaginary.

That description suggests a practical representation with a few basic parts:

> **Situation = entities + properties + relations + conditions + events + evidence + uncertainty.**

This is a proposed working schema inspired by situation-based approaches to understanding, not a standardized format.

For example, “the delivery is late” is not enough by itself. A useful context model might include the delivery, the recipient, the supplier, the expected date, the latest tracking event, the dependency on the delivery, and the confidence attached to each piece of information.

## Why uncertainty belongs inside the model

Without explicit uncertainty, systems can turn guesses into facts. A context model should preserve where a statement came from, when it was observed, whether it was directly stated or inferred, and whether newer evidence contradicts it.

This also makes correction possible. If a delivery arrives, the system can update the event state without erasing the historical fact that it was late. The past remains in memory; the present context changes.

## A testable design direction

Compare two assistants on tasks that require tracking changing situations. Give one access to a conventional conversation summary. Give the other a structured situation model containing entities, relations, conditions, timestamps, evidence, and uncertainty. Measure factual accuracy, stale-assumption errors, correction speed, and task completion.

The hypothesis is that structured context may improve performance when relevance depends on changing relationships rather than isolated remembered facts. That claim needs experiments; it should not be treated as established.

**Open question:** what is the smallest situation representation that preserves enough structure to support reliable action without becoming an expensive duplicate of the entire world?

## Source

- [Language in an Integrated Understanding System](https://pmc.ncbi.nlm.nih.gov/articles/PMC7585006/) — discusses situations as entities, properties, relations, and patterns of change.

*VOIDD Research · Working paper · 19 November 2026. Claims and proposals are distinguished; corrections and counterexamples are welcome.*