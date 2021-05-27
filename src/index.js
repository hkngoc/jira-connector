"use strict";

const auth          = require('./api/auth');
const board         = require('./api/board');
const issue         = require('./api/issue');
const issueLinkType = require('./api/issueLinkType');
const priority      = require('./api/priority');
const project       = require('./api/project');
const search        = require('./api/search');
const sprint        = require('./api/sprint');
const user          = require('./api/user');
const version       = require('./api/version');

const JiraClient = function (config) {
  if (!config.host) {
    throw new Error("NO_HOST_ERROR");
  }

  this.host              = config.host;
  this.timeout           = config.timeout;
  this.protocol          = config.protocol ? config.protocol : 'https';
  this.path_prefix       = config.path_prefix ? config.path_prefix : '/';
  this.port              = config.port;
  this.apiVersion        = config.apiVersion || 2;
  this.agileApiVersion   = '1.0';
  this.authApiVersion    = '1';
  this.webhookApiVersion = '1.0';
  this.promise           = config.promise || Promise;

  this.auth          = new auth(this);
  this.board         = new board(this);
  this.issue         = new issue(this);
  this.issueLinkType = new issueLinkType(this);
  this.priority      = new priority(this);
  this.project       = new project(this);
  this.search        = new search(this);
  this.sprint        = new sprint(this);
  this.user          = new user(this);
  this.version       = new version(this);
};

(function() {
  this.buildURL = function(path, forcedVersion) {
    const apiBasePath = this.path_prefix + 'rest/api/';
    const version = forcedVersion || this.apiVersion;
    const pathname = apiBasePath + version + path;
    const { protocol, host } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  };

  this.buildAgileURL = function (path, forcedVersion) {
    const apiBasePath = this.path_prefix + 'rest/agile/';
    const version = forcedVersion || this.agileApiVersion;
    const pathname = apiBasePath + version + path;
    const { protocol, host } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  };

  this.buildAuthURL = function (path, forcedVersion) {
    const apiBasePath = this.path_prefix + 'rest/auth/';
    const version = forcedVersion || this.authApiVersion;
    const pathname = apiBasePath + version + path;
    const { protocol, host } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  };

  this.makeRequest = async function(options, callback) {
    const opts = {
      method: options.method || 'GET',
      uri: options.uri
    }

    if (options.qs) {
      const query = Object.keys(options.qs)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options.qs[k]))
        .join('&');
      opts.uri = `${options.uri}?${query}`;
    }

    if (options.headers) {
      opts.headers = options.headers;
    }

    if (options.body) {
      opts.body = JSON.stringify(options.body);
    }

    const { uri, ...rest } = opts;
    const { parser } = options;

    try {
      const response = await fetch(uri, rest);
      const json = parser ? (await parser(response)) : (await response.json());
      if (callback) {
        callback(json);
      }
      return Promise.resolve(json);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}).call(JiraClient.prototype);

export default JiraClient;
