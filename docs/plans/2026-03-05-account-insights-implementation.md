# Account Insights Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an AI-powered account intelligence engine with 5 insight categories, composite scoring, EDB tables, dashboard, SalesAI signals, and Slack bot.

**Architecture:** Enhanced clone of Opportunity Insights — same bookmarklet + Glass API foundation with an added scoring layer. All account-level, OOTB metrics only for base product. 12 custom FormulaMetrics (9 new + 3 existing). 6 EDB tables, 15-widget dashboard, unified + individual SalesAI signals, Slack bot.

**Tech Stack:** JavaScript (bookmarklets, Glass API), JSON (FormulaMetric definitions), Markdown (SalesAI signal prompts), n8n (Slack bot orchestration)

**Reference project:** `/Users/scottmetcalf/projects/opportunityinsight` (note: no trailing 's')

---

## Task 1: Project Scaffold & CLAUDE.md

**Files:**
- Create: `CLAUDE.md`
- Create: `.gitignore`
- Create: `edb-tables/` (empty dir)
- Create: `metrics/account/` (empty dir)
- Create: `signals/unified/` (empty dir)
- Create: `signals/individual/` (empty dir)
- Create: `dashboards/` (empty dir)
- Create: `prompts/` (empty dir)
- Create: `n8n/workflows/` (empty dir)
- Create: `docs/sales-enablement/sales-leader/` (empty dir)
- Create: `docs/sales-enablement/revops/` (empty dir)
- Create: `assets/` (empty dir)

**Step 1: Create directory structure**

```bash
cd /Users/scottmetcalf/projects/accountinsights
mkdir -p edb-tables metrics/account signals/unified signals/individual dashboards prompts n8n/workflows docs/sales-enablement/sales-leader docs/sales-enablement/revops assets
```

**Step 2: Create .gitignore**

Copy from reference project:

```
.env
.env.*
n8n/credentials/
*.credential.json
node_modules/
__pycache__/
.venv/
.DS_Store
```

**Step 3: Create CLAUDE.md**

Write the full project guidance file. Model on `/Users/scottmetcalf/projects/opportunityinsight/CLAUDE.md` but adapted for Account Insights:

- Project overview: Account Insights, 5 insight categories, AI Play 30-day sprint
- Architecture table: same layers (Data, Tables, Metrics, Intelligence, Dashboard, Orchestration, Reasoning, Delivery)
- The 5 Insight Types table: ICP Fit (target), Relationship Health (handshake), Engagement Momentum (chart), Whitespace & Expansion (gem), Account Neglect (alert) — all Account object
- Repository structure (matching project layout)
- Key design decisions: OOTB only, 5+1 tables, composite scoring layer, account-level only, bookmarklet delivery
- Working with EDB Tables section (Glass API pattern, `/glass/api/v2/object_explore/create`, account object type, opens `/reporting/account/{id}`)
- Working with Custom Metrics section (FormulaMetric + TimeRangeMetric, deploy via Admin API)
- Working with SalesAI Signals section (unified vs individual, 5 categories)
- Slack Bot section (`/ai`, 3 branches: neglected, surging, expansion)
- Confluence Documentation links (to be populated)
- Required Credentials table (same as OI)

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: project scaffold with directory structure and CLAUDE.md"
```

---

## Task 2: Carry Over Existing Account Metrics (3 metrics)

**Files:**
- Create: `metrics/account/email_responsiveness.json`
- Create: `metrics/account/executive_coverage.json`
- Create: `metrics/account/engagement_momentum.json`

**Step 1: Copy and adapt email_responsiveness.json**

Copy from `/Users/scottmetcalf/projects/opportunityinsight/metrics/account/email_responsiveness.json`. Update `_meta` section:

```json
{
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["icp_fit_profiling", "relationship_health", "account_neglect"],
    "best_fit_tables": ["Table 1: ICP Fit Profiling", "Table 2: Relationship Health", "Table 5: Account Neglect"]
  }
}
```

Keep everything else identical — same slug, same formula (`a / b`), same TimeRangeMetric filters, same coaching_text.

**Step 2: Copy and adapt executive_coverage.json**

Copy from reference. Update `_meta`:

```json
{
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["icp_fit_profiling", "relationship_health"],
    "best_fit_tables": ["Table 1: ICP Fit Profiling", "Table 2: Relationship Health"]
  }
}
```

**Step 3: Copy and adapt engagement_momentum.json**

Copy from reference. Update `_meta`:

```json
{
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["engagement_momentum", "whitespace_expansion"],
    "best_fit_tables": ["Table 3: Engagement Momentum", "Table 4: Whitespace & Expansion"]
  }
}
```

**Step 4: Commit**

```bash
git add metrics/account/email_responsiveness.json metrics/account/executive_coverage.json metrics/account/engagement_momentum.json
git commit -m "feat: carry over 3 existing account-level FormulaMetrics from Opportunity Insights"
```

---

## Task 3: New Custom Metrics — Building Blocks (3 metrics)

**Files:**
- Create: `metrics/account/stakeholder_breadth.json`
- Create: `metrics/account/meeting_acceleration.json`
- Create: `metrics/account/email_acceleration.json`

**Step 1: Create account_stakeholder_breadth.json**

Unique people engaged per week. Formula: `7 * a / b` where `a` = people engaged (count of unique external contacts), `b` = days observed (use 30 as constant via a Field param or simplify to `a / 4.3` for weekly rate over 30 days).

Pattern follows `/Users/scottmetcalf/projects/opportunityinsight/metrics/opportunity/stakeholder_breadth.json` but uses `connection_field: "account_id"`.

```json
{
  "slug": "account_stakeholder_breadth",
  "object": "account",
  "definition": {
    "attribute_type": "FormulaMetric",
    "data_type": "double",
    "f": "a / 4.3",
    "params": {
      "a": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count_distinct",
        "count_distinct_field": "participants.email",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_30_days"],
        "filters": {
          "": {
            "$and": [
              {"external": {"$eq": true}},
              {"is_deleted": {"$eq": false}},
              {
                "participants": {
                  "$nested": [
                    {"participants.external": {"$eq": true}}
                  ]
                }
              }
            ]
          }
        }
      }
    }
  },
  "display_name": "Stakeholder Breadth",
  "description": "Unique external contacts engaged per week (30-day average) at the account level.",
  "coaching_text": "Below 1.0/week = thin relationship. 1.0-3.0 = healthy. Above 3.0 = broad multi-threaded engagement.",
  "active": true,
  "show": true,
  "source": "people_ai",
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["relationship_health", "icp_fit_profiling"],
    "best_fit_tables": ["Table 2: Relationship Health", "Table 1: ICP Fit Profiling"]
  }
}
```

**Step 2: Create account_meeting_acceleration.json**

7-day meeting rate vs 30-day meeting rate, normalized. Formula: `(a * 30) / (b * 7)` which simplifies to `4.286 * a / b`. Values > 1.0 = accelerating.

```json
{
  "slug": "account_meeting_acceleration",
  "object": "account",
  "definition": {
    "attribute_type": "FormulaMetric",
    "data_type": "double",
    "f": "4.286 * a / b",
    "params": {
      "a": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_7_days"],
        "filters": {
          "": {
            "$and": [
              {"activity_type": {"$eq": "meeting"}},
              {"external": {"$eq": true}},
              {"is_deleted": {"$eq": false}}
            ]
          }
        }
      },
      "b": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_30_days"],
        "filters": {
          "": {
            "$and": [
              {"activity_type": {"$eq": "meeting"}},
              {"external": {"$eq": true}},
              {"is_deleted": {"$eq": false}}
            ]
          }
        }
      }
    }
  },
  "display_name": "Meeting Acceleration",
  "description": "Ratio of 7-day to 30-day meeting frequency, normalized. Above 1.0 = meetings accelerating.",
  "coaching_text": "Above 1.5 = surge. 0.8-1.2 = steady. Below 0.5 = meeting cadence declining.",
  "active": true,
  "show": true,
  "source": "people_ai",
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["engagement_momentum"],
    "best_fit_tables": ["Table 3: Engagement Momentum"]
  }
}
```

**Step 3: Create account_email_acceleration.json**

Same pattern as meeting_acceleration but for inbound emails.

```json
{
  "slug": "account_email_acceleration",
  "object": "account",
  "definition": {
    "attribute_type": "FormulaMetric",
    "data_type": "double",
    "f": "4.286 * a / b",
    "params": {
      "a": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_7_days"],
        "filters": {
          "": {
            "$and": [
              {"activity_type": {"$eq": "email"}},
              {"external": {"$eq": true}},
              {"outbound": {"$eq": false}},
              {"is_deleted": {"$eq": false}}
            ]
          }
        }
      },
      "b": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_30_days"],
        "filters": {
          "": {
            "$and": [
              {"activity_type": {"$eq": "email"}},
              {"external": {"$eq": true}},
              {"outbound": {"$eq": false}},
              {"is_deleted": {"$eq": false}}
            ]
          }
        }
      }
    }
  },
  "display_name": "Email Acceleration",
  "description": "Ratio of 7-day to 30-day inbound email frequency, normalized. Above 1.0 = inbound email accelerating.",
  "coaching_text": "Above 1.5 = surge in inbound interest. 0.8-1.2 = steady. Below 0.5 = going quiet.",
  "active": true,
  "show": true,
  "source": "people_ai",
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["engagement_momentum"],
    "best_fit_tables": ["Table 3: Engagement Momentum"]
  }
}
```

**Step 4: Commit**

```bash
git add metrics/account/stakeholder_breadth.json metrics/account/meeting_acceleration.json metrics/account/email_acceleration.json
git commit -m "feat: add 3 new building-block FormulaMetrics (stakeholder breadth, meeting/email acceleration)"
```

---

## Task 4: New Custom Metrics — Activity-to-Revenue Ratio (1 metric)

**Files:**
- Create: `metrics/account/activity_revenue_ratio.json`

**Step 1: Create account_activity_revenue_ratio.json**

This metric compares engagement level to account size. Since FormulaMetric may not support `log()`, use a simpler approach: `a / b` where `a` = total activities (30d) and `b` = a revenue-tier proxy. Alternatively, use engagement_level directly as the numerator since it's already normalized 0-100.

Note: The FormulaMetric `f` field supports basic arithmetic only (`+`, `-`, `*`, `/`). A true log-normalized ratio would need to be computed outside the metric system. For the MVP, use total activities divided by a time-range count as a relative measure, and let the SalesAI signal layer handle the revenue-normalization logic.

Simpler approach — activity intensity as a standalone signal:

```json
{
  "slug": "account_activity_revenue_ratio",
  "object": "account",
  "definition": {
    "attribute_type": "FormulaMetric",
    "data_type": "double",
    "f": "a + b",
    "params": {
      "a": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_30_days"],
        "filters": {
          "": {
            "$and": [
              {"activity_type": {"$eq": "meeting"}},
              {"external": {"$eq": true}},
              {"is_deleted": {"$eq": false}}
            ]
          }
        }
      },
      "b": {
        "attribute_type": "TimeRangeMetric",
        "data_type": "integer",
        "entity": "activity",
        "agg": "count",
        "connection_field": "account_id",
        "timestamp_field": "timestamp",
        "time_ranges": ["last_30_days"],
        "filters": {
          "": {
            "$and": [
              {"activity_type": {"$eq": "email"}},
              {"external": {"$eq": true}},
              {"is_deleted": {"$eq": false}}
            ]
          }
        }
      }
    }
  },
  "display_name": "Activity Intensity",
  "description": "Total external meetings + emails in last 30 days. Used as a proxy for activity-to-revenue comparison — high activity on small accounts signals expansion potential. Revenue normalization done in SalesAI signal layer.",
  "coaching_text": "Compare against account revenue tier. High intensity on small accounts = expansion signal. Low intensity on large accounts = coverage gap.",
  "active": true,
  "show": true,
  "source": "people_ai",
  "_meta": {
    "tier": 1,
    "maps_to_insight": ["whitespace_expansion", "account_neglect"],
    "best_fit_tables": ["Table 4: Whitespace & Expansion", "Table 5: Account Neglect"]
  }
}
```

**Step 2: Commit**

```bash
git add metrics/account/activity_revenue_ratio.json
git commit -m "feat: add activity intensity metric for expansion/neglect detection"
```

---

## Task 5: EDB Table 1 — ICP Fit Profiling

**Files:**
- Create: `edb-tables/icp_fit_profiling.js`

**Step 1: Write the bookmarklet**

Follow the exact pattern from `/Users/scottmetcalf/projects/opportunityinsight/edb-tables/hidden_opportunity.js`. Key differences:
- `TABLE_NAME`: `'🎯 ICP Fit Profiling'`
- `OBJECT_TYPE`: `'account'`
- 13 columns (see design doc Table 1)
- Filters: all accounts (no restrictive filter — show everything, sorted by engagement level desc as proxy until ICP score is deployed)
- Sort: `ootb_account_engagement_level`, `_0`, `desc`
- Opens: `/reporting/account/{id}`

Columns array:

```javascript
const columns = [
  { slug: 'ootb_account', variation_id: null, agg: 'unique', display_name: 'Account' },
  { slug: 'ootb_account_original_owner', variation_id: null, agg: 'unique', display_name: 'Owner' },
  { slug: 'ootb_account_industry', variation_id: null, agg: 'unique', display_name: 'Industry' },
  { slug: 'ootb_account_annual_revenue', variation_id: null, agg: 'unique', display_name: 'Annual Revenue' },
  { slug: 'ootb_account_type', variation_id: '_0', agg: 'unique', display_name: 'Account Type' },
  { slug: 'ootb_account_engagement_level', variation_id: '_0', agg: 'avg', display_name: 'Engagement Level' },
  { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'People Engaged (30d)' },
  { slug: 'ootb_account_executive_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'Execs Engaged (30d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_30_days', agg: 'sum', display_name: 'Meetings (30d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Received (30d)' },
  { slug: 'ootb_account_count_of_emails_sent', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Sent (30d)' },
  { slug: 'ootb_account_executive_activities', variation_id: '_last_30_days', agg: 'sum', display_name: 'Exec Activities (30d)' },
  { slug: 'ootb_account_closed_won_opportunities', variation_id: '_last_fyear', agg: 'sum', display_name: 'Closed Won (Last FY)' }
];
```

Filters: minimal — just require engagement > 0 to exclude empty accounts:

```javascript
const filters = {
  operator: 'AND',
  conditions: [
    {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      operator: 'gt',
      value: 0
    }
  ]
};
```

Use the full IIFE + fetch + window.open pattern from hidden_opportunity.js.

**Step 2: Commit**

```bash
git add edb-tables/icp_fit_profiling.js
git commit -m "feat: add EDB Table 1 — ICP Fit Profiling bookmarklet"
```

---

## Task 6: EDB Table 2 — Relationship Health

**Files:**
- Create: `edb-tables/relationship_health.js`

**Step 1: Write the bookmarklet**

- `TABLE_NAME`: `'🤝 Relationship Health'`
- `OBJECT_TYPE`: `'account'`
- 13 columns (see design doc Table 2)
- Filters: accounts with open opportunities > 0 OR engagement > 0 (active accounts)
- Sort: `ootb_account_engagement_level`, `_0`, `asc` (worst relationship health first)

Columns:

```javascript
const columns = [
  { slug: 'ootb_account', variation_id: null, agg: 'unique', display_name: 'Account' },
  { slug: 'ootb_account_original_owner', variation_id: null, agg: 'unique', display_name: 'Owner' },
  { slug: 'ootb_account_type', variation_id: '_0', agg: 'unique', display_name: 'Account Type' },
  { slug: 'ootb_account_engagement_level', variation_id: '_0', agg: 'avg', display_name: 'Engagement Level' },
  { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'People Engaged (30d)' },
  { slug: 'ootb_account_executive_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'Execs Engaged (30d)' },
  { slug: 'ootb_account_executive_activities', variation_id: '_last_30_days', agg: 'sum', display_name: 'Exec Activities (30d)' },
  { slug: 'ootb_account_count_of_emails_sent', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Sent (30d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Received (30d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_7_days', agg: 'sum', display_name: 'Meetings (7d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_30_days', agg: 'sum', display_name: 'Meetings (30d)' },
  { slug: 'ootb_account_open_opportunities', variation_id: '_any_time', agg: 'sum', display_name: 'Open Opps' },
  { slug: 'ootb_account_annual_revenue', variation_id: null, agg: 'unique', display_name: 'Annual Revenue' }
];
```

Filters:

```javascript
const filters = {
  operator: 'AND',
  conditions: [
    {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      operator: 'gt',
      value: 0
    }
  ]
};
```

**Step 2: Commit**

```bash
git add edb-tables/relationship_health.js
git commit -m "feat: add EDB Table 2 — Relationship Health bookmarklet"
```

---

## Task 7: EDB Table 3 — Engagement Momentum

**Files:**
- Create: `edb-tables/engagement_momentum.js`

**Step 1: Write the bookmarklet**

- `TABLE_NAME`: `'📈 Engagement Momentum'`
- `OBJECT_TYPE`: `'account'`
- 12 columns
- Filters: engagement level > 0
- Sort: `ootb_account_engagement_level`, `_0`, `desc`

Columns:

```javascript
const columns = [
  { slug: 'ootb_account', variation_id: null, agg: 'unique', display_name: 'Account' },
  { slug: 'ootb_account_original_owner', variation_id: null, agg: 'unique', display_name: 'Owner' },
  { slug: 'ootb_account_type', variation_id: '_0', agg: 'unique', display_name: 'Account Type' },
  { slug: 'ootb_account_engagement_level', variation_id: '_0', agg: 'avg', display_name: 'Engagement Level' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_7_days', agg: 'sum', display_name: 'Meetings (7d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_30_days', agg: 'sum', display_name: 'Meetings (30d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_7_days', agg: 'sum', display_name: 'Emails Received (7d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Received (30d)' },
  { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'People Engaged (30d)' },
  { slug: 'ootb_account_executive_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'Execs Engaged (30d)' },
  { slug: 'ootb_account_count_of_emails_sent', variation_id: '_last_7_days', agg: 'sum', display_name: 'Emails Sent (7d)' },
  { slug: 'ootb_account_count_of_emails_sent', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Sent (30d)' }
];
```

**Step 2: Commit**

```bash
git add edb-tables/engagement_momentum.js
git commit -m "feat: add EDB Table 3 — Engagement Momentum bookmarklet"
```

---

## Task 8: EDB Table 4 — Whitespace & Expansion

**Files:**
- Create: `edb-tables/whitespace_expansion.js`

**Step 1: Write the bookmarklet**

- `TABLE_NAME`: `'💎 Whitespace & Expansion'`
- `OBJECT_TYPE`: `'account'`
- 13 columns
- Filters: engagement level >= 50 (active accounts with meaningful engagement)
- Sort: `ootb_account_engagement_level`, `_0`, `desc`

Columns:

```javascript
const columns = [
  { slug: 'ootb_account', variation_id: null, agg: 'unique', display_name: 'Account' },
  { slug: 'ootb_account_original_owner', variation_id: null, agg: 'unique', display_name: 'Owner' },
  { slug: 'ootb_account_annual_revenue', variation_id: null, agg: 'unique', display_name: 'Annual Revenue' },
  { slug: 'ootb_account_type', variation_id: '_0', agg: 'unique', display_name: 'Account Type' },
  { slug: 'ootb_account_open_opportunities', variation_id: '_any_time', agg: 'sum', display_name: 'Open Opps' },
  { slug: 'ootb_account_closed_won_opportunities', variation_id: '_last_fyear', agg: 'sum', display_name: 'Closed Won (Last FY)' },
  { slug: 'ootb_account_engagement_level', variation_id: '_0', agg: 'avg', display_name: 'Engagement Level' },
  { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'People Engaged (30d)' },
  { slug: 'ootb_account_executive_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'Execs Engaged (30d)' },
  { slug: 'ootb_account_executive_activities', variation_id: '_last_30_days', agg: 'sum', display_name: 'Exec Activities (30d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_30_days', agg: 'sum', display_name: 'Meetings (30d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Received (30d)' },
  { slug: 'ootb_account_count_of_emails_sent', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Sent (30d)' }
];
```

Filters:

```javascript
const filters = {
  operator: 'AND',
  conditions: [
    {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      operator: 'gte',
      value: 50
    }
  ]
};
```

**Step 2: Commit**

```bash
git add edb-tables/whitespace_expansion.js
git commit -m "feat: add EDB Table 4 — Whitespace & Expansion bookmarklet"
```

---

## Task 9: EDB Table 5 — Account Neglect

**Files:**
- Create: `edb-tables/account_neglect.js`

**Step 1: Write the bookmarklet**

- `TABLE_NAME`: `'🚨 Account Neglect'`
- `OBJECT_TYPE`: `'account'`
- 12 columns
- Filters: engagement level < 30 AND meetings (30d) <= 1
- Sort: `ootb_account_annual_revenue`, `null`, `desc` (biggest neglected accounts first)

Columns:

```javascript
const columns = [
  { slug: 'ootb_account', variation_id: null, agg: 'unique', display_name: 'Account' },
  { slug: 'ootb_account_original_owner', variation_id: null, agg: 'unique', display_name: 'Owner' },
  { slug: 'ootb_account_type', variation_id: '_0', agg: 'unique', display_name: 'Account Type' },
  { slug: 'ootb_account_annual_revenue', variation_id: null, agg: 'unique', display_name: 'Annual Revenue' },
  { slug: 'ootb_account_open_opportunities', variation_id: '_any_time', agg: 'sum', display_name: 'Open Opps' },
  { slug: 'ootb_account_engagement_level', variation_id: '_0', agg: 'avg', display_name: 'Engagement Level' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_7_days', agg: 'sum', display_name: 'Meetings (7d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_30_days', agg: 'sum', display_name: 'Meetings (30d)' },
  { slug: 'ootb_account_count_of_emails_sent', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Sent (30d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Received (30d)' },
  { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'People Engaged (30d)' },
  { slug: 'ootb_account_closed_won_opportunities', variation_id: '_last_fyear', agg: 'sum', display_name: 'Closed Won (Last FY)' }
];
```

Filters:

```javascript
const filters = {
  operator: 'AND',
  conditions: [
    {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      operator: 'lt',
      value: 30
    },
    {
      slug: 'ootb_account_count_of_meetings_standard',
      variation_id: '_last_30_days',
      operator: 'lte',
      value: 1
    }
  ]
};
```

**Step 2: Commit**

```bash
git add edb-tables/account_neglect.js
git commit -m "feat: add EDB Table 5 — Account Neglect bookmarklet"
```

---

## Task 10: EDB Table 6 — Account Intelligence Summary

**Files:**
- Create: `edb-tables/account_intelligence_summary.js`

**Step 1: Write the bookmarklet**

- `TABLE_NAME`: `'🧠 Account Intelligence Summary'`
- `OBJECT_TYPE`: `'account'`
- 10 columns — the master view with all key metrics side by side
- Filters: engagement > 0
- Sort: `ootb_account_engagement_level`, `_0`, `desc`

This table gives reps the at-a-glance view. Composite scores won't appear until the scoring metrics are deployed via Admin API, but the OOTB columns provide immediate value.

Columns:

```javascript
const columns = [
  { slug: 'ootb_account', variation_id: null, agg: 'unique', display_name: 'Account' },
  { slug: 'ootb_account_original_owner', variation_id: null, agg: 'unique', display_name: 'Owner' },
  { slug: 'ootb_account_type', variation_id: '_0', agg: 'unique', display_name: 'Account Type' },
  { slug: 'ootb_account_annual_revenue', variation_id: null, agg: 'unique', display_name: 'Annual Revenue' },
  { slug: 'ootb_account_engagement_level', variation_id: '_0', agg: 'avg', display_name: 'Engagement Level' },
  { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'People Engaged (30d)' },
  { slug: 'ootb_account_executive_engaged', variation_id: '_last_30_days', agg: 'sum', display_name: 'Execs Engaged (30d)' },
  { slug: 'ootb_account_count_of_meetings_standard', variation_id: '_last_30_days', agg: 'sum', display_name: 'Meetings (30d)' },
  { slug: 'ootb_account_count_of_emails_received', variation_id: '_last_30_days', agg: 'sum', display_name: 'Emails Received (30d)' },
  { slug: 'ootb_account_open_opportunities', variation_id: '_any_time', agg: 'sum', display_name: 'Open Opps' }
];
```

**Step 2: Commit**

```bash
git add edb-tables/account_intelligence_summary.js
git commit -m "feat: add EDB Table 6 — Account Intelligence Summary bookmarklet"
```

---

## Task 11: EDB Dashboard

**Files:**
- Create: `dashboards/account_insights_board.js`

**Step 1: Write the dashboard board creator**

Follow the exact pattern from `/Users/scottmetcalf/projects/opportunityinsight/dashboards/opportunity_insights_board.js`. Adapt for account-level metrics.

- `BOARD_NAME`: `'Account Insights'`
- 15 widgets across 6 sections (per design doc Section 3)
- Common filters: engagement > 0 for account scope
- Global filter: team picker with `account: 'ootb_account_original_owner'`
- Widget definitions follow the same structure: `{ id, type, title, metric, group_by, filters, colors, reference_line }`

Key widgets:
1. KPI: Total Accounts (unique count of `ootb_account`)
2. KPI: Avg Engagement Score (`ootb_account_engagement_level`, avg)
3. KPI: Avg People Engaged (`ootb_account_people_engaged`, avg, 30d)
4. KPI: Accounts Heating Up (count where engagement > 70 — proxy until momentum metric deployed)
5. Bar: Engagement Distribution by bucket
6. Scatter: Engagement vs People Engaged (ICP proxy)
7. Bar: Relationship Health by Owner (avg engagement per owner)
8. Stacked Bar: Exec Coverage by Account Tier
9. Bar: Meeting Trend (7d vs 30d comparison)
10. Table: Top 10 Most Engaged Accounts
11. Table: Whitespace — High engagement customers
12. Table: Neglected — Low engagement high-value accounts
13. Bar: Neglect by Owner
14. Pie: Account Type Distribution
15. Note: About This Dashboard

Include `window.__accountInsightsBoard` export and console log summary.

**Step 2: Commit**

```bash
git add dashboards/account_insights_board.js
git commit -m "feat: add Account Insights EDB dashboard (15 widgets, 6 sections)"
```

---

## Task 12: Unified SalesAI Signal — Account Intelligence

**Files:**
- Create: `signals/unified/account_intelligence.md`

**Step 1: Write the unified signal**

Follow the pattern from `/Users/scottmetcalf/projects/opportunityinsight/signals/unified/opportunity_intelligence.md`. Adapt for 5 account-level categories.

Structure:
- Signal Configuration header (name, applies to, update frequency)
- System Prompt: "You are an AI sales analyst for People.ai. Analyze the following account metrics..."
- Analysis Framework: 5 categories with specific detection criteria and thresholds
- Priority Hierarchy: Neglect > Momentum (cooling) > Relationship Health > Whitespace > ICP Fit > Momentum (heating) > Healthy
- Scoring: 0.0-1.0 per category with specific thresholds for each
- Output Format: emoji + category + confidence + metric bullets + action
- OOTB Metrics Available: list all account-level metrics

Detection criteria per category:

**ACCOUNT NEGLECT (Score > 0.70):**
- Meetings (30d) = 0
- Emails received (30d) = 0
- Engagement level < 20
- Account type = Customer or has open pipeline

**ENGAGEMENT MOMENTUM - COOLING (Score < 0.50):**
- Meeting count 7d/30d ratio < 0.5 (normalized)
- Email received 7d/30d ratio < 0.5
- Engagement level declining
- People engaged dropping

**RELATIONSHIP HEALTH - POOR (Score < 0.40):**
- People engaged < 3
- Execs engaged = 0
- Email responsiveness < 0.2 (one-way communication)
- Meetings concentrated with single contact

**WHITESPACE & EXPANSION (Score > 0.65):**
- Engagement level > 60 on customer account
- New people engaged appearing
- Exec activities high relative to deal size
- Activity intensity high relative to revenue

**ICP FIT (Score > 0.70):**
- Engagement level > 60
- Exec coverage > 25%
- Email responsiveness > 0.4
- Stakeholder breadth > 1.5/week
- Meeting frequency > 4/month

**Step 2: Commit**

```bash
git add signals/unified/account_intelligence.md
git commit -m "feat: add unified Account Intelligence SalesAI signal"
```

---

## Task 13: Individual SalesAI Signals (5 signals)

**Files:**
- Create: `signals/individual/icp_fit.md`
- Create: `signals/individual/relationship_health.md`
- Create: `signals/individual/engagement_momentum.md`
- Create: `signals/individual/whitespace_expansion.md`
- Create: `signals/individual/account_neglect.md`

**Step 1: Write icp_fit.md**

Follow pattern from stall_risk.md. Structure:
- Configuration: Signal Name "ICP Fit Profile", Icon target, Applies To: All accounts with engagement > 0
- System Prompt: "You are an AI sales analyst specializing in ideal customer profiling..."
- What to Detect: behavioral patterns matching best customers
- Scoring: 0.0-1.0, fires when > 0.70
- OOTB Metrics: engagement_level, people_engaged, executive_engaged, meetings, emails, exec_activities, email_responsiveness, exec_coverage
- Output format: target ICP FIT - {confidence} + metric bullets + recommended approach

**Step 2: Write relationship_health.md**

- Configuration: "Relationship Health", Icon handshake, Applies To: Accounts with open pipeline or type=Customer
- What to Detect: single-threading, exec gaps, one-sided communication, thin stakeholder coverage
- Scoring: fires when < 0.40 (inverse — low score = poor health)
- Metrics: people_engaged, executive_engaged, email responsiveness, meetings, exec_activities
- Output: handshake RELATIONSHIP GAP + bullets + action

**Step 3: Write engagement_momentum.md**

- Configuration: "Engagement Momentum", Icon chart up/chart down, Applies To: All accounts with engagement > 0
- What to Detect: Surges (7d vs 30d ratios > 1.5) or declines (< 0.5)
- Scoring: > 1.5 fires as surge, < 0.5 fires as decline
- Metrics: meetings (7d, 30d), emails received (7d, 30d), people_engaged, executive_engaged, engagement_level
- Output: chart up SURGING or chart down DECLINING + bullets + action

**Step 4: Write whitespace_expansion.md**

- Configuration: "Whitespace & Expansion", Icon gem, Applies To: Customer accounts with engagement >= 50
- What to Detect: high activity relative to footprint, new stakeholders, exec over-investment on existing accounts
- Scoring: fires when > 0.65
- Metrics: engagement_level, people_engaged, new_people_engaged, executive_activities, meetings, annual_revenue, open_opportunities
- Output: gem EXPANSION OPPORTUNITY + bullets + potential value + action

**Step 5: Write account_neglect.md**

- Configuration: "Account Neglect", Icon alert, Applies To: Customer accounts or accounts with open pipeline
- What to Detect: zero meetings, zero emails, no upcoming activity, high-value accounts going dark
- Scoring: fires when > 0.70
- Metrics: meetings (7d, 30d), emails_sent (30d), emails_received (30d), engagement_level, annual_revenue, open_opportunities
- Output: alert ACCOUNT NEGLECT + bullets + action (re-engage within 48 hours)

**Step 6: Commit**

```bash
git add signals/individual/
git commit -m "feat: add 5 individual SalesAI signals (ICP fit, relationship, momentum, whitespace, neglect)"
```

---

## Task 14: Slack Bot Prompt Templates

**Files:**
- Create: `prompts/neglected_account_analysis.md`
- Create: `prompts/surging_account_analysis.md`
- Create: `prompts/expansion_account_analysis.md`

**Step 1: Write neglected_account_analysis.md**

Follow pattern from `/Users/scottmetcalf/projects/opportunityinsight/prompts/zombie_opportunity_analysis.md`. Adapt:
- Context: You are analyzing accounts that have gone silent
- Input: Account name, owner, type, annual revenue, engagement level, meetings (7d, 30d), emails (30d), people engaged, open opps
- Analysis: Why is this account being neglected? What's at risk? What should the owner do?
- Output: Slack block kit format with account name, risk level, key metrics, recommended action

**Step 2: Write surging_account_analysis.md**

Follow pattern from ghost_opportunity_analysis.md. Adapt:
- Context: Accounts with rapidly increasing engagement
- Input: Account metrics showing acceleration
- Analysis: What's driving the surge? Is there a deal forming? Should we capitalize?
- Output: Slack block kit with surge indicators and next steps

**Step 3: Write expansion_account_analysis.md**

- Context: Customer accounts with high activity relative to current footprint
- Input: Account metrics + open opps + closed won history
- Analysis: Where is the expansion potential? What products/services could apply?
- Output: Slack block kit with expansion signals and recommended approach

**Step 4: Commit**

```bash
git add prompts/
git commit -m "feat: add 3 Slack bot prompt templates (neglected, surging, expansion)"
```

---

## Task 15: Sales Enablement — Sales Leader Persona

**Files:**
- Create: `docs/sales-enablement/sales-leader/README.md`
- Create: `docs/sales-enablement/sales-leader/talk-track.md`
- Create: `docs/sales-enablement/sales-leader/one-pager.md`
- Create: `docs/sales-enablement/sales-leader/discovery-questions.md`
- Create: `docs/sales-enablement/sales-leader/objection-handling.md`
- Create: `docs/sales-enablement/sales-leader/demo-script.md`

**Step 1: Write all 6 files**

Model on the Opportunity Insights sales-leader docs at `/Users/scottmetcalf/projects/opportunityinsight/docs/sales-enablement/sales-leader/`. Adapt all messaging for Account Insights:

- **Audience:** VPs of Sales, CROs, Sales Managers, Regional Directors
- **Key messaging:** Account prioritization, relationship visibility, expansion detection, coverage gap identification
- **Value props:** ICP-based account scoring, relationship health monitoring, momentum detection, whitespace discovery, neglect alerting
- **Use cases:** "Which accounts should my team focus on?", "Where are we under-invested?", "Which customer accounts are at risk of going dark?"
- **ROI:** Reference the design doc ROI summary

Each file should follow the structure and tone of its OI equivalent but with Account Insights content.

**Step 2: Commit**

```bash
git add docs/sales-enablement/sales-leader/
git commit -m "feat: add sales enablement docs — Sales Leader persona (6 files)"
```

---

## Task 16: Sales Enablement — RevOps Persona

**Files:**
- Create: `docs/sales-enablement/revops/README.md`
- Create: `docs/sales-enablement/revops/talk-track.md`
- Create: `docs/sales-enablement/revops/one-pager.md`
- Create: `docs/sales-enablement/revops/discovery-questions.md`
- Create: `docs/sales-enablement/revops/objection-handling.md`
- Create: `docs/sales-enablement/revops/demo-script.md`

**Step 1: Write all 6 files**

Model on OI revops docs. Adapt messaging:

- **Audience:** Revenue Operations, Sales Operations, CRM administrators
- **Key messaging:** Account hygiene at scale, scoring transparency, OOTB metrics (no custom fields), coverage gap reporting
- **Value props:** No implementation burden, composite scoring from existing data, automated neglect detection, rep accountability
- **Technical focus:** How the metrics work, what OOTB data powers the scores, deployment via bookmarklets

**Step 2: Commit**

```bash
git add docs/sales-enablement/revops/
git commit -m "feat: add sales enablement docs — RevOps persona (6 files)"
```

---

## Task 17: Confluence Launch Hub Pages

**Files:** None (Confluence API calls)

**Step 1: Create parent page "Account Insights - Launch Hub"**

Use the Confluence API to create a page under the AI Play Launches Hub (parent page ID: 59360870403) in the CS space. Mirror the structure and content of the Opportunity Insights Launch Hub (page 59360542722) but adapted for Account Insights:

- Status, Launch Owner, Target Launch Date, Launch Type
- Quick Links table
- "What is Account Insights?" section with 5 insight types
- Value Proposition with one-line pitch and ROI summary
- 30-Day Sprint Timeline
- Success Criteria
- Use Case Scenarios (one per category)
- Asset Creation Checklist
- Metrics Dashboard tracking tables
- Customer Validation section
- Sprint Risks & Mitigations
- Launch Team
- Communication Plan

**Step 2: Create child pages**

Create these child pages under the Launch Hub:
1. OOTB Metrics to Account Insights
2. Account Insights - EDB Table Designs
3. Account Insights - EDB Dashboard Spec
4. SalesAI Signals for Account Insights
5. Account Insights - Custom Metrics Recommendations
6. Account Insights - Slack Bot Demo (/ai)
7. Claude AI Project - How the Dashboard Works
8. Sales Enablement - Sales Leader Persona
9. Sales Enablement - RevOps Persona

Each page should mirror the structure of its OI equivalent, adapted for Account Insights content.

**Step 3: Update CLAUDE.md**

Add the Confluence page IDs and links to the Confluence Documentation section of CLAUDE.md.

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with Confluence page links"
```

---

## Summary

| Task | What | Files | Commit |
|------|------|-------|--------|
| 1 | Project scaffold + CLAUDE.md | 3 files + dirs | Initial scaffold |
| 2 | Carry over 3 existing metrics | 3 JSON | Existing metrics |
| 3 | 3 new building-block metrics | 3 JSON | New metrics |
| 4 | Activity intensity metric | 1 JSON | Expansion metric |
| 5 | EDB Table 1: ICP Fit | 1 JS | Table bookmarklet |
| 6 | EDB Table 2: Relationship Health | 1 JS | Table bookmarklet |
| 7 | EDB Table 3: Engagement Momentum | 1 JS | Table bookmarklet |
| 8 | EDB Table 4: Whitespace & Expansion | 1 JS | Table bookmarklet |
| 9 | EDB Table 5: Account Neglect | 1 JS | Table bookmarklet |
| 10 | EDB Table 6: Intelligence Summary | 1 JS | Table bookmarklet |
| 11 | EDB Dashboard | 1 JS | Dashboard |
| 12 | Unified SalesAI Signal | 1 MD | Signal |
| 13 | 5 Individual SalesAI Signals | 5 MD | Signals |
| 14 | 3 Slack Bot Prompt Templates | 3 MD | Prompts |
| 15 | Sales Enablement: Sales Leader | 6 MD | Docs |
| 16 | Sales Enablement: RevOps | 6 MD | Docs |
| 17 | Confluence Launch Hub Pages | API + CLAUDE.md | Docs |

**Total: 17 tasks, ~36 files, 17 commits**
