"use strict";

module.exports = XrayClient;

/**
 * Used to access Jira REST endpoints in '/rest/raven/1.0/'
 *
 * @param {XrayClient} jiraClient
 * @constructor XrayClient
 */
function XrayClient(jiraClient) {
  this.jiraClient = jiraClient;

  this.testExecutions = function (opts, callback) {
    let options = {
      uri: this.jiraClient.buildRavenURL(`/test/${opts.issueId || opts.issueKey}/testrun`),
      method: 'GET',
      qs: opts.qs ? opts.qs : ''
    };

    return this.jiraClient.makeRequest(options, callback);
  };

  this.allTestExecutions = async function (opts, callback, tests) {
    if (tests == null || !tests) {
      tests = [];
    }

    let response = await this.testExecutions(opts);
    const { entries, iDisplayLength, iDisplayStart = 0, iTotalRecords } = response;

    tests.push(...entries);

    if (iDisplayStart + iDisplayLength >= iTotalRecords) {
      return tests;
    } else {
      if (!opts.qs) {
        opts.qs = {};
      }
      // hack
      opts.qs.bSsaveEntries = true;
      opts.qs.iDisplayStart = (iDisplayStart || 0) + iDisplayLength;
      opts.qs.iDisplayLength = iDisplayLength;

      return this.allTestExecutions(opts, callback, tests);
    }
  };

  this.testruns = function (opts, callback) {
    let options = {
      uri: this.jiraClient.buildRavenURL(`/testruns`),
      method: 'GET',
      qs: opts.qs ? opts.qs : ''
    };

    return this.jiraClient.makeRequest(options, callback);
  };

  this.getAllTestRuns = async function (opts, callback, trs) {
    if (trs == null || !trs) {
      trs = [];
    }

    try {
      let response = await this.testruns(opts);
      trs.push(...response);

      opts.qs.page = opts.qs.page + 1;

      return this.getAllTestRuns(opts, callback, trs);
    } catch(e) {
      console.log(e);
      return trs;
    }
  };

  this.allTestRuns = async function(opts, callback) {
    try {
      return await this.testruns(opts, callback);
    } catch(e) {
      if (!opts.qs) {
        opts.qs = {};
      }
      if (!opts.qs.page) {
        opts.qs.page = 1;
      }
      return this.getAllTestRuns(opts, callback);
    }
  };

  this.associateTestToTestPlan = async function(opts, callback) {
    const options = {
      uri: this.jiraClient.buildRavenURL(`/test/${opts.issueId || opts.issueKey}/testplans`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: opts.body ? opts.body : null
    };

    return this.jiraClient.makeRequest(options, callback);
  }
}
