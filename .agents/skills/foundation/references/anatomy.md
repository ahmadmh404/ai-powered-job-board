# Anatomy of the two documents

This is reverse-engineered from a real pair (a product called Cartograph: a tool that turns a GitHub repo into a dependency map). The examples below come from it. Use them to understand the pattern, not to copy the wording.

Contents:
1. `docs/project-doc.md`, section by section
2. `CLAUDE.md`, section by section
3. How the rules in CLAUDE.md trace back to the project doc
4. Writing patterns that make both work
5. Common mistakes

---

## 1. `docs/project-doc.md`

### Opening note (2 to 3 lines)

Tells the reader how to use the file. Three things: it is the decisions with reasoning, the reasoning matters more than the decisions, and the agent should read only the part it needs and never paste it into a prompt.

Why: it sets the habit of reading on demand, which is what keeps context small.

### What it is

The product as a short walk-through of what a person does, in order. Concrete verbs. No marketing. "Sign in, paste a URL, get a map. Open a folder into its files. Select a file and see what it imports."

Aim for one short paragraph, two at most.

### The problem

Why this needs to exist, shown through what is painful today. Name the real situation, with real symptoms, not "developers struggle with X". Where possible show where the current approach breaks ("stops working at around thirty files").

### Who it's for

One specific person, in a specific situation. Say what they can already do and what they cannot. Then add the line that turns this into a tool:

> This description is the test every feature gets measured against.

Give an example of a tempting feature and show how the test refuses it ("they want to know what depends on this file, not a quality score").

### Why this hasn't stuck before (optional but strong)

Only when the idea has been tried. Name the earlier attempts and the most likely reason they failed. Say what has changed. Then say plainly: "That's the bet. It is a bet, and it should be stated as one."

Skip this section for a product with no real history. Do not invent a competitor story.

### The rule everything rests on

One bolded sentence. The single invariant that makes the product worth building.

> **Every box and every line comes from really parsing the code.**

Then:
- what the AI or any flexible part may and may not do,
- the reason, blunt and short ("a graph that is ninety percent right is worse than no graph, because there's no way to tell which ten percent is wrong"),
- where pressure to break it will come from, named directly.

If the product has no single invariant, say that, and use this section for the two or three principles that matter most. Do not force one.

### Scope

A terse list of what is in. One line per item, with a short phrase of reasoning only where it is not obvious ("`require()` as well, because a large amount of real code still uses it").

### Out of scope, and why

The most useful section for an agent. Lead with the framing: each of these is something a model will propose, because each sounds like an improvement. Then a list where **every item has its reason**.

> **Scores, grades, severity badges.** This product explains a codebase; it does not review one. Once there's a number, people argue with the number instead of reading the map.

Include things the user might also be tempted by, and things that are deferred (with the honest reason: "requires a token that would then have to be stored. Not in v1").

### How it works

Open with: no folder names here, the structure is the agent's to choose. These are constraints on behaviour.

Each item is a bold short claim, followed by one to three sentences of reason, ideally with a test for when it has gone wrong.

> **The parser is standalone.** It takes a directory path and returns files, edges and a coverage report. It does not know the web framework exists... If it can't run standalone, the layering is wrong.

The "if X, the design is wrong" line is the signature move. It turns an architecture preference into something the agent can notice breaking.

Where the reasoning is about asymmetric risk, spell out the asymmetry. Example: a table with security on and no policy returns nothing, which is visible. A table where security was forgotten returns everything, silently. So the second must be made impossible, not unlikely.

### The interface (include only if there is a UI)

Taste, with reasons. Say what the tool is like, what earns colour or motion, what is derived instead of decided. Say which decisions are fixed and which the agent should just make without asking ("pick sensible values, keep them consistent, don't ask about each one").

If the UI will be seen for long stretches, say so; it justifies the density and calm.

### Where this is likely to go wrong

Honest risks. For each: what is hard, and why. Include at least one "the failure is silent" risk if there is one, and say that loud reporting beats a tidy interface there. Include the least settled part of the plan and label it as such.

### What has to be true before this ships

A short list of checks a person can run by hand. Specific. Start with the framing: not "it looks right". Each item names what to do and what it should show.

---

## 2. `CLAUDE.md`

Short and always true. These sections, in this order.

### Opening (3 to 5 lines)

What the product is in one or two sentences, with the core principle. Then one line: where the reasoning lives and that this file is only the rules.

### Stack

One paragraph. Only what is decided. Add a warning for fast-moving frameworks: if unsure about an API, read the docs inside the installed package instead of going from memory.

### How we work

The process contract with the user. Cover:
- the document layers (project doc = what and why, read on demand; phase specs = behaviour and an acceptance check, never file names; this file = always true),
- what to do when starting a phase (read this file and that phase's spec, build what the spec asks, stop),
- what to do when dropped into a fresh context (look at which specs exist, then the git log, then say what you have worked out before building),
- who runs the acceptance check (the user, by hand) and what the agent checks itself (types, lint, build, anything verifiable from a terminal in seconds),
- what happens when a phase comes out wrong (reset instead of patch, and say if a spec is ambiguous before building).

Take these from the user's answers in the interview. Do not assume their workflow matches the example.

### How to talk to me

The user's communication rules, in their voice. Typical content:
- short, cut any sentence that does not tell me something I need,
- one specific question at a time, with the direction you would take and why,
- when you need something only I can give (a key, a value), say exactly what and where, then stop,
- no walls of text, no re-stating the plan,
- plain English,
- say when something did not work.

### How the code is laid out

Behaviour constraints only, because the agent picks the file structure. Each one is a layering or isolation rule, copied from "How it works" in the project doc in shortened form.

> The parsing code can't import Next, React or the database client. Path in, data out, runnable from a plain script.

### Conventions

Language strictness, comment style, how to handle awkward types, the "one obvious way" preference, and the UI feel if there is a UI. If a design or frontend skill will fire on its own, add one line saying which of the user's rules overrule it and why.

### Things not to do

Open with: "Breaking one of these is worse than not finishing." Then a bold-led list. Each item has a reason in a clause.

> **Never decide that two files are connected.** An edge exists because the parser resolved a real import to a real file.

Always include, if they apply to the user's way of working:
- don't install a package without asking (name it, say what for, wait),
- don't build ahead of the current phase,
- don't leave the build broken, tell me about a failure instead of working around it,
- don't weaken a check to make it pass.

---

## 3. How CLAUDE.md traces to the project doc

| CLAUDE.md section | Comes from |
|---|---|
| Opening | "What it is" and "The rule everything rests on" |
| Stack | The decided stack in the interview |
| How we work | The interview (user's workflow), not the project doc |
| How to talk to me | The interview (user's preferences), not the project doc |
| How the code is laid out | "How it works" |
| Conventions | "The interface" and the interview |
| Things not to do | "The rule everything rests on" and "Out of scope, and why" |

If a line in CLAUDE.md cannot be traced to one of these, ask whether it is needed.

---

## 4. Writing patterns

- **Say why, always.** "Out of scope" without reasons is a list the agent will argue past.
- **The "if X, then the design is wrong" test.** Gives the agent a way to notice a violation.
- **Name the pressure.** Say where the temptation to break a rule will come from. Agents (and tired humans) drift in predictable directions.
- **Absent beats approximate.** Where a wrong answer is worse than no answer, say so and tell the agent to show nothing.
- **Behaviour, not structure.** The agent chooses file layout. You fix what must be true of it.
- **Concrete over general.** "Stops working at around thirty files" beats "doesn't scale".
- **Plain words.** Short sentences. If a bulleted breakdown would be one sentence, write the sentence.
- **Honest about bets and weak spots.** It makes the rest more believable and makes the agent careful in the right places.
- **Checkable.** Every rule is something you could point to and call broken.

---

## 5. Common mistakes

- Filling `CLAUDE.md` with reasoning, so it grows past a few hundred lines and gets skimmed.
- Putting file or folder names in either document, which locks in structure too early and goes stale.
- Listing out-of-scope items without reasons.
- A "Who it's for" that says "developers" or "teams".
- Inventing a competitor history or a market bet that the user never described.
- Repeating the same rule in both files, so they drift apart.
- Writing the ship checks as feelings ("looks good") instead of things to do by hand.
- Hiding the unsettled parts to make the plan look finished.
