"use strict";

export default AuthClient;

/**
 * Used to access Jira REST endpoints in '/rest/auth/1/session'
 *
 * @param {JiraClient} jiraClient
 * @constructor UserClient
 */
function AuthClient(jiraClient) {
  this.jiraClient = jiraClient;
  /**
   * Get current User. Returns information about the currently authenticated user's session.
   *
   * @method currentUser
   * @memberOf Auth#
   * @param [callback] Called when the current user has been retrieved.
   * @return {Promise} Resolved when the user has been retrieved.
   */
  this.currentUser = function (callback) {
    var options = {
      uri: this.jiraClient.buildAuthURL('/session'),
      method: 'GET'
    };

    return this.jiraClient.makeRequest(options, callback);
  };
}
