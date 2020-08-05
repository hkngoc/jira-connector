"use strict";

module.exports = VersionClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/version'
 * @param {JiraClient} jiraClient
 * @constructor VersionClient
 */
function VersionClient(jiraClient) {
    this.jiraClient = jiraClient;

    /**
     * Get a project version.
     *
     * @method getVersion
     * @memberOf VersionClient#
     * @param {Object} opts The request options sent to the Jira API.
     * @param {string|number} opts.versionId The id of the version to retrieve.
     * @param {callback} [callback] Called when the version is retrieved.
     * @return {Promise} Resolved when the version is retrieved.
     */
    this.getVersion = function (opts, callback) {
        var options = this.buildRequestOptions(opts, '', 'GET');
        return this.jiraClient.makeRequest(options, callback);
    };

    /**
     * Build out the request options necessary to make a particular API call.
     *
     * @private
     * @method buildRequestOptions
     * @memberOf FilterClient#
     * @param {Object} opts The arguments passed to the method.
     * @param {number} opts.versionId The id of the screen to use in the path.
     * @param {Array} [opts.fields] The fields to include
     * @param {Array} [opts.expand] The fields to expand
     * @param {string} path The path of the endpoint following /version/{id}
     * @param {string} method The request method.
     * @param {Object} [body] The request body, if any.
     * @param {Object} [qs] The querystring, if any.  opts.expand and opts.fields arrays will be automagically added.
     * @returns {{uri: string, method: string, body: Object, qs: Object, followAllRedirects: boolean, json: boolean}}
     */
    this.buildRequestOptions = function (opts, path, method, body, qs) {
        var basePath = '/version/' + opts.versionId;
        if (!qs) qs = {};
        if (!body) body = {};

        if (opts.fields) {
            qs.fields = '';
            opts.fields.forEach(function (field) {
                qs.fields += field + ','
            });
            qs.fields = qs.fields.slice(0, -1);
        }

        if (opts.expand) {
            qs.expand = '';
            opts.expand.forEach(function (ex) {
                qs.expand += ex + ','
            });
            qs.expand = qs.expand.slice(0, -1);
        }

        let options = {
            uri: this.jiraClient.buildURL(basePath + path),
            method: method
        }
        if (qs) {
            options.qs = qs;
        }
        if (body && method != "GET" && method != "PUT") {
            qs.body = body;
        }

        return options;
    };
}
