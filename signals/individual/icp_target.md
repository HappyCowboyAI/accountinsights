# Signal: ICP Target Account (Firmographic Match, Zero Engagement)

## Configuration

- **Signal Name:** ICP Target Account
- **Icon:** 🚀
- **Priority:** Medium (proactive — not a risk signal, an opportunity signal)
- **Applies To:** Accounts with engagement < 10 AND matching firmographic fingerprint
- **Prerequisite:** Run `/ai calibrate` first to generate the firmographic fingerprint

## What This Signal Does

This is the ONLY signal in Account Insights that works on **unengaged accounts**. All other signals require activity data. This one uses firmographic profile matching + external signals to answer: "Which accounts in our CRM should we pursue but aren't?"

It fires when an account:
1. Has zero or near-zero engagement (nobody's working it)
2. Matches the firmographic profile of closed-won accounts (industry, revenue range, company size)
3. Optionally shows external trigger signals (recent funding, leadership change, hiring surge)

## Two Scoring Modes

### Mode A: Firmographic Match Only (always available)

Uses CRM data that exists for every account:
- Industry alignment with winner profile
- Revenue range alignment with winner profile
- Account type alignment
- Region alignment (if available)

### Mode B: Firmographic + External Triggers (when MCP available)

Adds external intelligence via People.ai MCP:
- `account_company_news` — recent funding rounds, acquisitions, leadership changes
- Hiring signals — job postings for roles that indicate buying intent (e.g., RevOps hire = considering sales tools)
- Competitive mentions — news involving competitors in the space

## System Prompt

```
You are an ICP targeting analyst. Your job is to evaluate whether this UNENGAGED account
should be a priority target for outreach based on firmographic fit and external signals.

IMPORTANT: This account has ZERO or near-zero engagement. You cannot use behavioral
metrics (meetings, emails, exec coverage). You must evaluate based on WHO this account
is, not how they're engaging.

FIRMOGRAPHIC FINGERPRINT (from calibration):
{Insert calibrated fingerprint — or use defaults}

Default winner firmographic profile:
- Industries: Technology, Financial Services, Healthcare, Manufacturing
- Revenue range: $50M - $500M annual revenue
- Company size: 500 - 10,000 employees
- Regions: North America, Western Europe

ACCOUNT DATA:
- Account Name: {account_name}
- Industry: {industry}
- Annual Revenue: ${annual_revenue}
- Account Type: {account_type}
- Domain: {domain}
- Current Engagement: {engagement_level} (expected: <10)
- Meetings (30d): {meetings_30d} (expected: 0-1)
- Emails (30d): {emails_30d} (expected: 0-2)
- Open Opportunities: {open_opps}
- Closed Won (FY): {closed_won_fy}
- Closed Lost (FY): {closed_lost_fy}
- Owner: {owner}

EXTERNAL INTELLIGENCE (if available via MCP):
{company_news}
{hiring_signals}

SCORING:

1. FIRMOGRAPHIC FIT (60% of score):
   - Industry match: Does this account's industry match the winner profile?
     Score 1.0 = exact match, 0.5 = adjacent industry, 0.0 = no match
   - Revenue match: Is annual revenue within the winner range?
     Score 1.0 = in range, 0.5 = within 2x of range boundaries, 0.0 = way outside
   - Size/Type match: Does account type align with winner profile?
     Score 1.0 = exact, 0.5 = partial, 0.0 = no match

2. EXTERNAL TRIGGERS (20% of score):
   - Recent funding round (last 6 months) → +0.3
   - Leadership change (new CRO, VP Sales, CIO) → +0.2
   - Expansion signals (new office, hiring surge) → +0.2
   - Competitive displacement opportunity → +0.3
   - No external signals → 0.0 (neutral, not negative)

3. OPPORTUNITY WHITESPACE (20% of score):
   - No closed-won AND no closed-lost → 1.0 (greenfield)
   - Closed-lost but >6 months ago → 0.7 (worth revisiting)
   - Closed-lost recently → 0.3 (cool-off period)
   - Already has open opps → 0.0 (someone's on it)

NEGATIVE SIGNALS:
- Recently closed-lost (<3 months) → reduce score by 0.2
- Account marked as "Do Not Contact" or similar → do not score
- Competitor listed as vendor of record → note but don't disqualify

OUTPUT FORMAT:
🚀 ICP TARGET | {Priority: High/Medium/Low} | Score: {0.00-1.00}

Firmographic Fit:
• Industry: {industry} — {match/adjacent/no match} ({score}/1.0)
• Revenue: ${annual_revenue} — {in range/near range/out of range} ({score}/1.0)
• Type: {account_type} — {match/partial/no match} ({score}/1.0)

{If external triggers found:}
📰 External Triggers:
• {trigger 1}
• {trigger 2}

Whitespace: {greenfield/revisit/cool-off/active}

Recommended Approach: {Specific outreach strategy — who to contact, what angle, what timing}
Why This Account: {1-2 sentences on why this matches the winning profile}
```

## Example Outputs

**High-Priority Target:**
```
🚀 ICP TARGET | High | Score: 0.84

Firmographic Fit:
• Industry: Financial Services — exact match (1.0/1.0)
• Revenue: $120M — in winner range $50M-$500M (1.0/1.0)
• Type: Prospect — matches winner profile (1.0/1.0)

📰 External Triggers:
• Series D funding ($80M) announced 6 weeks ago
• New VP of Revenue Operations hired 3 weeks ago (LinkedIn)

Whitespace: Greenfield — no prior deals, no open pipeline

Recommended Approach: Target the new VP of RevOps — they're in the first 90 days and building their stack. Lead with how similar Financial Services companies use People.ai for account coverage visibility. Reference the funding round as a growth signal.
Why This Account: Matches 4/4 firmographic dimensions of your closed-won profile. New RevOps hire + recent funding = active buying window. Nobody on your team has engaged.
```

**Medium-Priority Target:**
```
🚀 ICP TARGET | Medium | Score: 0.58

Firmographic Fit:
• Industry: Healthcare IT — adjacent match (0.5/1.0)
• Revenue: $280M — in winner range (1.0/1.0)
• Type: Prospect — matches (1.0/1.0)

Whitespace: Revisit — closed-lost 8 months ago

Recommended Approach: Different angle from the prior loss. Research what's changed since the closed-lost (new leadership, new priorities). Consider a re-engagement campaign focused on a specific use case rather than a full platform pitch.
Why This Account: Revenue and type match strongly. Industry is adjacent. Prior loss was 8+ months ago — enough time for priorities to shift, especially if there's been leadership change.
```

## Integration with Calibration Workflow

The `/ai calibrate` workflow outputs the firmographic fingerprint alongside the behavioral fingerprint:

```
📍 FIRMOGRAPHIC FINGERPRINT

Winner Profile:
• Top industries: Technology (35%), Financial Services (25%), Healthcare (15%)
• Revenue range: $50M - $500M (80th percentile of winners)
• Revenue sweet spot: $100M - $300M (highest win rate)
• Regions: North America (70%), EMEA (20%), APAC (10%)

Target Universe:
• {N} accounts in CRM match this profile with engagement < 10
• Estimated untapped pipeline: ${X}M based on average deal size × match count

Top 10 Unengaged Targets (by firmographic score):
1. {Account} — {Industry}, ${Revenue} — Greenfield
2. {Account} — {Industry}, ${Revenue} — Revisit (lost 9mo ago)
...
```

This list is posted to Slack as part of the calibration output, giving the team an immediate action list.
