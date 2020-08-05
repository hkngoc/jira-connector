"use strict";

module.exports = DevClient;

function DevClient(jiraClient) {
  this.jiraClient = jiraClient;

  this.detail = function (opts, callback) {
    const { qs } = opts

    let options = {
      uri: this.jiraClient.buildDevURL('/issue/detail'),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      qs: qs
    };

    return this.jiraClient.makeRequest(options, callback);
  };
}
