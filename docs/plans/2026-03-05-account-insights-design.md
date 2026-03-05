# Account Insights — Design Document

**Date:** 2026-03-05
**Author:** Scott Metcalf + Claude
**Status:** Approved
**Based on:** Opportunity Insights project (`/Users/scottmetcalf/projects/opportunityinsights`)

---

## Overview

Account Insights is an AI-powered intelligence engine that analyzes account-level activity data from People.ai's OOTB metrics to surface critical patterns across 5 insight categories. It follows the Enhanced Architecture approach — the same proven foundation as Opportunity Insights (EDB tables, custom metrics, signals, dashboard, Slack bot) with an added **scoring layer** that rolls up multiple metrics into per-category composite grades.

### Design Philosophy

- **OOTB metrics only** for the base product — no custom fields, no SalesAI dependency
- **Activity-based intelligence** — built from actual behavioral data (meetings, emails, exec access), not conversation transcripts or web visits
- **Scoring layer** — composite scores per category enable prioritization and A-F grading
- **Same tiered model** as Opportunity Insights:
  - Tier 1 (Base): EDB Tables + Custom FormulaMetrics + Dashboard
  - Tier 2 (Enhanced): Category Scoring Metrics
  - Tier 3 (AI): SalesAI Signals (optional)

### Competitive Differentiation

People.ai captures hundreds of granular OOTB activity metrics automatically. Competitors rely on conversation intelligence (Gong), intent signals (6sense), or CRM data (Salesforce Einstein). Account Insights leverages actual behavioral engagement data — meetings held, emails exchanged, exec access achieved — to build a richer, more objective account intelligence layer.

---

## The 5 Insight Categories

| # | Category | Core Question | Type |
|---|----------|--------------|------|
| 1 | **ICP Fit Profiling** | Does this account behave like our best customers? | Static profile |
| 2 | **Relationship Health** | How deep and broad is our relationship right now? | Current state |
| 3 | **Engagement Momentum** | Is this account heating up or cooling down? | Trajectory |
| 4 | **Whitespace & Expansion** | Where is untapped potential in existing accounts? | Opportunity |
| 5 | **Account Neglect** | Which accounts are we failing to cover? | Coverage gap |

---

## Project Structure

```
/Users/scottmetcalf/projects/accountinsights/
├── CLAUDE.md
├── edb-tables/              # 5 tables (one per category) + 1 summary table
│   ├── icp_fit_profiling.js
│   ├── relationship_health.js
│   ├── engagement_momentum.js
│   ├── whitespace_expansion.js
│   ├── account_neglect.js
│   └── account_intelligence_summary.js
├── metrics/
│   └── account/             # OOTB-derived FormulaMetrics + category scores
├── signals/
│   ├── unified/             # Single "Account Intelligence" signal
│   │   └── account_intelligence.md
│   └── individual/          # 5 individual signals (one per category)
│       ├── icp_fit.md
│       ├── relationship_health.md
│       ├── engagement_momentum.md
│       ├── whitespace_expansion.md
│       └── account_neglect.md
├── dashboards/              # Account Insights board
│   └── account_insights_board.js
├── prompts/                 # Claude prompt templates for Slack bot
│   ├── neglected_account_analysis.md
│   ├── surging_account_analysis.md
│   └── expansion_account_analysis.md
├── n8n/workflows/           # Slack bot orchestration
├── docs/
│   ├── plans/               # Design docs (this file)
│   └── sales-enablement/    # Sales Leader + RevOps personas
│       ├── sales-leader/
│       └── revops/
└── assets/                  # Screenshots, GIFs, demos
```

---

## EDB Tables

### Table 1: ICP Fit Profiling (`icp_fit_profiling.js`)

**Object:** Account
**Purpose:** Score accounts against behavioral ICP model
**Filters:** All accounts, sorted by ICP Fit Score descending

| Column | Metric Slug | Variation | Purpose |
|--------|------------|-----------|---------|
| Account | `ootb_account` | — | Identity |
| Owner | `ootb_account_original_owner` | — | Ownership |
| Industry | `ootb_account_industry` | — | Firmographic |
| Annual Revenue | `ootb_account_annual_revenue` | — | Firmographic |
| Account Type | `ootb_account_type` | `_0` | Customer/Prospect |
| Engagement Level | `ootb_account_engagement_level` | `_0` | Overall engagement |
| People Engaged (30d) | `ootb_account_people_engaged` | `_last_30_days` | Stakeholder breadth |
| Execs Engaged (30d) | `ootb_account_executive_engaged` | `_last_30_days` | Exec access |
| Meetings (30d) | `ootb_account_count_of_meetings_standard` | `_last_30_days` | Activity volume |
| Emails Received (30d) | `ootb_account_count_of_emails_received` | `_last_30_days` | Responsiveness |
| Email Responsiveness | `account_email_responsiveness` | computed | Custom ratio |
| Exec Coverage | `account_executive_coverage` | computed | Custom % |
| **ICP Fit Score** | `account_icp_fit_score` | computed | **Composite** |

### Table 2: Relationship Health (`relationship_health.js`)

**Object:** Account
**Purpose:** Assess relationship depth and breadth
**Filters:** Accounts with open opportunities OR type = Customer, sorted by Relationship Score ascending (worst first)

| Column | Metric Slug | Variation | Purpose |
|--------|------------|-----------|---------|
| Account | `ootb_account` | — | Identity |
| Owner | `ootb_account_original_owner` | — | Ownership |
| Account Type | `ootb_account_type` | `_0` | Segment |
| Engagement Level | `ootb_account_engagement_level` | `_0` | Overall health |
| People Engaged (30d) | `ootb_account_people_engaged` | `_last_30_days` | Breadth |
| Execs Engaged (30d) | `ootb_account_executive_engaged` | `_last_30_days` | Depth |
| Exec Activities (30d) | `ootb_account_executive_activities` | `_last_30_days` | Exec investment |
| Emails Sent (30d) | `ootb_account_count_of_emails_sent` | `_last_30_days` | Outbound effort |
| Emails Received (30d) | `ootb_account_count_of_emails_received` | `_last_30_days` | Inbound response |
| Meetings (7d) | `ootb_account_count_of_meetings_standard` | `_last_7_days` | Recent cadence |
| Meetings (30d) | `ootb_account_count_of_meetings_standard` | `_last_30_days` | Monthly cadence |
| Email Responsiveness | `account_email_responsiveness` | computed | Engagement balance |
| Exec Coverage | `account_executive_coverage` | computed | Exec access % |
| Stakeholder Breadth | `account_stakeholder_breadth` | computed | **New: contacts/week** |
| **Relationship Score** | `account_relationship_health_score` | computed | **Composite** |

### Table 3: Engagement Momentum (`engagement_momentum.js`)

**Object:** Account
**Purpose:** Detect accounts heating up or cooling down
**Filters:** All accounts with engagement level > 0, sorted by Momentum Score descending

| Column | Metric Slug | Variation | Purpose |
|--------|------------|-----------|---------|
| Account | `ootb_account` | — | Identity |
| Owner | `ootb_account_original_owner` | — | Ownership |
| Account Type | `ootb_account_type` | `_0` | Segment |
| Engagement Level | `ootb_account_engagement_level` | `_0` | Current level |
| Meetings (7d) | `ootb_account_count_of_meetings_standard` | `_last_7_days` | This week |
| Meetings (30d) | `ootb_account_count_of_meetings_standard` | `_last_30_days` | This month |
| Emails Received (7d) | `ootb_account_count_of_emails_received` | `_last_7_days` | Recent inbound |
| Emails Received (30d) | `ootb_account_count_of_emails_received` | `_last_30_days` | Monthly inbound |
| People Engaged (30d) | `ootb_account_people_engaged` | `_last_30_days` | New relationships |
| Execs Engaged (30d) | `ootb_account_executive_engaged` | `_last_30_days` | Exec activation |
| Engagement Momentum | `account_engagement_momentum` | computed | Existing: 14d/30d ratio |
| Meeting Acceleration | `account_meeting_acceleration` | computed | **New: 7d vs 30d rate** |
| Email Acceleration | `account_email_acceleration` | computed | **New: 7d vs 30d rate** |
| **Momentum Score** | `account_momentum_score` | computed | **Composite** |

### Table 4: Whitespace & Expansion (`whitespace_expansion.js`)

**Object:** Account
**Purpose:** Identify expansion potential in existing accounts
**Filters:** Account type = Customer, engagement level >= 50, sorted by Expansion Score descending

| Column | Metric Slug | Variation | Purpose |
|--------|------------|-----------|---------|
| Account | `ootb_account` | — | Identity |
| Owner | `ootb_account_original_owner` | — | Ownership |
| Annual Revenue | `ootb_account_annual_revenue` | — | Account size |
| Account Type | `ootb_account_type` | `_0` | Must be Customer |
| Open Opportunities | `ootb_account_open_opportunities` | `_any_time` | Current pipeline |
| Closed Won (Last FY) | `ootb_account_closed_won_opportunities` | `_last_fyear` | Historical wins |
| Engagement Level | `ootb_account_engagement_level` | `_0` | Current activity |
| People Engaged (30d) | `ootb_account_people_engaged` | `_last_30_days` | Breadth signal |
| Execs Engaged (30d) | `ootb_account_executive_engaged` | `_last_30_days` | New exec contacts |
| Exec Activities (30d) | `ootb_account_executive_activities` | `_last_30_days` | Exec investment |
| Meetings (30d) | `ootb_account_count_of_meetings_standard` | `_last_30_days` | Activity volume |
| Engagement Momentum | `account_engagement_momentum` | computed | Trending up? |
| Activity-to-Revenue Ratio | `account_activity_revenue_ratio` | computed | **New: engagement vs footprint** |
| **Expansion Score** | `account_expansion_score` | computed | **Composite** |

### Table 5: Account Neglect (`account_neglect.js`)

**Object:** Account
**Purpose:** Surface accounts being ignored
**Filters:** Account type = Customer OR has open opportunities, engagement level < 30, meetings (30d) <= 1, sorted by Annual Revenue descending

| Column | Metric Slug | Variation | Purpose |
|--------|------------|-----------|---------|
| Account | `ootb_account` | — | Identity |
| Owner | `ootb_account_original_owner` | — | Who's responsible |
| Account Type | `ootb_account_type` | `_0` | Customer/Prospect |
| Annual Revenue | `ootb_account_annual_revenue` | — | Account value |
| Open Opportunities | `ootb_account_open_opportunities` | `_any_time` | Active pipeline |
| Engagement Level | `ootb_account_engagement_level` | `_0` | Current (likely low) |
| Meetings (7d) | `ootb_account_count_of_meetings_standard` | `_last_7_days` | Recent (likely 0) |
| Meetings (30d) | `ootb_account_count_of_meetings_standard` | `_last_30_days` | Monthly (likely 0) |
| Emails Sent (30d) | `ootb_account_count_of_emails_sent` | `_last_30_days` | Outbound effort |
| Emails Received (30d) | `ootb_account_count_of_emails_received` | `_last_30_days` | Response |
| People Engaged (30d) | `ootb_account_people_engaged` | `_last_30_days` | Contact breadth |
| Engagement Momentum | `account_engagement_momentum` | computed | Declining? |
| **Neglect Score** | `account_neglect_score` | computed | **Composite (inverse)** |

### Table 6: Account Intelligence Summary (`account_intelligence_summary.js`)

**Object:** Account
**Purpose:** At-a-glance view of all 5 category scores per account
**Filters:** All accounts, sortable by any score column

| Column | Purpose |
|--------|---------|
| Account | Identity |
| Owner | Ownership |
| Account Type | Segment |
| Annual Revenue | Size |
| Engagement Level | Current state |
| ICP Fit Score | Category 1 |
| Relationship Score | Category 2 |
| Momentum Score | Category 3 |
| Expansion Score | Category 4 |
| Neglect Score | Category 5 |
| Primary Insight | Highest-priority category label |

---

## Custom Metrics

### Existing (carried over from Opportunity Insights)

| Metric | Formula | Purpose |
|--------|---------|---------|
| `account_email_responsiveness` | `a / b` (inbound / outbound emails) | Engagement balance |
| `account_executive_coverage` | `100 * a / b` (exec meetings / total meetings) | Exec access % |
| `account_engagement_momentum` | `100 * a / b` (14d activities / 30d activities) | Rate of change |

### New Metrics

| Metric | Object | Type | Formula Concept |
|--------|--------|------|----------------|
| `account_stakeholder_breadth` | Account | FormulaMetric | Unique people engaged per week |
| `account_meeting_acceleration` | Account | FormulaMetric | 7d meeting rate / 30d meeting rate (x4.3 normalized) |
| `account_email_acceleration` | Account | FormulaMetric | 7d email rate / 30d email rate (x4.3 normalized) |
| `account_activity_revenue_ratio` | Account | FormulaMetric | Engagement level / log(annual revenue) |
| `account_icp_fit_score` | Account | FormulaMetric | Weighted composite (see below) |
| `account_relationship_health_score` | Account | FormulaMetric | Weighted composite (see below) |
| `account_momentum_score` | Account | FormulaMetric | Weighted composite (see below) |
| `account_expansion_score` | Account | FormulaMetric | Weighted composite (see below) |
| `account_neglect_score` | Account | FormulaMetric | Inverse weighted composite (see below) |

**Total: 12 custom metrics (9 new + 3 existing)**

### Composite Score Formulas

**ICP Fit Score:**
```
(0.30 x normalized_engagement) + (0.25 x normalized_exec_coverage)
+ (0.20 x normalized_email_responsiveness) + (0.15 x normalized_stakeholder_breadth)
+ (0.10 x normalized_meeting_frequency)
```

**Relationship Health Score:**
```
(0.25 x normalized_stakeholder_breadth) + (0.25 x normalized_exec_coverage)
+ (0.20 x normalized_email_responsiveness) + (0.15 x normalized_meeting_cadence)
+ (0.15 x normalized_engagement_level)
```

**Momentum Score:**
```
(0.35 x normalized_engagement_momentum) + (0.30 x normalized_meeting_acceleration)
+ (0.20 x normalized_email_acceleration) + (0.15 x normalized_new_people_rate)
```

**Expansion Score:**
```
(0.30 x normalized_activity_revenue_ratio) + (0.25 x normalized_engagement_momentum)
+ (0.25 x normalized_new_exec_engagement) + (0.20 x normalized_engagement_level)
```

**Neglect Score (inverse — higher = more neglected):**
```
(0.35 x inverse_recent_meetings) + (0.25 x inverse_email_activity)
+ (0.20 x normalized_account_value) + (0.20 x inverse_engagement_level)
```

---

## EDB Dashboard

**Board: `account_insights_board.js`** — 15 widgets, 6 sections, global team picker filter.

### Section 1: Account Health KPIs (4 widgets)
| Widget | Type | Metric |
|--------|------|--------|
| Total Accounts Tracked | KPI | Count of accounts in scope |
| Avg ICP Fit Score | KPI | Mean across all scored accounts |
| Avg Relationship Health | KPI | Mean relationship score |
| Accounts Heating Up | KPI | Count where momentum score > 1.2 |

### Section 2: ICP & Scoring Distribution (2 widgets)
| Widget | Type | Purpose |
|--------|------|---------|
| ICP Fit Score Distribution | Bar chart | Accounts bucketed by A/B/C/D/F |
| Score Quadrant: ICP Fit vs Momentum | Scatter | Top-right = high-fit accounts heating up |

### Section 3: Relationship & Coverage (2 widgets)
| Widget | Type | Purpose |
|--------|------|---------|
| Relationship Health by Owner | Bar chart | Avg score per rep |
| Exec Coverage by Account Tier | Stacked bar | % Dir/VP/Exec meetings by revenue tier |

### Section 4: Engagement Momentum (2 widgets)
| Widget | Type | Purpose |
|--------|------|---------|
| Heating vs Cooling Trend | Bar chart | Accelerating vs decelerating by week |
| Top 10 Surging Accounts | Table | Highest momentum with week-over-week change |

### Section 5: Expansion & Neglect (3 widgets)
| Widget | Type | Purpose |
|--------|------|---------|
| Whitespace Opportunities | Table | Top expansion-scored customers |
| Neglected High-Value Accounts | Table | Highest revenue, lowest engagement |
| Neglect by Owner | Bar chart | Count of neglected accounts per rep |

### Section 6: Summary (2 widgets)
| Widget | Type | Purpose |
|--------|------|---------|
| Primary Insight Distribution | Pie/donut | % of accounts per top category |
| About This Dashboard | Note | Description and methodology |

---

## SalesAI Signals

### Unified Signal: `account_intelligence.md`

Single signal per account. Evaluates all 5 categories, scores each 0.0-1.0, surfaces only the highest-priority insight.

**Priority hierarchy:** Neglect > Momentum (cooling) > Relationship Health (poor) > Whitespace > ICP Fit > Momentum (heating) > Healthy

**Thresholds:**
| Pattern | Fires When | Urgency |
|---------|-----------|---------|
| Neglect | Score > 0.70 | Act within 48 hours |
| Momentum (cooling) | Score < 0.50 | Act within 1 week |
| Relationship Health | Score < 0.40 | Act within 1 week |
| Whitespace | Score > 0.65 | Reposition within 2 weeks |
| ICP Fit | Score > 0.70 (prospects) | Prioritize outreach |
| Momentum (heating) | Score > 1.50 | Capitalize immediately |

**Output format:**
```
{EMOJI} {CATEGORY} - {Confidence Level}
* {Primary metric with specific numbers}
* {Supporting signal}
* {Trend or comparison}
Action: {Specific recommendation with timeline}
```

### Individual Signals (5 separate)

| Signal | File | Emoji | Fires When |
|--------|------|-------|-----------|
| ICP Fit | `icp_fit.md` | Target | Score > 0.70 on prospect accounts |
| Relationship Health | `relationship_health.md` | Handshake | Score < 0.40 on accounts with pipeline |
| Engagement Momentum | `engagement_momentum.md` | Chart up/down | Score > 1.5 (surge) or < 0.5 (decline) |
| Whitespace Expansion | `whitespace_expansion.md` | Gem | Score > 0.65 on customer accounts |
| Account Neglect | `account_neglect.md` | Alert | Score > 0.70 on customer/pipeline accounts |

---

## Slack Bot (`/account-insights`)

Same n8n orchestration pattern as Opportunity Insights.

### Three Analysis Branches

| Branch | What It Finds | Prompt Template |
|--------|--------------|----------------|
| Neglected Accounts | Customers + high-value prospects with zero recent engagement | `prompts/neglected_account_analysis.md` |
| Surging Accounts | Accounts with momentum score > 1.5 | `prompts/surging_account_analysis.md` |
| Expansion Candidates | Customer accounts with high activity-to-revenue ratio | `prompts/expansion_account_analysis.md` |

**Flow:** `/account-insights` -> immediate ack -> 3 parallel branches -> Claude Sonnet analysis via People.ai MCP -> formatted Slack digest + email summary.

---

## Sales Enablement

Same two-persona structure as Opportunity Insights:

### Sales Leader Persona
- Talk track, one-pager, discovery questions, objection handling, demo script

### RevOps Persona
- Talk track, one-pager, discovery questions, objection handling, demo script

---

## Confluence Launch Hub

Mirror the Opportunity Insights Launch Hub structure with these pages:

1. **Account Insights - Launch Hub** (parent page)
2. OOTB Metrics to Account Insights
3. Account Insights - EDB Table Designs
4. Account Insights - EDB Dashboard Spec
5. SalesAI Signals for Account Insights
6. Account Insights - Custom Metrics Recommendations
7. Account Insights - Slack Bot Demo (`/account-insights`)
8. Claude AI Project - How the Dashboard Works
9. Sales Enablement - Sales Leader Persona (with child pages)
10. Sales Enablement - RevOps Persona (with child pages)

---

## Value Proposition

### One-Line Pitch

**For Sales Leaders and Account Executives who struggle to prioritize accounts and spot relationship gaps early enough, Account Insights is an AI intelligence engine that scores accounts across 5 dimensions — ICP fit, relationship health, engagement momentum, expansion potential, and coverage gaps — using actual behavioral data, not gut feel.**

### ROI Summary (50-person sales team)

- **ICP Prioritization:** Focus on highest-fit accounts = 15-20% improvement in prospecting efficiency
- **Relationship Gaps Fixed:** 10-15 at-risk relationships caught early = $1M-$2M protected
- **Expansion Captured:** 15-25 upsell opportunities surfaced = $750K-$1.5M
- **Neglect Remediated:** 20-30 abandoned accounts re-engaged = $500K-$1M pipeline created
- **Total Annual Impact:** $3M-$6M+ influenced revenue

---

## Success Criteria

### Minimum Viable Success (30 days)
- 20%+ activation rate
- 15-20 weekly active users
- <10 critical issues
- 2+ documented account impacts

### Stretch Goals
- 35%+ activation rate
- 30+ weekly active users
- 5+ documented account impacts
- Request for expansion to other teams
