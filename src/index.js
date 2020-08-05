"use strict";

const auth = require('./api/auth');
const board = require('./api/board');
const dev = require('./api/dev');
const issue = require('./api/issue');
const priority = require('./api/priority');
const project = require('./api/project');
const search = require('./api/search');
const sprint = require('./api/sprint');
const user = require('./api/user');
const xray = require('./api/xray');

const JiraClient = module.exports = function (config) {
  if (!config.host) {
    throw new Error(errorStrings.NO_HOST_ERROR);
  }

  this.host = config.host;
  this.timeout = config.timeout;
  this.protocol = config.protocol ? config.protocol : 'https';
  this.path_prefix = config.path_prefix ? config.path_prefix : '/';
  this.port = config.port;

  this.apiVersion = 2;
  this.agileApiVersion = '1.0';
  this.authApiVersion = '1';
  this.webhookApiVersion = '1.0';
  // Tempo rest api
  this.hungerApiVersion = '1.0';
  this.devApiVersion = '1.0';
  // XRAY rest api
  this.ravenApiVersion = '1.0';

  this.promise = config.promise || Promise;
  this.requestLib = config.requestLib;

  this.auth = new auth(this);
  this.board = new board(this);
  this.dev = new dev(this);
  this.issue = new issue(this);
  this.priority = new priority(this);
  this.project = new project(this);
  this.search = new search(this);
  this.sprint = new sprint(this);
  this.user = new user(this);
  this.xray = new xray(this);
};

(function () {
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

  this.buildHungerURL = function(path, forcedVersion) {
    const apiBasePath = this.path_prefix + 'rest/hunger/';
    const version = forcedVersion || this.hungerApiVersion;
    const pathname = apiBasePath + version + path;
    const { protocol, host } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  };

  this.buildDevURL = function(path, forcedVersion) {
    const apiBasePath = this.path_prefix + 'rest/dev-status/';
    const version = forcedVersion || this.devApiVersion;
    const pathname = apiBasePath + version + path;
    const { protocol, host } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  };

  this.buildRavenURL = function(path, forcedVersion) {
    const apiBasePath = this.path_prefix + 'rest/raven/';
    const version = forcedVersion || this.ravenApiVersion;
    const pathname = apiBasePath + version + path;
    const { protocol, host } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  };

  this.makeRequest = function(options, callback) {
    if (this.requestLib) {
      return this.requestLib(options, callback);
    }

    const { method } = options;
    let opts = {
      method: method
    }

    if (options.headers) {
      opts.headers = options.headers;
    }

    if (options.qs) {
      let query = Object.keys(options.qs)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options.qs[k]))
       .join('&');
      options.uri = `${options.uri}?${query}`;
    }

    if (options.body) {
      opts.body = JSON.stringify(options.body);
    }

    const { uri, parser } = options;

    if (callback) {
      return fetch(uri, opts)
        .then(response => parser ? parser(response) : response.json())
        .then(result => callback(null, result))
        .catch(e => callback(e));
    } else {
      return fetch(uri, opts)
        .then(response => parser ? parser(response) : response.json())
        .then(result => Promise.resolve(result))
        .catch(e => Promise.reject(e));
    }
  };
}).call(JiraClient.prototype);
