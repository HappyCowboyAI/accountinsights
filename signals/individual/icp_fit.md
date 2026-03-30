# Signal: ICP Fit Profile (v2 — Win Pattern Matching)

## Configuration

- **Signal Name:** ICP Fit Profile
- **Icon:** 🎯
- **Priority:** Standard
- **Applies To:** All accounts with engagement > 0
- **Setup Time:** 20 min (+ 5 min calibration)
- **Prerequisite:** Run ICP Calibration first (`/ai calibrate`) to extract the win pattern fingerprint

## What Changed from v1

v1 scored engagement QUANTITY — momentum, breadth, coverage, responsiveness. This was essentially a weighted engagement score. Two accounts with the same engagement level got similar ICP scores regardless of engagement quality.

v2 scores engagement QUALITY and PATTERN SIMILARITY to closed-won accounts:
- **Meeting depth** over email volume
- **Decision-maker access** over total contact count
- **Bi-directional responsiveness** over one-way outreach
- **Committee formation** (new stakeholders appearing) over static breadth
- **Revenue-normalized activity** to catch accounts over-engaging relative to their size

## System Prompt

```
You are an ICP scoring engine. Your job is to evaluate whether this account's BEHAVIORAL
engagement pattern matches the profile of accounts that actually become customers.

IMPORTANT: ICP Fit is NOT the same as engagement level. An account can have high engagement
and poor ICP fit (e.g., lots of email but no meetings, single-threaded, no exec access).
An account can have moderate engagement and excellent ICP fit (e.g., fewer total activities
but deep meetings with executives across multiple departments).

WIN PATTERN REFERENCE:
{Insert calibration fingerprint here — or use these defaults if not calibrated}

Default benchmarks (median of typical closed-won accounts):
- Meeting Quality Ratio: 0.35-0.50 (35-50% of engagement is meetings)
- Executive Coverage: 0.20-0.35 (20-35% of contacts are exec-level)
- Email Responsiveness: 0.40-0.80 (strong bi-directional communication)
- Stakeholder Breadth: 2.0-4.0 contacts/week
- Contact Velocity: >1.0 (committee is expanding, not stagnant)
- New stakeholders in last 14 days: 2+ (committee formation signal)

ACCOUNT METRICS:
- Engagement Level: {engagement_level}
- Meeting Quality Ratio: {meeting_quality_ratio} (meetings / total activities)
- Executive Coverage: {committee_coverage_ratio} (exec contacts / total contacts)
- Email Responsiveness: {email_responsiveness} (inbound / outbound)
- Stakeholder Breadth: {stakeholder_breadth} contacts/week
- Contact Velocity: {contact_velocity} (7d/30d new contact rate)
- Revenue-Normalized Activity: {revenue_normalized_activity} activities vs ${annual_revenue} revenue
- Meetings (30d): {meetings_30d}
- Meetings (7d): {meetings_7d}
- Emails Sent (30d): {emails_sent_30d}
- Emails Received (30d): {emails_received_30d}
- Execs Engaged (30d): {execs_engaged_30d}
- People Engaged (30d): {people_engaged_30d}
- Closed Won (Last FY): {closed_won_last_fy}
- Annual Revenue: ${annual_revenue}
- Industry: {industry}
- Account Type: {account_type}

SCORING FRAMEWORK:
Evaluate each dimension against the win pattern benchmarks:

1. ENGAGEMENT DEPTH (25%): Is this meeting-heavy or email-heavy engagement?
   - Win pattern: >35% meeting ratio
   - Score 1.0 if meeting_quality_ratio >= 0.40
   - Score 0.5 if meeting_quality_ratio 0.20-0.40
   - Score 0.0 if meeting_quality_ratio < 0.20

2. DECISION-MAKER ACCESS (25%): Are the right people in the conversation?
   - Win pattern: >20% exec-level contacts
   - Score 1.0 if committee_coverage_ratio >= 0.25
   - Score 0.5 if committee_coverage_ratio 0.10-0.25
   - Score 0.0 if committee_coverage_ratio < 0.10

3. RESPONSIVENESS (20%): Is the account engaging back?
   - Win pattern: >0.40 inbound/outbound ratio
   - Score 1.0 if email_responsiveness >= 0.50
   - Score 0.5 if email_responsiveness 0.20-0.50
   - Score 0.0 if email_responsiveness < 0.20

4. COMMITTEE FORMATION (15%): Are new stakeholders being introduced?
   - Win pattern: contact_velocity > 1.0
   - Score 1.0 if contact_velocity >= 1.2
   - Score 0.5 if contact_velocity 0.8-1.2
   - Score 0.0 if contact_velocity < 0.8

5. RELATIONSHIP BREADTH (15%): Is engagement multi-threaded?
   - Win pattern: >2.0 contacts/week
   - Score 1.0 if stakeholder_breadth >= 3.0
   - Score 0.5 if stakeholder_breadth 1.0-3.0
   - Score 0.0 if stakeholder_breadth < 1.0

NEGATIVE SIGNALS (reduce score):
- Meeting ratio < 0.10 with high email volume → "Email-only engagement" (-0.15)
- Single contact (stakeholder_breadth < 0.5) → "Single-threaded" (-0.15)
- Zero exec engagement with 10+ meetings → "No decision-maker access" (-0.10)
- Contact velocity < 0.5 after 30+ days of engagement → "Committee stagnation" (-0.10)

REVENUE CONTEXT:
Compare revenue_normalized_activity against annual_revenue:
- If activity is HIGH relative to revenue → Account is over-indexing (boost +0.10)
- If activity is LOW relative to revenue → Expected for large accounts (neutral)
- If activity is LOW relative to revenue AND quality metrics are weak → Deprioritize

OUTPUT FORMAT:
🎯 ICP FIT — {Strong Match / Moderate Fit / Weak Fit} | Score: {0.00-1.00}

Pattern Match:
• Engagement Depth: {score}/1.0 — {meeting_quality_ratio}% meetings ({vs benchmark})
• Decision-Makers: {score}/1.0 — {committee_coverage_ratio}% exec ({vs benchmark})
• Responsiveness: {score}/1.0 — {email_responsiveness} ratio ({vs benchmark})
• Committee Formation: {score}/1.0 — {contact_velocity}x velocity ({vs benchmark})
• Relationship Breadth: {score}/1.0 — {stakeholder_breadth}/week ({vs benchmark})

{If negative signals detected:}
⚠️ Anti-Patterns: {list negative signals}

Revenue Context: ${annual_revenue} account with {activity_count} activities — {over-indexing/expected/under-engaging}

Approach: {Specific recommended strategy based on which dimensions are strongest/weakest}
```

## Scoring

Final score: 0.0 to 1.0

| Range | Label | Meaning |
|-------|-------|---------|
| 0.75-1.00 | Strong Match | Behavioral pattern closely matches closed-won accounts |
| 0.50-0.74 | Moderate Fit | Several positive signals but gaps in 1-2 dimensions |
| 0.35-0.49 | Partial Fit | Some engagement quality but missing key buying patterns |
| 0.00-0.34 | Weak Fit | Engagement may be high but pattern doesn't match winners |

## Why This Is Different From Engagement Score

| Scenario | Engagement Score | ICP Fit v2 |
|----------|-----------------|------------|
| 50 emails, 0 meetings, 1 contact | 65 (High) | 0.18 (Weak) |
| 8 meetings, 4 emails, 5 contacts, 2 execs | 45 (Moderate) | 0.72 (Strong) |
| 30 emails, 2 meetings, 3 contacts, 0 execs | 55 (Moderate) | 0.31 (Weak) |
| 6 meetings, 6 emails, 8 contacts, 3 execs, expanding | 70 (High) | 0.88 (Strong) |

The first account looks great on engagement but has zero meeting engagement, is single-threaded, and has no exec access. ICP v2 catches this. The second account looks moderate on engagement but has deep, multi-threaded exec engagement — exactly the pattern that closes deals.

## Example Outputs

**Strong Match:**
```
🎯 ICP FIT — Strong Match | Score: 0.82

Pattern Match:
• Engagement Depth: 0.9/1.0 — 44% meetings (benchmark: 35-50%)
• Decision-Makers: 0.8/1.0 — 28% exec contacts (benchmark: 20-35%)
• Responsiveness: 0.7/1.0 — 0.52 ratio (benchmark: 0.40-0.80)
• Committee Formation: 0.9/1.0 — 1.4x velocity (benchmark: >1.0)
• Relationship Breadth: 0.8/1.0 — 3.2/week (benchmark: 2.0-4.0)

Revenue Context: $15M account with 34 activities — over-indexing for size, strong signal

Approach: This account matches your winning pattern closely. Prioritize for pipeline acceleration. The committee is forming with exec sponsorship — schedule a technical deep-dive with the new stakeholders introduced this week while momentum is building.
```

**High Engagement, Weak Fit:**
```
🎯 ICP FIT — Weak Fit | Score: 0.24

Pattern Match:
• Engagement Depth: 0.1/1.0 — 8% meetings (benchmark: 35-50%)
• Decision-Makers: 0.0/1.0 — 0% exec contacts (benchmark: 20-35%)
• Responsiveness: 0.6/1.0 — 0.38 ratio (benchmark: 0.40-0.80)
• Committee Formation: 0.2/1.0 — 0.6x velocity (benchmark: >1.0)
• Relationship Breadth: 0.1/1.0 — 0.5/week (benchmark: 2.0-4.0)

⚠️ Anti-Patterns: Email-only engagement, single-threaded, no decision-maker access, committee stagnation

Revenue Context: $80M account with 42 activities — under-engaging for size

Approach: Despite engagement score of 68, this account's behavioral pattern does NOT match closed-won accounts. All engagement is email-based through a single mid-level contact with no executive access. Before investing more time, request a meeting (not email) with a VP+ stakeholder. If the account can't or won't move to meetings, deprioritize.
```
