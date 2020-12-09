const i=require("./api/auth"),t=require("./api/board"),e=require("./api/issue"),s=require("./api/issueLinkType"),r=require("./api/priority"),o=require("./api/project"),h=require("./api/search"),n=require("./api/sprint"),p=require("./api/user"),a=require("./api/version"),u=function(u){if(!u.host)throw new Error("NO_HOST_ERROR");this.host=u.host,this.timeout=u.timeout,this.protocol=u.protocol?u.protocol:"https",this.path_prefix=u.path_prefix?u.path_prefix:"/",this.port=u.port,this.apiVersion=u.apiVersion||2,this.agileApiVersion="1.0",this.authApiVersion="1",this.webhookApiVersion="1.0",this.promise=u.promise||Promise,this.auth=new i(this),this.board=new t(this),this.issue=new e(this),this.issueLinkType=new s(this),this.priority=new r(this),this.project=new o(this),this.search=new h(this),this.sprint=new n(this),this.user=new p(this),this.version=new a(this)};(function(){this.buildURL=function(i,t){const e=this.path_prefix+"rest/api/"+(t||this.apiVersion)+i,{protocol:s,host:r}=this;return decodeURIComponent(`${s}://${r}${e}`)},this.buildAgileURL=function(i,t){const e=this.path_prefix+"rest/agile/"+(t||this.agileApiVersion)+i,{protocol:s,host:r}=this;return decodeURIComponent(`${s}://${r}${e}`)},this.buildAuthURL=function(i,t){const e=this.path_prefix+"rest/auth/"+(t||this.authApiVersion)+i,{protocol:s,host:r}=this;return decodeURIComponent(`${s}://${r}${e}`)},this.makeRequest=async function(i,t){const e={method:i.method||"GET",uri:i.uri};if(i.qs){const t=Object.keys(i.qs).map(t=>encodeURIComponent(t)+"="+encodeURIComponent(i.qs[t])).join("&");e.uri=`${i.uri}?${t}`}i.body&&(e.body=JSON.stringify(i.body));const{uri:s,...r}=e;try{const i=await fetch(s,r),e=parser?await parser(i):await i.json();return t&&t(e),Promise.resolve(e)}catch(i){return Promise.reject(i)}}}).call(u.prototype);export default u;
