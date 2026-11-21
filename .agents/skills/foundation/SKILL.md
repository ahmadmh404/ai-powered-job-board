---
name: foundation-docs
description: Writes the two foundation documents for a new software product, docs/project-doc.md (what the product is and the reasoning behind every decision) and CLAUDE.md (the short list of rules a coding agent follows on every prompt). Use this whenever the user is planning a new product or MVP and wants to turn messy notes, a long chat, a PRD, or a rough idea into documents an agentic coding tool can build from. Also use it when the user says their context is too long or too complex, asks for a CLAUDE.md, a project doc, a project brief, spec-driven setup, or "the docs before I start building", even if they never name the two files. Do not use it for per-phase specs, for documenting an existing codebase, or for writing code.
---

# foundation-docs

Write two documents that let a coding agent build a product without a giant pile of context.

The idea behind them: a coding agent does worse with thousands of lines of mixed-up notes than with two short, well-aimed files. So the job is not to record everything. The job is to split what is known into two layers and keep each layer small.

- `docs/project-doc.md` is the **why**. What the product is, who it is for, what is out of scope, and the reasoning behind each decision. The agent reads the part it needs, when it needs it. It is never pasted into a prompt.
- `CLAUDE.md` is the **rules**. Short, always true, read on every prompt. It holds no reasoning, only what to do and what never to do.

The two files are written in that order. The rules in `CLAUDE.md` should fall out of the decisions in `project-doc.md`. If a rule has no decision behind it, either the rule is not needed or the project doc is missing something.

Read `references/anatomy.md` before writing. It explains what each section is for and shows the writing patterns that make these documents work. Do not skip it, because the sections look simple but the quality comes from the patterns.

## Step 1: Take stock of what exists

Look at what the user already has: pasted notes, a long chat, a PRD, a repo. Extract answers from it first. Never ask a question the material already answers.

Treat the material as raw ore. A long planning chat is full of decisions, but also dead ends, repeated ideas, and options that were dropped. Pull out only the decisions and the reasons for them.

## Step 2: Interview for the gaps

Ask only for what you cannot work out yourself. Ask in short rounds, one or two questions at a time, never a long form.

Every question gets a recommendation attached: "A or B? I'd go with B, because ...". A question the user can answer in two seconds gets answered. An open question usually does not. If you have a question tool, use it for choices.

What you need, roughly in this order:

1. **The person.** Who exactly uses this, and what are they doing when they need it? Push for one specific person, not "developers" or "teams".
2. **The rule everything rests on.** Is there one thing that, if broken, makes the product pointless? Many products have one. If the user does not see it, propose one from what they said and check.
3. **What is tempting but out.** What will a model (or the user at 2am) want to add that should be refused? Each gets a reason.
4. **Stack.** Only what is decided. If it is undecided, say so in the doc instead of guessing.
5. **How they want to work with the agent.** How phases are run, who checks the result and how, how they want the agent to talk. See `references/anatomy.md` for the CLAUDE.md sections this feeds.
6. **What has to be true before it ships.** Specific things they can check by hand. "It looks right" is not an answer.

Stop interviewing when you could write both documents. Do not chase completeness. Unsettled things go in the "Where this is likely to go wrong" section, honestly labelled, and that is better than a made-up answer.

## Step 3: Write `docs/project-doc.md`

Use the section order in `references/anatomy.md`. Follow these principles throughout:

- **Reasoning over decisions.** A decision alone helps the agent only in the case you thought of. The reasoning helps in the forks you did not think of. Say why, in plain words, every time.
- **No file names, no folder names, no function names.** Describe behaviour. The agent picks the structure. If a sentence names a path, rewrite it as a behaviour.
- **State bets as bets.** If something is a guess about the market or the design, say it is a guess.
- **Be honest about weak spots.** Name the parts that are risky or not settled. An agent that knows where the plan is thin takes more care there.
- **Make it checkable.** Rules should be things you could point to and say "this is broken". "The parser can't import the web framework" can be checked. "Keep the code clean" cannot.
- **Keep it short.** Aim for 150 to 250 lines. If it is growing past that, cut repeated points and anything the code will show anyway.

## Step 4: Derive `CLAUDE.md`

Build it from the project doc, not from scratch. Each section pulls from a specific place, listed in `references/anatomy.md`. Principles:

- **Rules only, no reasoning.** Open with one line saying where the reasoning lives ("Why any of these rules exist is in `docs/project-doc.md`").
- **About 100 to 130 lines.** It is read on every prompt, so every line costs attention.
- **Behaviour, not structure.** Tell the agent what the code must not do, not where files must go.
- **Write in first person to the agent.** "Don't ask me to paste it." "Tell me rather than casting." The voice should sound like the user.
- **Hard prohibitions get their reason in a clause.** A "never" with no reason gets argued away. One short clause is enough.
- **Do not repeat what the agent can see.** Skip what is obvious from the codebase or config.
- **Name any skill the user's other tools will fire, and say where it must not win.** If a frontend or design skill will activate, state which of the user's rules overrule it.

## Step 5: Check before handing over

Read both documents once more against this list. Fix, then hand over.

- Does any sentence name a file, folder, or function? Rewrite it.
- Does any rule or decision have no reason? Add one clause, or cut it.
- Could a rule never be shown to be broken? Make it checkable or cut it.
- Is anything in `CLAUDE.md` that is really reasoning? Move it to the project doc.
- Is anything in both files? Keep it in one. The rule goes in `CLAUDE.md`, the reasoning in the project doc.
- Are the unsettled parts named, or did you paper over them?
- Is every item in "Out of scope" paired with a reason?
- Are the ship checks things a person can do by hand?

## Step 6: Hand over

Give the user the two files. Then, in a few plain lines, say:

- what is still unsettled and where you flagged it,
- anything you assumed instead of asking,
- the next step. Per-phase specs are a separate job: one short spec per phase, written just before that phase starts, with behaviour and a hand-run acceptance check. This skill does not write them.

Do not summarise both documents back at the user.

## What this skill will not do

- It will not write per-phase specs or code.
- It will not invent a decision the user has not made. It asks, recommends, or flags it as unsettled.
- It will not fill the project doc with every idea from the planning chat. Dropped ideas stay dropped, unless they belong in "Out of scope" with a reason.
