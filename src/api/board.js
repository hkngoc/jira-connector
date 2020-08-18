"use strict";

module.exports = AgileBoardClient;

/**
 * Used to access Jira REST endpoints in '/rest/agile/1.0/dashboard'
 * @param {JiraClient} jiraClient
 * @constructor AgileBoardClient
 */
function AgileBoardClient(jiraClient) {
  this.jiraClient = jiraClient;

  /**
   * Get a list of sprints associated with an agile board
   * 
   * @deprecated Use board.getAllSprints
   *
   * @method getSprintsForBoard
   * @memberOf AgileBoardClient#
   * @param opts The request options to send to the Jira API
   * @param opts.boardId The agile board id.
   * @param [opts.startAt] The index of the first sprint to return (0-based). must be 0 or a multiple of
   *     maxResults
   * @param [opts.maxResults] A hint as to the the maximum number of sprints to return in each call. Note that the
   *     JIRA server reserves the right to impose a maxResults limit that is lower than the value that a client
   *     provides, dues to lack or resources or any other condition. When this happens, your results will be
   *     truncated. Callers should always check the returned maxResults to determine the value that is effectively
   *     being used.
   * @param [opts.state] Optionally filter by state, e.g. 'active'.
   * @param callback Called when the sprints have been retrieved.
   * @return {Promise} Resolved when the sprints have been retrieved.
   */
  this.getSprintsForBoard = function(opts, callback) {
    const options = {
      uri: this.jiraClient.buildAgileURL("/board/" + opts.boardId + "/sprint")
    };

    const searchOptions = {};
    if (opts.startAt) {
      searchOptions.startAt = opts.startAt;
    }
    if (opts.maxResults) {
      searchOptions.maxResults = opts.maxResults;
    }
    if (opts.state) {
      searchOptions.state = opts.state;
    }

    options.qs = searchOptions;

    return this.jiraClient.makeRequest(options, callback);
  };

  this.getAllSprintsForBoard = async function(opts, callback, sprints = null) {
    if (sprints == null || !sprints) {
      sprints = [];
    }

    const response = await this.getSprintsForBoard(opts);
    const { values, maxResults, startAt, isLast } = response;

    sprints.push(...values);
    if (!isLast) {
      const nextStartAt = startAt + maxResults
      opts.startAt = nextStartAt;
      opts.maxResults = maxResults;
      return this.getAllSprintsForBoard(opts, callback, sprints);
    } else {
      if (callback) {
        callback(sprints);
      } else {
        return sprints;
      }
    }
  }
}
