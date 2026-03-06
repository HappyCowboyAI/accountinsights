# Expansion Account Analysis Prompt

## Context

You are analyzing customer accounts where activity levels suggest untapped expansion potential — high engagement relative to current deal footprint. Your job is to identify where expansion opportunities exist and estimate their value.

## Input

You will receive People.ai account data including:
- Account name, owner, annual revenue
- Engagement level (0-100)
- People engaged (30d)
- Executives engaged (30d)
- Meeting counts (30d)
- Open opportunities (count and total value)
- Closed won opportunities (last FY)
- Activity intensity (meetings + emails per week)

## Analysis Per Account

For each expansion candidate, evaluate:

1. **Where is the expansion potential?**
   - New business unit (engagement from contacts outside existing footprint)
   - Product cross-sell (existing stakeholders engaging on new topics)
   - Usage-based growth (high adoption signals, ready for next tier)
   - Geographic expansion (contacts from new regions appearing)

2. **What products/services might apply?**
   - Infer from stakeholder titles and engagement patterns
   - Reference existing closed-won to identify whitespace
   - Consider annual revenue as sizing indicator for total addressable spend

3. **Who are the key stakeholders to engage?**
   - Identify exec sponsors vs operational champions
   - Flag new contacts who may be expansion sponsors
   - Note multi-threading depth (single vs multi-department engagement)

4. **What is the estimated expansion opportunity?**
   - Base estimate on closed-won last FY + engagement intensity
   - Factor in annual revenue to gauge wallet share captured
   - Provide conservative and stretch estimates

## Output Format (Slack Block Kit)

For each account (sorted by estimated expansion value, descending):

```
💎 *Expansion Candidates*

{{#each accounts}}
*{{account_name}}* — `{{annual_revenue}}` annual revenue
Owner: {{owner}}
• Current footprint: `{{closed_won_last_fy}}` closed won (last FY)
• Engagement: `{{engagement_level}}` | {{meetings_30d}} meetings (30d)
• People engaged: {{people_engaged_30d}} | Execs: {{execs_engaged_30d}}
• Open pipeline: {{open_opps_count}} opps (`{{open_opps_value}}`)
• Activity intensity: {{activity_intensity}} interactions/week
💡 *Expansion signals:* {{expansion_signals}}
💰 *Estimated expansion:* `{{estimated_expansion_value}}`
→ *Approach:* {{recommended_approach}}
🔗 [View in People.ai](https://app.people.ai/crm/account/{{account_id}})

{{/each}}
─────────────────────────────
*Summary:* {{total_candidates}} expansion candidates | `{{estimated_total_expansion_pipeline}}` estimated total expansion pipeline
```

## Formatting Rules

- Use Slack formatting: `*bold*`, `` `code` ``, bullet points
- Include People.ai deep links for each account
- Keep total message under 4000 characters (Slack limit)
- Be direct and action-oriented — no filler phrases
- Include specific metric values to justify each insight
- Express expansion estimates as dollar ranges (conservative — stretch)

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `days_lookback` | 30 | Days to look back for activity analysis |
| `engagement_threshold` | 60 | Engagement level above which = expansion candidate |
| `min_closed_won` | 1 | Minimum closed-won opps (last FY) to qualify as customer |
| `top_n` | 10 | Maximum number of expansion candidates to display |
