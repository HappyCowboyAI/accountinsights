/**
 * EDB Table 6: Account Intelligence Summary
 * Object: Account
 * Filter: All accounts with engagement > 0
 * Columns: 10
 *
 * Master at-a-glance view showing all key account metrics side by side.
 * Enables reps to sort and filter by any metric for prioritization.
 * Composite scoring columns will appear once scoring metrics are deployed
 * via the Admin API.
 *
 * Key Usage:
 * - Sort by Engagement Level to find most active accounts
 * - Sort by Annual Revenue to find largest accounts
 * - Cross-reference People Engaged with Meetings to assess relationship depth
 * - Compare Execs Engaged across accounts for coverage gap analysis
 */

(function() {
  const TABLE_NAME = '\u{1F9E0} Account Intelligence Summary';
  const OBJECT_TYPE = 'account';

  const columns = [
    {
      slug: 'ootb_account',
      variation_id: null,
      agg: 'unique',
      display_name: 'Account'
    },
    {
      slug: 'ootb_account_original_owner',
      variation_id: null,
      agg: 'unique',
      display_name: 'Owner'
    },
    {
      slug: 'ootb_account_type',
      variation_id: '_0',
      agg: 'unique',
      display_name: 'Account Type'
    },
    {
      slug: 'ootb_account_annual_revenue',
      variation_id: null,
      agg: 'unique',
      display_name: 'Annual Revenue'
    },
    {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      agg: 'avg',
      display_name: 'Engagement Level'
    },
    {
      slug: 'ootb_account_people_engaged',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'People Engaged (30d)'
    },
    {
      slug: 'ootb_account_executive_engaged',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Execs Engaged (30d)'
    },
    {
      slug: 'ootb_account_count_of_meetings_standard',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Meetings (30d)'
    },
    {
      slug: 'ootb_account_count_of_emails_received',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Emails Received (30d)'
    },
    {
      slug: 'ootb_account_open_opportunities',
      variation_id: '_any_time',
      agg: 'sum',
      display_name: 'Open Opps'
    }
  ];

  const columnDefs = columns.map((col, idx) => {
    const def = {
      order: idx,
      slug: col.slug,
      agg: col.agg,
      display_name: col.display_name
    };
    if (col.variation_id) {
      def.variation_id = col.variation_id;
    }
    return def;
  });

  // Filter: accounts with engagement > 0
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

  const payload = {
    name: TABLE_NAME,
    object_type: OBJECT_TYPE,
    columns: columnDefs,
    filters: filters,
    sort: {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      direction: 'desc'
    }
  };

  fetch('/glass/api/v2/object_explore/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.id) {
        window.open('/reporting/account/' + data.id, '_blank');
        console.log('\u2705 Created: ' + TABLE_NAME + ' (ID: ' + data.id + ')');
      } else {
        console.error('\u274C Failed to create table:', data);
        alert('Failed to create table. Check console for details.');
      }
    })
    .catch(function(err) {
      console.error('\u274C Error:', err);
      alert('Error creating table: ' + err.message);
    });
})();
