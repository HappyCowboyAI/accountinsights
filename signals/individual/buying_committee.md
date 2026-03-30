# SalesAI Signal: Buying Committee Coverage

**Category:** Buying Committee Intelligence
**Object:** Account
**Priority:** High (just below Account Neglect)
**Wave:** 2

---

## Trigger Conditions

This signal fires when ANY of the following conditions are met:

| Condition | Threshold | Meaning |
|-----------|-----------|---------|
| Committee Coverage Ratio | < 0.15 | Less than 15% of engaged contacts are executive-level |
| Contact Velocity | < 0.50 | New contact engagement declining — committee stagnation |
| Stakeholder Breadth | < 0.50 | Fewer than ~2 unique contacts per week |
| Combined: Coverage < 0.15 AND Velocity < 0.8 | Both | Missing decision-makers AND not expanding reach |

## Scoring

Score: 0.0 to 1.0 (higher = worse committee coverage)

```
score = (
  0.40 * (1 - min(committee_coverage_ratio / 0.30, 1.0)) +
  0.30 * (1 - min(contact_velocity / 1.2, 1.0)) +
  0.30 * (1 - min(stakeholder_breadth / 3.0, 1.0))
)
```

## SalesAI Prompt

```
You are analyzing the buying committee coverage for the account "{account_name}".

METRICS:
- Committee Coverage Ratio: {committee_coverage_ratio} (exec contacts / total contacts)
- Contact Velocity: {contact_velocity} (7d/30d new contact rate, >1.0 = expanding)
- Stakeholder Breadth: {stakeholder_breadth} contacts/week
- Executives Engaged (30d): {execs_engaged_30d}
- Total People Contacted (30d): {people_contacted_30d}
- Meetings (30d): {meetings_30d}
- Engagement Level: {engagement_level}

ANALYSIS FRAMEWORK:
1. Assess decision-maker access: Are executives (VP+) in the conversation?
2. Assess committee breadth: How many unique people across how many departments?
3. Assess committee momentum: Are new stakeholders being introduced or is it stagnant?
4. Assess concentration risk: What % of all activity is with a single contact?

OUTPUT FORMAT (exactly this structure):
🏛️ BUYING COMMITTEE GAP | {Priority: Critical/High/Medium} | Score: {0.0-1.0}
Committee: {X}% exec-level | {Y} total contacts | Velocity: {accelerating/stagnant/declining}
Risk: {What's missing — e.g., "No executive engagement in 30 days, all activity with 2 mid-level contacts"}
Action: {Specific multi-threading recommendation with timeline}
```

## Priority Hierarchy

Within Account Insights signal priority:
1. Account Neglect (Critical)
2. **Buying Committee Gap (High)**
3. Declining Engagement (High)
4. Relationship Health (Medium-High)
5. Whitespace & Expansion (Medium)
6. ICP Fit (Medium)
7. Surging Engagement (Low — positive signal)
8. Healthy Account (Informational)

## Example Outputs

**Critical:**
```
🏛️ BUYING COMMITTEE GAP | Critical | Score: 0.85
Committee: 0% exec-level | 2 total contacts | Velocity: declining
Risk: Zero executive engagement in 30 days. All 14 meetings were with the same 2 mid-level contacts. No new stakeholders introduced in 6 weeks despite active deal progression.
Action: Initiate executive sponsor mapping within 48 hours. Request champion to facilitate VP-level introduction. Prepare executive business case for CXO outreach.
```

**High:**
```
🏛️ BUYING COMMITTEE GAP | High | Score: 0.62
Committee: 8% exec-level | 6 total contacts | Velocity: stagnant
Risk: Only 1 executive touched in 30 days (single exec meeting 3 weeks ago). Contact base hasn't expanded — same 6 people for the last month. Missing procurement and technical evaluator engagement.
Action: Schedule multi-threaded discovery session. Map the buying committee with champion and identify 2-3 new stakeholders to engage this week.
```

**Medium:**
```
🏛️ BUYING COMMITTEE GAP | Medium | Score: 0.38
Committee: 22% exec-level | 8 total contacts | Velocity: stable
Risk: Reasonable exec coverage but contact velocity flat — no new stakeholders being introduced. Committee may be complete, or expansion may have stalled.
Action: Verify with champion whether all key stakeholders are engaged. Consider inviting adjacent department leaders to upcoming QBR.
```
