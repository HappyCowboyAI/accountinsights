/**
 * EDB Table 8: ICP Target Accounts (Zero/Low Engagement)
 * Object: Account
 * Filter: Accounts with engagement < 10 (unengaged or barely touched)
 * Columns: 13
 *
 * Surfaces accounts that MATCH the firmographic profile of closed-won
 * accounts but have little or no engagement. These are the highest-priority
 * net-new targets — accounts the team should be pursuing but isn't.
 *
 * Key Signals:
 * - Industry + Revenue matches closed-won profile = firmographic ICP match
 * - Engagement < 10 = nobody's working this account
 * - Closed Won (FY) = 0 = no existing deal history
 * - Annual Revenue in the winner range = right-sized target
 *
 * Sort by annual revenue descending — biggest untouched opportunities first.
 *
 * NOTE: This table shows ALL low-engagement accounts. After running
 * /ai calibrate, use the firmographic fingerprint to filter to accounts
 * matching your specific winning industries and revenue bands.
 */

(function() {
  var TABLE_NAME = '\uD83D\uDE80 ICP Target Accounts';
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
      slug: 'ootb_account_type',
      variation_id: '_0',
      agg: 'unique',
      display_name: 'Account Type'
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
      slug: 'ootb_account_count_of_external_people_contacted',
      variation_id: '_last_30_days',
      agg: 'sum',
      display_name: 'People Contacted (30d)'
    },
    {
      slug: 'ootb_account_closed_won_opportunities',
      variation_id: '_last_fyear',
      agg: 'sum',
      display_name: 'Closed Won (FY)'
    },
    {
      slug: 'ootb_account_closed_lost_opportunities',
      variation_id: '_last_fyear',
      agg: 'sum',
      display_name: 'Closed Lost (FY)'
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

  // Filter: low/zero engagement accounts — the untouched book
  var filters = {
    operator: 'AND',
    conditions: [
      {
        slug: 'ootb_account_engagement_level',
        variation_id: '_0',
        operator: 'lt',
        value: 10
      }
    ]
  };

  var payload = {
    name: TABLE_NAME,
    object_type: OBJECT_TYPE,
    columns: columnDefs,
    filters: filters,
    sort: {
      slug: 'ootb_account_annual_revenue',
      variation_id: null,
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
