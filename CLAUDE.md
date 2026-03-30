# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Account Insights** is an AI-powered intelligence engine that analyzes account-level activity data to surface critical patterns across 5 insight categories — ICP Fit, Relationship Health, Engagement Momentum, Whitespace & Expansion, and Account Neglect — enabling proactive account management before problems become visible in CRM.

This is a People.ai AI Play launched as a 30-day sprint. It uses only People.ai OOTB (out-of-the-box) metrics for the base product — no custom fields, no org-specific fields, no SalesAI dependency.

## Architecture

| Layer | Tool | Role |
|-------|------|------|
| Data | **People.ai Insights API** | CSV exports of OOTB metrics (engagement, activity, exec access, relationship data) |
| Tables | **EDB (Explore Data Builder)** | 7 pre-filtered tables via Glass API bookmarklets (5 category + 1 summary + 1 buying committee) |
| Metrics | **Custom FormulaMetrics** | 14 computed signals (7 base + 5 composite scores + 2 buying committee) |
| Intelligence | **SalesAI Signals** | LLM-powered analysis using Claude + OOTB metric context |
| Dashboard | **EDB Board Creator** | 15-widget HTML bookmarklet dashboard |
| Orchestration | **n8n** | Slack bot workflow (`/account-insights` slash command) |
| Reasoning | **Claude (Anthropic API)** | AI analysis of accounts via Claude Sonnet 4.5 + People.ai MCP |
| Delivery | **Slack** | `/account-insights` command, channel posts, email digests |

There is no custom backend code. EDB tables/dashboards deploy via bookmarklets. The Slack bot runs as an n8n workflow. This is an enhanced architecture that adds a composite scoring layer on top of the Opportunity Insights foundation (EDB tables + metrics + signals + dashboard + Slack bot).

## The 5 Insight Types

| Type | Icon | Object | Signal |
|------|------|--------|--------|
| ICP Fit Profiling | 🎯 | Account | Engagement patterns matching best-customer behavioral profile |
| Relationship Health | 🤝 | Account | Multi-threading depth, exec coverage, email responsiveness |
| Engagement Momentum | 📈 | Account | 7d vs 30d activity acceleration/deceleration |
| Whitespace & Expansion | 💎 | Account | High engagement + small footprint, new stakeholders, activity-to-revenue disparity |
| Account Neglect | 🚨 | Account | Zero recent meetings/emails, declining engagement, high-value accounts going dark |

**Key design choice:** All 5 tables operate at the Account level. Unlike Opportunity Insights (which has 3 opportunity + 1 account table), Account Insights is entirely account-scoped. The enhanced architecture adds a composite scoring layer — weighted FormulaMetrics that combine multiple signals into per-category grades.

## Repository Structure

- `edb-tables/` — JavaScript bookmarklet scripts for 7 EDB tables
  - `icp_fit_profiling.js` — Table 1: ICP Fit Profiling (account)
  - `relationship_health.js` — Table 2: Relationship Health (account)
  - `engagement_momentum.js` — Table 3: Engagement Momentum (account)
  - `whitespace_expansion.js` — Table 4: Whitespace & Expansion (account)
  - `account_neglect.js` — Table 5: Account Neglect (account)
  - `account_intelligence_summary.js` — Table 6: Account Intelligence Summary (composite view)
  - `buying_committee_coverage.js` — Table 7: Buying Committee Coverage (Wave 2)
- `metrics/` — Custom metric JSON definitions
  - `account/` — 14 FormulaMetrics total:
    - 7 base metrics (email_responsiveness, executive_coverage, engagement_momentum, stakeholder_breadth, meeting_acceleration, email_acceleration, activity_revenue_ratio)
    - 5 composite scores (icp_fit_score, relationship_health_score, engagement_momentum_score, whitespace_expansion_score, account_neglect_score)
    - 2 buying committee metrics (committee_coverage_ratio, contact_velocity) — Wave 2
- `signals/` — SalesAI Signal configurations
  - `unified/` — Single "Account Intelligence" signal (recommended)
  - `individual/` — 6 signals (5 category + 1 buying committee)
  - `compound/` — 4 cross-category compound signals (Wave 2)
- `dashboards/` — EDB dashboard HTML board creator
- `prompts/` — Claude prompt templates for AI analysis (neglected, surging, expansion)
- `n8n/workflows/` — n8n workflow JSON for the /account-insights Slack bot
  - `account_insights_v1.json` — 37-node workflow, 3 parallel branches
- `docs/` — Setup guides, design specs, implementation plans
  - `plans/` — Design doc, implementation plan, Wave 2 design
  - `sales-enablement/` — Sales-facing documentation
    - `sales-leader/` — Materials for sales leaders
    - `revops/` — Materials for RevOps teams
- `assets/` — HTML deployment guide site
  - `index.html` — CSM Deployment Guide (main page with bookmarklets + board generator)
  - `preflight-checklist.html` — Interactive pre-flight checklist (4 phases)
  - `custom-metrics.html` — Custom metrics reference (12 base + 5 composite)
  - `signals-guide.html` — SalesAI signals deployment guide

## Key Design Decisions

- **OOTB metrics only**: All metric slugs use the `ootb_` prefix and are core platform metrics. No SalesAI dependency for base product. This ensures universal deployability at any People.ai customer.
- **Excluded metric types**: SalesAI metrics (`next_steps`, `risks`, `key_topics`), percentage metrics (non-standard variation_id format), and custom/org-specific metrics are excluded from base tables.
- **5+1 EDB tables**: 5 category-specific tables (one per insight type) + 1 summary table that provides a composite view across all categories.
- **Composite scoring layer**: Weighted FormulaMetrics combine multiple signals into per-category grades, enabling at-a-glance account health assessment.
- **Account-level only**: Unlike Opportunity Insights (3 opportunity + 1 account table), all tables here operate at the Account level.
- **Bookmarklet delivery**: Tables and dashboards deploy via draggable bookmarklets that call the Glass API. No admin access needed. Users drag to bookmarks bar, navigate to app.people.ai, and click.
- **Custom metrics compute ratios, not thresholds**: Thresholds vary by customer. Metrics compute the ratio/rate and expose thresholds via `coaching_text` as guidance.

## Working with EDB Tables

The bookmarklet scripts in `edb-tables/` create EDB tables via the People.ai Glass API (`/glass/api/v2/object_explore/create`). Each script:

1. Defines columns with metric slugs, variation IDs, and aggregation types
2. Sets object-level filters (e.g., account-level engagement and activity filters)
3. POSTs to the Glass API to create the table
4. Opens the new table at `/reporting/account/{id}` in a new tab

All metric slugs are validated against PeopleaiMetricLibrary.csv. The account object type is used for all tables.

## Working with Custom Metrics

JSON definitions in `metrics/` follow the People.ai metric schema:
- **FormulaMetric**: Computes ratios/percentages from underlying TimeRangeMetrics
- **TimeRangeMetric**: Counts/sums with time-windowed variations

14 total metrics: 7 base, 5 composite scores, 2 buying committee (Wave 2). Deploy via the People.ai Admin API or manual import.

## Working with SalesAI Signals

Signal configurations in `signals/` define the prompt, metrics context, and output format for LLM-powered analysis. Two deployment options:
- **Unified (recommended)**: One signal per account, intelligent prioritization across all 5 categories
- **Individual**: 5 separate signals (one per insight category), more flexibility but higher signal volume

Note: Account Insights has 5 insight categories (not 4 like Opportunity Insights), plus Wave 2 adds Buying Committee Coverage and 4 Cross-Category Compound Signals.

## Slack Bot (/account-insights)

The n8n workflow in `n8n/workflows/` implements the `/account-insights` Slack slash command:
1. Immediate ⏳ acknowledgment (Slack requires response within 3 seconds)
2. Authenticates with People.ai Insights API
3. Runs 3 parallel analysis branches (Neglected Accounts, Surging Accounts, Expansion Candidates)
4. Posts formatted digest to Slack channel
5. Emails HTML version to the requesting user

**Runtime:** 2-4 minutes. Uses Claude Sonnet 4.5 + People.ai MCP for AI analysis.

## Confluence Documentation

All design specs live in Confluence under the CS space (spaceId: 14057473):

| Page | ID | URL |
|------|----|-----|
| Account Insights - Launch Hub (parent) | 59406680089 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406680089) |
| OOTB Metrics to Account Insights | 59406614550 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406614550) |
| EDB Table Designs | 59406549076 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406549076) |
| EDB Dashboard Spec | 59406549097 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406549097) |
| SalesAI Signals for Account Insights | 59406549116 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406549116) |
| Custom Metrics Recommendations | 59406549135 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406549135) |
| Slack Bot Demo (/account-insights) | 59406680118 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406680118) |
| How the Account Insights Dashboard Works | 59406581797 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406581797) |
| Sales Enablement — Sales Leader Persona | 59406188590 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406188590) |
| Sales Enablement — RevOps Persona | 59406352424 | [Link](https://peopleai.atlassian.net/wiki/spaces/CS/pages/59406352424) |

## Required Credentials

| Credential | Purpose |
|------------|---------|
| People.ai API (client_id + client_secret) | Insights API authentication (OAuth client credentials) |
| Anthropic API key | Claude Sonnet 4.5 for AI analysis |
| Slack Bot Token (xoxb-...) | Slack API calls, slash command responses |
| People.ai MCP Multi-Header Auth | MCP endpoint for live CRM analysis |
| SMTP (people.ai) | Email digest delivery |
