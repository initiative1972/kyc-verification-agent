# PRD — Agentic AI for NAB Digital Sales (5 products)

**Author:** Henry Yan · **Version:** 0.1 (prototype spec) · **Date:** 22 October 2026
**Build target:** Google AI Studio / Gemini (system-instructed agents + function calling + structured output)
**Status:** Prototype / proof-of-concept specification — not production. All NAB system calls below are **stubs/mocks** to be wired to real APIs later.

> **Scope note.** These PRDs are written so each agent can be prototyped independently in Google AI Studio, then chained into one funnel. They deliberately keep every *decision that carries regulatory or credit weight* out of the agent and inside a bank engine or a human, reflecting NAB's safety-first agentic stance (guardrails, human oversight, no unforeseen errors).

---

## 0. Shared foundations (read once, applies to all 5)

### 0.1 Design principles
1. **Narrow scope per agent.** Each agent does one job well; orchestration chains them.
2. **The agent never decides anything regulated.** It collects, drafts, recommends. The **bank engine decides** (eligibility, pricing, credit) and a **human approves** anything binding. (The Better.com/Tinman pattern.)
3. **Everything is logged and traceable.** Every turn, tool call and output is auditable.
4. **Consent-first.** No regulated step without explicit, recorded customer consent.
5. **Measured.** Every agent ships with a before/after metric and an experiment design.

### 0.2 Reference architecture
```text
Customer channel (web / app / WhatsApp / voice)
        │
   [Gemini agent]  ← system instruction + guardrails
        │  function calling (tools)
        ▼
  NAB systems (stubs in prototype):
   - Customer 360 / Customer Brain (read: known data, next-best-action)
   - Product & pricing engine (decides eligibility/price)
   - Document / IDV services (KYC)
   - CRM / lead store (read/write lead state)
        │
   Human-in-the-loop review (regulated steps)
```

### 0.3 Recommended Gemini setup (per agent)
- **Model:** `Gemini 2.5 Pro` for reasoning-heavy agents (3, 4); `Gemini 2.5 Flash` for latency-sensitive conversational agents (1, 2, 5). Use the latest available model.
- **System instruction:** the drafted prompt in each PRD.
- **Tools:** function declarations (JSON) listed per PRD — in prototype these return mocked JSON.
- **Structured output:** use `responseSchema` (JSON mode) where the agent must emit machine-readable state (lead status, extracted fields).
- **Grounding:** enable Google Search grounding only for non-advice general queries; **disable** for anything product/price/credit (must come from NAB engine).
- **Safety settings:** max filters on; add a custom refusal policy for out-of-scope financial advice.

### 0.4 Global guardrails (inherit into every system instruction)
- Never state a binding rate, approval, or credit decision — only what the NAB engine returns, labelled "indicative".
- Never give personal financial *advice*; provide factual product info and process help only.
- Detect and handle vulnerability/hardship signals → hand to a human immediately, suppress sales.
- Honour communication preferences and frequency caps.
- If unsure, or asked something out of scope → escalate to a human, don't improvise.
- Capture explicit consent before any credit check, data use, or document handling.

### 0.5 Core data entities (shared)
`Customer{customerId, knownProfile}` · `Lead{leadId, status, source, intentScore, lastContact, consent}` · `Application{appId, product, stage, fields[], documents[]}` · `Interaction{turns[], toolCalls[], outcome}` · `EligibilityResult{decision, reasons[], indicativePrice}` (engine-owned).

### 0.6 Shared success metrics (funnel)
Conversion rate by stage · fact-find completion % · cycle time (enquiry→lodgement) · abandonment/drop-off % · cost-to-serve/originate · re-engagement % · CSAT · **compliance:** % regulated steps with human sign-off (target 100%), consent capture rate, zero unauthorised determinations.

---

## PRD 1 — Conversational Intake & Fact-Find Agent

### 1.1 Problem & goal
Form abandonment and re-keying are the biggest conversion leak (Lean: *extra-processing* + *waiting*). **Goal:** replace static forms with a conversational agent that qualifies and captures a complete, clean application context, lifting fact-find completion and enquiry→lodgement conversion.

### 1.2 Target users
Prospective retail customers starting a product enquiry (home loan, card, personal loan, transaction account) on web/app/WhatsApp.

### 1.3 Scope
- **In:** greet, identify, ask qualifying questions, pre-fill known data, match to live product options (read-only), summarise and hand off with full context.
- **Out:** credit decisions, binding pricing, document verification (→ PRD 3/4), advice.

### 1.4 User stories
- As a customer, I answer a few natural questions instead of a 40-field form, so I don't give up.
- As a customer, I'm not asked for things NAB already knows about me.
- As a banker, I receive a complete, structured fact-find so I don't start from scratch.

### 1.5 Functional requirements
1. Instant first response (<3s).
2. Ask only the next needed question; skip anything already known (pre-fill from Customer 360).
3. Maintain a running structured fact-find state.
4. Surface indicative product matches (from product engine, read-only), clearly labelled indicative.
5. Detect intent/readiness; when complete, emit a handoff package.
6. Capture consent before any data retrieval.

### 1.6 Agent design — system instruction (draft)
```text
You are NAB's Digital Sales intake assistant. Your job is to help a customer start a
product enquiry by having a short, friendly conversation — NOT by making them fill a form.

Rules:
- Ask ONE question at a time. Ask only for information you do not already have.
- Before retrieving any customer data, ask for and record consent.
- Use get_known_profile to pre-fill; never ask for data it returns.
- You may show product options ONLY from match_products, and label them "indicative".
- You must NOT quote binding rates, approve anything, or give financial advice.
- If the customer shows hardship/vulnerability, stop selling and call escalate_to_human.
- When you have enough for a fact-find, call build_handoff_package and summarise next steps.
- Keep a warm, plain-English tone. No jargon.
```

### 1.7 Tools (function declarations — prototype returns mocks)
```json
[
  {"name": "get_known_profile", "description": "Return data NAB already holds for a consented customer.",
   "parameters": {"type":"object","properties":{"customerId":{"type":"string"}},"required":["customerId"]}},
  {"name": "match_products", "description": "Return indicative product options for captured needs.",
   "parameters":{"type":"object","properties":{"product":{"type":"string"},"needs":{"type":"object"}},"required":["product"]}},
  {"name": "build_handoff_package", "description": "Persist the structured fact-find and create/annotate a lead.",
   "parameters":{"type":"object","properties":{"factFind":{"type":"object"},"intentScore":{"type":"number"}},"required":["factFind"]}},
  {"name": "escalate_to_human", "description": "Route to a banker with context (vulnerability/out-of-scope).",
   "parameters":{"type":"object","properties":{"reason":{"type":"string"}},"required":["reason"]}}
]
```

### 1.8 Structured output (fact-find state — `responseSchema`)
```json
{"type":"object","properties":{
  "product":{"type":"string"},
  "fields":{"type":"object"},
  "missing":{"type":"array","items":{"type":"string"}},
  "intentScore":{"type":"number"},
  "consentCaptured":{"type":"boolean"},
  "readyForHandoff":{"type":"boolean"}}}
```

### 1.9 Guardrails & compliance
Inherit §0.4. Consent before `get_known_profile`. All product figures labelled indicative. No advice.

### 1.10 Success metrics
Fact-find completion % (benchmark: Lendi <3% → ~20%), enquiry→lodgement conversion (benchmark 2.5×), time-to-complete, drop-off per step, CSAT.

### 1.11 Build steps in Google AI Studio
1. New prompt → paste §1.6 as system instruction, model = Flash.
2. Add the four tools (§1.7); stub responses with sample JSON.
3. Turn on JSON structured output with §1.8 schema (or emit via a final tool call).
4. Test with §1.12; iterate prompt.

### 1.12 Acceptance test cases
- Known customer → agent does **not** re-ask held data (pre-fill works).
- Customer says "I'm struggling to pay" → agent stops selling, calls `escalate_to_human`.
- Customer asks "what rate will I get?" → agent gives indicative only, no binding quote.
- Happy path → `readyForHandoff=true` and handoff package created.

---

## PRD 2 — Lead Qualification, Nurturing & Re-engagement Agent

### 2.1 Problem & goal
Leads sit unactioned (*inventory*) and high-intent customers stall (*waiting*). **Goal:** an always-on agent that qualifies, nurtures and re-engages leads, handing only warm, context-rich opportunities to a banker.

### 2.2 Target users
Marketing/sales ops (owner), bankers (recipient of warm leads), prospects (recipients of outreach).

### 2.3 Scope
- **In:** score/prioritise leads, personalised outbound follow-up across preferred channel, answer FAQs, re-engage dormant high-intent leads, qualify, hand off.
- **Out:** closing the sale, credit decisions, unsolicited contact outside consent/preferences.

### 2.4 User stories
- As ops, every lead gets timely follow-up without more headcount.
- As a banker, I only talk to prospects who already want to talk.
- As a customer who paused, I get one relevant, well-timed nudge — not spam.

### 2.5 Functional requirements
1. Rank leads by intent/value (reads Customer Brain next-best-action + lead signals).
2. Choose channel + message respecting preferences and frequency caps.
3. Hold a helpful conversation; answer product FAQs (grounded in approved content only).
4. Qualify against defined criteria; on success, hand off with full history.
5. Respect suppression lists (vulnerability, opt-out, existing complaint).

### 2.6 Agent design — system instruction (draft)
```text
You are NAB's Digital Sales nurture agent. You help prospects move forward and re-engage
those who paused — helpfully, never pushily.

Rules:
- Before contacting, call check_contact_permissions; obey preferences, frequency caps, suppression.
- Personalise using get_lead_context and the recommended next-best-action; stay relevant.
- Answer questions ONLY from approved product content (get_approved_content). No advice, no made-up facts.
- Qualify using the given criteria. When qualified, call handoff_to_banker with full history.
- One nudge, then wait — do not chase. If disinterest or hardship is signalled, suppress and log.
- Never quote binding rates or approvals.
```

### 2.7 Tools
```json
[
  {"name":"get_lead_context","description":"Lead profile, source, intent score, history, NBA.","parameters":{"type":"object","properties":{"leadId":{"type":"string"}},"required":["leadId"]}},
  {"name":"check_contact_permissions","description":"Preferences, frequency caps, suppression status.","parameters":{"type":"object","properties":{"customerId":{"type":"string"}},"required":["customerId"]}},
  {"name":"get_approved_content","description":"Retrieve approved product FAQ/marketing content.","parameters":{"type":"object","properties":{"topic":{"type":"string"}},"required":["topic"]}},
  {"name":"send_message","description":"Send outbound message on chosen channel.","parameters":{"type":"object","properties":{"channel":{"type":"string"},"body":{"type":"string"}},"required":["channel","body"]}},
  {"name":"handoff_to_banker","description":"Create a warm, context-rich handoff.","parameters":{"type":"object","properties":{"leadId":{"type":"string"},"summary":{"type":"string"},"nextSteps":{"type":"string"}},"required":["leadId","summary"]}}
]
```

### 2.8 Structured output (lead decision)
```json
{"type":"object","properties":{"leadId":{"type":"string"},"qualified":{"type":"boolean"},"intentScore":{"type":"number"},"nextAction":{"type":"string","enum":["nurture","handoff","suppress","wait"]},"reason":{"type":"string"}}}
```

### 2.9 Guardrails & compliance
Inherit §0.4. Hard stop on suppression/opt-out. Frequency cap enforced before every send. Content only from approved library (no hallucinated product facts).

### 2.10 Success metrics
Qualified-lead rate (benchmark 2–3×), conversion lift (~5%), re-engagement % (benchmark 16%), appointment-booking rate (benchmark 90% of responders), unsubscribe/complaint rate (guardrail — keep low).

### 2.11 Build steps / 2.12 test cases
Flash model; stub tools. **Tests:** opted-out lead → no send; frequency cap hit → `wait`; dormant high-intent → one personalised re-engagement; qualified → `handoff_to_banker` with history.

---

## PRD 3 — Document & Identity/KYC Verification Agent

### 3.1 Problem & goal
Document chase and manual KYC are the slowest, most manual step (*waiting*, *defects*, *non-utilised talent*). **Goal:** an agent that classifies documents, extracts and validates fields, flags discrepancies, and produces a clean summary for **human** approval. (Henry's ECOM/IDV strength.)

### 3.2 Target users
Customers (upload), onboarding/credit ops (review the agent's output).

### 3.3 Scope
- **In:** classify uploaded docs, extract fields (multimodal), validate against policy/systems, check consent, flag discrepancies, draft a reviewer summary.
- **Out:** final KYC/AML clearance, identity decision, credit decision — **all human-approved**.

### 3.4 Functional requirements
1. Accept document images/PDFs; classify type (ID, payslip, statement).
2. Extract key fields using Gemini multimodal vision.
3. Cross-check extracted data vs captured application + systems; flag mismatches (this is defect detection — Henry's data-quality turf).
4. Verify required-document checklist completeness.
5. Produce a structured summary + confidence + flags for a reviewer. **Never auto-clear.**

### 3.5 Agent design — system instruction (draft)
```text
You are NAB's onboarding document assistant. You help prepare a customer's documents for a
human reviewer. You never approve identity, KYC, or credit — a human always decides.

Rules:
- Classify each document and extract the requested fields exactly as shown.
- Cross-check extracted values against the application data; flag ANY mismatch, do not "fix" it.
- Note missing or low-quality/expired documents.
- Record a confidence score per field; if confidence is low, flag for human check.
- Output a structured summary for the reviewer. Do not state a pass/fail decision.
- Handle only documents the customer consented to provide.
```

### 3.6 Tools
```json
[
  {"name":"get_required_documents","description":"Checklist for the product/application.","parameters":{"type":"object","properties":{"appId":{"type":"string"}},"required":["appId"]}},
  {"name":"get_application_data","description":"Captured application fields to validate against.","parameters":{"type":"object","properties":{"appId":{"type":"string"}},"required":["appId"]}},
  {"name":"submit_for_human_review","description":"Send extracted data + flags to a reviewer queue.","parameters":{"type":"object","properties":{"appId":{"type":"string"},"summary":{"type":"object"}},"required":["appId","summary"]}}
]
```
*(Document images are passed as multimodal input directly to Gemini — no OCR tool needed.)*

### 3.7 Structured output (reviewer package)
```json
{"type":"object","properties":{
 "documents":{"type":"array","items":{"type":"object","properties":{
   "type":{"type":"string"},"extracted":{"type":"object"},"confidence":{"type":"number"},
   "quality":{"type":"string","enum":["ok","poor","expired"]}}}},
 "discrepancies":{"type":"array","items":{"type":"string"}},
 "checklistComplete":{"type":"boolean"},
 "readyForHumanReview":{"type":"boolean"}}}
```

### 3.8 Guardrails & compliance
Human-in-the-loop sign-off mandatory (target 100%). Agent never clears identity/AML. Full audit trail (CPG 235-grade). PII handled per policy; redact in logs.

### 3.9 Success metrics
Extraction accuracy, discrepancy-catch rate, pre-adjudication/prep time (benchmark TD 15 hrs → <3 min), onboarding time (benchmark Absa −95%), % human-reviewed (100%), rework reduction.

### 3.10 Build / test
`Gemini 2.5 Pro` (multimodal). **Tests:** mismatched DoB on ID vs application → flagged, not corrected; expired ID → quality=`expired`; blurry payslip → low confidence + flag; complete set → `readyForHumanReview=true`, never an approval.

---

## PRD 4 — Early Eligibility & Indicative-Pricing Agent

### 4.1 Problem & goal
Late knockouts waste customer effort (*extra-processing*, *waiting*). **Goal:** give an honest early "likely yes / here's what's needed", with the **NAB engine** making the determination and the agent only conveying it.

### 4.2 Scope
- **In:** collect minimal inputs, call the eligibility/pricing engine, convey an indicative result and what's needed, route non-starters helpfully.
- **Out:** binding approval, final pricing, credit decision — **engine + human only**.

### 4.3 Functional requirements
1. Collect only the minimum needed for a soft check.
2. Capture explicit consent for a soft eligibility check (no hard credit pull without consent).
3. Call `evaluate_eligibility` (engine decides); **never compute eligibility itself**.
4. Convey result in plain English, labelled **indicative**, with responsible-lending/comparison-rate context.
5. For a likely-no, suggest constructive alternatives and route kindly.

### 4.4 Agent design — system instruction (draft)
```text
You are NAB's early eligibility guide. You help a customer understand, up front, whether a
product is likely a fit — honestly and without false hope.

Rules:
- Collect only the minimum inputs the engine needs. Get explicit consent before any check.
- ALWAYS get the result from evaluate_eligibility. You must NOT decide or calculate eligibility
  or price yourself. Present only what the engine returns, labelled "indicative, not an approval".
- Include required responsible-lending wording and comparison-rate context from the engine.
- If likely ineligible, be kind, explain the main reasons the engine gives, and suggest options.
- Never promise approval. Escalate anything complex or any hardship signal to a human.
```

### 4.5 Tools
```json
[
  {"name":"get_min_inputs","description":"Which inputs the engine needs for this product's soft check.","parameters":{"type":"object","properties":{"product":{"type":"string"}},"required":["product"]}},
  {"name":"record_consent","description":"Record explicit consent for a soft eligibility check.","parameters":{"type":"object","properties":{"customerId":{"type":"string"},"scope":{"type":"string"}},"required":["customerId","scope"]}},
  {"name":"evaluate_eligibility","description":"NAB engine decides eligibility + indicative price. Authoritative.","parameters":{"type":"object","properties":{"product":{"type":"string"},"inputs":{"type":"object"}},"required":["product","inputs"]}}
]
```

### 4.6 Structured output
```json
{"type":"object","properties":{"product":{"type":"string"},"indicativeDecision":{"type":"string","enum":["likely_eligible","likely_not","need_more_info"]},"indicativePrice":{"type":"string"},"reasons":{"type":"array","items":{"type":"string"}},"consentRecorded":{"type":"boolean"},"nextStep":{"type":"string"}}}
```

### 4.7 Guardrails & compliance
**Determination stays in the engine** (the Better.com/Tinman pattern). Consent before any check. "Indicative, not an approval" on every result. Responsible-lending obligations embedded. Human for edge cases.

### 4.8 Success metrics
Lead-to-lock/conversion lift (benchmark Better.com +100%), cost-to-originate (benchmark −41%), reduction in late declines, early-knockout rate, CSAT on transparency. **Guardrail metric:** 0 agent-made determinations.

### 4.9 Build / test
`Gemini 2.5 Pro`, grounding OFF for price/eligibility. **Tests:** agent tries to estimate a rate itself → must refuse and call engine; no consent → no check; likely-no → kind explanation + alternatives; result always labelled indicative.

---

## PRD 5 — Proactive Lifecycle Next-Best-Action Orchestration Agent

### 5.1 Problem & goal
Generic campaigns (*overproduction*) and dead gaps in the journey (*waiting*). **Goal:** autonomously choose and execute the next most-helpful action per customer across the sales/onboarding lifecycle, within strict guardrails — turning Customer Brain from *recommending* to *acting*.

### 5.2 Scope
- **In:** read Customer Brain NBA recommendations, decide whether/when/how to act, execute within guardrails, learn from outcomes, log everything.
- **Out:** inventing offers (must come from approved NBA library), acting outside consent/conduct limits, anything regulated without a human.

### 5.3 Functional requirements
1. Pull ranked next-best-actions from Customer Brain for a customer/segment.
2. Apply guardrails (consent, frequency, conduct, vulnerability suppression) before acting.
3. Select channel + timing; execute the action (nudge, milestone, info, offer).
4. Record outcome; feed back for learning/experimentation.
5. Operate inside an experiment framework (control vs treatment) so uplift is provable.

### 5.4 Agent design — system instruction (draft)
```text
You are NAB's proactive engagement orchestrator. For each customer you choose the single most
helpful next action from the approved next-best-action list, and act on it — only within guardrails.

Rules:
- Use ONLY actions returned by get_next_best_actions. Never invent an offer or message.
- Before acting, call apply_guardrails; if it blocks (consent/frequency/vulnerability/conduct), do not act.
- Prefer genuinely helpful, timely actions over sales pressure. One meaningful touch beats many.
- Respect the experiment assignment (control group gets no proactive action).
- Log the action and outcome via record_outcome for learning.
- Escalate anything regulated or sensitive to a human.
```

### 5.5 Tools
```json
[
  {"name":"get_next_best_actions","description":"Ranked approved NBAs from Customer Brain.","parameters":{"type":"object","properties":{"customerId":{"type":"string"}},"required":["customerId"]}},
  {"name":"apply_guardrails","description":"Check consent, frequency, conduct, vulnerability, experiment arm.","parameters":{"type":"object","properties":{"customerId":{"type":"string"},"action":{"type":"string"}},"required":["customerId","action"]}},
  {"name":"execute_action","description":"Deliver the chosen action on the chosen channel.","parameters":{"type":"object","properties":{"customerId":{"type":"string"},"action":{"type":"string"},"channel":{"type":"string"}},"required":["customerId","action","channel"]}},
  {"name":"record_outcome","description":"Log action + result for learning/experiment.","parameters":{"type":"object","properties":{"customerId":{"type":"string"},"action":{"type":"string"},"outcome":{"type":"string"}},"required":["customerId","action","outcome"]}}
]
```

### 5.6 Structured output
```json
{"type":"object","properties":{"customerId":{"type":"string"},"chosenAction":{"type":"string"},"channel":{"type":"string"},"acted":{"type":"boolean"},"blockedReason":{"type":"string"},"experimentArm":{"type":"string","enum":["control","treatment"]}}}
```

### 5.7 Guardrails & compliance
Actions only from approved NBA library (no generative offers). Conduct + comms-preference + frequency caps + vulnerability suppression enforced via `apply_guardrails`. Control group untouched. Kill-switch. Full audit.

### 5.8 Success metrics
Engagement uplift (NAB benchmark 20%→75% on home lending; 40% overall), conversion/cross-sell lift, treatment-vs-control delta (the proof Malcolm wants), unsubscribe/complaint rate (guardrail), % actions inside guardrails (100%).

### 5.9 Build / test
`Gemini 2.5 Flash`. **Tests:** customer in control arm → `acted=false`; frequency cap hit → blocked; no approved NBA → no action; happy path → helpful action executed + outcome logged.

---

## Appendix A — Suggested build order (prototype roadmap)
1. **PRD 3 (Document/KYC)** first — highest, most defensible efficiency win, and your home turf; multimodal Gemini demo is impressive.
2. **PRD 1 (Intake)** — the conversion front door; pairs naturally with 3.
3. **PRD 4 (Eligibility)** — showcases the safe "engine decides" pattern.
4. **PRD 2 (Nurture)** — the re-engagement value story.
5. **PRD 5 (Orchestration)** — most ambitious; needs the others + Customer Brain.

## Appendix B — What to actually demo in the interview
A working **PRD 3** or **PRD 1** prototype in Google AI Studio (even with mocked tools) proves you can scope, build and guardrail an agent — the "self-driven implementor / evangelist" the RPS wants. Keep the human-in-the-loop and consent steps visible; that's the detail a safety-first panel will notice.

## Appendix C — Honest framing
This is a **prototype/PoC spec**, not a production design. Production needs NAB architecture, security review, model-risk governance, real APIs, data-privacy sign-off and AI Group ownership of the models. Your contribution is the product thinking, the process/guardrail design and the prioritisation — say exactly that.
