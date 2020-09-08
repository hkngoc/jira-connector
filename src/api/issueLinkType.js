"use strict";

export default IssueLinkTypeClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/issueLinkType'
 * @param {JiraClient} jiraClient
 * @constructor IssueLinkTypeClient
 */
function IssueLinkTypeClient(jiraClient) {
  this.jiraClient = jiraClient;

  /**
   * Get a list of available issue link types, if issue linking is enabled. Each issue link type has an id, a name
   * and a label for the outward and inward link relationship.
   *
   * @method getAvailableTypes
   * @memberOf IssueLinkTypeClient#
   * @param opts The request options for the API.  Ignored in this function.
   * @param [callback] Called when the available IssueLink types are retrieved.
   * @return {Promise} Resolved when the available IssueLink types are retrieved.
   */
  this.getAvailableTypes = function(opts, callback) {
    var options = {
      uri: this.jiraClient.buildURL('/issueLinkType'),
      method: 'GET'
    };

    return this.jiraClient.makeRequest(options, callback);
  };
}
