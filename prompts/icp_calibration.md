# ICP Calibration — Win vs Loss Pattern Extraction

**Purpose:** Analyze closed-won vs closed-lost accounts to extract the behavioral fingerprint that distinguishes winners from losers. The output becomes the reference profile that all prospect accounts are scored against.

**Trigger:** `/ai calibrate` Slack command
**Runtime:** 3-5 minutes (includes MCP deep dives on 15 accounts)
**Frequency:** Run once per deployment, recalibrate quarterly

---

## How It Works

```
/ai calibrate
    │
    ├─ Branch 1: Pull 30 WINNERS (closed-won last FY)
    │   └─ Insights API → engagement metrics, meeting/email counts,
    │      exec coverage, stakeholder breadth, revenue, industry
    │   └─ Compute derived ratios per account
    │
    ├─ Branch 2: Pull 30 LOSERS (closed-lost, no closed-won)
    │   └─ Same metrics, same derived ratios
    │   └─ This is the CONTROL group
    │
    ├─ Branch 3: Deep dive 15 WINNERS via MCP
    │   └─ get_recent_account_activity (90-day timeline)
    │   └─ get_engaged_people (stakeholder details)
    │   └─ 5 from each revenue tier (small, mid, enterprise)
    │   └─ Reconstruct: meeting cadence, committee formation,
    │      exec entry timing, engagement arc
    │
    └─ Claude Analysis: Compare cohorts, extract fingerprint
        └─ OUTPUT: Win Pattern Fingerprint with thresholds
```

## Why 30/30/15?

- **30 winners + 30 losers** for the metric-level comparison: enough to compute meaningful medians and ranges. At 10 you're fitting to outliers; at 30 you start seeing real distributions.
- **15 deep dives via MCP**: MCP calls take 10-15 seconds each. 15 accounts = ~3 min of API time. We pick 5 per revenue tier (small/mid/enterprise) so the fingerprint captures the pattern across deal sizes, not just the enterprise motion.

## Derived Ratios (Computed Per Account)

These are calculated from OOTB metrics in the n8n Code node before Claude analysis:

| Ratio | Formula | What It Measures |
|-------|---------|-----------------|
| Meeting Quality Ratio | `meetings_30d / (meetings_30d + emails_30d)` | Engagement depth — meetings vs email |
| Executive Coverage | `execs_engaged_30d / people_contacted_30d` | Decision-maker access |
| Email Responsiveness | `emails_received_30d / emails_sent_30d` | Bi-directional communication |
| Contact Velocity | `people_contacted_7d / people_contacted_30d * 4.286` | New stakeholder introduction rate |
| Stakeholder Breadth | `people_contacted_30d / 4.3` | Unique contacts per week |

## The Comparison That Matters

The key output is the **GAP** between winners and losers on each dimension:

```
Winner meeting ratio:  42% median (range: 30-55%)
Loser meeting ratio:   14% median (range: 5-25%)
                       ^^^
                       THIS GAP is the signal
```

A dimension where winners and losers look the same (e.g., both have similar engagement levels) is NOT a useful ICP indicator — even if the absolute numbers are high. The dimensions with the BIGGEST gaps are the strongest predictors.

## Deep Dive: What MCP Adds That Metrics Can't

OOTB metrics show current state. MCP activity timelines show the STORY:

| Question | Metrics Alone | MCP Timeline |
|----------|--------------|-------------|
| When did execs enter the conversation? | "2 execs engaged" | "VP joined meeting in week 3, CFO in week 6" |
| Is the committee forming? | "5 contacts, velocity 1.2" | "Started with 2, added procurement in week 4, added legal in week 7" |
| What's the meeting cadence? | "12 meetings in 30 days" | "Weekly 1:1s + bi-weekly committee meetings" |
| Is engagement accelerating? | "Momentum score 1.3" | "2 meetings/week for 6 weeks, then 4/week in last 2 weeks" |

The deep dive on 15 winners extracts the ENGAGEMENT ARC — the shape of the journey from first touch to close. This becomes the pattern that the ICP signal matches against.

## Output: Win Pattern Fingerprint

The final output posted to Slack and emailed to the CSM:

```
🎯 WIN PATTERN FINGERPRINT
Calibrated: {date}
Based on: 30 winners vs 30 losers, last 12 months
Deep dive: 15 winner activity timelines analyzed

📊 BEHAVIORAL BENCHMARKS

| Dimension           | Winner Median | Loser Median | Gap    | Signal Strength |
|---------------------|--------------|-------------|--------|----------------|
| Meeting Quality     | 42%          | 14%         | +28%   | 🟢 Strong       |
| Executive Coverage  | 24%          | 8%          | +16%   | 🟢 Strong       |
| Email Response Rate | 0.52         | 0.18        | +0.34  | 🟢 Strong       |
| Contact Velocity    | 1.3          | 0.7         | +0.6   | 🟡 Moderate     |
| Stakeholder Breadth | 3.1/wk       | 1.4/wk      | +1.7   | 🟡 Moderate     |
| Engagement Level    | 65           | 48          | +17    | 🔴 Weak         |

🏆 TOP DIFFERENTIATORS
1. Meeting depth, not email volume, is the #1 predictor
2. Executive involvement by week 3 is critical
3. Committee formation (3+ new stakeholders) separates winners
4. Bi-directional email is 3x higher for winners
5. Engagement level alone is a WEAK predictor (overlap between cohorts)

📈 WINNER ENGAGEMENT ARC (from 15 deep dives)
- First 2 weeks: 1-2 meetings, 1-2 contacts, exploratory
- Weeks 3-4: Executive enters, meeting cadence increases
- Weeks 5-8: 2-3 new stakeholders, committee formation visible
- Weeks 8-12: Meeting cadence peaks, multiple departments engaged
- Key pattern: "Staircase" — each step adds a new stakeholder level

🚫 ANTI-PATTERNS (what losers look like)
1. Email-heavy engagement (>85% email, <15% meetings)
2. Single-threaded past 30 days — no new contacts added
3. Executive ghosting — exec attended 1-2 meetings then vanished
4. "Polite decline" pattern — responsive emails but declining meetings

⚖️ RECOMMENDED ICP SCORING WEIGHTS
- Meeting Quality Ratio: 30% (strongest gap)
- Executive Coverage: 25% (second strongest)
- Email Responsiveness: 20% (clear differentiator)
- Contact Velocity: 15% (moderate signal)
- Stakeholder Breadth: 10% (overlaps with velocity)

🎯 THRESHOLDS
- STRONG FIT (>0.70): Meeting ratio >35%, exec coverage >20%, responsive
- MODERATE FIT (0.40-0.70): Meeting ratio 20-35%, some exec access
- WEAK FIT (<0.40): Email-heavy, single-threaded, no exec access
```

## How the Fingerprint Gets Used

1. CSM runs `/ai calibrate` during deployment setup
2. The fingerprint is posted to Slack and emailed as HTML
3. CSM reviews with the customer: "Does this match your intuition about what makes a good deal?"
4. The thresholds and weights are embedded into the ICP Fit SalesAI signal prompt
5. Every prospect account is scored against THIS customer's specific winning patterns
6. Recalibrate quarterly or when win rates shift

## Recalibration Triggers

- Win rate changes >10% quarter-over-quarter
- New product line or market segment launched
- Sales motion change (PLG to enterprise, inbound to outbound)
- Average deal size shifts >25%
- New ICP hypothesis from leadership (test against the data)
