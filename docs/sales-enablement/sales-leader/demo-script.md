# Account Insights — Demo Script (Sales Leaders)

**Audience:** VPs of Sales, CROs, Sales Managers
**Duration:** 5-10 minutes
**Prerequisites:** Access to a People.ai instance with live data (customer or demo environment)

---

## Pre-Demo Checklist

- [ ] EDB tables deployed (all 5: ICP Fit, Relationship Health, Engagement Momentum, Whitespace & Expansion, Account Neglect)
- [ ] Know which reps/managers the sales leader oversees
- [ ] Pre-scan the Account Neglect table — find 2-3 high-value accounts from *their* reps that tell a story
- [ ] Pre-scan the Whitespace & Expansion table — find 1-2 customer accounts with outsized engagement
- [ ] Identify one account with strong ICP fit that the team hasn't prioritized
- [ ] Have a SalesAI Signal example ready on an account record

---

## Demo Flow (10 min)

### Transition In (30 sec)

> "Let me show you what your account book looks like through this lens. I want you to pretend you're about to walk into your Thursday account review. Instead of asking reps 'how are your key accounts,' you open this first."

---

### Stop 1: Account Neglect — "The Accounts Your Team Forgot" (3 min)

**Open the Account Neglect EDB table.** Sort by `annual_revenue` descending.

> "Think of this as your coverage dashboard. Every account on this list is a high-value account where your team's engagement has dropped off — zero recent meetings, declining email activity, engagement score falling. These are the accounts quietly slipping away."

**Point to the highest-value account:**

> "Let's start here. [Account Name], $[ARR], owned by [rep name]. Last meeting: [X] days ago. Engagement level: [X]. Emails sent in the last 30 days: [X]. Emails received: [X]."

Pause. Then:

> "If you're [rep name]'s manager, what do you want to ask right now?"

**Let them answer.** They'll usually nail it — "Why haven't we met with them? What happened to the QBR cadence?" That's the point.

> "Exactly. And notice — you're not asking 'how are your accounts?' You're asking about a specific coverage gap. That's a completely different account review conversation."

**Scroll to show the full list:**

> "You've got [X] accounts on this list. $[total ARR]. These are your retention risks for the week — ranked by the data, not by which reps volunteer to talk about them."

**Columns that matter for sales leaders:**
- `ootb_account_original_owner` — whose account is this
- `ootb_account_annual_revenue` — what's at stake
- `engagement_level` — overall health at a glance
- `ootb_account_count_of_meetings_standard` (last 30d) — is anyone meeting with the customer
- `ootb_account_days_since_last_activity` — how long it's been dark

---

### Stop 2: ICP Fit — "The Accounts Your Team Should Be Prioritizing" (2.5 min)

**Switch to the ICP Fit Profiling EDB table.** Sort by ICP score descending.

> "Now this is a different kind of intelligence. These aren't accounts in trouble — these are accounts that look like your best customers."

> "Every row is an account scored against the behavioral profile of your closed-won deals. Not just industry and size — but meeting cadence, exec involvement, engagement patterns, email responsiveness. The accounts at the top of this list behave the way your winners behaved."

**Point to a high-scoring prospect account:**

> "[Account Name]. ICP fit score: [X]. Engagement level: [X]. [X] exec meetings in the last 30 days. [X] people engaged across [X] departments. This account has the same behavioral fingerprint as the deals your team closed last quarter."

> "As a sales leader, you want to know: is your rep treating this account differently than the 50 others in their territory? Because the data says this one deserves disproportionate attention."

**If there are low-ranked accounts reps are spending time on:**

> "And look at the bottom of the list — [Account Name]. Engagement: [X]. Zero exec meetings. Low stakeholder breadth. But your rep had [X] meetings with them last month. That's time that could have been spent on a top-20 ICP account."

> "This is how you help reps prioritize — not based on gut feel, but based on which accounts actually match how your customers behave before they buy."

---

### Stop 3: Whitespace & Expansion — "Revenue Hiding in Your Customer Base" (2.5 min)

**Switch to the Whitespace & Expansion EDB table.** Sort by `engagement_level` descending.

> "These are your expansion plays. Every account on this list is a customer where engagement far exceeds what you'd expect for their current spend. They're telling you they want more."

**Find an account with high engagement relative to ARR:**

> "Here's one. [Account Name], paying $[ARR]. But look at the engagement: [X] level, [X] meetings in the last 30 days, [X] new people engaged, [X] exec meetings. For an account their size, that's 3x the typical engagement."

> "That's not a satisfied customer on autopilot. That's an account exploring what else you can do for them. But there's no expansion pipeline. Nobody's asked the question."

**Point to the department or stakeholder breadth:**

> "And look at the stakeholder data — [X] people engaged across what appear to be multiple departments. When you see a $200K customer engaging like a $500K customer, with new departments getting involved, that's your signal to have an expansion conversation."

> "How much expansion pipeline would you create if your team ran a whitespace play on the top 10 accounts on this list? Even converting 3-4 of these is meaningful pipeline you didn't have yesterday."

---

### Stop 4: Engagement Momentum — "Accounts Heating Up Right Now" (1 min)

**Switch to the Engagement Momentum EDB table.** Sort by momentum score descending.

> "Last one — and this is the real-time view. These are accounts where engagement has surged in the last 7 days compared to their 30-day baseline. Something is happening."

**Point to an account with a strong momentum surge:**

> "Look at [Account Name]. 7-day engagement is [X]% above their 30-day average. [X] new meetings scheduled. A new VP just joined a call for the first time. Inbound emails spiked."

> "That's a buying signal or an expansion signal. But if nobody's watching the momentum data, your team doesn't react until it's an inbound request — or until the competitor gets there first."

> "Even catching 2-3 of these surges per week across your team means your reps are showing up at exactly the right moment instead of the wrong one."

---

### Optional: SalesAI Signal on Account Record (1 min)

> "One more thing — your reps don't need to look at these tables. On every account, they see this."

**Show an account record with a SalesAI Signal visible.**

> "The most critical insight for this account, right on the record. When [rep name] opens this account tomorrow, they already know what needs attention — before you ask about it in the account review."

> "That's the intelligence flywheel. The rep sees the signal, takes action, and shows up to the account review with a plan instead of a guess."

---

### Close (30 sec)

> "So here's what your next account review looks like:
> 1. Open the Neglect view — those are your retention conversations
> 2. Check ICP Fit — make sure reps are prioritizing the right prospects
> 3. Glance at Whitespace — identify expansion plays in your customer base
> 4. Check Momentum — see which accounts are heating up right now
> 5. Review Relationship Health — flag single-threaded risk on key accounts

> That's a 5-minute prep that transforms a 30-minute account review. Want me to have this ready for Thursday?"

---

## Demo Tips

**Make it personal.** Use rep names and account names they recognize. "This is Sarah's account" hits differently than "this is a $2M customer."

**Ask, don't tell.** "What would you want to ask the rep?" puts them in the coaching seat. They sell the value to themselves.

**Account review framing.** Everything should tie back to "imagine opening this before your next account review." That's their mental model.

**Let the silence work.** After showing a neglected high-value account with strong signals, stop talking. The data makes the argument.

**One account is enough.** If they react strongly to the first neglected account, don't rush to show 5 more. Go deep on that one. "Tell me about this account — did you know engagement had dropped?" That conversation is more valuable than a feature tour.

**Read the energy.** If they lean into neglect, spend more time there. If they get excited about expansion, pivot. Follow their interest — every table leads to the same conclusion.

---

## Handling Demo Objections

| They say... | You say... |
|---|---|
| "I already knew that account was being neglected" | "Great. Now imagine knowing that about every account across every team — without having to check manually." |
| "That account is fine, the rep just hasn't logged activity" | "That's a valid explanation. But the fact that you have to guess is exactly the problem. With this view, the account either shows engagement or it doesn't." |
| "My reps will think I'm micromanaging their territory" | "Position it to them as: 'This tool tells you which accounts need your attention before I ask.' Best reps love it." |
| "The engagement score seems off" | "These are the same OOTB People.ai metrics your team already uses. If something looks wrong, it's worth investigating — that's a data quality catch." |
| "We don't have time for another tool" | "This replaces the first 5 minutes of prep. Open one view before your account review. That's the whole workflow." |
| "Can we filter by team/segment/territory?" | "Yes — every column is sortable and filterable. You can build a view per team, per segment, per territory, per manager." |
