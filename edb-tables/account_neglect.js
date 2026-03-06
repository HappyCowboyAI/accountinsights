/**
 * EDB Table 5: Account Neglect
 * Object: Account
 * Filter: Engagement < 30 AND meetings (30d) <= 1
 * Columns: 12
 *
 * Surfaces accounts that are being ignored — particularly high-value
 * customers or accounts with open pipeline that have gone dark.
 * Sorted by annual revenue descending (biggest neglected accounts first).
 *
 * Key Signals:
 * - Any row here with Account Type = "Customer" is urgent
 * - Open Opps > 0 with zero activity = deal at risk from neglect
 * - Closed Won (Last FY) > 0 but current engagement near zero = churn risk
 * - Annual Revenue high + all activity metrics near zero = immediate action
 */

(function() {
  const TABLE_NAME = '🚨 Account Neglect';
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
      slug: 'ootb_account_open_opportunities',
      variation_id: '_any_time',
      agg: 'sum',
      display_name: 'Open Opps'
    },
    {
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      agg: 'avg',
      display_name: 'Engagement Level'
    },
    {
      slug: 'ootb_account_count_of_meetings_standard',
      variation_id: '_last_7_days',
      agg: 'sum',
      display_name: 'Meetings (7d)'
    },
    {
      slug: 'ootb_account_count_of_meetings_standard',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Meetings (30d)'
    },
    {
      slug: 'ootb_account_count_of_emails_sent',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Emails Sent (30d)'
    },
    {
      slug: 'ootb_account_count_of_emails_received',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Emails Received (30d)'
    },
    {
      slug: 'ootb_account_people_engaged',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'People Engaged (30d)'
    },
    {
      slug: 'ootb_account_closed_won_opportunities',
      variation_id: '_last_fyear',
      agg: 'sum',
      display_name: 'Closed Won (Last FY)'
    }
  ];

  const columnDefs = columns.map(function(col, idx) {
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

  const payload = {
    name: TABLE_NAME,
    object_type: OBJECT_TYPE,
    columns: columnDefs,
    filters: filters,
    sort: {
      slug: 'ootb_account_annual_revenue',
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
        console.log('✅ Created: ' + TABLE_NAME + ' (ID: ' + data.id + ')');
      } else {
        console.error('❌ Failed to create table:', data);
        alert('Failed to create table. Check console for details.');
      }
    })
    .catch(function(err) {
      console.error('❌ Error:', err);
      alert('Error creating table: ' + err.message);
    });
})();
