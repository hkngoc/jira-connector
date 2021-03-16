"use strict";

module.exports = IssueClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/issue' and '/rest/agile/1.0/issue'
 * @constructor IssueClient
 * @param {JiraClient} jiraClient
 */
function IssueClient(jiraClient) {
  this.jiraClient = jiraClient;

  /**
   * Creates an issue or a sub-task from a JSON representation.
   *
   * The fields that can be set on create, in either the fields parameter or the update parameter can be determined
   * using the /rest/api/2/issue/createmeta resource. If a field is not configured to appear on the create screen,
   * then it will not be in the createmeta, and a field validation error will occur if it is submitted.
   *
   * Creating a sub-task is similar to creating a regular issue, with two important differences:
   *
   * * the issueType field must correspond to a sub-task issue type (you can use /issue/createmeta to discover
   * sub-task issue types), and
   * * you must provide a parent field in the issue create request containing the id or key of the parent issue.
   *
   * @method createIssue
   * @memberof IssueClient#
   * @param {Object} issue The issue data in the form of POST body to the JIRA API.
   * See {@link https://docs.atlassian.com/jira/REST/latest/#d2e398}
   * @param [callback] Called when the issue has been created.
   * @return {Promise} Resolved when the issue has been created.
   */
  this.createIssue = function(issue, callback) {
    var options = {
      uri: this.jiraClient.buildURL('/issue'),
      method: 'POST',
      body: issue,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return this.jiraClient.makeRequest(options, callback);
  };

  /**
   * Returns the meta data for creating issues. This includes the available projects, issue types and fields,
   * including field types and whether or not those fields are required. Projects will not be returned if the user
   * does not have permission to create issues in that project.
   *
   * The fields in the createmeta correspond to the fields in the create screen for the project/issuetype. Fields not
   * in the screen will not be in the createmeta.
   *
   * Fields will only be returned if ```expand=projects.issuetypes.fields.```
   *
   * The results can be filtered by project and/or issue type, given by the query params.
   *
   * @method getCreateMetadata
   * @memberOf IssueClient#
   * @param {Object} [opts] The options for the API request.
   * @param {string} [opts.projectIds] combined with the projectKeys param, lists the projects with which to filter
   *     the results. If absent, all projects are returned. This parameter can be specified multiple times, and/or be
   *     a comma-separated list. Specifiying a project that does not exist (or that you cannot create issues in) is
   *     not an error, but it will not be in the results.
   * @param {string} [opts.projectKeys] combined with the projectIds param, lists the projects with which to filter
   *     the results. If null, all projects are returned. This parameter can be specified multiple times, and/or be a
   *     comma-separated list. Specifiying a project that does not exist (or that you cannot create issues in) is not
   *     an error, but it will not be in the results.
   * @param {string} [opts.issuetypeIds] combinded with issuetypeNames, lists the issue types with which to filter
   *     the results. If null, all issue types are returned. This parameter can be specified multiple times, and/or
   *     be a comma-separated list. Specifiying an issue type that does not exist is not an error.
   * @param {string} [opts.issuetypeNames] combinded with issuetypeIds, lists the issue types with which to filter
   *     the results. If null, all issue types are returned. This parameter can be specified multiple times, but is
   *     NOT interpreted as a comma-separated list. Specifiying an issue type that does not exist is not an error.
   * @param {string} [opts.expand] in order to get expanded field descriptions, specify 'projects.issuetypes.fields' here.
   * @param [callback] Called when the metadata has been retrieved.
   * @return {Promise} Resolved when the metadata has been retrieved.
   */
  this.getCreateMetadata = function(opts, callback) {
    var options = {
      uri: this.jiraClient.buildURL('/issue/createmeta'),
      method: 'GET',
      qs: opts
    };

    return this.jiraClient.makeRequest(options, callback);
  };

  /**
   * Returns a full representation of the issue for the given issue key.
   *
   * An issue JSON consists of the issue key, a collection of fields, a link to the workflow transition sub-resource,
   * and (optionally) the HTML rendered values of any fields that support it (e.g. if wiki syntax is enabled for the
   * description or comments).
   *
   * The fields param (which can be specified multiple times) gives a comma-separated list of fields to include in
   * the response. This can be used to retrieve a subset of fields. A particular field can be excluded by prefixing
   * it with a minus.
   *
   * By default, all (\*all) fields are returned in this get-issue resource. Note: the default is different when doing
   * a jql search -- the default there is just navigable fields (\*navigable).
   *
   * * \*all - include all fields
   * * \*navigable - include just navigable fields
   * * summary,comment - include just the summary and comments
   * * -comment - include everything except comments (the default is *all for get-issue)
   * * \*all,-comment - include everything except comments
   *
   * JIRA will attempt to identify the issue by the issueIdOrKey path parameter. This can be an issue id, or an issue
   * key. If the issue cannot be found via an exact match, JIRA will also look for the issue in a case-insensitive
   * way, or by looking to see if the issue was moved. In either of these cases, the request will proceed as normal
   * (a 302 or other redirect will not be returned). The issue key contained in the response will indicate the
   * current value of issue's key.
   *
   * @method getIssue
   * @memberof IssueClient#
   * @param {Object} opts The options to pass to the API.  Note that this object must contain EITHER an issueId or
   *        issueKey property; issueId will be used over issueKey if both are present.
   * @param {boolean} [opts.agile] Whether or not to call the agile version of this endpoint.  Defaults to false.
   * @param {string} [opts.issueId] The id of the issue.  EX: 10002
   * @param {string} [opts.issueKey] The Key of the issue.  EX: JWR-3
   * @param {Object} [opts.fields] See {@link https://docs.atlassian.com/jira/REST/latest/#d2e611}
   * @param {Object} [opts.expand] See {@link https://docs.atlassian.com/jira/REST/latest/#d2e611}
   * @param {Object} [opts.properties] See {@link https://docs.atlassian.com/jira/REST/latest/#d2e611}
   * @param [callback] Called when data has been retrieved
   * @return {Promise} Resolved when data has been retrieved
   */
  this.getIssue = function(opts, callback) {
    if (!opts.agile) {
      var options = this.buildRequestOptions(opts, '', 'GET');
    } else {
      var endpoint = '/issue/' + (opts.issueId || opts.issueKey);
      var options = {
        uri: this.jiraClient.buildAgileURL(endpoint),
        method: 'GET',
        qs: opts.qs
      };
    }

    return this.jiraClient.makeRequest(options, callback);
  };

  /**
   *  Edits an issue from a JSON representation.
   *
   * The issue can either be updated by setting explicit the field value(s) or by using an operation to change the
   * field value.
   *
   * The fields that can be updated, in either the fields parameter or the update parameter, can be determined using
   * the {@link IssueClient#getEditMetadata} method. If a field is not configured to appear on the edit
   * screen, then it will not be in the editmeta, and a field validation error will occur if it is submitted.
   *
   * Specifying a "field_id": field_value in the "fields" is a shorthand for a "set" operation in the "update"
   * section. Field should appear either in "fields" or "update", not in both.
   *
   * @method editIssue
   * @memberof IssueClient#
   * @param {Object} opts The options to pass to the API.  Note that this object must contain EITHER an issueId or
   *        issueKey property; issueId will be used over issueKey if both are present.
   * @param {string} [opts.issueId] The id of the issue.  EX: 10002
   * @param {string} [opts.issueKey] The Key of the issue.  EX: JWR-3
   * @param {boolean} [opts.notifyUsers]
   * @param {boolean} [opts.overrideScreenSecurity]
   * @param {boolean} [opts.overrideEditableFlag]
   * @param {Object} [opts.issue] See {@link https://docs.atlassian.com/jira/REST/latest/#d2e656}
   * @param {Object} [opts.issue.transition]
   * @param {Object} [opts.issue.fields]
   * @param {Object} [opts.issue.update]
   * @param {Object} [opts.issue.historyMetadata]
   * @param {Object} [opts.issue.properties]
   * @param {callback} [callback] Called when data has been retrieved
   * @return {Promise} Resolved when data has been retrieved
   */
  this.editIssue = function(opts, callback) {
    var options = {
      uri: this.jiraClient.buildURL('/issue/' + (opts.issueId || opts.issueKey)),
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: opts.issue || opts.body
    };

    return this.jiraClient.makeRequest(options, callback, 'Issue Updated');
  };

  /**
   * Get a list of the transitions possible for this issue by the current user, along with fields that are required
   * and their types.
   *
   * Fields will only be returned if ```expand=transitions.fields.```
   *
   * The fields in the metadata correspond to the fields in the transition screen for that transition. Fields not in
   * the screen will not be in the metadata.
   *
   * @method getTransitions
   * @memberof IssueClient#
   * @param {Object} opts The options to pass to the API.  Note that this object must contain EITHER an issueId or
   *     issueKey property; issueId will be used over issueKey if both are present.
   * @param {string} [opts.issueId] The id of the issue.  EX: 10002
   * @param {string} [opts.issueKey] The Key of the issue.  EX: JWR-3
   * @param {string} opts.transitionId If specified, will call back with only the transition with the specified id.
   * @param [callback] Called when the transitions are retrieved.
   * @return {Promise} Resolved when the transitions are retrieved.
   */
  this.getTransitions = function(opts, callback) {
    var options = this.buildRequestOptions(opts, '/transitions', 'GET', null, { transitionId: opts.transitionId });

    return this.jiraClient.makeRequest(options, callback);
  };

  /**
   * Perform a transition on an issue. When performing the transition you can udate or set other issue fields.
   *
   * The fields that can be set on transtion, in either the fields parameter or the update parameter can be
   * determined using the** /rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields resource**. If a
   * field is not configured to appear on the transition screen, then it will not be in the transition metadata, and
   * a field validation error will occur if it is submitted.
   *
   * @method transitionIssue
   * @memberof IssueClient#
   * @param {Object} opts The options to pass to the API.  Note that this object must contain EITHER an issueId or
   *     issueKey property; issueId will be used over issueKey if both are present.
   * @param {string} [opts.issueId] The id of the issue.  EX: 10002
   * @param {string} [opts.issueKey] The Key of the issue.  EX: JWR-3
   * @param {object} [opts.transition] See {@link https://docs.atlassian.com/jira/REST/latest/#d2e698}
   * @param {string} [opts.transition.id] The ID of the issue transition. Required when specifying a transition to undertake. 
   * @param [callback] Called when the transitions are retrieved.
   * @return {Promise} Resolved when the transitions are retrieved.
   */
  this.transitionIssue = function(opts, callback) {
    var options;
    if (!opts.transition.transition) { // To keep backwards compatibility
      options = this.buildRequestOptions(opts, '/transitions', 'POST', opts);
    } else {
      options = this.buildRequestOptions(opts, '/transitions', 'POST', opts.transition)
    }
    return this.jiraClient.makeRequest(options, callback, 'Issue Transitioned');
  };

  /**
   * Gets all work logs for an issue.
   *
   * @method getWorkLogs
   * @memberOf IssueClient#
   * @param {Object} opts The options to pass to the API.  Note that this object must contain EITHER an issueId or
   *     issueKey property; issueId will be used over issueKey if both are present.
   * @param {string} [opts.issueId] The id of the issue.  EX: 10002
   * @param {string} [opts.issueKey] The Key of the issue.  EX: JWR-3
   * @param [callback] Called after the worklogs are retrieved.
   * @return {Promise} Resolved after the worklogs are retrieved.
   */
  this.getWorkLogs = function(opts, callback) {
    var options = this.buildRequestOptions(opts, '/worklog', 'GET');

    return this.jiraClient.makeRequest(options, callback);
  };

  this.getAllWorkLogs = async function(opts, callback, worklogs = null) {
    if (worklogs == null || !worklogs) {
      worklogs = [];
    }

    const response = await this.getWorkLogs(opts);
    const { worklogs: current, startAt, maxResults, total } = response;

    worklogs.push(...current);
    let nextStartAt = startAt + maxResults
    if (nextStartAt < total) {
      opts.startAt = nextStartAt;
      opts.maxResults = maxResults;
      return this.getAllWorkLogs(opts, callback, worklogs);
    } else {
      return worklogs;
    }
  }

  /**
   * Gets a specific worklog.
   *
   * @method getWorkLog
   * @memberOf IssueClient#
   * @param {Object} opts The options to pass to the API.  Note that this object must contain EITHER an issueId or
   *     issueKey property; issueId will be used over issueKey if both are present.
   * @param {string} [opts.issueId] The id of the issue.  EX: 10002
   * @param {string} [opts.issueKey] The Key of the issue.  EX: JWR-3
   * @param {string} opts.id The id of the work log to retrieve.
   * @param [callback] Called after the worklog is retrieved.
   * @return {Promise} Resolved after the worklog is retrieved.
   */
  this.getWorkLog = function(opts, callback) {
    var options = {
      uri: this.jiraClient.buildURL('/issue/' + (opts.issueId || opts.issueKey) + '/worklog/' + (opts.id || opts.worklogId)),
      method: 'GET',
      qs: {
        expand: opts.expand
      }
    };

    return this.jiraClient.makeRequest(options, callback);
  };

  /**
   * Build out the request options necessary to make a particular API call.
   *
   * @private
   * @method buildRequestOptions
   * @param {Object} opts The arguments passed to the method.
   * @param {string} path The path of the endpoint following /issue/{idOrKey}
   * @param {string} method The request method.
   * @param {Object} [body] The request body, if any.
   * @param {Object} [qs] The querystring, if any.  opts.expand and opts.fields arrays will be automagically added.
   * @returns {{uri: string, method: string, body: Object, qs: Object, followAllRedirects: boolean, json: boolean}}
   */
  this.buildRequestOptions = function(opts, path, method, body, qs) {
    if (!opts.issueId && !opts.issueKey) {
      throw new Error("NO_ISSUE_IDENTIFIER");
    }
    var idOrKey = opts.issueId || opts.issueKey;
    var basePath = '/issue/' + idOrKey;
    // if (!qs) qs = {};
    // if (!body) body = {};

    if (opts.fields) {
      qs.fields = '';
      opts.fields.forEach(function(field) {
          qs.fields += field + ','
      });
    }

    if (opts.expand) {
      qs.expand = '';
      opts.expand.forEach(function(ex) {
          qs.expand += ex + ','
      });
    }

    if (opts.properties) {
      qs.properties = '';
      opts.properties.forEach(function(prop) {
          qs.properties += prop + ','
      });
    }

    let options = {
      uri: this.jiraClient.buildURL(basePath + path),
      method: method
    }
    if (qs) {
      options.qs = qs;
    }
    if (body && method != "GET" && method != "PUT") {
      options.body = body;
    }

    return options;
  }
}