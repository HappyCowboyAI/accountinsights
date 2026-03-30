/**
 * EDB Table 7: Buying Committee Coverage
 * Object: Account
 * Filter: Accounts with external contacts engaged in last 30 days
 * Columns: 13
 *
 * Analyzes the breadth and seniority of contacts engaged at each account
 * to assess buying committee coverage. Sorted ascending by executive
 * engagement (worst committee coverage first).
 *
 * Key Signals:
 * - Exec Engaged = 0 with high total contacts = missing decision-makers
 * - Contact Velocity < 0.8 = stagnant committee, no new stakeholders
 * - People Engaged < 3 with active deal = single-threaded risk
 * - High meetings but low unique contacts = repeat meetings with same people
 *
 * Wave 2 Feature — Buying Committee Intelligence
 */

(function() {
  var TABLE_NAME = '\u{1F3DB}\uFE0F Buying Committee Coverage';
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
      slug: 'ootb_account_engagement_level',
      variation_id: '_0',
      agg: 'avg',
      display_name: 'Engagement Level'
    },
    {
      slug: 'ootb_account_annual_revenue',
      variation_id: null,
      agg: 'unique',
      display_name: 'Annual Revenue'
    },
    {
      slug: 'ootb_account_count_of_external_people_contacted',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'People Contacted (30d)'
    },
    {
      slug: 'ootb_account_count_of_engaged_executives_external',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Execs Engaged (30d)'
    },
    {
      slug: 'ootb_account_count_of_external_people_contacted',
      variation_id: '_last_7_days',
      agg: 'sum',
      display_name: 'People Contacted (7d)'
    },
    {
      slug: 'ootb_account_executive_activities',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'Exec Activities (30d)'
    },
    {
      slug: 'ootb_account_people_engaged',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'People Engaged (30d)'
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
      slug: 'ootb_account_open_opportunities',
      variation_id: '_any_time',
      agg: 'sum',
      display_name: 'Open Opps'
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

  // Filter: accounts with external contacts in last 30 days and engagement > 0
  var filters = {
    operator: 'AND',
    conditions: [
      {
        slug: 'ootb_account_count_of_external_people_contacted',
        variation_id: '_last_30_days',
        operator: 'gt',
        value: 0
      },
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
      slug: 'ootb_account_count_of_engaged_executives_external',
      variation_id: '_last_30_days',
      direction: 'asc'
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
