# Account Insights — Narrative Talk Track

**Audience:** Revenue Operations
**Duration:** 15-20 minutes (expandable to 30 with demo)
**Tone:** Peer-to-peer, data-driven, operationally specific

---

## The Story Arc

```
OPEN: The account blind spot every RevOps team has
  → PROBLEM: The data exists but nobody's reading it at the account level
    → IMPACT: What it costs you (with math)
      → SOLUTION: What Account Insights does differently
        → PROOF: What it looks like in practice
          → CLOSE: What getting started looks like
```

---

## 1. OPEN — The Account Blind Spot (2 min)

> "Let me ask you something. Right now, across your entire book of business, how many high-value accounts have a problem that nobody on the team has noticed yet?"

Pause. Let them think.

> "Every RevOps team I talk to has the same challenge. Your activity capture is working. Your CRM data is solid. Your dashboards show pipeline by account, by rep, by segment. But there's a gap between having account-level data and actually *seeing* what the data is telling you about account health.
>
> Reps are focused on their open deals — they're not stepping back to evaluate whether they're multi-threaded across an account, whether exec engagement is declining, or whether a strategic account has gone completely dark. Managers review pipeline, not account coverage. And you — you can build the reports, but you can't force people to read them at the account level.
>
> That gap — between activity data captured and account health patterns detected — is where strategic accounts erode quietly."

**Why this works for RevOps:** You're validating their data infrastructure while naming the exact limitation they live with. They've invested in activity capture — this positions Account Insights as the return on that investment at the account level.

---

## 2. PROBLEM — The Patterns Are Invisible (3 min)

> "Here's what we see across our customer base. There are five patterns that consistently show up in account-level data that humans almost never catch systematically."

Walk through each — keep it crisp, one sentence per pattern:

> **Neglected accounts.** A strategic account that was active 6 weeks ago has quietly gone dark. No meetings, no emails, engagement declining — but it's still sitting in the book of business at full value. By the time someone notices, the relationship has cooled and competitors have moved in.

> **Single-threaded relationships.** The account looks healthy — meetings happening, emails flowing — but dig deeper and it's all one contact. One person leaves or goes cold, and the entire account relationship collapses. Nobody sees it because the top-line engagement metrics look fine.

> **Missing exec coverage.** Your team is meeting with mid-level contacts but hasn't engaged a single executive in weeks. The deal champion is engaged but the economic buyer has disappeared. No account-level report flags this because each individual metric looks acceptable in isolation.

> **Stagnant engagement momentum.** An account had a burst of activity two months ago — meetings, emails, new stakeholders. Since then, everything has flatlined. The 7-day trend is zero while the 30-day numbers still look reasonable. Without comparing time windows, the deceleration is invisible.

> **Expansion signals hiding in plain sight.** Some accounts have disproportionate engagement relative to their current spend — activity across multiple departments, new stakeholders appearing, exec involvement spiking. These are expansion candidates, but nobody's connecting the dots because the data lives in separate reports.

> "These aren't edge cases. Across a 50-person sales team, we typically see 15-20 neglected strategic accounts, 10-15 single-threaded relationships, and a handful of expansion candidates sitting unrecognized — right now."

**Why this works for RevOps:** You're describing problems in their language — account coverage, relationship depth, process gaps. Each pattern maps to a metric they already care about.

---

## 3. IMPACT — What It Costs You (2 min)

> "Let me put some numbers on this."

Use their deal sizes if you know them. Otherwise use these defaults:

> "Take a 50-person sales team with an average deal size of $150K.
>
> - **Neglected accounts caught too late:** 15-20 strategic accounts where competitors moved in during a coverage gap. At a 15% churn rate on neglected accounts, that's $1M to $1.5M in preventable revenue loss.
> - **Single-threaded relationships that collapse:** 10-15 accounts where the single point of contact goes dark or leaves. At a 25% loss rate, that's $750K to $1.5M.
> - **Missing pipeline from unrecognized expansion:** Even 5-10 accounts where activity signals pointed to expansion but nobody acted. That's $500K to $1M in missed upsell.
> - **Deals lost to poor exec coverage:** Accounts where the economic buyer was never properly engaged. At a 10-15% win rate improvement from multi-threading, that's $750K to $1.5M.
>
> "Add it up and you're looking at $3M to $6M in influenced revenue annually. Not from new data. Not from a new tool. From *reading the account-level data you already have.*"

**Why this works for RevOps:** RevOps lives in ROI calculations. This gives them the math to build an internal business case. The "data you already have" line directly validates their People.ai investment.

---

## 4. SOLUTION — What Account Insights Does (5 min)

> "Account Insights is an intelligence layer that sits on top of the People.ai data you're already capturing. No new integrations, no new data sources, no reps changing behavior. It analyzes the account-level activity signals — engagement levels, meetings held, emails exchanged, executive access, stakeholder breadth — and surfaces the five patterns I just described."

### How It's Different From Dashboards

> "I know what you're thinking — 'We already have account reports.' You do. And they're great for showing you what happened. But reports answer the question you thought to ask. Account Insights answers the questions you *didn't* think to ask.
>
> A report shows you meetings per account. Account Insights tells you *this account's engagement dropped 58% in the last two weeks, the only active contact hasn't responded to email in 10 days, and there are zero meetings scheduled — act within 48 hours.*
>
> A report shows you accounts by segment. Account Insights tells you *this strategic account has 3 departments engaged, exec meetings spiking, and activity 4x the median for accounts this size — someone should be scoping an expansion.*"

### The Five Insight Categories

Walk through briefly — they've heard the problems, now name the solutions:

> "Five insight categories, running on OOTB People.ai metrics:
>
> 1. **ICP Fit Profiling** — identifies which accounts behaviorally match your best-customer engagement profile. Not firmographic fit — behavioral fit based on how they engage with your team.
>
> 2. **Relationship Health** — measures multi-threading depth, executive coverage, and email responsiveness at the account level. Flags single-threaded accounts and accounts where exec engagement has dropped.
>
> 3. **Engagement Momentum** — compares 7-day vs. 30-day activity to detect acceleration or deceleration. Catches accounts losing momentum before it shows up in quarterly reviews.
>
> 4. **Whitespace & Expansion** — spots accounts with disproportionate engagement relative to current footprint. New stakeholders, cross-department activity, exec involvement — these are your growth candidates.
>
> 5. **Account Neglect** — flags accounts with zero recent meetings, zero recent emails, and declining engagement. Automated accountability for coverage gaps."

### The Scoring Engine

> "Under the hood, 12 custom FormulaMetrics compute transparent ratios — stakeholder breadth, exec coverage percentage, engagement momentum, email responsiveness rate, meeting acceleration. Every score links directly back to the underlying OOTB data: meetings held, emails exchanged, people engaged, executives engaged. No black box. You can see exactly why an account scored the way it did."

### Delivery

> "The insights surface in three ways:
> - **Pre-built EDB tables** — 5 category-specific views plus a composite summary table. Filtered, sorted, immediately actionable.
> - **SalesAI Signals** that appear directly on the account record — so reps see the insight where they're already working.
> - **A Slack digest** that any rep can trigger on demand — type `/account-insights` and get a full analysis posted to their channel in under 3 minutes."

**Why this works for RevOps:** You're speaking to their operational concerns — no new integrations, uses existing data, transparent scoring, multiple delivery surfaces. The dashboard comparison directly addresses the "we already have this" objection before it comes up.

---

## 5. PROOF — What It Looks Like (5 min)

This is where you demo. Two paths depending on setup:

### Path A: Live Demo Available

> "Let me show you what this looks like with real data."

Show the Account Neglect table first — it's the most visceral. Sort by account value descending.

> "Every row in this table is an account where the data is saying 'nobody's paying attention.' Look at this one — [point to specific account] — $XXK annual value, engagement score is XX, zero meetings in the last 30 days, and the last email was 3 weeks ago. That's a strategic account going dark. Without this view, when does that show up in your review cadence?"

Then show the Relationship Health table.

> "Now this is the one that changes the conversation for RevOps. Every row here is an account where the relationship is concentrated — single-threaded, no exec coverage, or email going one-directional. This account has 12 meetings in the last quarter but only 2 contacts engaged. One person leaves, and you're starting from zero."

### Path B: Scenario Walkthrough (No Live Demo)

Use three representative scenarios:

> "Let me walk you through three real scenarios.
>
> **James** is an Enterprise AE with a $500K strategic account. The account has been in his book for two years and renewal is in 90 days. On paper, everything looks fine — meetings are happening, the champion is responsive. But Account Insights flags a relationship health issue: all engagement is with one contact, exec coverage is zero for the last 45 days, and no new stakeholders have been introduced in 6 months. James gets the alert, runs a multi-threading campaign, gets the VP and CFO into a business review, and secures a 3-year renewal with expansion.
>
> **Priya** is a Sales Manager running a team of 8. She has 200 accounts across her team and reviews maybe 20 per week in pipeline calls. Account Insights surfaces 6 neglected accounts — high-value accounts with zero engagement in the last 30 days. Two of them are in active evaluation with a competitor. Priya reassigns coverage, gets meetings booked within a week, and saves $400K in at-risk revenue she didn't know was at risk.
>
> **Marcus** is in RevOps. He runs a quarterly account coverage audit that takes 3 days. Account Insights replaces that manual process with automated neglect detection and coverage gap reporting — updated in real time, not quarterly. His first insight: 18% of strategic accounts had zero exec engagement in the last 60 days. That number is now a KPI his team tracks weekly."

---

## 6. CLOSE — Getting Started (2 min)

> "Here's what I like about this from a RevOps perspective. There's nothing to implement.
>
> The data is already flowing through People.ai. The metrics are all out-of-the-box — no custom fields, no schema changes. The 12 FormulaMetrics compute transparent ratios on that existing data. The EDB tables deploy in minutes with a bookmarklet. SalesAI Signals configure in under an hour.
>
> What I'd suggest is a focused pilot: pick one team, deploy the five insight tables plus the summary view, and run it for 30 days. Track two things — accounts where the insight led to a different action, and accounts where the insight surfaced something nobody had noticed. After 30 days, we review the data together and decide if it scales.
>
> For your team specifically, the Account Neglect and Relationship Health tables are usually where RevOps gets the most excited — because they directly improve account hygiene and catch coverage gaps that no amount of CRM training solves."

**Transition to next steps:**

> "Who on your team would you want involved in a pilot like that?"

---

## Key Phrases to Use

| Instead of saying... | Say this... |
|---|---|
| "AI-powered insights" | "Transparent scoring on your existing account data" |
| "Machine learning model" | "FormulaMetric computations on OOTB engagement signals" |
| "Our algorithm detects" | "The data shows / The engagement pattern indicates" |
| "This is a new product" | "This is a new capability built on your existing People.ai investment" |
| "Buy this" | "Pilot this with one team for 30 days" |

## Key Phrases to Avoid

- "Replace your dashboards" — you're complementing, not replacing
- "AI will tell your reps what to do" — reps decide, the scores surface patterns
- "Guaranteed results" — use "influenced revenue" and "based on patterns we see"
- "Simple / Easy" — RevOps knows nothing is simple. Say "straightforward deployment"
