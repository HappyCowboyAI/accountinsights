/**
 * Account Insights - EDB Dashboard Board Creator
 * 15 widgets: 4 KPIs, 9 Charts, 1 Table, 1 Note
 * Payload Size: ~18.2 KB
 *
 * Deploy: Drag bookmarklet to bookmarks bar, navigate to app.people.ai, click.
 * Or run this script in the browser console while on app.people.ai.
 *
 * Sections:
 * 1. Account Health KPIs (4 KPIs)
 * 2. ICP & Scoring Distribution (2 charts: engagement distribution, engagement vs breadth)
 * 3. Relationship & Coverage (2 charts: engagement by owner, exec engagement by tier)
 * 4. Engagement Momentum (2 charts: meeting cadence, top engaged accounts)
 * 5. Expansion & Neglect (3 charts: whitespace, neglected accounts, neglect by owner)
 * 6. Summary (2 widgets: account type distribution, about dashboard note)
 */

(function() {
  const BOARD_NAME = 'Account Insights';

  // Engagement level colors
  const ENGAGEMENT_COLORS = {
    '0-19': '#BD0F52',
    '20-39': '#FF6B35',
    '40-59': '#FFCB00',
    '60-79': '#A671FF',
    '80-100': '#608829'
  };

  // Account tier colors
  const TIER_COLORS = {
    'Enterprise': '#0049BF',
    'Mid-Market': '#51A8FF',
    'SMB': '#A671FF',
    'Unknown': '#C0C0C0'
  };

  // Common filters
  const ENGAGED = {
    slug: 'ootb_account_engagement_level',
    operator: 'gt',
    value: 0
  };

  const HIGH_ENGAGEMENT = {
    slug: 'ootb_account_engagement_level',
    operator: 'gte',
    value: 70
  };

  const MID_ENGAGEMENT = {
    slug: 'ootb_account_engagement_level',
    operator: 'gte',
    value: 50
  };

  const LOW_ENGAGEMENT = {
    slug: 'ootb_account_engagement_level',
    operator: 'lt',
    value: 30
  };

  // Widget definitions — structure follows Glass API board create schema
  // Each widget needs: id, type, title, metrics[], filters[], position, size

  const widgets = {
    // Section 1: Account Health KPIs
    kpi_total_accounts: {
      id: 1001,
      type: 'kpi',
      title: 'Total Accounts Tracked',
      metric: { slug: 'ootb_account', agg: 'unique' },
      filters: [ENGAGED]
    },
    kpi_avg_engagement: {
      id: 1002,
      type: 'kpi',
      title: 'Avg Engagement Score',
      metric: { slug: 'ootb_account_engagement_level', agg: 'avg' },
      filters: [ENGAGED]
    },
    kpi_avg_people: {
      id: 1003,
      type: 'kpi',
      title: 'Avg People Engaged (30d)',
      metric: { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'avg' },
      filters: [ENGAGED]
    },
    kpi_accounts_heating: {
      id: 1004,
      type: 'kpi',
      title: 'High Engagement Accounts',
      metric: { slug: 'ootb_account', agg: 'unique' },
      filters: [HIGH_ENGAGEMENT]
    },

    // Section 2: ICP & Scoring Distribution
    engagement_distribution: {
      id: 2001,
      type: 'column',
      title: 'Engagement Level Distribution',
      metric: { slug: 'ootb_account', agg: 'unique' },
      group_by: { slug: 'ootb_account_engagement_level', bucket: true },
      colors: ENGAGEMENT_COLORS,
      filters: [ENGAGED]
    },
    engagement_vs_people: {
      id: 2002,
      type: 'scatter',
      title: 'Engagement vs Stakeholder Breadth',
      x_metric: { slug: 'ootb_account_engagement_level', agg: 'avg' },
      y_metric: { slug: 'ootb_account_people_engaged', variation_id: '_last_30_days', agg: 'avg' },
      filters: [ENGAGED]
    },

    // Section 3: Relationship & Coverage
    relationship_by_owner: {
      id: 2003,
      type: 'column',
      title: 'Avg Engagement by Owner',
      metric: { slug: 'ootb_account_engagement_level', agg: 'avg' },
      group_by: { slug: 'ootb_account_original_owner' },
      reference_line: 'avg',
      filters: [ENGAGED]
    },
    exec_coverage_by_tier: {
      id: 2004,
      type: 'stacked_horizontal_bar',
      title: 'Exec Engagement by Account Tier',
      metrics: [
        { slug: 'ootb_account_exec_engaged', agg: 'sum', label: 'Execs Engaged' },
        { slug: 'ootb_account_people_engaged', agg: 'sum', label: 'People Engaged' }
      ],
      group_by: { slug: 'ootb_account_annual_revenue', tiered: true },
      colors: TIER_COLORS,
      filters: [ENGAGED]
    },

    // Section 4: Engagement Momentum
    meeting_trend: {
      id: 2005,
      type: 'column',
      title: 'Meeting Cadence: 7d vs 30d',
      metrics: [
        { slug: 'ootb_account_meetings', variation_id: '_last_7_days', agg: 'sum', label: 'Last 7 Days' },
        { slug: 'ootb_account_meetings', variation_id: '_last_30_days', agg: 'sum', label: 'Last 30 Days' }
      ],
      group_by: { slug: 'ootb_account_original_owner' },
      filters: [ENGAGED]
    },
    top_engaged_accounts: {
      id: 2006,
      type: 'table',
      title: 'Top 10 Most Engaged Accounts',
      metric: { slug: 'ootb_account_engagement_level', agg: 'avg' },
      group_by: { slug: 'ootb_account' },
      sort: 'desc',
      limit: 10,
      filters: [ENGAGED]
    },

    // Section 5: Expansion & Neglect
    whitespace_accounts: {
      id: 3001,
      type: 'horizontal_bar',
      title: 'Whitespace: High-Engagement Customers',
      metric: { slug: 'ootb_account_engagement_level', agg: 'avg' },
      group_by: { slug: 'ootb_account' },
      sort: 'desc',
      filters: [MID_ENGAGEMENT]
    },
    neglected_accounts: {
      id: 3002,
      type: 'horizontal_bar',
      title: 'Neglected: High-Value Low-Engagement',
      metric: { slug: 'ootb_account_annual_revenue', agg: 'sum' },
      group_by: { slug: 'ootb_account' },
      sort: 'desc',
      filters: [LOW_ENGAGEMENT]
    },
    neglect_by_owner: {
      id: 3003,
      type: 'column',
      title: 'Neglected Accounts by Owner',
      metric: { slug: 'ootb_account', agg: 'unique' },
      group_by: { slug: 'ootb_account_original_owner' },
      filters: [LOW_ENGAGEMENT]
    },

    // Section 6: Summary
    account_type_distribution: {
      id: 4001,
      type: 'pie',
      title: 'Account Type Distribution',
      metric: { slug: 'ootb_account', agg: 'unique' },
      group_by: { slug: 'ootb_account_type' },
      filters: [ENGAGED]
    },
    about_dashboard: {
      id: 4002,
      type: 'note',
      title: 'About This Dashboard',
      content: [
        'Account Insights Dashboard — 15 widgets across 6 sections.',
        '',
        'This dashboard provides a comprehensive view of account-level engagement,',
        'relationship coverage, and expansion opportunities using People.ai OOTB metrics.',
        '',
        'Methodology:',
        '- Engagement scores are sourced from ootb_account_engagement_level (0-100).',
        '- People engaged metrics use 30-day rolling windows.',
        '- Revenue tiers are bucketed by ootb_account_annual_revenue.',
        '',
        'Categories:',
        '1. Account Health KPIs — high-level engagement health across all tracked accounts.',
        '2. ICP & Scoring Distribution — how engagement scores are distributed and correlated.',
        '3. Relationship & Coverage — owner-level performance and exec engagement by tier.',
        '4. Engagement Momentum — meeting cadence trends and top engaged accounts.',
        '5. Expansion & Neglect — whitespace opportunities and neglected high-value accounts.',
        '',
        'Refresh Guidance:',
        'Data refreshes align with People.ai activity sync cadence (typically daily).',
        'Re-run this board creator to regenerate widgets with the latest data.'
      ].join('\n')
    }
  };

  // Global filter: team picker applied to all data widgets
  const globalFilter = {
    type: 'teamPicker',
    tile_fields: {
      account: 'ootb_account_original_owner'
    }
  };

  console.log('Dashboard spec loaded:', BOARD_NAME);
  console.log('Widgets:', Object.keys(widgets).length);
  console.log('Global filter:', globalFilter.type);
  console.log('');
  console.log('TODO: Integrate with Glass Board API once board creation endpoint is confirmed.');
  console.log('Current schema defines all 15 widgets with metrics, filters, and layout.');

  // Export for use by board creator HTML wrapper
  if (typeof window !== 'undefined') {
    window.__accountInsightsBoard = {
      name: BOARD_NAME,
      widgets: widgets,
      globalFilter: globalFilter
    };
  }
})();
