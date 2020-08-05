"use strict";

module.exports = AgileBoardClient;

/**
 * Used to access Jira REST endpoints in '/rest/agile/1.0/dashboard'
 * @param {JiraClient} jiraClient
 * @constructor AgileBoardClient
 */
function AgileBoardClient(jiraClient) {
  this.jiraClient = jiraClient;

  this.getSprintsForBoard = function(opts, callback) {
    let options = {
      uri: this.jiraClient.buildAgileURL("/board/" + opts.boardId + "/sprint")
    };

    let searchOptions = {};
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

    let response = await this.getSprintsForBoard(opts);
    const { values, maxResults, startAt, isLast } = response;

    sprints.push(...values);
    if (!isLast) {
      let nextStartAt = startAt + maxResults
      opts.startAt = nextStartAt;
      opts.maxResults = maxResults;
      return this.getAllSprintsForBoard(opts, callback, sprints);
    } else {
      return sprints;
    }
  }
}
