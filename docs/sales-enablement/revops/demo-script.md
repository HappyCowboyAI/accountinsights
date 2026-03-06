# Account Insights — Demo Script (RevOps)

**Audience:** Revenue Operations leaders, Sales Operations managers
**Duration:** 5-10 minutes
**Prerequisites:** Access to a People.ai instance with live data (customer or demo environment)

---

## Pre-Demo Checklist

- [ ] EDB tables deployed (all 6: ICP Fit, Relationship Health, Engagement Momentum, Whitespace, Neglect, Summary)
- [ ] Know the customer's average account value and team size
- [ ] Pre-scan the Account Neglect table — identify 2-3 compelling accounts to highlight
- [ ] Pre-scan the Relationship Health table — identify 1-2 accounts with clear single-threading
- [ ] Have the SalesAI Signal example ready (account record with signal visible)

---

## Demo Flow (10 min)

### Transition In (30 sec)

> "Let me show you what this looks like with your data. Everything you're about to see runs on the People.ai metrics your team already uses — engagement levels, meetings held, emails exchanged, people engaged, executives engaged. No new data sources."

---

### Stop 1: Account Neglect Table (3 min)

**Open the Account Neglect EDB table.** Sort by account value descending.

> "This is the Account Neglect view. Every row is an account where engagement has dropped below threshold — declining activity, zero recent meetings, emails going unanswered. These are accounts going dark, and the question is whether anyone on your team has noticed yet."

**Point to the top account by value:**

> "Look at this one. [Account Name], $[value] annual. Engagement score is [X] — well below 30, which means activity has flatlined. Meetings in the last 30 days: [X]. Emails sent: [X], emails received: [X]. Last meaningful activity was [X] weeks ago."

Pause. Let them absorb.

> "If I'm running an account coverage review, I already know exactly what to ask the rep. Not 'how's the account going?' but 'I see zero meetings in 30 days and engagement is at [X] — what's the re-engagement plan?'"

**Scroll down to show volume:**

> "And this isn't just one account. You've got [X] accounts on this list representing $[sum] in annual value. That's revenue at risk that may not be on anyone's radar between quarterly reviews."

**Key columns to highlight:**
- `engagement_level` — the overall health signal
- `ootb_meetings_last_30d` — zero or near-zero confirms neglect
- `ootb_emails_sent_last_30d` vs. `ootb_emails_received_last_30d` — one-directional or absent communication
- `ootb_people_engaged` — how many contacts are actually active

---

### Stop 2: Relationship Health Table (3 min)

**Switch to the Relationship Health EDB table.**

> "Now this is the view that usually gets the biggest reaction from RevOps. This isn't about whether engagement is happening — it's about *how deep* the engagement goes."

> "Every row here shows the relationship structure of an account — how many contacts are engaged, what percentage of meetings include executives, how responsive contacts are to email. The accounts at the top of this list have the most concentrated relationships."

**Point to the top account:**

> "Look at [Account Name]. Meetings last 30 days: [X]. But people engaged: [X]. That's [X] meetings with only [X] contacts. This is a single-threaded relationship. If that one person changes roles, goes on leave, or just goes quiet — the entire account relationship resets to zero."

> "For RevOps, this is an accountability metric. You can now see which accounts have genuine multi-threaded relationships and which are one person deep. That's not something any CRM report gives you today."

**Show the exec coverage column if applicable:**

> "And look at executive engagement on some of these. [X]% of meetings include a VP or above. For a strategic account, is that enough? Account Insights surfaces the question — your team decides the answer."

---

### Stop 3: Engagement Momentum Table (2 min)

**Switch to the Engagement Momentum EDB table.** Sort by momentum score ascending (decelerating accounts first).

> "This view compares recent activity to trailing activity — 7-day signals against 30-day baselines. The accounts at the top are decelerating. They were active, and now they're slowing down."

**Point to an account with declining momentum:**

> "This account had [X] meetings and [X] emails in the last 30 days. But in the last 7 days: [low numbers]. The trend is going the wrong direction. Is it seasonal? Is the champion disengaging? Is a competitor in the picture? The data can't tell you why — but it can tell you *which accounts* to ask about."

> "For RevOps, this is your early warning system. These accounts haven't gone dark yet — they're heading that direction. Catch them now, and you've got 2-3 weeks of runway to intervene."

---

### Stop 4: Whitespace & Expansion Table (1 min)

**Switch to the Whitespace & Expansion EDB table.** Sort by engagement level descending.

> "Last view — and this is the positive one. These are accounts where everything is going right. Engagement is high, multiple departments are involved, new stakeholders are appearing, executives are in the room."

**Point to an account with high engagement and signals of expansion:**

> "This account has engagement of [X], [X] people engaged across [X] interactions, and executive involvement is [X]%. Activity is well above the median for accounts this size. Is there an expansion opportunity here? Or is the team already pursuing one?"

> "For a RevOps team tracking growth efficiency, these are your candidates. Even surfacing 5-10 of these that nobody had on the expansion radar can meaningfully shift the quarter."

---

### Optional: SalesAI Signal on Account Record (1 min)

> "One more thing — these insights don't just live in tables. On the account record itself, the rep sees this."

**Show an account record with a SalesAI Signal visible.**

> "Right here — the most critical pattern detected on this account, with a specific recommended action. The rep doesn't go looking for it. It's right where they work."

---

### Close (30 sec)

> "So that's five views, all running on the data you already capture:
> 1. Accounts going dark that nobody's noticed
> 2. Relationships that are one person deep
> 3. Accounts losing momentum before it's obvious
> 4. Accounts primed for expansion that nobody's pursuing
>
> Plus a summary view that scores every account across all five categories.
>
> The tables are already deployed. The question is: which of these would you want your team looking at before their next account review?"

---

## Demo Tips

**Let them react.** When you show a specific account, pause. Ask: "Did you know about this one?" Their reaction tells you everything about the value.

**Don't over-narrate.** The data speaks for itself. Point to the numbers, name the pattern, and let silence do the work.

**Ask, don't tell.** "What would you want to ask the rep about this account?" is more powerful than "This account is clearly at risk."

**If they recognize the accounts:** "Great — the system is validating what you already know. Now imagine having this for every account across every team, automatically."

**If they don't recognize the accounts:** "That's the value. These are accounts that needed attention and nobody was looking. How many more are there across your full book of business?"

**If data looks thin:** Focus on the Relationship Health table — it's less dependent on volume and almost always surfaces surprising single-threading patterns.

---

## Handling Demo Objections

| They say... | You say... |
|---|---|
| "This account is actually fine" | "Great — that tells us the threshold might need tuning for your account cycle. Let's look at the next one." |
| "We already knew about that" | "That's validation. Now imagine this running across every team, every quarter, without someone manually auditing." |
| "The data doesn't look right" | "Which metric? Let's click into it. These are all OOTB People.ai metrics — if there's a data issue, this is how you find it." |
| "Can we change the filters?" | "Absolutely. Every threshold is adjustable. What would make this more useful for your team?" |
