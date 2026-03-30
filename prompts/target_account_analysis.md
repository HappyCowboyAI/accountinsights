# Target Account Analysis — Slack Bot Prompt

**Branch:** 4 (new addition to `/ai` Slack bot)
**Purpose:** Surface unengaged accounts that match the firmographic ICP profile
**Trigger:** Runs as part of the standard `/ai` digest, after the 3 existing branches

---

## Context

This prompt is used by the n8n Slack bot to identify and rank unengaged accounts
that match the firmographic profile of closed-won accounts. Unlike the other 3
branches (neglected, surging, expansion), this branch operates on accounts with
ZERO or near-zero engagement.

## Input Data

The n8n workflow provides:
- Account list filtered to: engagement < 10, annual_revenue > 0
- For each account: name, owner, industry, annual_revenue, account_type, domain,
  engagement_level, meetings_30d, emails_30d, open_opps, closed_won_fy, closed_lost_fy

## Prompt

```
You are a targeting analyst identifying high-priority accounts that should be pursued
but currently have zero or minimal engagement.

ACCOUNT DATA (low/zero engagement accounts):
{account_data}

YOUR TASK:
1. Score each account on firmographic ICP fit:
   - Industry alignment (Technology, Financial Services, Healthcare, Manufacturing = strong)
   - Revenue range ($50M-$500M = sweet spot, $500M-$2B = enterprise tier)
   - Account type (Prospect with no prior history = greenfield)
   - Prior history (closed-lost >6 months ago = worth revisiting)

2. Rank the top 5 accounts by targeting priority

3. For each top account, provide:
   - WHY it matches the ICP (firmographic reasons)
   - Recommended outreach approach (who to target, what angle)
   - Any red flags (recent closed-lost, do-not-contact indicators)

OUTPUT FORMAT:

🚀 **TOP 5 TARGET ACCOUNTS** — High-ICP accounts with zero engagement

**1. {Account Name}** — {Industry} | ${Annual Revenue}
   ICP Match: {Strong/Moderate} — {why}
   Status: {Greenfield / Revisit (lost Xmo ago) / Dormant}
   Approach: {Specific recommendation}

**2. {Account Name}** — {Industry} | ${Annual Revenue}
   ICP Match: {Strong/Moderate} — {why}
   Status: {status}
   Approach: {recommendation}

... (repeat for top 5)

📊 *{N} total unengaged accounts match ICP profile | Estimated untapped pipeline: ${X}M*
```

## How This Adds to the `/ai` Digest

The standard `/ai` Slack digest currently has 3 sections:
1. 🚨 Neglected Accounts (high-value accounts going dark)
2. 📈 Surging Accounts (accounts showing acceleration)
3. 💎 Expansion Candidates (customers ready for more)

This adds:
4. 🚀 Target Accounts (unengaged accounts matching ICP)

The full digest covers the complete account lifecycle:
- **Target** → accounts to pursue (new)
- **Surging** → accounts showing buying signals
- **Expansion** → customers ready for more
- **Neglected** → accounts slipping away
