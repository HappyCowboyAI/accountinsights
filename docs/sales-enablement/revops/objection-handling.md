# Account Insights — Objection Handling Guide

**Audience:** AEs and CSMs delivering Account Insights to RevOps buyers
**Format:** Objection → What they're really saying → Response

---

## "We already have account reports and dashboards for this."

**What they're really saying:** "I don't want another tool that duplicates what I've built."

**Response:**

> "You're right — and your account reports are doing what they should. They answer the questions you know to ask: accounts by segment, activity by rep, renewal timeline by quarter. Account Insights doesn't replace any of that.
>
> What it does is answer the questions you *didn't* think to ask. Your report shows meetings per account. It doesn't tell you that a specific account's engagement dropped 58% in the last two weeks while emails have gone one-directional and zero meetings are scheduled. Your report shows accounts by rep. It doesn't tell you that a strategic account has 15 meetings but only 2 contacts engaged — a single-threaded relationship one departure away from collapse.
>
> Think of it this way: reports show you the state of your accounts. Account Insights shows you what's *about to change* in your accounts."

**If they push back further:**

> "Let me ask this — in your last quarter, how many strategic accounts showed signs of risk that your team didn't catch until it was too late? Where you looked back and said 'the activity data was right there, we just didn't connect the dots'? That's exactly what this catches."

---

## "This sounds like AI hype. How is this different from every other 'AI-powered' pitch?"

**What they're really saying:** "I've heard AI promises before and they didn't deliver."

**Response:**

> "Fair. Let me be specific about what this is and what it isn't.
>
> This is not a black-box model making predictions. There's no training data, no model accuracy score, no 'trust the algorithm.' It's 12 FormulaMetrics computing transparent ratios on *your* engagement data — the same metrics you already look at in People.ai: meetings held, emails exchanged, people engaged, executives engaged, engagement levels.
>
> The difference is that it combines them into meaningful scores. A human looking at an account sees 'Meetings Last 30d: 12' and 'People Engaged: 2' as two separate numbers. Account Insights sees that combination as a single-threaded relationship risk — especially when the previous 30-day period had 4 people engaged and exec coverage was 35%.
>
> Every score traces back to specific OOTB metrics. Your team can verify any calculation by looking at the underlying data. It's math on your data, not magic."

---

## "Our data quality isn't good enough for this."

**What they're really saying:** "I'm worried it'll surface garbage and lose credibility."

**Response:**

> "Actually, this helps data quality — it doesn't require perfection.
>
> The metrics Account Insights uses are all auto-captured by People.ai: meetings from calendar, emails from inbox, engagement scores computed from activity volume. These aren't fields reps are manually updating — they're system-generated from real behavior.
>
> Where data quality issues *do* show up, Account Insights actually surfaces them. If a strategic account shows zero activity for 90 days — that's either a real neglect issue *or* a data capture problem. Either way, you want to know. Same with the Relationship Health view — if an account shows only 1 contact engaged, it's either genuinely single-threaded *or* contacts aren't linked correctly. Both are worth catching.
>
> Most teams find that Account Insights is the forcing function that improves CRM discipline — because now there's a visible consequence to missing data."

---

## "My reps won't use this. They ignore the account reports we already have."

**What they're really saying:** "Adoption is my biggest concern, not feature capabilities."

**Response:**

> "That's exactly why the delivery model matters. If this were just another tab in People.ai, you'd be right — most reps won't go find it.
>
> That's why there are three delivery surfaces. SalesAI Signals appear directly on the account record — the rep doesn't go looking for the insight, it comes to them where they're already working. The Slack digest is on-demand — type `/account-insights` and get a full analysis without leaving Slack. And the EDB tables are for your coverage reviews — not for reps to self-serve, but for managers to use in account reviews and QBRs.
>
> The question isn't 'will reps use a new tool?' It's 'will reps act on an insight that shows up in their workflow?' And the answer to that is usually yes — especially when their manager is looking at the same account health data in the review."

---

## "How is this different from what Gainsight / Clari / [competitor] does?"

**What they're really saying:** "I need to justify why this is better than alternatives."

**Response:**

> "Different data, different angle.
>
> Gainsight is customer success management — it tracks product usage, health scores, and renewal workflows. Clari is forecast management — it aggregates CRM and engagement data to predict what will close. Both are valuable.
>
> Account Insights is engagement pattern analysis at the account level — it reads the *behavioral* signals from sales activity. Not product adoption metrics, but whether your team is actually engaging the right people at the right level. Not a predicted close date, but whether relationship health and engagement momentum support the account strategy you think you have.
>
> The Neglect detection and Relationship Health scoring are things neither of those tools do — because they require the activity-level data that People.ai captures. Who's in the meetings, who's on the emails, which executives are engaged, how responsive contacts are.
>
> For teams that have Gainsight or Clari, this is complementary — it's a different lens on account health. For teams that don't, it fills a gap that no CRM report or BI dashboard covers."

---

## "This seems expensive to deploy and maintain."

**What they're really saying:** "I don't have bandwidth for another initiative."

**Response:**

> "This is probably the lightest deployment you'll do this quarter.
>
> The EDB tables deploy with a bookmarklet — literally a drag-and-click. No admin access needed, no schema changes, no IT ticket. Takes minutes.
>
> SalesAI Signals configure in the signal builder — pick the metrics, set the prompt, turn it on. Under an hour for all five signal types.
>
> There are no custom fields to create, no integrations to build, no data to migrate. Every metric Account Insights uses is out-of-the-box in People.ai. The 12 FormulaMetrics compute ratios on data that's already flowing. If you're a People.ai customer, the data is already there.
>
> For the pilot, I'd suggest deploying just the five category tables plus the summary view for one team. That's a 15-minute setup. Run for 30 days, measure impact, then decide what to expand."

---

## "What if it surfaces too many false positives?"

**What they're really saying:** "I need this to be accurate or it'll lose credibility fast."

**Response:**

> "Two things protect against that.
>
> First, the thresholds are transparent and adjustable. Account Neglect triggers when engagement drops below 30 and meetings in the last 30 days equals zero — those are People.ai metrics your team already knows and trusts. If those thresholds are too sensitive for your account cycle, we adjust them. Same with every filter across all five categories.
>
> Second, every score links directly to the underlying data. If the Relationship Health view flags an account as single-threaded, the team can see the exact metrics — 2 contacts engaged out of 15 meetings, zero executive involvement, email responsiveness declining. They can evaluate for themselves whether the signal is valid.
>
> In practice, we see false positive rates below 20% — and even the 'false positives' are often data quality issues worth catching. An account flagged as neglected that's actually being worked through a different channel? That's a data capture gap you'd want to fix."

---

## "We need to see this with our own data before we commit."

**What they're really saying:** "Show me, don't tell me."

**Response:**

> "Absolutely. That's what the pilot is for.
>
> I can deploy the five insight tables plus the summary view on your live People.ai instance in under 15 minutes. Your team will see their own accounts, their own engagement data, their own coverage gaps. No sample data, no hypotheticals.
>
> What I'd suggest: deploy the tables, do one account coverage review using the Neglect Detection view, and see what surfaces. If the first 5 accounts it flags are ones your team already knows about — great, it validates the approach. If it flags accounts nobody was watching — even better, you've already found value.
>
> Want to pick a team to try it with?"

---

## Quick Reference: Objection → One-Line Response

| Objection | One-Line Response |
|-----------|-------------------|
| "We have dashboards" | "Dashboards show account state. This shows what's about to change." |
| "AI hype" | "It's 12 FormulaMetrics on your engagement data — transparent math, not magic." |
| "Data quality" | "It uses auto-captured metrics, not CRM fields reps fill in." |
| "Reps won't use it" | "It shows up where they work — on the account record and in Slack." |
| "We have Gainsight/Clari" | "Different lens — engagement patterns from sales activity vs. product usage or forecasting." |
| "Too expensive to deploy" | "Tables deploy in minutes with a bookmarklet. No custom fields, no integrations." |
| "False positives" | "Transparent thresholds, linked to underlying data, adjustable per team." |
| "Show me with our data" | "15-minute setup on your live instance. Pick a team and let's go." |
