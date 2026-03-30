/**
 * EDB Table 1: ICP Fit Profiling (v2 — Quality-Based)
 * Object: Account
 * Filter: All accounts with engagement > 0
 * Columns: 15
 *
 * V2 redesign: Surfaces accounts based on engagement QUALITY, not just volume.
 * Two accounts at engagement 70 look identical on a dashboard — but one with
 * 45% meeting ratio and 3 execs engaged is a real buyer, while one with 5%
 * meetings and 1 contact is email noise.
 *
 * Key Quality Signals (what engagement score alone can't tell you):
 * - Meetings (30d) vs Emails (30d) = engagement depth
 * - Execs Engaged vs People Engaged = decision-maker access
 * - Emails Received vs Emails Sent = responsiveness / bi-directionality
 * - People Contacted (7d) vs (30d) = committee formation velocity
 * - Total Activity vs Annual Revenue = over-indexing relative to size
 *
 * Sorted by engagement descending, but USE the quality columns to
 * differentiate accounts at similar engagement levels.
 */

(function() {
  var TABLE_NAME = '\uD83C\uDFAF ICP Fit Profiling (v2)';
  var OBJECT_TYPE = 'account';

  var columns = [
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
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      agg: 'avg',
      display_name: 'Engagement'
    },
    {
      slug: 'ootb_account_count_of_meetings_standard',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Meetings (30d)'
    },
    {
      slug: 'ootb_account_count_of_emails',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Emails (30d)'
    },
    {
      slug: 'ootb_account_count_of_engaged_executives_external',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Execs Engaged (30d)'
    },
    {
      slug: 'ootb_account_count_of_external_people_contacted',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'People Contacted (30d)'
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
      slug: 'ootb_account_count_of_external_people_contacted',
      variation_id: '_last_7_days',
      agg: 'sum',
      display_name: 'New Contacts (7d)'
    },
    {
      slug: 'ootb_account_closed_won_opportunities',
      variation_id: '_last_fyear',
      agg: 'sum',
      display_name: 'Closed Won (FY)'
    },
    {
      slug: 'ootb_account_type',
      variation_id: '_0',
      agg: 'unique',
      display_name: 'Account Type'
    },
    {
      slug: 'ootb_account_domain',
      variation_id: null,
      agg: 'unique',
      display_name: 'Domain'
    }
  ];

  var columnDefs = columns.map(function(col, idx) {
    var def = {
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

  var filters = {
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

  var payload = {
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
