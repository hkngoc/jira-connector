!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t=t||self).JiraClient=i()}(this,(function(){"use strict";function t(t){this.jiraClient=t,this.currentUser=function(t){var i={uri:this.jiraClient.buildAuthURL("/session"),method:"GET"};return this.jiraClient.makeRequest(i,t)}}var i=function(t){this.jiraClient=t,this.getSprintsForBoard=function(t,i){const e={uri:this.jiraClient.buildAgileURL("/board/"+t.boardId+"/sprint")},s={};return t.startAt&&(s.startAt=t.startAt),t.maxResults&&(s.maxResults=t.maxResults),t.state&&(s.state=t.state),e.qs=s,this.jiraClient.makeRequest(e,i)},this.getAllSprintsForBoard=async function(t,i,e=null){null!=e&&e||(e=[]);const s=await this.getSprintsForBoard(t),{values:n,maxResults:r,startAt:o,isLast:a}=s;if(e.push(...n),!a){const s=o+r;return t.startAt=s,t.maxResults=r,this.getAllSprintsForBoard(t,i,e)}if(!i)return e;i(e)}};var e=function(t){this.jiraClient=t,this.createIssue=function(t,i){var e={uri:this.jiraClient.buildURL("/issue"),method:"POST",body:t,headers:{Accept:"application/json","Content-Type":"application/json"}};return this.jiraClient.makeRequest(e,i)},this.getCreateMetadata=function(t,i){var e={uri:this.jiraClient.buildURL("/issue/createmeta"),method:"GET",qs:t};return this.jiraClient.makeRequest(e,i)},this.getIssue=function(t,i){if(t.agile){var e="/issue/"+(t.issueId||t.issueKey);s={uri:this.jiraClient.buildAgileURL(e),method:"GET",qs:t.qs}}else var s=this.buildRequestOptions(t,"","GET");return this.jiraClient.makeRequest(s,i)},this.editIssue=function(t,i){var e={uri:this.jiraClient.buildURL("/issue/"+(t.issueId||t.issueKey)),method:"PUT",headers:{Accept:"application/json","Content-Type":"application/json"},body:t.issue||t.body};return this.jiraClient.makeRequest(e,i,"Issue Updated")},this.getTransitions=function(t,i){var e=this.buildRequestOptions(t,"/transitions","GET",null,{transitionId:t.transitionId});return this.jiraClient.makeRequest(e,i)},this.transitionIssue=function(t,i){var e;return e=t.transition.transition?this.buildRequestOptions(t,"/transitions","POST",t.transition):this.buildRequestOptions(t,"/transitions","POST",t),this.jiraClient.makeRequest(e,i,"Issue Transitioned")},this.getWorkLogs=function(t,i){var e=this.buildRequestOptions(t,"/worklog","GET");return this.jiraClient.makeRequest(e,i)},this.getAllWorkLogs=async function(t,i,e=null){null!=e&&e||(e=[]);const s=await this.getWorkLogs(t),{worklogs:n,startAt:r,maxResults:o,total:a}=s;e.push(...n);let u=r+o;return u<a?(t.startAt=u,t.maxResults=o,this.getAllWorkLogs(t,i,e)):e},this.getWorkLog=function(t,i){var e={uri:this.jiraClient.buildURL("/issue/"+(t.issueId||t.issueKey)+"/worklog/"+(t.id||t.worklogId)),method:"GET",qs:{expand:t.expand}};return this.jiraClient.makeRequest(e,i)},this.buildRequestOptions=function(t,i,e,s,n){if(!t.issueId&&!t.issueKey)throw new Error("NO_ISSUE_IDENTIFIER");var r="/issue/"+(t.issueId||t.issueKey);t.fields&&(n.fields="",t.fields.forEach((function(t){n.fields+=t+","}))),t.expand&&(n.expand="",t.expand.forEach((function(t){n.expand+=t+","}))),t.properties&&(n.properties="",t.properties.forEach((function(t){n.properties+=t+","})));let o={uri:this.jiraClient.buildURL(r+i),method:e};return n&&(o.qs=n),s&&"GET"!=e&&"PUT"!=e&&(n.body=s),o}};function s(t){this.jiraClient=t,this.getAvailableTypes=function(t,i){var e={uri:this.jiraClient.buildURL("/issueLinkType"),method:"GET"};return this.jiraClient.makeRequest(e,i)}}var n=function(t){this.jiraClient=t,this.getAllPriorities=function(t,i){var e={uri:this.jiraClient.buildURL("/priority"),method:"GET"};return this.jiraClient.makeRequest(e,i)},this.getPriority=function(t,i){var e={uri:this.jiraClient.buildURL("/priority/"+t.priorityId),method:"GET"};return this.jiraClient.makeRequest(e,i)}};var r=function(t){this.jiraClient=t,this.getAllProjects=function(t,i){t=t||{};var e={uri:this.jiraClient.buildURL("/project",t.apiVersion),method:"GET",followAllRedirects:!0,json:!0,qs:{expand:t.expand,recent:t.recent,properties:t.properties&&t.properties.join(",")}};return this.jiraClient.makeRequest(e,i)},this.getProjectProperties=function(t,i){var e=this.buildRequestOptions(t,"/properties","GET");return this.jiraClient.makeRequest(e,i)},this.getProject=function(t,i){var e=this.buildRequestOptions(t,"","GET");return this.jiraClient.makeRequest(e,i)},this.getComponents=function(t,i){var e=this.buildRequestOptions(t,"/components","GET");return this.jiraClient.makeRequest(e,i)},this.getStatuses=function(t,i){var e=this.buildRequestOptions(t,"/statuses","GET");return this.jiraClient.makeRequest(e,i)},this.getVersions=function(t,i){var e=this.buildRequestOptions(t,"/versions","GET");return this.jiraClient.makeRequest(e,i)},this.buildRequestOptions=function(t,i,e,s,n){var r=(t=t||{}).projectIdOrKey?"/project/"+t.projectIdOrKey:"/project";t.fields&&(n.fields="",t.fields.forEach((function(t){n.fields+=t+","})),n.fields=n.fields.slice(0,-1)),t.expand&&(n.expand="",t.expand.forEach((function(t){n.expand+=t+","})),n.expand=n.expand.slice(0,-1));let o={uri:this.jiraClient.buildURL(r+i),method:e};return n&&(o.qs=n),s&&"GET"!=e&&"PUT"!=e&&(n.body=s),o}};var o=function(t){this.jiraClient=t,this.search=function(t,i){let e={uri:this.jiraClient.buildURL("/search"),method:t.method,headers:{"Content-Type":"application/json"}},s=("POST"==t.method?t.fields:t.fields&&t.fields.join(","),"POST"==t.method?t.expand:t.expand&&t.expand.join(","),"POST"==t.method?t.properties:t.properties&&e.properties.join(","),{jql:t.jql});return t.startAt&&(s.startAt=t.startAt),t.maxResults&&(s.maxResults=t.maxResults),t.fields&&(s.fields=t.fields),t.expand&&(s.expand=t.expand),"POST"==t.method?e.body=s:e.qs=s,this.jiraClient.makeRequest(e,i)},this.searchAll=async function(t,i,e,s,n=null){null!=n&&n||(n=[]);let r=await this.search(t),{issues:o=[],startAt:a,maxResults:u,total:h}=r;s&&"function"==typeof s&&(o=o.filter(t=>s(t))),e&&"function"==typeof e&&(o=o.map(t=>e(t))),n.push(...o),i&&i(a+u,h);let l=a+u;return l<h?(t.startAt=l,t.maxResults=u,this.searchAll(t,i,e,s,n)):n}};var a=function(t){this.jiraClient=t,this.moveSprintIssues=function(t,i){const{sprintId:e,body:s}=t,n={uri:this.jiraClient.buildAgileURL("/sprint/"+e+"/issue"),method:"POST",headers:{"Content-Type":"application/json"},body:s};return this.jiraClient.makeRequest(n,i)}};var u=function(t){this.jiraClient=t,this.getUser=function(t,i){var e={uri:this.jiraClient.buildURL("/user"),method:"GET",qs:t.qs};return t.expand&&(e.qs.expand="",t.expand.forEach((function(t){e.qs.expand+=t+","}))),this.jiraClient.makeRequest(e,i)}};var h=function(t){this.jiraClient=t,this.getVersion=function(t,i){var e=this.buildRequestOptions(t,"","GET");return this.jiraClient.makeRequest(e,i)},this.buildRequestOptions=function(t,i,e,s,n){var r="/version/"+t.versionId;n||(n={}),s||(s={}),t.fields&&(n.fields="",t.fields.forEach((function(t){n.fields+=t+","})),n.fields=n.fields.slice(0,-1)),t.expand&&(n.expand="",t.expand.forEach((function(t){n.expand+=t+","})),n.expand=n.expand.slice(0,-1));let o={uri:this.jiraClient.buildURL(r+i),method:e};return n&&(o.qs=n),s&&"GET"!=e&&"PUT"!=e&&(n.body=s),o}};const l=function(l){if(!l.host)throw new Error("NO_HOST_ERROR");this.host=l.host,this.timeout=l.timeout,this.protocol=l.protocol?l.protocol:"https",this.path_prefix=l.path_prefix?l.path_prefix:"/",this.port=l.port,this.apiVersion=l.apiVersion||2,this.agileApiVersion="1.0",this.authApiVersion="1",this.webhookApiVersion="1.0",this.promise=l.promise||Promise,this.requestLib=l.requestLib,this.auth=new t(this),this.board=new i(this),this.issue=new e(this),this.issueLinkType=new s(this),this.priority=new n(this),this.project=new r(this),this.search=new o(this),this.sprint=new a(this),this.user=new u(this),this.version=new h(this)};return function(){this.buildURL=function(t,i){const e=this.path_prefix+"rest/api/"+(i||this.apiVersion)+t,{protocol:s,host:n}=this;return decodeURIComponent(`${s}://${n}${e}`)},this.buildAgileURL=function(t,i){const e=this.path_prefix+"rest/agile/"+(i||this.agileApiVersion)+t,{protocol:s,host:n}=this;return decodeURIComponent(`${s}://${n}${e}`)},this.buildAuthURL=function(t,i){const e=this.path_prefix+"rest/auth/"+(i||this.authApiVersion)+t,{protocol:s,host:n}=this;return decodeURIComponent(`${s}://${n}${e}`)},this.makeRequest=function(t,i){if(this.requestLib)return this.requestLib(t,i);const{method:e}=t;let s={method:e};if(t.headers&&(s.headers=t.headers),t.qs){let i=Object.keys(t.qs).map(i=>encodeURIComponent(i)+"="+encodeURIComponent(t.qs[i])).join("&");t.uri=`${t.uri}?${i}`}t.body&&(s.body=JSON.stringify(t.body));const{uri:n,parser:r}=t;return i?fetch(n,s).then(t=>r?r(t):t.json()).then(t=>i(null,t)).catch(t=>i(t)):fetch(n,s).then(t=>r?r(t):t.json()).then(t=>Promise.resolve(t)).catch(t=>Promise.reject(t))}}.call(l.prototype),l}));
