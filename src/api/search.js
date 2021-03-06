"use strict";

module.exports = SearchClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/search'
 *
 * @param {JiraClient} jiraClient
 * @constructor SearchClient
 */
function SearchClient(jiraClient) {
  this.jiraClient = jiraClient;

  /**
   * Searches for issues using JQL.
   *
   * Sorting the jql parameter is a full JQL expression, and includes an ORDER BY clause.
   *
   * The fields param (which can be specified multiple times) gives a comma-separated list of fields to include in
   * the response. This can be used to retrieve a subset of fields. A particular field can be excluded by prefixing
   * it with a minus.
   *
   * By default, only navigable (*navigable) fields are returned in this search resource. Note: the default is
   * different in the get-issue resource -- the default there all fields (*all).
   *
   * * *all - include all fields
   * * navigable - include just navigable fields
   * * summary,comment - include just the summary and comments
   * * -description - include navigable fields except the description (the default is *navigable for search)
   * * *all,-comment - include everything except comments
   *
   * Expanding Issues in the Search Result: It is possible to expand the issues returned by directly specifying the
   * expansion on the expand parameter passed in to this resources.
   *
   * For instance, to expand the "changelog" for all the issues on the search result, it is neccesary to specify
   * "changelog" as one of the values to expand.
   *
   * @method search
   * @memberOf SearchClient#
   * @param opts The options for the search.
   * @param {GET | POST} [opts.method=POST] search request method
   * @param {string} [opts.jql] The JQL query string
   * @param {number} [opts.startAt=0] The index of the first issue to return (0-based)
   * @param {number} [opts.maxResults=50] The maximum number of issues to return (defaults to 50). The maximum allowable
   *     value is dictated by the JIRA property 'jira.search.views.default.max'. If you specify a value that is
   *     higher than this number, your search results will be truncated.
   * @param {string} [opts.validateQuery=strict] Whether to validate the JQL query
   * @param {Array<string>} [opts.fields] The list of fields to return for each issue. By default, all navigable fields are
   *     returned.
   * @param {Array<string>} [opts.expand] A list of the parameters to expand.
   * @param {Array<string>} [opts.properties] A list of the properties to include (5 max).
   * @param {boolean} [opts.fieldsByKeys=false] Reference fields by their key (rather than ID). 
   * @param {callback} [callback] Called with the search results.
   * @return {Promise} Resolved with the search results.
   */
  this.search = function(opts, callback) {
    // opts = opts || {};
    // opts.method = (opts.method || 'POST').toUpperCase();

    let options = {
      uri: this.jiraClient.buildURL('/search'),
      method: opts.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let fields = opts.method == 'POST' ? opts.fields : opts.fields && opts.fields.join(',');
    let expand = opts.method == 'POST' ? opts.expand : opts.expand && opts.expand.join(',');
    let properties = opts.method == 'POST' ? opts.properties : opts.properties && options.properties.join(',');

    let search_options = {
      jql: opts.jql
    };
    if (opts.startAt) {
      search_options.startAt = opts.startAt;
    }
    if (opts.maxResults) {
      search_options.maxResults = opts.maxResults;
    }
    if (opts.fields) {
      search_options.fields = opts.fields;
    }
    if (opts.expand) {
      search_options.expand = opts.expand;
    }
    if ("validateQuery" in opts) {
      search_options.validateQuery = opts.validateQuery;
    }
    if ("fieldsByKeys" in opts) {
      search_options.fieldsByKeys = opts.fieldsByKeys;
    }

    if (opts.method == 'POST') {
      options.body = search_options;
    } else {
      options.qs = search_options;
    }

    return this.jiraClient.makeRequest(options, callback);
  }

  this.searchAll = async function(opts, onProgress, projection, selection, issues = null) {
    if (issues == null || !issues) {
      issues = [];
    }

    let response = await this.search(opts);
    let { issues: current = [], startAt, maxResults, total } = response;

    if (selection && typeof selection == "function") {
      current = current.filter(issue => selection(issue));
    }
    if (projection && typeof projection == "function") {
      current = current.map(issue => projection(issue));
    }

    issues.push(...current);
    if (onProgress) {
      onProgress(startAt + maxResults, total);
    }
    let nextStartAt = startAt + maxResults
    if (nextStartAt < total) {
      opts.startAt = nextStartAt;
      opts.maxResults = maxResults;
      return this.searchAll(opts, onProgress, projection, selection, issues);
    } else {
      return issues;
    }
  }
}