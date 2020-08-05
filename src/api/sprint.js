"use strict";

module.exports = AgileSprintClient;

/**
 * Used to access Jira REST endpoints in '/rest/agile/1.0/sprint'
 * @param {JiraClient} jiraClient
 * @constructor AgileSprintClient
 */
function AgileSprintClient(jiraClient) {
  this.jiraClient = jiraClient;

  /**
   * Move issues to a sprint, for a given sprint id.
   *
   * @method moveSprintIssues
   * @memberOf AgileSprintClient#
   * @param {Object} opts The issue data in the form of POST body to the
   *   Jira API.
   * @param {string} [opts.sprintId] The sprint id.
   * @param [callback] Called when the sprint has been retrieved.
   * @return {Promise} Resolved when the sprint has been retrieved.
   */
  this.moveSprintIssues = function (opts, callback) {
    const { sprintId, body } = opts

    let options = {
      uri: this.jiraClient.buildAgileURL('/sprint/' + sprintId + '/issue'),
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: body
    };

    return this.jiraClient.makeRequest(options, callback);
  };
}
