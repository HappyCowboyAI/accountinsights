# Cross-Category Compound Signals

**Wave:** 2
**Object:** Account
**Purpose:** Surface high-value insights at the intersection of multiple categories

These compound signals combine metrics from 2+ insight categories to detect patterns that are more actionable than any single category alone. They represent the "so what?" layer — the moment where data becomes a specific recommended action.

---

## Signal 1: Single-Threaded Champion Risk

**Emoji:** :fire:
**Priority:** CRITICAL
**Categories crossed:** Engagement Momentum + Relationship Health

### Trigger Conditions

ALL of these must be true:
- `engagement_momentum_score` > 1.2 (surging engagement)
- `stakeholder_breadth` < 0.5 (fewer than ~2 contacts/week)
- `executive_coverage` < 15% (minimal exec access)
- `meetings_30d` >= 3 (there IS activity — it's just narrow)

### Why This Matters

The account is surging with activity, but ALL of it flows through one person. This is the most dangerous pattern in B2B sales: a single-threaded champion driving momentum. If that person changes roles, goes on leave, or loses internal political capital — the entire relationship collapses overnight. The higher the momentum, the more painful the collapse.

### SalesAI Prompt

```
You are detecting single-threaded champion risk at "{account_name}".

METRICS:
- Engagement Momentum Score: {engagement_momentum_score} (>1.2 = surging)
- Stakeholder Breadth: {stakeholder_breadth} contacts/week
- Executive Coverage: {executive_coverage}%
- Meetings (30d): {meetings_30d}
- People Engaged (30d): {people_engaged_30d}
- Emails Sent (30d): {emails_sent_30d}
- Emails Received (30d): {emails_received_30d}

ANALYSIS: This account shows HIGH engagement momentum but NARROW relationship breadth.
All activity appears concentrated through a single champion. Assess:
1. How concentrated is the activity? (meetings with same person vs. different people)
2. Is the champion's engagement sustainable or showing signs of fatigue?
3. What is the risk if this single contact becomes unavailable?

OUTPUT FORMAT:
🔥 SINGLE-THREADED CHAMPION RISK | Critical | Score: {0.0-1.0}
Pattern: {engagement_momentum_score}x momentum through {people_engaged} contacts ({executive_coverage}% exec)
Risk: {Specific description of the concentration risk}
Action: Immediate multi-threading — get {N} new stakeholders engaged within 2 weeks
Timeline: {Urgency based on deal stage and momentum}
```

### Example Output

```
🔥 SINGLE-THREADED CHAMPION RISK | Critical | Score: 0.91
Pattern: 1.8x momentum through 2 contacts (0% exec)
Risk: 11 meetings in 30 days, all with Sarah Chen (Director, IT). Zero executive engagement. Email is bi-directional but only with Sarah. If Sarah changes roles or loses budget authority, the entire $400K opportunity collapses with no fallback relationships.
Action: Immediate multi-threading — get 3 new stakeholders engaged within 2 weeks. Ask Sarah to facilitate introductions to her VP and the procurement lead. Schedule executive alignment meeting.
Timeline: Critical — act this week. Momentum is high but fragile.
```

---

## Signal 2: Executive Ghosting

**Emoji:** :ghost:
**Priority:** HIGH
**Categories crossed:** Engagement Momentum + Relationship Health + Buying Committee

### Trigger Conditions

ALL of these must be true:
- `engagement_momentum_score` < 0.8 (declining engagement)
- `executive_coverage` was > 20% in prior 30-day window (execs WERE engaged)
- Executive meetings in last 7 days = 0
- Total meetings in last 7 days >= 1 (team is still active, but execs dropped)

### Why This Matters

Executives were actively engaged — attending meetings, responding to emails — and then went silent. This is a leading indicator of competitive evaluation, internal reprioritization, or loss of executive sponsorship. The mid-level team may still be engaged (meetings continue), but the decision-makers have disengaged. By the time this shows up in a quarterly review, the damage is done.

### SalesAI Prompt

```
You are detecting executive ghosting at "{account_name}".

METRICS:
- Engagement Momentum Score: {engagement_momentum_score}
- Exec Activities (30d): {exec_activities_30d}
- Exec Activities (7d): {exec_activities_7d}
- Executive Coverage (30d): {executive_coverage}%
- Meetings (30d): {meetings_30d}
- Meetings (7d): {meetings_7d}
- Email Responsiveness: {email_responsiveness}

ANALYSIS: Executives were previously engaged but have gone silent in the last 7-14 days
while mid-level activity continues. Assess:
1. How abrupt was the executive disengagement?
2. Is mid-level engagement compensating or also declining?
3. What are the likely causes? (competitive eval, budget freeze, reorg, champion departure)

OUTPUT FORMAT:
👻 EXECUTIVE GHOSTING | High | Score: {0.0-1.0}
Pattern: Exec engagement dropped from {prior}% to {current}% in {timeframe}
Risk: {What this likely means for the deal/account}
Action: Executive re-engagement — CXO-to-CXO outreach within 48 hours
Diagnosis: {Most likely cause and how to confirm}
```

### Example Output

```
👻 EXECUTIVE GHOSTING | High | Score: 0.78
Pattern: Exec engagement dropped from 28% to 0% in 14 days. VP of Engineering attended 3 meetings in weeks 1-2, zero since.
Risk: Executive disengagement while mid-level team continues meeting suggests the VP may have deprioritized internally or is evaluating alternatives. The technical team may not be aware of the shift.
Action: Executive re-engagement — CXO-to-CXO outreach within 48 hours. Have your VP of Sales reach out directly to the VP of Engineering with a value-focused agenda.
Diagnosis: Check if there was a reorg, budget review, or competitive RFP. Ask your champion directly: "We noticed [VP name] hasn't been as available — is there a better time for executive alignment?"
```

---

## Signal 3: Expansion Ready (Validated)

**Emoji:** :moneybag:
**Priority:** MEDIUM (positive signal — not urgent, but high value)
**Categories crossed:** Whitespace & Expansion + Relationship Health + Engagement Momentum

### Trigger Conditions

ALL of these must be true:
- `whitespace_expansion_score` > 0.65 (strong expansion signal)
- `relationship_health_score` > 0.60 (healthy multi-threaded relationship)
- `engagement_momentum_score` > 1.0 (engagement growing)
- Account type = "Customer" (existing customer, not prospect)
- No open expansion opportunity in CRM

### Why This Matters

Many expansion signals are false positives — high activity that turns out to be support escalations, training, or one-off projects. This compound signal validates expansion readiness by requiring BOTH strong activity signals AND a healthy underlying relationship. The combination of growing engagement + broad relationships + expansion-level activity intensity is the strongest indicator that a customer is ready to buy more.

### SalesAI Prompt

```
You are identifying validated expansion opportunities at "{account_name}".

METRICS:
- Whitespace Expansion Score: {whitespace_expansion_score}
- Relationship Health Score: {relationship_health_score}
- Engagement Momentum Score: {engagement_momentum_score}
- Activity Revenue Ratio: {activity_revenue_ratio}
- Stakeholder Breadth: {stakeholder_breadth} contacts/week
- Executive Coverage: {executive_coverage}%
- Annual Revenue: ${annual_revenue}
- Open Opportunities: {open_opps}

ANALYSIS: This customer account shows validated expansion signals — high activity
intensity with strong relationships and growing momentum. Assess:
1. Is the engagement cross-departmental? (new teams engaging = whitespace)
2. Are executives newly involved? (exec sponsorship for expansion)
3. What is the estimated expansion potential based on activity-to-revenue ratio?

OUTPUT FORMAT:
💰 EXPANSION READY | Medium | Score: {0.0-1.0}
Evidence: {whitespace_score} whitespace + {relationship_score} relationship + {momentum_score}x momentum
Estimated potential: ${range} based on engagement-to-revenue comparison
Approach: {Specific expansion strategy — upsell, cross-sell, new department}
Next step: Create expansion opportunity in CRM and schedule strategic account review
```

### Example Output

```
💰 EXPANSION READY | Medium | Score: 0.82
Evidence: 0.78 whitespace + 0.72 relationship + 1.4x momentum. Customer at $200K ARR engaging like a $500K account — 3x the meeting volume of similar-sized customers, 2 new departments reaching out, VP of Product newly involved.
Estimated potential: $250K-$400K expansion based on engagement-to-revenue comparison with similar accounts.
Approach: Cross-sell into Product and Engineering teams. VP of Product involvement suggests interest in platform capabilities beyond current deployment. Schedule strategic account review with customer success.
Next step: Create expansion opportunity in CRM ($300K est.) and schedule joint Sales + CS strategic account review within 2 weeks.
```

---

## Signal 4: Rapid Acceleration (New Business)

**Emoji:** :zap:
**Priority:** HIGH
**Categories crossed:** Engagement Momentum + Buying Committee + ICP Fit

### Trigger Conditions

ALL of these must be true:
- `engagement_momentum_score` > 1.5 (rapidly accelerating)
- `contact_velocity` > 1.2 (committee expanding)
- `committee_coverage_ratio` > 0.20 (executives in the conversation)
- No open opportunities in CRM
- Account type != "Customer" (prospect or new)

### Why This Matters

This is the "hidden opportunity" signal for Account Insights — a prospect account with all the hallmarks of an active buying cycle, but no deal in CRM. Activity is surging, new stakeholders are joining (including executives), and the engagement pattern matches buying behavior. Every day without an opportunity created is a day without pipeline, without forecasting, and without structured selling.

### SalesAI Prompt

```
You are detecting rapid acceleration buying signals at "{account_name}".

METRICS:
- Engagement Momentum Score: {engagement_momentum_score} (>1.5 = rapid acceleration)
- Contact Velocity: {contact_velocity} (>1.2 = committee expanding)
- Committee Coverage Ratio: {committee_coverage_ratio} (>0.20 = exec access)
- People Contacted (7d): {people_contacted_7d}
- People Contacted (30d): {people_contacted_30d}
- Exec Engaged (30d): {execs_engaged_30d}
- Meetings (7d): {meetings_7d}
- Meetings (30d): {meetings_30d}
- Open Opportunities: {open_opps}
- ICP Fit Score: {icp_fit_score}

ANALYSIS: This prospect account shows rapid acceleration with expanding committee
engagement including executives — but has no open opportunity. Assess:
1. Does the engagement pattern match a buying cycle? (meeting frequency, exec involvement, breadth)
2. How does this compare to historical closed-won patterns?
3. What stage of buying is this likely in? (awareness, evaluation, decision)

OUTPUT FORMAT:
⚡ RAPID ACCELERATION | High | Score: {0.0-1.0}
Pattern: {momentum_score}x momentum | {contact_velocity}x contact expansion | {committee_ratio}% exec coverage
Buying signals: {Specific evidence of active buying cycle}
Action: Create opportunity immediately — this account is in active buying cycle
Estimated stage: {Likely buying stage based on engagement patterns}
```

### Example Output

```
⚡ RAPID ACCELERATION | High | Score: 0.88
Pattern: 2.1x momentum | 1.6x contact expansion | 25% exec coverage. 8 meetings in last 7 days (vs. 12 in prior 23 days). 4 new stakeholders introduced this week including VP of IT.
Buying signals: Rapid meeting acceleration with broadening committee. New executive engagement. Inbound email volume tripled. Pattern matches historical closed-won accounts at evaluation stage.
Action: Create opportunity immediately — this account is in active buying cycle with no deal in CRM. Assign to territory AE and schedule qualification call within 48 hours.
Estimated stage: Mid-evaluation — committee is forming, executives are sponsoring, timeline likely 60-90 days to close.
```

---

## Priority Hierarchy (Updated with Compound Signals)

When multiple signals fire on the same account, display in this order:

1. **Account Neglect** (Critical) — 🚨
2. **Single-Threaded Champion Risk** (Critical) — 🔥
3. **Executive Ghosting** (High) — 👻
4. **Rapid Acceleration** (High) — ⚡
5. **Buying Committee Gap** (High) — 🏛️
6. **Declining Engagement** (High) — 📉
7. **Relationship Health Warning** (Medium-High) — 🤝
8. **Expansion Ready** (Medium) — 💰
9. **Whitespace Signal** (Medium) — 💎
10. **ICP Fit Match** (Medium) — 🎯
11. **Surging Engagement** (Low) — 📈
12. **Healthy Account** (Informational) — ✅
