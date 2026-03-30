# Account Insights — Wave 2 Design Document

**Date:** 2026-03-30
**Author:** Scott Metcalf + Claude
**Status:** Draft
**Builds on:** Wave 1 (2026-03-05 design + implementation)

---

## Overview

Wave 2 extends Account Insights with two capabilities that differentiate it from a simple "OI for accounts" reskin:

1. **Buying Committee Coverage** — Infer buying committee role coverage from activity patterns. Goes beyond counting contacts to assess whether the RIGHT people (decision-makers, evaluators, champions) are in the conversation.

2. **Cross-Category Compound Signals** — Surface high-value insights at the intersection of 2+ existing categories. These "so what?" signals combine multiple data points into specific recommended actions.

### Design Philosophy

Wave 1 established 5 independent insight categories. Wave 2 introduces a **correlation layer** — the insight that "surging engagement + narrow relationships" is more dangerous than either signal alone. This is the highest-leverage addition because compound signals directly map to specific sales actions, not just dashboards to review.

### Competitive Position

- **Gong** does buying committee inference from transcripts. We do it from activity patterns — no transcripts needed, works for any customer with People.ai activity capture.
- **6sense** and **Demandbase** map buying groups from intent signals. We map them from actual engagement data — who's in the meetings, who's responding to emails.
- **Nobody** is shipping compound signals that cross account health categories. This is net-new.

---

## Feature 1: Buying Committee Coverage

### New Metrics

| Metric | Slug | Formula | What It Measures |
|--------|------|---------|-----------------|
| Committee Coverage Ratio | `account_committee_coverage_ratio` | `a / b` (exec contacts / total contacts) | % of engaged contacts at executive level |
| Contact Velocity | `account_contact_velocity` | `4.286 * a / b` (7d / 30d unique contacts) | Rate of new stakeholder introduction |

### New EDB Table

**Table 7: Buying Committee Coverage** (`buying_committee_coverage.js`)
- 13 columns: Account, Owner, Engagement, Revenue, People Contacted (30d/7d), Execs Engaged (30d), Exec Activities (30d), People Engaged (30d), Meetings (30d), Emails (30d), Open Opps, Domain
- Filter: external_people_contacted_30d > 0 AND engagement > 0
- Sort: Execs Engaged ascending (worst committee coverage first)

### New SalesAI Signal

**Buying Committee Gap** (`signals/individual/buying_committee.md`)
- Fires when: committee_coverage_ratio < 0.15 OR contact_velocity < 0.50 OR stakeholder_breadth < 0.50
- Priority: High
- Output: Committee composition assessment, missing role identification, multi-threading recommendation

### Value Proposition

Average B2B buying group: 7-8 stakeholders (Forrester 2026). Multi-threading cuts sales cycles 15-30% and increases win rates 8-15% (Salesmotion). This signal tells reps exactly where their committee coverage is thin — before the deal stalls.

---

## Feature 2: Cross-Category Compound Signals

### The 4 Compound Signals

| # | Signal | Emoji | Priority | Categories Crossed | Trigger |
|---|--------|-------|----------|-------------------|---------|
| 1 | Single-Threaded Champion Risk | :fire: | Critical | Momentum + Relationship | HIGH momentum + LOW breadth + LOW exec coverage |
| 2 | Executive Ghosting | :ghost: | High | Momentum + Relationship + Committee | DECLINING momentum + PREVIOUSLY HIGH exec coverage + CURRENT zero exec |
| 3 | Expansion Ready (Validated) | :moneybag: | Medium | Whitespace + Relationship + Momentum | HIGH whitespace + HIGH relationship + GROWING momentum + Customer |
| 4 | Rapid Acceleration (New Business) | :zap: | High | Momentum + Committee + ICP | SURGING momentum + EXPANDING committee + Exec access + No open opps |

### Why Compound > Individual

Individual signals answer "what's happening?" Compound signals answer "what should I do?"

| Individual Signal | Compound Signal | Action Clarity |
|------------------|----------------|---------------|
| "Engagement is surging" | "Engagement is surging through one person — multi-thread NOW" | 10x more actionable |
| "Executive coverage dropped" | "Executives ghosted after being actively engaged — CXO outreach in 48hrs" | Specific, time-bound |
| "Whitespace score is high" | "Validated expansion: strong relationships + growing momentum + 3x activity. Create opp." | Eliminates false positives |
| "Contact velocity is high" | "New business acceleration: buying committee forming with exec sponsorship, no opp in CRM" | Pipeline creation trigger |

### Priority Hierarchy (Updated)

Full signal priority order with compound signals integrated:

1. Account Neglect (Critical)
2. **Single-Threaded Champion Risk** (Critical) — NEW
3. **Executive Ghosting** (High) — NEW
4. **Rapid Acceleration** (High) — NEW
5. Buying Committee Gap (High) — NEW
6. Declining Engagement (High)
7. Relationship Health Warning (Medium-High)
8. **Expansion Ready** (Medium) — NEW
9. Whitespace Signal (Medium)
10. ICP Fit Match (Medium)
11. Surging Engagement (Low)
12. Healthy Account (Informational)

---

## Integration with Existing Assets

### Dashboard Updates

Add 2 new widgets to the Account Insights dashboard:

**Widget 16: Buying Committee Gaps** (Section 7)
- Table widget showing top 10 accounts with lowest committee coverage ratio
- Columns: Account, Coverage Ratio, Total Contacts, Exec Contacts, Contact Velocity

**Widget 17: Compound Signal Alerts** (Section 7)
- List widget showing all accounts with active compound signals
- Sorted by priority (Critical > High > Medium)
- Each row: emoji + signal name + account + score + one-line action

### Slack Bot Updates

Add a 4th parallel branch to the `/account-insights` Slack bot:

**Branch 4: Compound Alerts**
- Detect accounts with compound signal conditions
- Format as a priority-sorted alert list
- Example Slack output:
```
⚡ COMPOUND SIGNALS
🔥 Acme Corp — Single-Threaded Champion Risk (0.91) — Multi-thread immediately
👻 TechStart Inc — Executive Ghosting (0.78) — CXO outreach in 48hrs
💰 MegaCorp — Expansion Ready (0.82) — Create $300K expansion opp
```

### Unified Signal Update

Update `signals/unified/account_intelligence.md` to include compound signal evaluation after individual category assessment. The compound signals take priority over individual signals when both fire.

---

## Metrics Summary (After Wave 2)

| Category | Count | Metrics |
|----------|-------|---------|
| Base (Wave 1) | 7 | email_responsiveness, executive_coverage, engagement_momentum, stakeholder_breadth, meeting_acceleration, email_acceleration, activity_revenue_ratio |
| Composite (Wave 1) | 5 | icp_fit_score, relationship_health_score, engagement_momentum_score, whitespace_expansion_score, account_neglect_score |
| Buying Committee (Wave 2) | 2 | committee_coverage_ratio, contact_velocity |
| **Total** | **14** | |

## Tables Summary (After Wave 2)

| # | Table | Wave |
|---|-------|------|
| 1 | ICP Fit Profiling | 1 |
| 2 | Relationship Health | 1 |
| 3 | Engagement Momentum | 1 |
| 4 | Whitespace & Expansion | 1 |
| 5 | Account Neglect | 1 |
| 6 | Account Intelligence Summary | 1 |
| 7 | Buying Committee Coverage | 2 |

## Signals Summary (After Wave 2)

| # | Signal | Type | Wave |
|---|--------|------|------|
| 1-5 | Individual category signals | Individual | 1 |
| 6 | Account Intelligence (unified) | Unified | 1 |
| 7 | Buying Committee Gap | Individual | 2 |
| 8-11 | Compound signals (4) | Compound | 2 |

---

## Success Criteria

1. **Committee Coverage** identifies at least 3 accounts per team with critical decision-maker gaps that weren't previously visible
2. **Single-Threaded Champion Risk** catches at least 1 account per team where momentum is high but relationship is dangerously narrow
3. **Executive Ghosting** detects exec disengagement 2+ weeks before it surfaces in standard review cadence
4. **Expansion Ready** reduces false positive rate of expansion signals by 50%+ vs. whitespace score alone
5. **Rapid Acceleration** creates at least 2 new pipeline opportunities per team from accounts with no existing deals
