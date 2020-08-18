"use strict";

module.exports = UserClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/user'
 *
 * @param {JiraClient} jiraClient
 * @constructor UserClient
 */
function UserClient(jiraClient) {
  this.jiraClient = jiraClient;

  /**
   * Get a user. This resource cannot be accessed anonymously.
   *
   * @method getUser
   * @memberOf UserClient#
   * @param opts The request options sent to the Jira API
   * @param {string} [opts.accountId] The account ID of the user
   * @param {string} [opts.username] The name of the user to retrieve.
   * @param {string} [opts.userKey] The key of the user to retrieve.
   * @param {string} [opts.expand] The fields to be expanded.
   * @param {callback} [callback] Called when the user has been retrieved.
   * @return {Promise} Resolved when the user has been retrieved.
   */
  this.getUser = function(opts, callback) {
    var options = {
      uri: this.jiraClient.buildURL('/user'),
      method: 'GET',
      qs: opts.qs
    };

    if (opts.expand) {
      options.qs.expand = '';
      opts.expand.forEach(function(ex) {
        options.qs.expand += ex + ','
      });
    }

    return this.jiraClient.makeRequest(options, callback);
  };
}