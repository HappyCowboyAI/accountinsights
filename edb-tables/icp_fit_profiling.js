/**
 * EDB Table 1: ICP Fit Profiling
 * Object: Account
 * Filter: All accounts with engagement > 0
 * Columns: 13
 *
 * Surfaces accounts that match the behavioral profile of your best customers.
 * Uses engagement patterns, exec access, stakeholder breadth, and meeting
 * frequency as proxies for ICP fit until composite scoring is deployed.
 *
 * Key Signals:
 * - High engagement + high exec coverage + strong email responsiveness = strong ICP fit
 * - Closed Won (Last FY) > 0 = proven buyer, validate current engagement
 * - Industry + Revenue + Engagement pattern = behavioral ICP fingerprint
 */

(function() {
  const TABLE_NAME = '\uD83C\uDFAF ICP Fit Profiling';
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
      slug: 'ootb_account_industry',
      variation_id: null,
      agg: 'unique',
      display_name: 'Industry'
    },
    {
      slug: 'ootb_account_annual_revenue',
      variation_id: null,
      agg: 'unique',
      display_name: 'Annual Revenue'
    },
    {
      slug: 'ootb_account_type',
      variation_id: '_0',
      agg: 'unique',
      display_name: 'Account Type'
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
      slug: 'ootb_account_count_of_emails_sent',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Emails Sent (30d)'
    },
    {
      slug: 'ootb_account_executive_activities',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Exec Activities (30d)'
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
