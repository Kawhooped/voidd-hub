# Bot Detect: Behavior Before Labels

*Automation is not automatically malicious. A careful detection system should observe behavior, preserve evidence, and classify intent cautiously.*

The word “bot” often gets used as if it describes a single kind of threat. It does not. Automated systems can perform useful tasks, assist people, test websites, index public information, or abuse services. Treating all automation as malicious creates false alarms and makes legitimate activity harder to understand.

A more useful starting point is to separate three questions: **is this activity automated, what behavior is being observed, and does the behavior indicate abuse?**

## Behavior contains more than content

Some detection methods examine request rates, navigation patterns, timing, browser characteristics, or interaction signals. Research on advanced web bots has explored combining web logs with mouse-movement behavior, finding that multiple signal types can be more robust than relying on one signal alone. Earlier work on social bots also distinguishes detection approaches by the behavioral and network evidence they use.

These studies do not establish a universal detector. They show why a single clue is rarely enough. A fast sequence of requests may come from a crawler, a monitoring tool, a human using automation, or an abusive script. The surrounding behavior and purpose matter.

## Separate automation from abuse

> **Observe → Collect evidence → Estimate automation → Assess harmful behavior → Decide proportionately.**

This is a cautious workflow proposal. It is not a claim that intent can always be inferred reliably from telemetry.

A detector should avoid jumping directly from “unusual” to “malicious.” It can instead preserve a confidence level, record the signals that contributed to the assessment, and allow uncertain cases to remain uncertain. Where appropriate, the response can be graduated: observe, rate-limit, challenge, or block only when the evidence and risk justify it.

## Build for false positives, not just detection rates

A useful evaluation should include legitimate automation, assistive technologies, privacy tools, unusual but human behavior, and modern AI agents. Measure false-positive rates alongside detection rates. Test across different devices, connection conditions, and user populations. Avoid collecting sensitive behavioral data unless it is necessary, proportionate, and properly disclosed.

## A small independent experiment

Start with a local test environment and a handful of controlled traffic patterns: ordinary browsing, scripted navigation, scheduled monitoring, high-frequency requests, and deliberately abusive sequences. Record only the minimum signals needed. Compare simple rules with a cautious classifier, then inspect every false positive.

The goal is not to build a machine that labels people. It is to build a system that recognizes patterns of activity, explains why a pattern was flagged, and avoids claiming more than the evidence supports.

**Open question:** can a lightweight detector distinguish benign automation from harmful automation using a small, privacy-conscious set of behavioral signals?

## Sources

- [Detection of Advanced Web Bots by Combining Web Logs with Mouse Behavioural Biometrics](https://doi.org/10.1145/3447815) — *Digital Threats: Research and Practice*, 2021.
- [Detection of malicious social bots: A survey and a refined taxonomy](https://www.sciencedirect.com/science/article/pii/S0957417420302074) — *Expert Systems with Applications*, 2020.

*VOIDD Research · Working paper · 19 November 2026. Claims and proposals are distinguished; corrections and counterexamples are welcome.*