# Intelligence Beyond Models

*A useful test of intelligence is not only what a model can say, but what a system can learn and reliably do when the world pushes back.*

Language models have made intelligence look unusually easy to demonstrate: ask a question, receive a fluent answer. But fluency is only one observable capability. A system can describe a task without completing it, explain a strategy without executing it, and sound confident while missing important constraints.

This suggests a practical research question: **what changes when we evaluate intelligence through interaction with an environment rather than through answers alone?**

## From answers to feedback

An interactive system receives information from an environment, chooses an action, observes what happens, and adjusts. The feedback may come from a person, a tool, a simulator, a physical device, or the consequences of an earlier action. The important difference is that the system's next move is constrained by what actually happened.

Recent surveys of LLM-based agents describe feedback as a central design problem. A 2025 IJCAI survey groups feedback mechanisms into internal, external, multi-agent, and human feedback, and discusses how systems use feedback to revise strategies. A separate 2025 ACM survey argues that agent evaluation needs to measure more than a single answer: behavior, capability, reliability, safety, and the evaluation process itself matter.

## A working model

For research purposes, we can treat an intelligent system as a loop:

> **Observe → Model the situation → Choose → Act → Receive feedback → Update.**

The loop is a proposed evaluation lens, not a claim that every intelligent process must follow one fixed architecture.

This shifts attention from impressive demonstrations to repeatable performance. Can the system notice that an assumption was wrong? Can it recover from a failed action? Does it improve after receiving useful feedback? Can it distinguish a successful outcome from a plausible-looking one?

## What should be measured?

A practical experiment should record the result achieved, the actions taken, the feedback received, and whether later attempts improve. Cost, time, safety, and reliability also matter. A system that succeeds once but fails unpredictably may be less useful than one that succeeds modestly and consistently.

Static benchmarks remain useful for controlled comparisons. They simply do not answer every question about long-running interaction. Research on agent evaluation increasingly examines interactive tasks and deployment conditions because real environments contain changing state, tool constraints, and consequences that a fixed question set cannot fully represent.

## The research opportunity

Build small environments where an agent must accomplish a concrete objective, expose it to meaningful feedback, and compare its behavior across repeated trials. Keep the environment, success criteria, and failure cases inspectable. Publish logs or a reproducible summary when privacy and safety permit.

The larger idea is modest but useful: do not infer intelligence from presentation alone. Test what the system can learn, adapt, and accomplish under observable constraints.

**Open question:** which combination of task success, adaptation, robustness, and cost best predicts whether an AI system will be useful outside the benchmark?

## Sources

- [A Survey on the Feedback Mechanism of LLM-based AI Agents](https://ijcai.org/proceedings/2025/1175) — IJCAI 2025.
- [Evaluation and Benchmarking of LLM Agents: A Survey](https://doi.org/10.1145/3711896.3736570) — ACM SIGKDD 2025.

*VOIDD Research · Working paper · 19 November 2026. Claims and proposals are distinguished; corrections and counterexamples are welcome.*