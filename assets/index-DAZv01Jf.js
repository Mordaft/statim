var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l={BASE_URL:`./`,DEV:!1,MODE:`production`,PROD:!0,SSR:!1},u=Number(l.VITE_TIME_SCALE)>0?Number(l.VITE_TIME_SCALE):1,d=e=>Math.round(e*u),f=(l.VITE_STUN_URLS??`stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302`).split(`,`).map(e=>e.trim()).filter(Boolean),p=f.length?[{urls:f}]:[];l.VITE_TURN_URL&&p.push({urls:l.VITE_TURN_URL,username:l.VITE_TURN_USERNAME,credential:l.VITE_TURN_CREDENTIAL});var m={confluenceBaseUrl:l.VITE_CONFLUENCE_BASE_URL??``,pageId:l.VITE_CONFLUENCE_PAGE_ID??``,iceServers:p,meteredDomain:l.VITE_METERED_DOMAIN??``,meteredApiKey:l.VITE_METERED_API_KEY??``,seedRotationMs:36e5,seedGraceMs:6e5,announceTtlMs:42e5,fastPollMs:d(1e4),idlePollMs:d(6e4),dailyFastRequestBudget:100,startupFastPollMs:d(12e4),fastHoldMs:d(8e4),answerTimeoutMs:d(15e4),signalBatchDelayMs:d(1500),signalTtlMs:3e5,maxPollBackoffMs:d(3e5),maxPeers:20,historyWindowMs:36e6,historyMaxBytes:131072},h=o((e=>{e.hashU32=function(e){return e|=0,e=e+2127912214+(e<<12)|0,e=e^-949894596^e>>>19,e=e+374761393+(e<<5)|0,e=e+-744332180^e<<9,e=e+-42973499+(e<<3)|0,e^-1252372727^e>>>16},e.readU64=function(e,t){var n=0;return n|=e[t++]|0,n|=e[t++]<<8,n|=e[t++]<<16,n|=e[t++]<<24,n|=e[t++]<<32,n|=e[t++]<<40,n|=e[t++]<<48,n|=e[t++]<<56,n},e.readU32=function(e,t){var n=0;return n|=e[t++]|0,n|=e[t++]<<8,n|=e[t++]<<16,n|=e[t++]<<24,n},e.writeU32=function(e,t,n){e[t++]=(n|0)&255,e[t++]=n>>8&255,e[t++]=n>>16&255,e[t++]=n>>24&255},e.imul=function(e,t){var n=e>>>16,r=e&65535,i=t>>>16,a=t&65535;return r*a+(n*a+r*i<<16)|0}})),g=o((e=>{var t=h(),n=2654435761,r=2246822519,i=3266489917,a=668265263,o=374761393;function s(e,t){return e|=0,t|=0,e>>>(32-t|0)|e<<t}function c(e,n,r){return e|=0,n|=0,r|=0,t.imul(e>>>(32-n|0)|e<<n,r)|0}function l(e,t){return e|=0,t|=0,e>>>t^e}function u(e,n,r,i,a){return c(t.imul(n,r)+e,i,a)}function d(e,r,i){return c(e+t.imul(r[i],o),11,n)}function f(e,n,r){return u(e,t.readU32(n,r),i,17,a)}function p(e,i,a){return[u(e[0],t.readU32(i,a+0),r,13,n),u(e[1],t.readU32(i,a+4),r,13,n),u(e[2],t.readU32(i,a+8),r,13,n),u(e[3],t.readU32(i,a+12),r,13,n)]}function m(e,a,c,u){var m,h=u;if(u>=16){for(m=[e+n+r,e+r,e,e-n];u>=16;)m=p(m,a,c),c+=16,u-=16;m=s(m[0],1)+s(m[1],7)+s(m[2],12)+s(m[3],18)+h}else m=e+o+u>>>0;for(;u>=4;)m=f(m,a,c),c+=4,u-=4;for(;u>0;)m=d(m,a,c),c++,u--;return m=l(t.imul(l(t.imul(l(m,15),r),13),i),16),m>>>0}e.hash=m})),_=c(o((e=>{var t=g(),n=h(),r=4,i=13,a=5,o=6,s=65536,c=4,l=(1<<c)-1,u=15,d=ne(5<<20),f=ee(),p=407708164,m=4,_=8,v=16,y=64,b=192,x=2147483648,S=7,C=4,w=7,T={4:65536,5:262144,6:1048576,7:4194304};function ee(){try{return new Uint32Array(s)}catch{for(var e=Array(s),t=0;t<s;t++)e[t]=0;return e}}function te(e){for(var t=0;t<s;t++)f[t]=0}function ne(e){try{return new Uint8Array(e)}catch{for(var t=Array(e),n=0;n<e;n++)t[n]=0;return t}}function re(e,t,n){if(typeof e.buffer!==void 0){if(Uint8Array.prototype.slice)return e.slice(t,n);var r=e.length;t|=0,t=t<0?Math.max(r+t,0):Math.min(t,r),n=n===void 0?r:n|0,n=n<0?Math.max(r+n,0):Math.min(n,r);for(var i=new Uint8Array(n-t),a=t,o=0;a<n;)i[o++]=e[a++];return i}return e.slice(t,n)}e.compressBound=function(e){return e+e/255+16|0},e.decompressBound=function(e){var t=0;if(n.readU32(e,t)!==p)throw Error(`invalid magic number`);t+=4;var r=e[t++];if((r&b)!==y)throw Error(`incompatible descriptor version `+(r&b));var i=(r&v)!==0,a=(r&_)!==0,o=e[t++]>>C&w;if(T[o]===void 0)throw Error(`invalid block size `+o);var s=T[o];if(a)return n.readU64(e,t);t++;for(var c=0;;){var l=n.readU32(e,t);if(t+=4,l&x?(l&=~x,c+=l):c+=s,l===0)return c;i&&(t+=4),t+=l}},e.makeBuffer=ne,e.decompressBlock=function(e,t,n,i,a){for(var o,s,c=n+i,l,u;n<c;){var d=e[n++],f=d>>4;if(f>0){if(f===15)for(;f+=e[n],e[n++]===255;);for(l=n+f;n<l;)t[a++]=e[n++]}if(n>=c)break;if(o=d&15,s=e[n++]|e[n++]<<8,o===15)for(;o+=e[n],e[n++]===255;);for(o+=r,u=a-s,l=u+o;u<l;)t[a++]=t[u++]|0}return a},e.compressBlock=function(e,t,s,d,f){var p,m,h,g,_,v,y=0,b=d+s,x;if(m=s,d>=i)for(var S=(1<<o)+3;s+r<b-a;){var C=n.readU32(e,s),w=n.hashU32(C)>>>0;if(w=(w>>16^w)>>>0&65535,p=f[w]-1,f[w]=s+1,p<0||s-p>>>16>0||n.readU32(e,p)!==C)_=S++>>o,s+=_;else{for(S=(1<<o)+3,v=s-m,g=s-p,s+=r,p+=r,h=s;s<b-a&&e[s]===e[p];)s++,p++;h=s-h;var T=h<l?h:l;if(v>=u){for(t[y++]=(u<<c)+T,x=v-u;x>=255;x-=255)t[y++]=255;t[y++]=x}else t[y++]=(v<<c)+T;for(var ee=0;ee<v;ee++)t[y++]=e[m+ee];if(t[y++]=g,t[y++]=g>>8,h>=l){for(x=h-l;x>=255;x-=255)t[y++]=255;t[y++]=x}m=s}}if(m===0)return 0;if(v=b-m,v>=u){for(t[y++]=u<<c,x=v-u;x>=255;x-=255)t[y++]=255;t[y++]=x}else t[y++]=v<<c;for(s=m;s<b;)t[y++]=e[s++];return y},e.decompressFrame=function(t,r){var i,a,o,s,c=0,l=0;if(n.readU32(t,c)!==p)throw Error(`invalid magic number`);if(c+=4,s=t[c++],(s&b)!==y)throw Error(`incompatible descriptor version`);if(i=(s&v)!==0,a=(s&m)!==0,o=(s&_)!==0,T[t[c++]>>C&w]===void 0)throw Error(`invalid block size`);for(o&&(c+=8),c++;;){var u=n.readU32(t,c);if(c+=4,u===0)break;if(i&&(c+=4),(u&x)!==0){u&=~x;for(var d=0;d<u;d++)r[l++]=t[c++]}else l=e.decompressBlock(t,r,c,u,l),c+=u}return a&&(c+=4),l},e.compressFrame=function(r,i){var a=0;n.writeU32(i,a,p),a+=4,i[a++]=y,i[a++]=S<<C,i[a]=t.hash(0,i,4,a-4)>>8,a++;var o=T[S],s=r.length,c=0;for(te(f);s>0;){var l=0,u=s>o?o:s;if(l=e.compressBlock(r,d,c,u,f),l>u||l===0){n.writeU32(i,a,2147483648|u),a+=4;for(var m=c+u;c<m;)i[a++]=r[c++];s-=u}else{n.writeU32(i,a,l),a+=4;for(var h=0;h<l;)i[a++]=d[h++];c+=u,s-=u}}return n.writeU32(i,a,0),a+=4,a},e.decompress=function(t,n){var r,i;return n===void 0&&(n=e.decompressBound(t)),r=e.makeBuffer(n),i=e.decompressFrame(t,r),i!==n&&(r=re(r,0,i)),r},e.compress=function(t,n){var r,i;return n===void 0&&(n=e.compressBound(t.length)),r=e.makeBuffer(n),i=e.compressFrame(t,r),i!==n&&(r=re(r,0,i)),r}}))(),1),v=new TextEncoder,y=new TextDecoder;function b(e){return new Uint8Array(_.compress(e))}function x(e,t){let n=new Uint8Array(t),r=_.decompressFrame(e,n);if(!(r>=0&&r<=t))throw Error(`LZ4: tamaño descomprimido excesivo`);return n.slice(0,r)}function S(e){return b(v.encode(e))}function C(e,t){return y.decode(x(e,t))}var w=new TextEncoder,T=w.encode(`statim-msg-v1`);function ee(e){let t=``;for(let n of e)t+=String.fromCharCode(n);return btoa(t)}function te(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}function ne(){return{seedId:crypto.randomUUID(),seed:ee(crypto.getRandomValues(new Uint8Array(32)))}}var re=new Map;function ie(e){let t=re.get(e);return t||(t=crypto.subtle.importKey(`raw`,te(e),`HKDF`,!1,[`deriveKey`]).then(e=>crypto.subtle.deriveKey({name:`HKDF`,hash:`SHA-256`,salt:new Uint8Array,info:T},e,{name:`AES-GCM`,length:256},!1,[`encrypt`,`decrypt`])),re.set(e,t)),t}function ae(e){re.delete(e)}async function oe(e,t){let n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.encrypt({name:`AES-GCM`,iv:n},await ie(e),t);return{iv:n,ct:new Uint8Array(r)}}async function se(e,t,n){return new Uint8Array(await crypto.subtle.decrypt({name:`AES-GCM`,iv:t},await ie(e),n))}async function ce(e){return new Uint8Array(await crypto.subtle.digest(`SHA-256`,w.encode(e)))}var le=`statim-diagnostics`,ue=150,de=Date.now(),fe=[],E=[];function pe(e){return e instanceof Error?{name:e.name,message:e.message,stack:e.stack}:e}function D(e){if(e)return Object.fromEntries(Object.entries(e).filter(([e])=>!/token|authorization|apikey|api_key|meteredApiKey|password|secret|seed|^content$|^patch$|^body$/i.test(e)).map(([e,t])=>[e,pe(t)]))}function O(e,t){let n=D(t),r={at:new Date().toISOString(),event:e,details:n};E.push(r),E.length>ue&&E.shift(),fe.push({step:e,elapsedMs:Date.now()-de,detail:n}),fe.length>ue&&fe.shift(),/error|fail/i.test(e)||n&&`error`in n?console.error(`[Statim] ${r.event}`,r.details??``):/warn/i.test(e)?console.warn(`[Statim] ${r.event}`,r.details??``):console.info(`[Statim] ${r.event}`,r.details??``);try{if(typeof sessionStorage<`u`){let e=JSON.parse(sessionStorage.getItem(le)??`[]`);sessionStorage.setItem(le,JSON.stringify([...e,r].slice(-150)))}}catch{}try{typeof window<`u`&&typeof window.dispatchEvent==`function`&&window.dispatchEvent(new CustomEvent(`statim-trace`,{detail:r}))}catch{}}function me(){return[...fe]}function he(){try{if(typeof sessionStorage<`u`){let e=sessionStorage.getItem(le);if(e)return JSON.parse(e)}}catch{}return[...E]}function ge(){try{if(typeof sessionStorage<`u`){let e=sessionStorage.getItem(le);if(e)return e}}catch{}return JSON.stringify(E)}function _e(){fe.length=0,E.length=0;try{typeof sessionStorage<`u`&&sessionStorage.removeItem(le)}catch{}try{typeof window<`u`&&typeof window.dispatchEvent==`function`&&window.dispatchEvent(new CustomEvent(`statim-trace-cleared`))}catch{}}function k(){let e=he();return e.length===0?`No hay registros guardados.`:e.map(e=>{let t=e.details&&Object.keys(e.details).length>0?` ${JSON.stringify(e.details)}`:``;return`[${e.at}] ${e.event}${t}`}).join(`
`)}function ve(){typeof window<`u`&&(window.__STATIM_DIAGNOSTICS__={trace:O,getTraceEntries:me,getDiagnostics:ge,getDiagnosticsEvents:he,clearDiagnostics:_e,exportLogs:k})}var ye=2,A=45,be=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function xe(e){return be.test(e)}function j(e,t,n){let r=e.replace(/-/g,``);for(let e=0;e<16;e++)t[n+e]=parseInt(r.slice(e*2,e*2+2),16)}function Se(e){let t=Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``);return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Ce(e){let t=new Uint8Array(A+e.ct.length);return t[0]=ye,j(e.packetId,t,1),j(e.seedId,t,17),t.set(e.iv,33),t.set(e.ct,A),t}function we(e,t){if(!(e instanceof ArrayBuffer)||e.byteLength<=A||e.byteLength>t)return null;let n=new Uint8Array(e);return n[0]===ye?{packetId:Se(n.subarray(1,17)),seedId:Se(n.subarray(17,33)),iv:n.slice(33,A),ct:n.slice(A)}:null}var M=`stz1:`,Te=/^[^\s@]+@[^\s@]+$/;function Ee(e,t=256){return typeof e==`string`&&e.length>0&&e.length<=t?e:null}function N(e){let t=Ee(e);return t&&Te.test(t)?t.toLowerCase():null}function De(e){if(!e||typeof e!=`object`)return null;let t=e;if(t.v!==1||typeof t.ts!=`number`)return null;if(t.t===`announce`){let e=N(t.email),n=Ee(t.session,64),r=Ee(t.seedId,64),i=Ee(t.seed,64),a=typeof t.ip==`string`&&t.ip.length<=64?t.ip:null;return!e||!n||!r||!xe(r)||!i||a===null?null:{t:`announce`,v:1,email:e,session:n,ip:a,seedId:r,seed:i,ts:t.ts}}if(t.t===`signals`){let e=N(t.from),n=Ee(t.fromSession,64);if(!e||!n||!Array.isArray(t.items)||t.items.length>20)return null;let r=[];for(let e of t.items){if(!e||typeof e!=`object`)return null;let t=e,n=N(t.to),i=Ee(t.toSession,64),a=t.kind===`offer`||t.kind===`answer`?t.kind:null;if(!n||!i||!a)return null;r.push({to:n,toSession:i,kind:a,data:t.data})}return{t:`signals`,v:1,from:e,fromSession:n,items:r,ts:t.ts}}return null}var Oe=class{#e;#t=[];#n=0;#r=0;#i=!1;#a=!1;#o;constructor(e){this.#e=e}schedule(e,t=!1){return new Promise((n,r)=>{if(this.#a){r(Error(`RateLimiter cerrado`));return}let i={run:e,urgent:typeof t==`function`?t:()=>t,resolve:n,reject:r},a=this.#t.findIndex(e=>!e.urgent());i.urgent()&&a>=0?this.#t.splice(a,0,i):this.#t.push(i),this.pump()})}penalize(e){this.#r=Math.max(this.#r,Date.now()+e)}close(){this.#a=!0,clearTimeout(this.#o);for(let e of this.#t.splice(0))e.reject(Error(`RateLimiter cerrado`))}get remainingFastBudget(){return Math.max(0,this.#e.dailyFastBudget-this.#c().used)}pump(){if(this.#a||this.#i||!this.#t.length)return;clearTimeout(this.#o);let e=this.#t.findIndex(e=>e.urgent());e>0&&this.#t.unshift(...this.#t.splice(e,1));let t=this.#t[0],n=t.urgent()&&this.remainingFastBudget>0?this.#e.minGapMs:this.#e.normalGapMs,r=Date.now(),i=Math.max(this.#n+n,this.#r)-r;i>0?this.#o=setTimeout(()=>this.pump(),i):(this.#t.shift(),this.#n&&r-this.#n<this.#e.normalGapMs&&this.#l(),this.#n=r,this.#i=!0,t.run().then(t.resolve,t.reject).finally(()=>{this.#i=!1,this.pump()}))}#s(){return new Date().toISOString().slice(0,10)}#c(){try{let e=JSON.parse(localStorage.getItem(this.#e.storageKey)??``);if(e.day===this.#s()&&Number.isFinite(e.used))return e}catch{}return{day:this.#s(),used:0}}#l(){let e=this.#c();e.used++,localStorage.setItem(this.#e.storageKey,JSON.stringify(e))}},ke=class extends Error{status;retryAfterMs;constructor(e,t){super(`Confluence respondió ${e}`),this.status=e,this.retryAfterMs=t}},Ae=`statim.v1.`,je=1e6,P=class extends Error{constructor(){super(`La señal supera el límite de 32 KB de una propiedad de Confluence`)}};function Me(e){let t={data:M+ee(S(JSON.stringify(e)))};if(new TextEncoder().encode(JSON.stringify(t)).byteLength>32768)throw new P;return t}function Ne(e){if(!e||typeof e!=`object`)return null;try{if(new TextEncoder().encode(JSON.stringify(e)).byteLength>32768)return null;let t=e.data;return typeof t!=`string`||!t.startsWith(`stz1:`)?null:De(JSON.parse(C(te(t.slice(M.length)),je)))}catch{return null}}var Pe=class{#e;#t;#n;#r;constructor(e){this.#e=e.baseUrl.replace(/\/+$/,``),this.#t=e.pageId,this.#n=`Bearer ${e.token}`,this.#r=new Oe({minGapMs:m.fastPollMs,normalGapMs:m.idlePollMs,dailyFastBudget:m.dailyFastRequestBudget,storageKey:`statim.fastBudget.${e.email.toLowerCase()}`})}get remainingFastBudget(){return this.#r.remainingFastBudget}reschedule(){this.#r.pump()}close(){this.#r.close()}#i(e,t,n){return this.#r.schedule(async()=>{O(`confluence.request`,{path:e,method:t.method??`GET`});let n={Authorization:this.#n,Accept:`application/json`};n[`X-Atlassian-Token`]=`no-check`,t.body&&(n[`Content-Type`]=`application/json`);try{let r=await fetch(this.#e+e,{...t,headers:n,credentials:`omit`});if(!r.ok){let t=Number(r.headers.get(`Retry-After`)),n=t>0?t*1e3:void 0;throw n&&this.#r.penalize(n),O(`confluence.response_error`,{path:e,status:r.status}),new ke(r.status,n)}return O(`confluence.response_ok`,{path:e,status:r.status}),r.status===204?void 0:await r.json()}catch(t){throw t instanceof ke||O(`confluence.network_error`,{path:e,error:t}),t}},n)}async post(e,t=!1){let n=Me(e),r=Ae+crypto.randomUUID();return await this.#i(`/rest/api/content/${encodeURIComponent(this.#t)}/property`,{method:`POST`,body:JSON.stringify({key:r,value:n})},t),r}async remove(e){if(!e.startsWith(`statim.v1.`))throw Error(`Clave de propiedad ajena a Statim`);await this.#i(`/rest/api/content/${encodeURIComponent(this.#t)}/property/${encodeURIComponent(e)}`,{method:`DELETE`},!1)}async listSince(e,t=!1){let n=[],r=`/rest/api/content/${encodeURIComponent(this.#t)}/property?expand=version&limit=100`;for(;r;){let i=await this.#i(r,{},t);for(let t of i.results){if(typeof t.key!=`string`||!t.key.startsWith(`statim.v1.`))continue;let r=Ne(t.value);if(!r||!Number.isFinite(r.ts))continue;let i=Date.parse(t.version?.when??t.version?.createdAt??``),a=Number.isFinite(i)?i:r.ts;a>=e&&n.push({propertyKey:t.key,createdAt:a,envelope:r})}let a=i._links?.next??``;if(!a)r=``;else if(a.startsWith(`http://`)||a.startsWith(`https://`)){let e=new URL(a);r=e.pathname+e.search}else r=a.startsWith(`/api/`)?`/rest${a}`:a;let o=new URL(this.#e||`/`,location.href).pathname.replace(/\/+$/,``);o&&r.startsWith(o+`/`)&&(r=r.slice(o.length))}return n.sort((e,t)=>t.createdAt-e.createdAt)}},Fe=`statim.locale`,Ie={es:{"app.title":`Statim`,"app.offline":`Sin conexión`,"app.connected_one":`1 conectado`,"app.connected_many":`{count} conectados`,"app.peers_btn":`Equipo`,"app.peers_btn_count":`Equipo ({count})`,"app.logout":`Salir`,"app.update":`Actualizar`,"app.updating":`Actualizando...`,"app.update_available":`Actualización disponible`,"app.update_banner_msg":`Nueva versión de Statim disponible.`,"app.update_dismiss":`Cerrar aviso de actualización`,"app.lang":`Idioma`,"app.switch_lang":`English`,"error.unexpected":`Error inesperado.`,"error.metered":`Error con el servidor TURN Metered.`,"error.confluence_auth":`Credenciales o permisos no válidos en Confluence.`,"error.confluence_404":`No se encuentra la página de Confluence.`,"error.confluence_429":`Confluence está limitando las peticiones.`,"error.confluence_network":`No se pudo contactar con Confluence (revisa red, CORS o proxy).`,"notify.recovered":`{count} mensaje(s) recuperado(s)`,"login.title":`Acceso al equipo`,"login.subtitle":`Mensajería instantánea P2P segura para tu equipo`,"login.base_url":`URL de Confluence (vacío = mismo origen)`,"login.base_url_placeholder":`https://tu-sitio.atlassian.net`,"login.page_id":`ID de la página de Confluence`,"login.page_id_placeholder":`12345678`,"login.email":`Email de Atlassian`,"login.email_placeholder":`tu-email@empresa.com`,"login.token":`API token`,"login.token_placeholder":`Introduce tu API token`,"login.turn_section":`Conexión tras cortafuegos / proxy (TURN TLS)`,"login.metered_domain":`Subdominio de Metered`,"login.metered_domain_placeholder":`subdominio.metered.live`,"login.metered_api_key":`API Key de Metered`,"login.metered_api_key_placeholder":`Clave de Metered`,"login.proxy_section":`Proxy HTTP/HTTPS`,"login.proxy_url":`URL y puerto`,"login.proxy_url_placeholder":`http://proxy.ejemplo.com:8080`,"login.proxy_user":`Usuario`,"login.proxy_user_placeholder":`Usuario`,"login.proxy_password":`Password`,"login.proxy_password_placeholder":`Password`,"login.proxy_excluded":`Lista de dominios excluidos`,"login.proxy_excluded_placeholder":`localhost, 127.0.0.1, .empresa.com`,"login.logs_section":`Diagnóstico y registros (logs)`,"login.export_logs":`Copiar registros`,"login.clear_logs":`Limpiar`,"login.submit":`Entrar`,"login.connecting":`Conectando…`,"chat.notice_nobody":`Nadie conectado: tus mensajes llegarán cuando alguien se conecte (hasta 10 h).`,"chat.send_failed":`No se pudo enviar el mensaje.`,"chat.input_placeholder":`Escribe un mensaje`,"chat.input_aria":`Mensaje`,"chat.send_btn":`Enviar`,"chat.jump_one":`1 mensaje nuevo ↓`,"chat.jump_many":`{count} mensajes nuevos ↓`,"chat.date_today":`Hoy`,"chat.date_yesterday":`Ayer`,"chat.status_pending":`Guardado en local (esperando compañeros)`,"chat.status_sent":`Transmitido a la malla P2P`,"chat.status_searching":`Buscando compañeros...`,"chat.copied":`Texto copiado al portapapeles`,"menu.copy":`Copiar texto`,"menu.reply":`Citar / Responder`,"menu.info":`Info del mensaje`,"menu.close":`Cerrar`,"menu.details_title":`Detalles del mensaje`,"menu.from":`Remitente`,"menu.date":`Fecha y hora`,"menu.id":`ID del mensaje`,"menu.delivery":`Estado`,"menu.delivery_sent":`Transmitido a la malla WebRTC`,"menu.delivery_pending":`Guardado en local (pendiente de pares)`,"menu.delivery_received":`Recibido vía WebRTC (cifrado AES-GCM)`,"net.title":`Estado de red y sincronización`,"net.mesh_status":`Malla WebRTC (P2P)`,"net.connected_peers":`Compañeros conectados directamente`,"net.active_peers":`Compañeros activos recientemente`,"net.confluence_sync":`Señalización (Confluence)`,"net.budget":`Presupuesto de peticiones rápidas hoy`,"net.budget_val":`{used} / {total} usadas`,"net.sync_now":`Comprobar señales ahora`,"net.syncing":`Comprobando...`,"net.close":`Cerrar`,"peers.title":`Equipo`,"peers.empty":`Aún no hay compañeros anunciados.`,"peers.no_direct_connection":`sin conexión directa`,"peers.close":`Cerrar`,"pwa.install_btn":`Instalar app`,"pwa.install_title":`Instala Statim en tu móvil`,"pwa.install_desc":`Acceso rápido y notificaciones en tu pantalla de inicio.`,"pwa.install_ios":`Para instalar: pulsa Compartir ⎋ y luego "Añadir a pantalla de inicio" ⊞`,"pwa.install_dismiss":`Cerrar aviso de instalación`,"chat.emoji_toggle":`Reacciones y emojis rápidos`},en:{"app.title":`Statim`,"app.offline":`Offline`,"app.connected_one":`1 connected`,"app.connected_many":`{count} connected`,"app.peers_btn":`Team`,"app.peers_btn_count":`Team ({count})`,"app.logout":`Sign out`,"app.update":`Update`,"app.updating":`Updating...`,"app.update_available":`Update available`,"app.update_banner_msg":`A new version of Statim is available.`,"app.update_dismiss":`Dismiss update notice`,"app.lang":`Language`,"app.switch_lang":`Español`,"error.unexpected":`Unexpected error.`,"error.metered":`Metered TURN server error.`,"error.confluence_auth":`Invalid credentials or permissions in Confluence.`,"error.confluence_404":`Confluence page not found.`,"error.confluence_429":`Confluence is rate limiting requests.`,"error.confluence_network":`Could not reach Confluence (check network, CORS or proxy).`,"notify.recovered":`{count} recovered message(s)`,"login.title":`Connect to Statim`,"login.subtitle":`Secure P2P instant messaging for your team`,"login.base_url":`Confluence Base URL`,"login.base_url_placeholder":`E.g.: https://company.atlassian.net (empty for proxy)`,"login.page_id":`Page ID`,"login.page_id_placeholder":`E.g.: 12345678`,"login.email":`Email`,"login.email_placeholder":`your-email@company.com`,"login.token":`Atlassian API token`,"login.token_placeholder":`Enter your API token`,"login.turn_section":`TURN Server (optional)`,"login.metered_domain":`Metered Domain`,"login.metered_domain_placeholder":`E.g.: my-team`,"login.metered_api_key":`Metered API Key`,"login.metered_api_key_placeholder":`Metered API Key`,"login.proxy_section":`Local proxy (optional)`,"login.proxy_url":`Proxy URL`,"login.proxy_url_placeholder":`http://localhost:8787`,"login.proxy_user":`Proxy username (optional)`,"login.proxy_user_placeholder":`Username`,"login.proxy_password":`Proxy password (optional)`,"login.proxy_password_placeholder":`Password`,"login.proxy_excluded":`Excluded domains (optional)`,"login.proxy_excluded_placeholder":`localhost, 127.0.0.1`,"login.logs_section":`Diagnostics and logs`,"login.export_logs":`Download logs`,"login.clear_logs":`Clear logs`,"login.submit":`Connect`,"login.connecting":`Connecting...`,"chat.notice_nobody":`Nobody connected: your messages will arrive when someone connects (up to 10 h).`,"chat.send_failed":`Failed to send message.`,"chat.input_placeholder":`Type a message`,"chat.input_aria":`Message`,"chat.send_btn":`Send`,"chat.jump_one":`1 new message ↓`,"chat.jump_many":`{count} new messages ↓`,"chat.date_today":`Today`,"chat.date_yesterday":`Yesterday`,"chat.status_pending":`Saved locally (waiting for peers)`,"chat.status_sent":`Transmitted to P2P mesh`,"chat.status_searching":`Searching for peers...`,"chat.copied":`Text copied to clipboard`,"menu.copy":`Copy text`,"menu.reply":`Quote / Reply`,"menu.info":`Message info`,"menu.close":`Close`,"menu.details_title":`Message details`,"menu.from":`Sender`,"menu.date":`Date and time`,"menu.id":`Message ID`,"menu.delivery":`Status`,"menu.delivery_sent":`Transmitted to WebRTC mesh`,"menu.delivery_pending":`Saved locally (waiting for peers)`,"menu.delivery_received":`Received via WebRTC (AES-GCM encrypted)`,"net.title":`Network and sync status`,"net.mesh_status":`WebRTC Mesh (P2P)`,"net.connected_peers":`Directly connected peers`,"net.active_peers":`Recently active peers`,"net.confluence_sync":`Signaling (Confluence)`,"net.budget":`Fast request budget today`,"net.budget_val":`{used} / {total} used`,"net.sync_now":`Check signals now`,"net.syncing":`Checking...`,"net.close":`Close`,"peers.title":`Team`,"peers.empty":`No peers announced yet.`,"peers.no_direct_connection":`no direct connection`,"peers.close":`Close`,"pwa.install_btn":`Install app`,"pwa.install_title":`Install Statim on your phone`,"pwa.install_desc":`Fast access and notifications on your home screen.`,"pwa.install_ios":`To install: tap Share ⎋ and then "Add to Home Screen" ⊞`,"pwa.install_dismiss":`Dismiss install notice`,"chat.emoji_toggle":`Quick reactions and emojis`}},Le=Re();function Re(){try{let e=localStorage.getItem(Fe);if(e===`es`||e===`en`)return e}catch{}return`es`}function ze(){return Le}function Be(e){if(e===`es`||e===`en`){Le=e;try{localStorage.setItem(Fe,e)}catch{}typeof document<`u`&&(document.documentElement.lang=e),typeof window<`u`&&window.dispatchEvent(new CustomEvent(`statim:locale-changed`,{detail:e}))}}function Ve(){let e=Le===`es`?`en`:`es`;return Be(e),e}function F(e,t){let n=(Ie[Le]??Ie.es)[e]??Ie.es[e]??e;if(t)for(let[e,r]of Object.entries(t))n=n.replace(RegExp(`\\{${e}\\}`,`g`),String(r));return n}function He(e,t=Le){return new Intl.DateTimeFormat(t,{hour:`2-digit`,minute:`2-digit`}).format(e)}function Ue(e,t=Le){let n=new Date(e),r=new Date,i=Ie[t]??Ie.es;if(n.getDate()===r.getDate()&&n.getMonth()===r.getMonth()&&n.getFullYear()===r.getFullYear())return i[`chat.date_today`];let a=new Date(r);if(a.setDate(r.getDate()-1),n.getDate()===a.getDate()&&n.getMonth()===a.getMonth()&&n.getFullYear()===a.getFullYear())return i[`chat.date_yesterday`];let o=n.getFullYear()===r.getFullYear();return new Intl.DateTimeFormat(t,{day:`numeric`,month:`short`,...o?{}:{year:`numeric`}}).format(n)}var We=`subdomain.metered.live`;function Ge(e){let t=(e??``).trim().toLowerCase();return t?t.includes(`.`)?t:`${t}.metered.live`:We}async function Ke(e,t){let n=e.trim();if(!n)return[];let r=Ge(t),i=await fetch(`https://${r}/api/v1/turn/credentials?apiKey=${encodeURIComponent(n)}`);if(!i.ok)try{let e=await fetch(`https://${r}/api/v2/turn/credentials?secretKey=${encodeURIComponent(n)}`);if(e.ok){let t=(await e.json())?.data?.[0];if(t?.apiKey)i=await fetch(`https://${r}/api/v1/turn/credentials?apiKey=${encodeURIComponent(t.apiKey)}`);else if(t?.username&&t?.password)return[{urls:`turns:${r}:443?transport=tcp`,username:t.username,credential:t.password}]}}catch{}if(!i.ok)throw Error(`Clave de Metered no válida o error de conexión`);let a=await i.json(),o=[];for(let e of a){let t=(Array.isArray(e.urls)?e.urls:[e.urls]).filter(e=>e.startsWith(`turns:`));t.length>0&&o.push({...e,urls:t.length===1?t[0]:t})}if(!o.length&&a.length>0){let e=a.find(e=>e.username&&e.credential);if(e)return[{urls:`turns:${r}:443?transport=tcp`,username:e.username,credential:e.credential}]}return o}var qe=c(o(((e,t,n)=>{(function(n,r){typeof e==`object`&&t!==void 0?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.Dexie=r())})(n,(function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},e(t,n)};function t(t,n){if(typeof n!=`function`&&n!==null)throw TypeError(`Class extends value `+String(n)+` is not a constructor or null`);e(t,n);function r(){this.constructor=t}t.prototype=n===null?Object.create(n):(r.prototype=n.prototype,new r)}var n=function(){return n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},n.apply(this,arguments)};function r(e,t,n){if(n||arguments.length===2)for(var r=0,i=t.length,a;r<i;r++)(a||!(r in t))&&(a||=Array.prototype.slice.call(t,0,r),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}var i=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:global,a=Object.keys,o=Array.isArray;typeof Promise<`u`&&!i.Promise&&(i.Promise=Promise);function s(e,t){return typeof t==`object`&&a(t).forEach(function(n){e[n]=t[n]}),e}var c=Object.getPrototypeOf,l={}.hasOwnProperty;function u(e,t){return l.call(e,t)}function d(e,t){typeof t==`function`&&(t=t(c(e))),(typeof Reflect>`u`?a:Reflect.ownKeys)(t).forEach(function(n){p(e,n,t[n])})}var f=Object.defineProperty;function p(e,t,n,r){f(e,t,s(n&&u(n,`get`)&&typeof n.get==`function`?{get:n.get,set:n.set,configurable:!0}:{value:n,configurable:!0,writable:!0},r))}function m(e){return{from:function(t){return e.prototype=Object.create(t.prototype),p(e.prototype,`constructor`,e),{extend:d.bind(null,e.prototype)}}}}var h=Object.getOwnPropertyDescriptor;function g(e,t){var n=h(e,t),r;return n||(r=c(e))&&g(r,t)}var _=[].slice;function v(e,t,n){return _.call(e,t,n)}function y(e,t){return t(e)}function b(e){if(!e)throw Error(`Assertion Failed`)}function x(e){i.setImmediate?setImmediate(e):setTimeout(e,0)}function S(e,t){return e.reduce(function(e,n,r){var i=t(n,r);return i&&(e[i[0]]=i[1]),e},{})}function C(e,t){if(typeof t==`string`&&u(e,t))return e[t];if(!t)return e;if(typeof t!=`string`){for(var n=[],r=0,i=t.length;r<i;++r){var a=C(e,t[r]);n.push(a)}return n}var o=t.indexOf(`.`);if(o!==-1){var s=e[t.substr(0,o)];return s==null?void 0:C(s,t.substr(o+1))}}function w(e,t,n){if(e&&t!==void 0&&!(`isFrozen`in Object&&Object.isFrozen(e))){if(typeof t!=`string`&&`length`in t){b(typeof n!=`string`&&`length`in n);for(var r=0,i=t.length;r<i;++r)w(e,t[r],n[r])}else{var a=t.indexOf(`.`);if(a!==-1){var s=t.substr(0,a),c=t.substr(a+1);if(c===``)n===void 0?o(e)&&!isNaN(parseInt(s))?e.splice(s,1):delete e[s]:e[s]=n;else{var l=e[s];if(!l||!u(e,s)){if(n===void 0)return;l=e[s]={}}w(l,c,n)}}else n===void 0?o(e)&&!isNaN(parseInt(t))?e.splice(t,1):delete e[t]:e[t]=n}}}function T(e,t){typeof t==`string`?w(e,t,void 0):`length`in t&&[].map.call(t,function(t){w(e,t,void 0)})}function ee(e){var t={};for(var n in e)u(e,n)&&(t[n]=e[n]);return t}var te=[].concat;function ne(e){return te.apply([],e)}var re=`BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey`.split(`,`).concat(ne([8,16,32,64].map(function(e){return[`Int`,`Uint`,`Float`].map(function(t){return t+e+`Array`})}))).filter(function(e){return i[e]}),ie=new Set(re.map(function(e){return i[e]}));function ae(e){var t={};for(var n in e)if(u(e,n)){var r=e[n];t[n]=!r||typeof r!=`object`||ie.has(r.constructor)?r:ae(r)}return t}var oe=null;function se(e){oe=new WeakMap;var t=ce(e);return oe=null,t}function ce(e){if(!e||typeof e!=`object`)return e;var t=oe.get(e);if(t)return t;if(o(e)){t=[],oe.set(e,t);for(var n=0,r=e.length;n<r;++n)t.push(ce(e[n]))}else if(ie.has(e.constructor))t=e;else{var i=c(e);for(var a in t=i===Object.prototype?{}:Object.create(i),oe.set(e,t),e)u(e,a)&&(t[a]=ce(e[a]))}return t}var le={}.toString;function ue(e){return le.call(e).slice(8,-1)}var de=typeof Symbol<`u`?Symbol.iterator:`@@iterator`,fe=typeof de==`symbol`?function(e){var t;return e!=null&&(t=e[de])&&t.apply(e)}:function(){return null};function E(e,t){var n=e.indexOf(t);return n>=0&&e.splice(n,1),n>=0}var pe={};function D(e){var t,n,r,i;if(arguments.length===1){if(o(e))return e.slice();if(this===pe&&typeof e==`string`)return[e];if(i=fe(e)){for(n=[];r=i.next(),!r.done;)n.push(r.value);return n}if(e==null)return[e];if(t=e.length,typeof t==`number`){for(n=Array(t);t--;)n[t]=e[t];return n}return[e]}for(t=arguments.length,n=Array(t);t--;)n[t]=arguments[t];return n}var O=typeof Symbol<`u`?function(e){return e[Symbol.toStringTag]===`AsyncFunction`}:function(){return!1},me=[`Modify`,`Bulk`,`OpenFailed`,`VersionChange`,`Schema`,`Upgrade`,`InvalidTable`,`MissingAPI`,`NoSuchDatabase`,`InvalidArgument`,`SubTransaction`,`Unsupported`,`Internal`,`DatabaseClosed`,`PrematureCommit`,`ForeignAwait`],he=[`Unknown`,`Constraint`,`Data`,`TransactionInactive`,`ReadOnly`,`Version`,`NotFound`,`InvalidState`,`InvalidAccess`,`Abort`,`Timeout`,`QuotaExceeded`,`Syntax`,`DataClone`],ge=me.concat(he),_e={VersionChanged:`Database version changed by other database connection`,DatabaseClosed:`Database has been closed`,Abort:`Transaction aborted`,TransactionInactive:`Transaction has already completed or failed`,MissingAPI:`IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb`};function k(e,t){this.name=e,this.message=t}m(k).from(Error).extend({toString:function(){return this.name+`: `+this.message}});function ve(e,t){return e+`. Errors: `+Object.keys(t).map(function(e){return t[e].toString()}).filter(function(e,t,n){return n.indexOf(e)===t}).join(`
`)}function ye(e,t,n,r){this.failures=t,this.failedKeys=r,this.successCount=n,this.message=ve(e,t)}m(ye).from(k);function A(e,t){this.name=`BulkError`,this.failures=Object.keys(t).map(function(e){return t[e]}),this.failuresByPos=t,this.message=ve(e,this.failures)}m(A).from(k);var be=ge.reduce(function(e,t){return e[t]=t+`Error`,e},{}),xe=k,j=ge.reduce(function(e,t){var n=t+`Error`;function r(e,r){this.name=n,e?typeof e==`string`?(this.message=`${e}${r?`
 `+r:``}`,this.inner=r||null):typeof e==`object`&&(this.message=`${e.name} ${e.message}`,this.inner=e):(this.message=_e[t]||n,this.inner=null)}return m(r).from(xe),e[t]=r,e},{});j.Syntax=SyntaxError,j.Type=TypeError,j.Range=RangeError;var Se=he.reduce(function(e,t){return e[t+`Error`]=j[t],e},{});function Ce(e,t){if(!e||e instanceof k||e instanceof TypeError||e instanceof SyntaxError||!e.name||!Se[e.name])return e;var n=new Se[e.name](t||e.message,e);return`stack`in e&&p(n,`stack`,{get:function(){return this.inner.stack}}),n}var we=ge.reduce(function(e,t){return[`Syntax`,`Type`,`Range`].indexOf(t)===-1&&(e[t+`Error`]=j[t]),e},{});we.ModifyError=ye,we.DexieError=k,we.BulkError=A;function M(){}function Te(e){return e}function Ee(e,t){return e==null||e===Te?t:function(n){return t(e(n))}}function N(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function De(e,t){return e===M?t:function(){var n=e.apply(this,arguments);n!==void 0&&(arguments[0]=n);var r=this.onsuccess,i=this.onerror;this.onsuccess=null,this.onerror=null;var a=t.apply(this,arguments);return r&&(this.onsuccess=this.onsuccess?N(r,this.onsuccess):r),i&&(this.onerror=this.onerror?N(i,this.onerror):i),a===void 0?n:a}}function Oe(e,t){return e===M?t:function(){e.apply(this,arguments);var n=this.onsuccess,r=this.onerror;this.onsuccess=this.onerror=null,t.apply(this,arguments),n&&(this.onsuccess=this.onsuccess?N(n,this.onsuccess):n),r&&(this.onerror=this.onerror?N(r,this.onerror):r)}}function ke(e,t){return e===M?t:function(){var n=e.apply(this,arguments),r=arguments[0];s(r,n);var i=this.onsuccess,a=this.onerror;this.onsuccess=null,this.onerror=null;var o=t.apply(this,arguments);return i&&(this.onsuccess=this.onsuccess?N(i,this.onsuccess):i),a&&(this.onerror=this.onerror?N(a,this.onerror):a),n===void 0?o===void 0?void 0:o:s(n,o)}}function Ae(e,t){return e===M?t:function(){return t.apply(this,arguments)!==!1&&e.apply(this,arguments)}}function je(e,t){return e===M?t:function(){var n=e.apply(this,arguments);if(n&&typeof n.then==`function`){for(var r=this,i=arguments.length,a=Array(i);i--;)a[i]=arguments[i];return n.then(function(){return t.apply(r,a)})}return t.apply(this,arguments)}}var P=typeof location<`u`&&/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);function Me(e,t){P=e}var Ne={},Pe=100,Fe=typeof Promise>`u`?[]:(function(){var e=Promise.resolve();if(typeof crypto>`u`||!crypto.subtle)return[e,c(e),e];var t=crypto.subtle.digest(`SHA-512`,new Uint8Array([0]));return[t,c(t),e]})(),Ie=Fe[0],Le=Fe[1],Re=Fe[2],ze=Le&&Le.then,Be=Ie&&Ie.constructor,Ve=!!Re;function F(){queueMicrotask(z)}var He=function(e,t){Je.push([e,t]),We&&=(F(),!1)},Ue=!0,We=!0,Ge=[],Ke=[],qe=Te,I={id:`global`,global:!0,ref:0,unhandleds:[],onunhandled:M,pgp:!1,env:{},finalize:M},L=I,Je=[],Ye=0,Xe=[];function R(e){if(typeof this!=`object`)throw TypeError(`Promises must be constructed via new`);this._listeners=[],this._lib=!1;var t=this._PSD=L;if(typeof e!=`function`){if(e!==Ne)throw TypeError(`Not a function`);this._state=arguments[1],this._value=arguments[2],this._state===!1&&et(this,this._value)}else this._state=null,this._value=null,++t.ref,$e(this,e)}var Ze={get:function(){var e=L,t=mt;function n(n,r){var i=this,a=!e.global&&(e!==L||t!==mt),o=a&&!U(),s=new R(function(t,s){nt(i,new Qe(xt(n,e,a,o),xt(r,e,a,o),t,s,e))});return this._consoleTask&&(s._consoleTask=this._consoleTask),s}return n.prototype=Ne,n},set:function(e){p(this,`then`,e&&e.prototype===Ne?Ze:{get:function(){return e},set:Ze.set})}};d(R.prototype,{then:Ze,_then:function(e,t){nt(this,new Qe(null,null,e,t,L))},catch:function(e){if(arguments.length===1)return this.then(null,e);var t=arguments[0],n=arguments[1];return typeof t==`function`?this.then(null,function(e){return e instanceof t?n(e):ut(e)}):this.then(null,function(e){return e&&e.name===t?n(e):ut(e)})},finally:function(e){return this.then(function(t){return R.resolve(e()).then(function(){return t})},function(t){return R.resolve(e()).then(function(){return ut(t)})})},timeout:function(e,t){var n=this;return e<1/0?new R(function(r,i){var a=setTimeout(function(){return i(new j.Timeout(t))},e);n.then(r,i).finally(clearTimeout.bind(null,a))}):this}}),typeof Symbol<`u`&&Symbol.toStringTag&&p(R.prototype,Symbol.toStringTag,`Dexie.Promise`),I.env=bt();function Qe(e,t,n,r,i){this.onFulfilled=typeof e==`function`?e:null,this.onRejected=typeof t==`function`?t:null,this.resolve=n,this.reject=r,this.psd=i}d(R,{all:function(){var e=D.apply(null,arguments).map(_t);return new R(function(t,n){e.length===0&&t([]);var r=e.length;e.forEach(function(i,a){return R.resolve(i).then(function(n){e[a]=n,--r||t(e)},n)})})},resolve:function(e){return e instanceof R?e:e&&typeof e.then==`function`?new R(function(t,n){e.then(t,n)}):new R(Ne,!0,e)},reject:ut,race:function(){var e=D.apply(null,arguments).map(_t);return new R(function(t,n){e.map(function(e){return R.resolve(e).then(t,n)})})},PSD:{get:function(){return L},set:function(e){return L=e}},totalEchoes:{get:function(){return mt}},newPSD:H,usePSD:G,scheduler:{get:function(){return He},set:function(e){He=e}},rejectionMapper:{get:function(){return qe},set:function(e){qe=e}},follow:function(e,t){return new R(function(n,r){return H(function(t,n){var r=L;r.unhandleds=[],r.onunhandled=n,r.finalize=N(function(){var e=this;st(function(){e.unhandleds.length===0?t():n(e.unhandleds[0])})},r.finalize),e()},t,n,r)})}}),Be&&(Be.allSettled&&p(R,`allSettled`,function(){var e=D.apply(null,arguments).map(_t);return new R(function(t){e.length===0&&t([]);var n=e.length,r=Array(n);e.forEach(function(e,i){return R.resolve(e).then(function(e){return r[i]={status:`fulfilled`,value:e}},function(e){return r[i]={status:`rejected`,reason:e}}).then(function(){return--n||t(r)})})})}),Be.any&&typeof AggregateError<`u`&&p(R,`any`,function(){var e=D.apply(null,arguments).map(_t);return new R(function(t,n){e.length===0&&n(AggregateError([]));var r=e.length,i=Array(r);e.forEach(function(e,a){return R.resolve(e).then(function(e){return t(e)},function(e){i[a]=e,--r||n(AggregateError(i))})})})}),Be.withResolvers&&(R.withResolvers=Be.withResolvers));function $e(e,t){try{t(function(t){if(e._state===null){if(t===e)throw TypeError(`A promise cannot be resolved with itself.`);var n=e._lib&&it();t&&typeof t.then==`function`?$e(e,function(e,n){t instanceof R?t._then(e,n):t.then(e,n)}):(e._state=!0,e._value=t,tt(e)),n&&at()}},et.bind(null,e))}catch(t){et(e,t)}}function et(e,t){if(Ke.push(t),e._state===null){var n=e._lib&&it();t=qe(t),e._state=!1,e._value=t,ct(e),tt(e),n&&at()}}function tt(e){var t=e._listeners;e._listeners=[];for(var n=0,r=t.length;n<r;++n)nt(e,t[n]);var i=e._PSD;--i.ref||i.finalize(),Ye===0&&(++Ye,He(function(){--Ye===0&&ot()},[]))}function nt(e,t){if(e._state===null)e._listeners.push(t);else{var n=e._state?t.onFulfilled:t.onRejected;if(n===null)return(e._state?t.resolve:t.reject)(e._value);++t.psd.ref,++Ye,He(rt,[n,e,t])}}function rt(e,t,n){try{var r,i=t._value;!t._state&&Ke.length&&(Ke=[]),r=P&&t._consoleTask?t._consoleTask.run(function(){return e(i)}):e(i),!t._state&&Ke.indexOf(i)===-1&&lt(t),n.resolve(r)}catch(e){n.reject(e)}finally{--Ye===0&&ot(),--n.psd.ref||n.psd.finalize()}}function z(){G(I,function(){it()&&at()})}function it(){var e=Ue;return Ue=!1,We=!1,e}function at(){var e,t,n;do for(;Je.length>0;)for(e=Je,Je=[],n=e.length,t=0;t<n;++t){var r=e[t];r[0].apply(null,r[1])}while(Je.length>0);Ue=!0,We=!0}function ot(){var e=Ge;Ge=[],e.forEach(function(e){e._PSD.onunhandled.call(null,e._value,e)});for(var t=Xe.slice(0),n=t.length;n;)t[--n]()}function st(e){function t(){e(),Xe.splice(Xe.indexOf(t),1)}Xe.push(t),++Ye,He(function(){--Ye===0&&ot()},[])}function ct(e){Ge.some(function(t){return t._value===e._value})||Ge.push(e)}function lt(e){for(var t=Ge.length;t;)if(Ge[--t]._value===e._value){Ge.splice(t,1);return}}function ut(e){return new R(Ne,!1,e)}function B(e,t){var n=L;return function(){var r=it(),i=L;try{return W(n,!0),e.apply(this,arguments)}catch(e){t&&t(e)}finally{W(i,!1),r&&at()}}}var V={awaits:0,echoes:0,id:0},dt=0,ft=[],pt=0,mt=0,ht=0;function H(e,t,n,r){var i=L,a=Object.create(i);a.parent=i,a.ref=0,a.global=!1,a.id=++ht,I.env,a.env=Ve?{Promise:R,PromiseProp:{value:R,configurable:!0,writable:!0},all:R.all,race:R.race,allSettled:R.allSettled,any:R.any,resolve:R.resolve,reject:R.reject}:{},t&&s(a,t),++i.ref,a.finalize=function(){--this.parent.ref||this.parent.finalize()};var o=G(a,e,n,r);return a.ref===0&&a.finalize(),o}function gt(){return V.id||=++dt,++V.awaits,V.echoes+=Pe,V.id}function U(){return V.awaits?(--V.awaits===0&&(V.id=0),V.echoes=V.awaits*Pe,!0):!1}(``+ze).indexOf(`[native code]`)===-1&&(gt=U=M);function _t(e){return V.echoes&&e&&e.constructor===Be?(gt(),e.then(function(e){return U(),e},function(e){return U(),K(e)})):e}function vt(e){++mt,V.echoes&&--V.echoes!==0||(V.echoes=V.awaits=V.id=0),ft.push(L),W(e,!0)}function yt(){var e=ft[ft.length-1];ft.pop(),W(e,!1)}function W(e,t){var n=L;if((t?V.echoes&&(!pt++||e!==L):pt&&(!--pt||e!==L))&&queueMicrotask(t?vt.bind(null,e):yt),e!==L&&(L=e,n===I&&(I.env=bt()),Ve)){var r=I.env.Promise,a=e.env;(n.global||e.global)&&(Object.defineProperty(i,"Promise",a.PromiseProp),r.all=a.all,r.race=a.race,r.resolve=a.resolve,r.reject=a.reject,a.allSettled&&(r.allSettled=a.allSettled),a.any&&(r.any=a.any))}}function bt(){var e=i.Promise;return Ve?{Promise:e,PromiseProp:Object.getOwnPropertyDescriptor(i,`Promise`),all:e.all,race:e.race,allSettled:e.allSettled,any:e.any,resolve:e.resolve,reject:e.reject}:{}}function G(e,t,n,r,i){var a=L;try{return W(e,!0),t(n,r,i)}finally{W(a,!1)}}function xt(e,t,n,r){return typeof e==`function`?function(){var i=L;n&&gt(),W(t,!0);try{return e.apply(this,arguments)}finally{W(i,!1),r&&queueMicrotask(U)}}:e}function St(e){Promise===Be&&V.echoes===0?pt===0?e():enqueueNativeMicroTask(e):setTimeout(e,0)}var K=R.reject;function Ct(e,t,n,r){if(!e.idbdb||!e._state.openComplete&&!L.letThrough&&!e._vip){if(e._state.openComplete)return K(new j.DatabaseClosed(e._state.dbOpenError));if(!e._state.isBeingOpened){if(!e._state.autoOpen)return K(new j.DatabaseClosed);e.open().catch(M)}return e._state.dbReadyPromise.then(function(){return Ct(e,t,n,r)})}var i=e._createTransaction(t,n,e._dbSchema);try{i.create(),e._state.PR1398_maxLoop=3}catch(i){return i.name===be.InvalidState&&e.isOpen()&&--e._state.PR1398_maxLoop>0?(console.warn(`Dexie: Need to reopen db`),e.close({disableAutoOpen:!1}),e.open().then(function(){return Ct(e,t,n,r)})):K(i)}return i._promise(t,function(e,t){return H(function(){return L.trans=i,r(e,t,i)})}).then(function(e){if(t===`readwrite`)try{i.idbtrans.commit()}catch{}return t===`readonly`?e:i._completion.then(function(){return e})})}var wt=`4.4.7`,Tt=`￿`,Et=-1/0,q=`Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.`,Dt=`String expected.`,Ot=1e3,kt=`__dbnames`,At=`readonly`,jt=`readwrite`;function J(e,t){return e?t?function(){return e.apply(this,arguments)&&t.apply(this,arguments)}:e:t}var Mt={type:3,lower:-1/0,lowerOpen:!1,upper:[[]],upperOpen:!1};function Nt(e){return typeof e==`string`&&!/\./.test(e)?function(t){return t[e]===void 0&&e in t&&(t=se(t),delete t[e]),t}:function(e){return e}}function Pt(){throw j.Type(`Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.`)}function Y(e,t){try{var n=Lt(e),r=Lt(t);if(n!==r)return n===`Array`?1:r===`Array`?-1:n===`binary`?1:r===`binary`?-1:n===`string`?1:r===`string`?-1:n===`Date`?1:r===`Date`?-1:NaN;switch(n){case`number`:case`Date`:case`string`:return e>t?1:e<t?-1:0;case`binary`:return It(Rt(e),Rt(t));case`Array`:return Ft(e,t)}}catch{}return NaN}function Ft(e,t){for(var n=e.length,r=t.length,i=n<r?n:r,a=0;a<i;++a){var o=Y(e[a],t[a]);if(o!==0)return o}return n===r?0:n<r?-1:1}function It(e,t){for(var n=e.length,r=t.length,i=n<r?n:r,a=0;a<i;++a)if(e[a]!==t[a])return e[a]<t[a]?-1:1;return n===r?0:n<r?-1:1}function Lt(e){var t=typeof e;if(t!==`object`)return t;if(ArrayBuffer.isView(e))return`binary`;var n=ue(e);return n===`ArrayBuffer`?`binary`:n}function Rt(e){return e instanceof Uint8Array?e:ArrayBuffer.isView(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):new Uint8Array(e)}function zt(e,t,n){var r=e.schema.yProps;return r?(t&&n.numFailures>0&&(t=t.filter(function(e,t){return!n.failures[t]})),Promise.all(r.map(function(n){var r=n.updatesTable;return t?e.db.table(r).where(`k`).anyOf(t).delete():e.db.table(r).clear()})).then(function(){return n})):n}var Bt=function(){function e(e){this[`@@propmod`]=e}return e.prototype.execute=function(e){var t=this[`@@propmod`];if(t.add!==void 0){var n=t.add;if(o(n))return r(r([],o(e)?e:[],!0),n,!0).sort();if(typeof n==`number`)return(Number(e)||0)+n;if(typeof n==`bigint`)try{return BigInt(e)+n}catch{return BigInt(0)+n}throw TypeError(`Invalid term ${n}`)}if(t.remove!==void 0){var i=t.remove;if(o(i))return o(e)?e.filter(function(e){return!i.includes(e)}).sort():[];if(typeof i==`number`)return Number(e)-i;if(typeof i==`bigint`)try{return BigInt(e)-i}catch{return BigInt(0)-i}throw TypeError(`Invalid subtrahend ${i}`)}var a=t.replacePrefix?.[0];return a&&typeof e==`string`&&e.startsWith(a)?t.replacePrefix[1]+e.substring(a.length):e},e}();function Vt(e,t){for(var n=a(t),r=n.length,i=!1,o=0;o<r;++o){var s=n[o],c=t[s],l=C(e,s);c instanceof Bt?(w(e,s,c.execute(l)),i=!0):l!==c&&(w(e,s,c),i=!0)}return i}var Ht=function(){function e(){}return e.prototype._trans=function(e,t,n){var r=this._tx||L.trans,i=this.name,a=P&&typeof console<`u`&&console.createTask&&console.createTask(`Dexie: ${e===`readonly`?`read`:`write`} ${this.name}`);function o(e,n,r){if(!r.schema[i])throw new j.NotFound(`Table `+i+` not part of transaction`);return t(r.idbtrans,r)}var s=it();try{var c=r&&r.db._novip===this.db._novip?r===L.trans?r._promise(e,o,n):H(function(){return r._promise(e,o,n)},{trans:r,transless:L.transless||L}):Ct(this.db,e,[this.name],o);return a&&(c._consoleTask=a,c=c.catch(function(e){return console.trace(e),K(e)})),c}finally{s&&at()}},e.prototype.get=function(e,t){var n=this;return e&&e.constructor===Object?this.where(e).first(t):e==null?K(new j.Type(`Invalid argument to Table.get()`)):this._trans(`readonly`,function(t){return n.core.get({trans:t,key:e}).then(function(e){return n.hook.reading.fire(e)})}).then(t)},e.prototype.where=function(e){if(typeof e==`string`)return new this.db.WhereClause(this,e);if(o(e))return new this.db.WhereClause(this,`[${e.join(`+`)}]`);var t=a(e);if(t.length===1)return this.where(t[0]).equals(e[t[0]]);var n=this.schema.indexes.concat(this.schema.primKey).filter(function(e){if(e.compound&&t.every(function(t){return e.keyPath.indexOf(t)>=0})){for(var n=0;n<t.length;++n)if(t.indexOf(e.keyPath[n])===-1)return!1;return!0}return!1}).sort(function(e,t){return e.keyPath.length-t.keyPath.length})[0];if(n&&this.db._maxKey!==Tt){var r=n.keyPath.slice(0,t.length);return this.where(r).equals(r.map(function(t){return e[t]}))}!n&&P&&console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit from a compound index [${t.join(`+`)}]`);var i=this.schema.idxByName;function s(e,t){return Y(e,t)===0}var c=t.reduce(function(t,n){var r=t[0],a=t[1],c=i[n],l=e[n];return[r||c,r||!c?J(a,c&&c.multi?function(e){var t=C(e,n);return o(t)&&t.some(function(e){return s(l,e)})}:function(e){return s(l,C(e,n))}):a]},[null,null]),l=c[0],u=c[1];return l?this.where(l.name).equals(e[l.keyPath]).filter(u):n?this.filter(u):this.where(t).equals(``)},e.prototype.filter=function(e){return this.toCollection().and(e)},e.prototype.count=function(e){return this.toCollection().count(e)},e.prototype.offset=function(e){return this.toCollection().offset(e)},e.prototype.limit=function(e){return this.toCollection().limit(e)},e.prototype.each=function(e){return this.toCollection().each(e)},e.prototype.toArray=function(e){return this.toCollection().toArray(e)},e.prototype.toCollection=function(){return new this.db.Collection(new this.db.WhereClause(this))},e.prototype.orderBy=function(e){return new this.db.Collection(new this.db.WhereClause(this,o(e)?`[${e.join(`+`)}]`:e))},e.prototype.reverse=function(){return this.toCollection().reverse()},e.prototype.mapToClass=function(e){var n=this,r=n.db,i=n.name;this.schema.mappedClass=e,e.prototype instanceof Pt&&(e=function(e){t(n,e);function n(){return e!==null&&e.apply(this,arguments)||this}return Object.defineProperty(n.prototype,"db",{get:function(){return r},enumerable:!1,configurable:!0}),n.prototype.table=function(){return i},n}(e));for(var a=new Set,o=e.prototype;o;o=c(o))Object.getOwnPropertyNames(o).forEach(function(e){return a.add(e)});var s=function(t){if(!t)return t;var n=Object.create(e.prototype);for(var r in t)if(!a.has(r))try{n[r]=t[r]}catch{}return n};return this.schema.readHook&&this.hook.reading.unsubscribe(this.schema.readHook),this.schema.readHook=s,this.hook(`reading`,s),e},e.prototype.defineClass=function(){function e(e){s(this,e)}return this.mapToClass(e)},e.prototype.add=function(e,t){var n=this,r=this.schema.primKey,i=r.auto,a=r.keyPath,o=e;return a&&i&&(o=Nt(a)(e)),this._trans(`readwrite`,function(e){return n.core.mutate({trans:e,type:`add`,keys:t==null?null:[t],values:[o]})}).then(function(e){return e.numFailures?R.reject(e.failures[0]):e.lastResult}).then(function(t){if(a)try{w(e,a,t)}catch{}return t})},e.prototype.upsert=function(e,t){var n=this,r=this.schema.primKey.keyPath;return this._trans(`readwrite`,function(i){return n.core.get({trans:i,key:e}).then(function(a){var o=a??{};return Vt(o,t),r&&w(o,r,e),n.core.mutate({trans:i,type:`put`,values:[o],keys:[e],upsert:!0,updates:{keys:[e],changeSpecs:[t]}}).then(function(e){return e.numFailures?R.reject(e.failures[0]):!!a})})})},e.prototype.update=function(e,t){if(typeof e==`object`&&!o(e)){var n=C(e,this.schema.primKey.keyPath);return n===void 0?K(new j.InvalidArgument(`Given object does not contain its primary key`)):this.where(`:id`).equals(n).modify(t)}return this.where(`:id`).equals(e).modify(t)},e.prototype.put=function(e,t){var n=this,r=this.schema.primKey,i=r.auto,a=r.keyPath,o=e;return a&&i&&(o=Nt(a)(e)),this._trans(`readwrite`,function(e){return n.core.mutate({trans:e,type:`put`,values:[o],keys:t==null?null:[t]})}).then(function(e){return e.numFailures?R.reject(e.failures[0]):e.lastResult}).then(function(t){if(a)try{w(e,a,t)}catch{}return t})},e.prototype.delete=function(e){var t=this;return this._trans(`readwrite`,function(n){return t.core.mutate({trans:n,type:`delete`,keys:[e]}).then(function(n){return zt(t,[e],n)}).then(function(e){return e.numFailures?R.reject(e.failures[0]):void 0})})},e.prototype.clear=function(){var e=this;return this._trans(`readwrite`,function(t){return e.core.mutate({trans:t,type:`deleteRange`,range:Mt}).then(function(t){return zt(e,null,t)})}).then(function(e){return e.numFailures?R.reject(e.failures[0]):void 0})},e.prototype.bulkGet=function(e){var t=this;return this._trans(`readonly`,function(n){return t.core.getMany({keys:e,trans:n}).then(function(e){return e.map(function(e){return t.hook.reading.fire(e)})})})},e.prototype.bulkAdd=function(e,t,n){var r=this,i=Array.isArray(t)?t:void 0;n||=i?void 0:t;var a=n?n.allKeys:void 0;return this._trans(`readwrite`,function(t){var n=r.schema.primKey,o=n.auto,s=n.keyPath;if(s&&i)throw new j.InvalidArgument(`bulkAdd(): keys argument invalid on tables with inbound keys`);if(i&&i.length!==e.length)throw new j.InvalidArgument(`Arguments objects and keys must have the same length`);var c=e.length,l=s&&o?e.map(Nt(s)):e;return r.core.mutate({trans:t,type:`add`,keys:i,values:l,wantResults:a}).then(function(e){var t=e.numFailures,n=e.results,i=e.lastResult,o=e.failures,s=a?n:i;if(t===0)return s;throw new A(`${r.name}.bulkAdd(): ${t} of ${c} operations failed`,o)})})},e.prototype.bulkPut=function(e,t,n){var r=this,i=Array.isArray(t)?t:void 0;n||=i?void 0:t;var a=n?n.allKeys:void 0;return this._trans(`readwrite`,function(t){var n=r.schema.primKey,o=n.auto,s=n.keyPath;if(s&&i)throw new j.InvalidArgument(`bulkPut(): keys argument invalid on tables with inbound keys`);if(i&&i.length!==e.length)throw new j.InvalidArgument(`Arguments objects and keys must have the same length`);var c=e.length,l=s&&o?e.map(Nt(s)):e;return r.core.mutate({trans:t,type:`put`,keys:i,values:l,wantResults:a}).then(function(e){var t=e.numFailures,n=e.results,i=e.lastResult,o=e.failures,s=a?n:i;if(t===0)return s;throw new A(`${r.name}.bulkPut(): ${t} of ${c} operations failed`,o)})})},e.prototype.bulkUpdate=function(e){var t=this,n=e.map(function(e){return e.key}),r=e.map(function(e){return e.changes}),i=[];return this._trans(`readwrite`,function(a){var o=t.core;return o.getMany({trans:a,keys:n,cache:`clone`}).then(function(s){var c=o.schema.primaryKey,l=c.outbound,u=c.extractKey,d=[],f=[];e.forEach(function(e,t){var n=e.key,r=e.changes,a=s[t];if(a){for(var o=0,c=Object.keys(r);o<c.length;o++){var p=c[o];w(a,p,r[p])}if(!l&&Y(u(a),n)!==0)throw new j.Constraint(`Cannot update primary key in bulkUpdate()`);i.push(t),d.push(n),f.push(a)}});var p=d.length;return o.mutate({trans:a,type:`put`,keys:d,values:f,updates:{keys:n,changeSpecs:r}}).then(function(e){var n=e.numFailures,r=e.failures;if(n===0)return p;for(var a=0,o=Object.keys(r);a<o.length;a++){var s=o[a],c=i[Number(s)];if(c!=null){var l=r[s];delete r[s],r[c]=l}}throw new A(`${t.name}.bulkUpdate(): ${n} of ${p} operations failed`,r)})})})},e.prototype.bulkDelete=function(e){var t=this,n=e.length;return this._trans(`readwrite`,function(n){return t.core.mutate({trans:n,type:`delete`,keys:e}).then(function(n){return zt(t,e,n)})}).then(function(e){var r=e.numFailures,i=e.lastResult,a=e.failures;if(r===0)return i;throw new A(`${t.name}.bulkDelete(): ${r} of ${n} operations failed`,a)})},e}();function Ut(e){var t={},n=function(n,r){if(r){for(var i=arguments.length,a=Array(i-1);--i;)a[i-1]=arguments[i];return t[n].subscribe.apply(null,a),e}if(typeof n==`string`)return t[n]};n.addEventType=s;for(var r=1,i=arguments.length;r<i;++r)s(arguments[r]);return n;function s(e,r,i){if(typeof e==`object`)return c(e);r||=Ae,i||=M;var a={subscribers:[],fire:i,subscribe:function(e){a.subscribers.indexOf(e)===-1&&(a.subscribers.push(e),a.fire=r(a.fire,e))},unsubscribe:function(e){a.subscribers=a.subscribers.filter(function(t){return t!==e}),a.fire=a.subscribers.reduce(r,i)}};return t[e]=n[e]=a,a}function c(e){a(e).forEach(function(t){var n=e[t];if(o(n))s(t,e[t][0],e[t][1]);else if(n===`asap`)var r=s(t,Te,function(){for(var e=arguments.length,t=Array(e);e--;)t[e]=arguments[e];r.subscribers.forEach(function(e){x(function(){e.apply(null,t)})})});else throw new j.InvalidArgument(`Invalid event config`)})}}function Wt(e,t){return m(t).from({prototype:e}),t}function Gt(e){return Wt(Ht.prototype,function(t,n,r){this.db=e,this._tx=r,this.name=t,this.schema=n,this.hook=e._allTables[t]?e._allTables[t].hook:Ut(null,{creating:[De,M],reading:[Ee,Te],updating:[ke,M],deleting:[Oe,M]})})}function Kt(e,t){return!(e.filter||e.algorithm||e.or)&&(t?e.justLimit:!e.replayFilter)}function qt(e,t){e.filter=J(e.filter,t)}function Jt(e,t,n){var r=e.replayFilter;e.replayFilter=r?function(){return J(r(),t())}:t,e.justLimit=n&&!r}function Yt(e,t){e.isMatch=J(e.isMatch,t)}function Xt(e,t){if(e.isPrimKey)return t.primaryKey;var n=t.getIndexByKeyPath(e.index);if(!n)throw new j.Schema(`KeyPath `+e.index+` on object store `+t.name+` is not indexed`);return n}function Zt(e,t,n){var r=Xt(e,t.schema);return t.openCursor({trans:n,values:!e.keysOnly,reverse:e.dir===`prev`,unique:!!e.unique,query:{index:r,range:e.range}})}function Qt(e,t,n,r){var i=e.replayFilter?J(e.filter,e.replayFilter()):e.filter;if(e.or){var a={},o=function(e,n,r){if(!i||i(n,r,function(e){return n.stop(e)},function(e){return n.fail(e)})){var o=n.primaryKey,s=``+o;s===`[object ArrayBuffer]`&&(s=``+new Uint8Array(o)),u(a,s)||(a[s]=!0,t(e,n,r))}};return Promise.all([e.or._iterate(o,n),$t(Zt(e,r,n),e.algorithm,o,!e.keysOnly&&e.valueMapper)])}return $t(Zt(e,r,n),J(e.algorithm,i),t,!e.keysOnly&&e.valueMapper)}function $t(e,t,n,r){var i=B(r?function(e,t,i){return n(r(e),t,i)}:n);return e.then(function(e){if(e)return e.start(function(){var n=function(){return e.continue()};(!t||t(e,function(e){return n=e},function(t){e.stop(t),n=M},function(t){e.fail(t),n=M}))&&i(e.value,e,function(e){return n=e}),n()})})}var en=function(){function e(){}return e.prototype._read=function(e,t){var n=this._ctx;return n.error?n.table._trans(null,K.bind(null,n.error)):n.table._trans(`readonly`,e).then(t)},e.prototype._write=function(e){var t=this._ctx;return t.error?t.table._trans(null,K.bind(null,t.error)):t.table._trans(`readwrite`,e,`locked`)},e.prototype._addAlgorithm=function(e){var t=this._ctx;t.algorithm=J(t.algorithm,e)},e.prototype._iterate=function(e,t){return Qt(this._ctx,e,t,this._ctx.table.core)},e.prototype.clone=function(e){var t=Object.create(this.constructor.prototype),n=Object.create(this._ctx);return e&&s(n,e),t._ctx=n,t},e.prototype.raw=function(){return this._ctx.valueMapper=null,this},e.prototype.each=function(e){var t=this._ctx;return this._read(function(n){return Qt(t,e,n,t.table.core)})},e.prototype.count=function(e){var t=this;return this._read(function(e){var n=t._ctx,r=n.table.core;if(Kt(n,!0))return r.count({trans:e,query:{index:Xt(n,r.schema),range:n.range}}).then(function(e){return Math.min(e,n.limit)});var i=0;return Qt(n,function(){return++i,!1},e,r).then(function(){return i})}).then(e)},e.prototype.sortBy=function(e,t){var n=e.split(`.`).reverse(),r=n[0],i=n.length-1;function a(e,t){return t?a(e[n[t]],t-1):e[r]}var o=this._ctx.dir===`next`?1:-1;function s(e,t){return Y(a(e,i),a(t,i))*o}return this.toArray(function(e){return e.slice().sort(s)}).then(t)},e.prototype.toArray=function(e){var t=this;return this._read(function(e){var n=t._ctx;if(Kt(n,!0)&&n.limit>0){var r=n.valueMapper,i=Xt(n,n.table.core.schema);return n.table.core.query({trans:e,limit:n.limit,values:!0,direction:n.dir===`prev`?`prev`:void 0,query:{index:i,range:n.range}}).then(function(e){var t=e.result;return r?t.map(r):t})}var a=[];return Qt(n,function(e){return a.push(e)},e,n.table.core).then(function(){return a})},e)},e.prototype.offset=function(e){var t=this._ctx;return e<=0||(t.offset+=e,Kt(t)?Jt(t,function(){var t=e;return function(e,n){return t===0?!0:t===1?(--t,!1):(n(function(){e.advance(t),t=0}),!1)}}):Jt(t,function(){var t=e;return function(){return--t<0}})),this},e.prototype.limit=function(e){return this._ctx.limit=Math.min(this._ctx.limit,e),Jt(this._ctx,function(){var t=e;return function(e,n,r){return--t<=0&&n(r),t>=0}},!0),this},e.prototype.until=function(e,t){return qt(this._ctx,function(n,r,i){return!e(n.value)||(r(i),t)}),this},e.prototype.first=function(e){return this.limit(1).toArray(function(e){return e[0]}).then(e)},e.prototype.last=function(e){return this.reverse().first(e)},e.prototype.filter=function(e){return qt(this._ctx,function(t){return e(t.value)}),Yt(this._ctx,e),this},e.prototype.and=function(e){return this.filter(e)},e.prototype.or=function(e){return new this.db.WhereClause(this._ctx.table,e,this)},e.prototype.reverse=function(){return this._ctx.dir=this._ctx.dir===`prev`?`next`:`prev`,this._ondirectionchange&&this._ondirectionchange(this._ctx.dir),this},e.prototype.desc=function(){return this.reverse()},e.prototype.eachKey=function(e){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each(function(t,n){e(n.key,n)})},e.prototype.eachUniqueKey=function(e){return this._ctx.unique=`unique`,this.eachKey(e)},e.prototype.eachPrimaryKey=function(e){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each(function(t,n){e(n.primaryKey,n)})},e.prototype.keys=function(e){var t=this._ctx;t.keysOnly=!t.isMatch;var n=[];return this.each(function(e,t){n.push(t.key)}).then(function(){return n}).then(e)},e.prototype.primaryKeys=function(e){var t=this._ctx;if(Kt(t,!0)&&t.limit>0)return this._read(function(e){var n=Xt(t,t.table.core.schema);return t.table.core.query({trans:e,values:!1,limit:t.limit,direction:t.dir===`prev`?`prev`:void 0,query:{index:n,range:t.range}})}).then(function(e){return e.result}).then(e);t.keysOnly=!t.isMatch;var n=[];return this.each(function(e,t){n.push(t.primaryKey)}).then(function(){return n}).then(e)},e.prototype.uniqueKeys=function(e){return this._ctx.unique=`unique`,this.keys(e)},e.prototype.firstKey=function(e){return this.limit(1).keys(function(e){return e[0]}).then(e)},e.prototype.lastKey=function(e){return this.reverse().firstKey(e)},e.prototype.distinct=function(){var e=this._ctx,t=e.index&&e.table.schema.idxByName[e.index];if(!t||!t.multi)return this;var n={};return qt(this._ctx,function(e){var t=e.primaryKey.toString(),r=u(n,t);return n[t]=!0,!r}),this},e.prototype.modify=function(e){var t=this,n=this._ctx;return this._write(function(r){var i=typeof e==`function`?e:function(t){return Vt(t,e)},o=n.table.core,s=o.schema.primaryKey,c=s.outbound,l=s.extractKey,u=200,d=t.db._options.modifyChunkSize;d&&(u=typeof d==`object`?d[o.name]||d[`*`]||200:d);var f=[],p=0,m=[],h=function(e,t){var n=t.failures,r=t.numFailures;p+=e-r;for(var i=0,o=a(n);i<o.length;i++){var s=o[i];f.push(n[s])}},g=e===tn;return t.clone().primaryKeys().then(function(t){var a=Kt(n)&&n.limit===1/0&&(typeof e!=`function`||g)&&{index:n.index,range:n.range},s=function(d){var f=Math.min(u,t.length-d),p=t.slice(d,d+f);return(g?Promise.resolve([]):o.getMany({trans:r,keys:p,cache:`immutable`})).then(function(m){var _=[],v=[],y=c?[]:null,b=g?p:[];if(!g)for(var x=0;x<f;++x){var S=m[x],C={value:se(S),primKey:t[d+x]};i.call(C,C.value,C)!==!1&&(C.value==null?b.push(t[d+x]):!c&&Y(l(S),l(C.value))!==0?(b.push(t[d+x]),_.push(C.value)):(v.push(C.value),c&&y.push(t[d+x])))}return Promise.resolve(_.length>0&&o.mutate({trans:r,type:`add`,values:_}).then(function(e){for(var t in e.failures)b.splice(parseInt(t),1);h(_.length,e)})).then(function(){return(v.length>0||a&&typeof e==`object`)&&o.mutate({trans:r,type:`put`,keys:y,values:v,criteria:a,changeSpec:typeof e!=`function`&&e,isAdditionalChunk:d>0}).then(function(e){return h(v.length,e)})}).then(function(){return(b.length>0||a&&g)&&o.mutate({trans:r,type:`delete`,keys:b,criteria:a,isAdditionalChunk:d>0}).then(function(e){return zt(n.table,b,e)}).then(function(e){return h(b.length,e)})}).then(function(){return t.length>d+f&&s(d+u)})})};return s(0).then(function(){if(f.length>0)throw new ye(`Error modifying one or more objects`,f,p,m);return t.length})})})},e.prototype.delete=function(){var e=this._ctx,t=e.range;return Kt(e)&&!e.table.schema.yProps&&(e.isPrimKey||t.type===3)?this._write(function(n){var r=e.table.core.schema.primaryKey,i=t;return e.table.core.count({trans:n,query:{index:r,range:i}}).then(function(t){return e.table.core.mutate({trans:n,type:`deleteRange`,range:i}).then(function(e){var n=e.failures,r=e.numFailures;if(r)throw new ye(`Could not delete some values`,Object.keys(n).map(function(e){return n[e]}),t-r);return t-r})})}):this.modify(tn)},e}(),tn=function(e,t){return t.value=null};function nn(e){return Wt(en.prototype,function(t,n){this.db=e;var r=Mt,i=null;if(n)try{r=n()}catch(e){i=e}var a=t._ctx,o=a.table,s=o.hook.reading.fire;this._ctx={table:o,index:a.index,isPrimKey:!a.index||o.schema.primKey.keyPath&&a.index===o.schema.primKey.name,range:r,keysOnly:!1,dir:`next`,unique:``,algorithm:null,filter:null,replayFilter:null,justLimit:!0,isMatch:null,offset:0,limit:1/0,error:i,or:a.or,valueMapper:s===Te?null:s}})}function rn(e,t){return e<t?-1:e===t?0:1}function an(e,t){return e>t?-1:e===t?0:1}function X(e,t,n){var r=e instanceof pn?new e.Collection(e):e;return r._ctx.error=n?new n(t):TypeError(t),r}function on(e){var t=new e.Collection(e,function(){return fn(``)});return t._addAlgorithm(function(){return!1}),t}function sn(e){return e===`next`?function(e){return e.toUpperCase()}:function(e){return e.toLowerCase()}}function cn(e){return e===`next`?function(e){return e.toLowerCase()}:function(e){return e.toUpperCase()}}function ln(e,t,n,r,i,a){for(var o=Math.min(e.length,r.length),s=-1,c=0;c<o;++c){var l=t[c];if(l!==r[c])return i(e[c],n[c])<0?e.substr(0,c)+n[c]+n.substr(c+1):i(e[c],r[c])<0?e.substr(0,c)+r[c]+n.substr(c+1):s>=0?e.substr(0,s)+t[s]+n.substr(s+1):null;i(e[c],l)<0&&(s=c)}return o<r.length&&a===`next`?e+n.substr(e.length):o<e.length&&a===`prev`?e.substr(0,n.length):s<0?null:e.substr(0,s)+r[s]+n.substr(s+1)}function un(e,t,n,r){var i,a,o,s,c,l,u,d=n.length;if(!n.every(function(e){return typeof e==`string`}))return X(e,Dt);function f(e){i=sn(e),a=cn(e),o=e===`next`?rn:an;var t=n.map(function(e){return{lower:a(e),upper:i(e)}}).sort(function(e,t){return o(e.lower,t.lower)});s=t.map(function(e){return e.upper}),c=t.map(function(e){return e.lower}),l=e,u=e===`next`?``:r}f(`next`);var p=new e.Collection(e,function(){return dn(s[0],c[d-1]+r)});p._ondirectionchange=function(e){f(e)};var m=0;return p._addAlgorithm(function(e,n,r){var i=e.key;if(typeof i!=`string`)return!1;var f=a(i);if(t(f,c,m))return!0;for(var p=null,h=m;h<d;++h){var g=ln(i,f,s[h],c[h],o,l);g===null&&p===null?m=h+1:(p===null||o(p,g)>0)&&(p=g)}return n(p===null?r:function(){e.continue(p+u)}),!1}),p}function dn(e,t,n,r){return{type:2,lower:e,upper:t,lowerOpen:n,upperOpen:r}}function fn(e){return{type:1,lower:e,upper:e}}var pn=function(){function e(){}return Object.defineProperty(e.prototype,"Collection",{get:function(){return this._ctx.table.db.Collection},enumerable:!1,configurable:!0}),e.prototype.between=function(e,t,n,r){n=n!==!1,r=r===!0;try{return this._cmp(e,t)>0||this._cmp(e,t)===0&&(n||r)&&!(n&&r)?on(this):new this.Collection(this,function(){return dn(e,t,!n,!r)})}catch{return X(this,q)}},e.prototype.equals=function(e){return e==null?X(this,q):new this.Collection(this,function(){return fn(e)})},e.prototype.above=function(e){return e==null?X(this,q):new this.Collection(this,function(){return dn(e,void 0,!0)})},e.prototype.aboveOrEqual=function(e){return e==null?X(this,q):new this.Collection(this,function(){return dn(e,void 0,!1)})},e.prototype.below=function(e){return e==null?X(this,q):new this.Collection(this,function(){return dn(void 0,e,!1,!0)})},e.prototype.belowOrEqual=function(e){return e==null?X(this,q):new this.Collection(this,function(){return dn(void 0,e)})},e.prototype.startsWith=function(e){return typeof e==`string`?this.between(e,e+Tt,!0,!0):X(this,Dt)},e.prototype.startsWithIgnoreCase=function(e){return e===``?this.startsWith(e):un(this,function(e,t){return e.indexOf(t[0])===0},[e],Tt)},e.prototype.equalsIgnoreCase=function(e){return un(this,function(e,t){return e===t[0]},[e],``)},e.prototype.anyOfIgnoreCase=function(){var e=D.apply(pe,arguments);return e.length===0?on(this):un(this,function(e,t){return t.indexOf(e)!==-1},e,``)},e.prototype.startsWithAnyOfIgnoreCase=function(){var e=D.apply(pe,arguments);return e.length===0?on(this):un(this,function(e,t){return t.some(function(t){return e.indexOf(t)===0})},e,Tt)},e.prototype.anyOf=function(){var e=this,t=D.apply(pe,arguments),n=this._cmp;try{t.sort(n)}catch{return X(this,q)}if(t.length===0)return on(this);var r=new this.Collection(this,function(){return dn(t[0],t[t.length-1])});r._ondirectionchange=function(r){n=r===`next`?e._ascending:e._descending,t.sort(n)};var i=0;return r._addAlgorithm(function(e,r,a){for(var o=e.key;n(o,t[i])>0;)if(++i,i===t.length)return r(a),!1;return n(o,t[i])===0||(r(function(){e.continue(t[i])}),!1)}),r},e.prototype.notEqual=function(e){return this.inAnyRange([[Et,e],[e,this.db._maxKey]],{includeLowers:!1,includeUppers:!1})},e.prototype.noneOf=function(){var e=D.apply(pe,arguments);if(e.length===0)return new this.Collection(this);try{e.sort(this._ascending)}catch{return X(this,q)}var t=e.reduce(function(e,t){return e?e.concat([[e[e.length-1][1],t]]):[[Et,t]]},null);return t.push([e[e.length-1],this.db._maxKey]),this.inAnyRange(t,{includeLowers:!1,includeUppers:!1})},e.prototype.inAnyRange=function(e,t){var n=this,r=this._cmp,i=this._ascending,a=this._descending,o=this._min,s=this._max;if(e.length===0)return on(this);if(!e.every(function(e){return e[0]!==void 0&&e[1]!==void 0&&i(e[0],e[1])<=0}))return X(this,`First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower`,j.InvalidArgument);var c=!t||t.includeLowers!==!1,l=t&&t.includeUppers===!0;function u(e,t){for(var n=0,i=e.length;n<i;++n){var a=e[n];if(r(t[0],a[1])<0&&r(t[1],a[0])>0){a[0]=o(a[0],t[0]),a[1]=s(a[1],t[1]);break}}return n===i&&e.push(t),e}var d=i;function f(e,t){return d(e[0],t[0])}var p;try{p=e.reduce(u,[]),p.sort(f)}catch{return X(this,q)}var m=0,h=l?function(e){return i(e,p[m][1])>0}:function(e){return i(e,p[m][1])>=0},g=c?function(e){return a(e,p[m][0])>0}:function(e){return a(e,p[m][0])>=0};function _(e){return!h(e)&&!g(e)}var v=h,y=new this.Collection(this,function(){return dn(p[0][0],p[p.length-1][1],!c,!l)});return y._ondirectionchange=function(e){e===`next`?(v=h,d=i):(v=g,d=a),p.sort(f)},y._addAlgorithm(function(e,t,r){for(var a=e.key;v(a);)if(++m,m===p.length)return t(r),!1;return _(a)?!0:(n._cmp(a,p[m][1])===0||n._cmp(a,p[m][0])===0||t(function(){d===i?e.continue(p[m][0]):e.continue(p[m][1])}),!1)}),y},e.prototype.startsWithAnyOf=function(){var e=D.apply(pe,arguments);return e.every(function(e){return typeof e==`string`})?e.length===0?on(this):this.inAnyRange(e.map(function(e){return[e,e+Tt]})):X(this,`startsWithAnyOf() only works with strings`)},e}();function mn(e){return Wt(pn.prototype,function(t,n,r){if(this.db=e,this._ctx={table:t,index:n===`:id`?null:n,or:r},this._cmp=this._ascending=Y,this._descending=function(e,t){return Y(t,e)},this._max=function(e,t){return Y(e,t)>0?e:t},this._min=function(e,t){return Y(e,t)<0?e:t},this._IDBKeyRange=e._deps.IDBKeyRange,!this._IDBKeyRange)throw new j.MissingAPI})}function Z(e){return B(function(t){return hn(t),e(t.target.error),!1})}function hn(e){e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault()}var gn=`storagemutated`,_n=`x-storagemutated-1`,vn=Ut(null,gn),yn=function(){function e(){}return e.prototype._lock=function(){return b(!L.global),++this._reculock,this._reculock===1&&!L.global&&(L.lockOwnerFor=this),this},e.prototype._unlock=function(){if(b(!L.global),--this._reculock===0)for(L.global||(L.lockOwnerFor=null);this._blockedFuncs.length>0&&!this._locked();){var e=this._blockedFuncs.shift();try{G(e[1],e[0])}catch{}}return this},e.prototype._locked=function(){return this._reculock&&L.lockOwnerFor!==this},e.prototype.create=function(e){var t=this;if(!this.mode)return this;var n=this.db.idbdb,r=this.db._state.dbOpenError;if(b(!this.idbtrans),!e&&!n)switch(r&&r.name){case`DatabaseClosedError`:throw new j.DatabaseClosed(r);case`MissingAPIError`:throw new j.MissingAPI(r.message,r);default:throw new j.OpenFailed(r)}if(!this.active)throw new j.TransactionInactive;return b(this._completion._state===null),e=this.idbtrans=e||(this.db.core?this.db.core.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability}):n.transaction(this.storeNames,this.mode,{durability:this.chromeTransactionDurability})),e.onerror=B(function(n){hn(n),t._reject(e.error)}),e.onabort=B(function(n){hn(n),t.active&&t._reject(new j.Abort(e.error)),t.active=!1,t.on(`abort`).fire(n)}),e.oncomplete=B(function(){t.active=!1,t._resolve(),`mutatedParts`in e&&vn.storagemutated.fire(e.mutatedParts)}),this},e.prototype._promise=function(e,t,n){var r=this;if(e===`readwrite`&&this.mode!==`readwrite`)return K(new j.ReadOnly(`Transaction is readonly`));if(!this.active)return K(new j.TransactionInactive);if(this._locked())return new R(function(i,a){r._blockedFuncs.push([function(){r._promise(e,t,n).then(i,a)},L])});if(n)return H(function(){var e=new R(function(e,n){r._lock();var i=t(e,n,r);i&&i.then&&i.then(e,n)});return e.finally(function(){return r._unlock()}),e._lib=!0,e});var i=new R(function(e,n){var i=t(e,n,r);i&&i.then&&i.then(e,n)});return i._lib=!0,i},e.prototype._root=function(){return this.parent?this.parent._root():this},e.prototype.waitFor=function(e){var t=this._root(),n=R.resolve(e);if(t._waitingFor)t._waitingFor=t._waitingFor.then(function(){return n});else{t._waitingFor=n,t._waitingQueue=[];var r=t.idbtrans.objectStore(t.storeNames[0]);(function e(){for(++t._spinCount;t._waitingQueue.length;)t._waitingQueue.shift()();t._waitingFor&&(r.get(-1/0).onsuccess=e)})()}var i=t._waitingFor;return new R(function(e,r){n.then(function(n){return t._waitingQueue.push(B(e.bind(null,n)))},function(e){return t._waitingQueue.push(B(r.bind(null,e)))}).finally(function(){t._waitingFor===i&&(t._waitingFor=null)})})},e.prototype.abort=function(){this.active&&(this.active=!1,this.idbtrans&&this.idbtrans.abort(),this._reject(new j.Abort))},e.prototype.table=function(e){var t=this._memoizedTables||={};if(u(t,e))return t[e];var n=this.schema[e];if(!n)throw new j.NotFound(`Table `+e+` not part of transaction`);var r=new this.db.Table(e,n,this);return r.core=this.db.core.table(e),t[e]=r,r},e}();function bn(e){return Wt(yn.prototype,function(t,n,r,i,a){var o=this;t!==`readonly`&&n.forEach(function(e){var t=r[e]?.yProps;t&&(n=n.concat(t.map(function(e){return e.updatesTable})))}),this.db=e,this.mode=t,this.storeNames=n,this.schema=r,this.chromeTransactionDurability=i,this.idbtrans=null,this.on=Ut(this,`complete`,`error`,`abort`),this.parent=a||null,this.active=!0,this._reculock=0,this._blockedFuncs=[],this._resolve=null,this._reject=null,this._waitingFor=null,this._waitingQueue=null,this._spinCount=0,this._completion=new R(function(e,t){o._resolve=e,o._reject=t}),this._completion.then(function(){o.active=!1,o.on.complete.fire()},function(e){var t=o.active;return o.active=!1,o.on.error.fire(e),o.parent?o.parent._reject(e):t&&o.idbtrans&&o.idbtrans.abort(),K(e)})})}function xn(e,t,n,r,i,a,o,s){return{name:e,keyPath:t,unique:n,multi:r,auto:i,compound:a,src:(n&&!o?`&`:``)+(r?`*`:``)+(i?`++`:``)+Sn(t),type:s}}function Sn(e){return typeof e==`string`?e:e?`[`+[].join.call(e,`+`)+`]`:``}function Cn(e,t,n){return{name:e,primKey:t,indexes:n,mappedClass:null,idxByName:S(n,function(e){return[e.name,e]})}}function wn(e){return e.length===1?e[0]:e}var Tn=function(e){try{return e.only([[]]),Tn=function(){return[[]]},[[]]}catch{return Tn=function(){return Tt},Tt}};function En(e){return e==null?function(){}:typeof e==`string`?Dn(e):function(t){return C(t,e)}}function Dn(e){return e.split(`.`).length===1?function(t){return t[e]}:function(t){return C(t,e)}}function On(e){return[].slice.call(e)}var kn=0;function An(e){return e==null?`:id`:typeof e==`string`?e:`[${e.join(`+`)}]`}function jn(e,t,n){function r(e,t){var n=On(e.objectStoreNames),r=n.length>0?t.objectStore(n[0]):{};return{schema:{name:e.name,tables:n.map(function(e){return t.objectStore(e)}).map(function(e){var t=e.keyPath,n=e.autoIncrement,r=o(t),i=t==null,a={},s={name:e.name,primaryKey:{name:null,isPrimaryKey:!0,outbound:i,compound:r,keyPath:t,autoIncrement:n,unique:!0,extractKey:En(t)},indexes:On(e.indexNames).map(function(t){return e.index(t)}).map(function(e){var t=e.name,n=e.unique,r=e.multiEntry,i=e.keyPath,s={name:t,compound:o(i),keyPath:i,unique:n,multiEntry:r,extractKey:En(i)};return a[An(i)]=s,s}),getIndexByKeyPath:function(e){return a[An(e)]}};return a[`:id`]=s.primaryKey,t!=null&&(a[An(t)]=s.primaryKey),s})},hasGetAll:n.length>0&&`getAll`in r&&!(typeof navigator<`u`&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604),hasIdb3Features:`getAllRecords`in r}}function i(e){if(e.type===3)return null;if(e.type===4)throw Error(`Cannot convert never type to IDBKeyRange`);var n=e.lower,r=e.upper,i=e.lowerOpen,a=e.upperOpen;return n===void 0?r===void 0?null:t.upperBound(r,!!a):r===void 0?t.lowerBound(n,!!i):t.bound(n,r,!!i,!!a)}function a(e){var t=e.name;function n(e){var n=e.trans,r=e.type,a=e.keys,o=e.values,s=e.range;return new Promise(function(e,c){e=B(e);var l=n.objectStore(t),u=l.keyPath==null,d=r===`put`||r===`add`;if(!d&&r!==`delete`&&r!==`deleteRange`)throw Error(`Invalid operation type: `+r);var f=(a||o||{length:1}).length;if(a&&o&&a.length!==o.length)throw Error(`Given keys array must have same length as given values array.`);if(f===0)return e({numFailures:0,failures:{},results:[],lastResult:void 0});var p,m=[],h=[],g=0,_=function(e){++g,hn(e)};if(r===`deleteRange`){if(s.type===4)return e({numFailures:g,failures:h,results:[],lastResult:void 0});s.type===3?m.push(p=l.clear()):m.push(p=l.delete(i(s)))}else{var v=d?u?[o,a]:[o,null]:[a,null],y=v[0],b=v[1];if(d)for(var x=0;x<f;++x)m.push(p=b&&b[x]!==void 0?l[r](y[x],b[x]):l[r](y[x])),p.onerror=_;else for(var x=0;x<f;++x)m.push(p=l[r](y[x])),p.onerror=_}var S=function(t){var n=t.target.result;m.forEach(function(e,t){return e.error!=null&&(h[t]=e.error)}),e({numFailures:g,failures:h,results:r===`delete`?a:m.map(function(e){return e.result}),lastResult:n})};p.onerror=function(e){_(e),S(e)},p.onsuccess=S})}function r(e){var n=e.trans,r=e.values,a=e.query,o=e.reverse,s=e.unique;return new Promise(function(e,c){e=B(e);var l=a.index,u=a.range,d=n.objectStore(t),f=l.isPrimaryKey?d:d.index(l.name),p=o?s?`prevunique`:`prev`:s?`nextunique`:`next`,m=r||!(`openKeyCursor`in f)?f.openCursor(i(u),p):f.openKeyCursor(i(u),p);m.onerror=Z(c),m.onsuccess=B(function(t){var r=m.result;if(!r)e(null);else{r.___id=++kn,r.done=!1;var i=r.continue.bind(r),a=r.continuePrimaryKey;a&&=a.bind(r);var o=r.advance.bind(r),s=function(){throw Error(`Cursor not started`)},l=function(){throw Error(`Cursor not stopped`)};r.trans=n,r.stop=r.continue=r.continuePrimaryKey=r.advance=s,r.fail=B(c),r.next=function(){var e=this,t=1;return this.start(function(){return t--?e.continue():e.stop()}).then(function(){return e})},r.start=function(e){var t=new Promise(function(e,t){e=B(e),m.onerror=Z(t),r.fail=t,r.stop=function(t){r.stop=r.continue=r.continuePrimaryKey=r.advance=l,e(t)}}),n=function(){if(m.result)try{e()}catch(e){r.fail(e)}else r.done=!0,r.start=function(){throw Error(`Cursor behind last entry`)},r.stop()};return m.onsuccess=B(function(e){m.onsuccess=n,n()}),r.continue=i,r.continuePrimaryKey=a,r.advance=o,n(),t},e(r)}},c)})}function a(e,n){return function(r){return new Promise(function(a,o){a=B(a);var s=r.trans,c=r.values,l=r.limit,u=r.query,d=r.direction??`next`,f=l===1/0?void 0:l,p=u.index,m=u.range,h=s.objectStore(t),g=p.isPrimaryKey?h:h.index(p.name),_=i(m);if(l===0)return a({result:[]});if(n){var v={query:_,count:f,direction:d},y=c?g.getAll(v):g.getAllKeys(v);y.onsuccess=function(e){return a({result:e.target.result})},y.onerror=Z(o)}else if(e&&d===`next`){var y=c?g.getAll(_,f):g.getAllKeys(_,f);y.onsuccess=function(e){return a({result:e.target.result})},y.onerror=Z(o)}else{var b=0,x=c||!(`openKeyCursor`in g)?g.openCursor(_,d):g.openKeyCursor(_,d),S=[];x.onsuccess=function(){var e=x.result;if(!e||(S.push(c?e.value:e.primaryKey),++b===l))return a({result:S});e.continue()},x.onerror=Z(o)}})}}return{name:t,schema:e,mutate:n,getMany:function(e){var n=e.trans,r=e.keys;return new Promise(function(e,i){e=B(e);for(var a=n.objectStore(t),o=r.length,s=Array(o),c=0,l=0,u,d=function(t){var n=t.target;s[n._pos]=n.result,++l===c&&e(s)},f=Z(i),p=0;p<o;++p)r[p]!=null&&(u=a.get(r[p]),u._pos=p,u.onsuccess=d,u.onerror=f,++c);c===0&&e(s)})},get:function(e){var n=e.trans,r=e.key;return new Promise(function(e,i){e=B(e);var a=n.objectStore(t).get(r);a.onsuccess=function(t){return e(t.target.result)},a.onerror=Z(i)})},query:a(l,u),openCursor:r,count:function(e){var n=e.query,r=e.trans,a=n.index,o=n.range;return new Promise(function(e,n){var s=r.objectStore(t),c=a.isPrimaryKey?s:s.index(a.name),l=i(o),u=l?c.count(l):c.count();u.onsuccess=B(function(t){return e(t.target.result)}),u.onerror=Z(n)})}}}var s=r(e,n),c=s.schema,l=s.hasGetAll,u=s.hasIdb3Features,d=c.tables.map(function(e){return a(e)}),f={};return d.forEach(function(e){return f[e.name]=e}),{stack:`dbcore`,transaction:e.transaction.bind(e),table:function(e){if(!f[e])throw Error(`Table '${e}' not found`);return f[e]},MIN_KEY:-1/0,MAX_KEY:Tn(t),schema:c}}function Mn(e,t){return t.reduce(function(e,t){var r=t.create;return n(n({},e),r(e))},e)}function Nn(e,t,n,r){var i=n.IDBKeyRange;return n.indexedDB,{dbcore:Mn(jn(t,i,r),e.dbcore)}}function Pn(e,t){var n=t.db;e.core=Nn(e._middlewares,n,e._deps,t).dbcore,e.tables.forEach(function(t){var n=t.name;e.core.schema.tables.some(function(e){return e.name===n})&&(t.core=e.core.table(n),e[n]instanceof e.Table&&(e[n].core=t.core))})}function Fn(e,t,n,r){n.forEach(function(n){var i=r[n];t.forEach(function(t){var r=g(t,n);(!r||`value`in r&&r.value===void 0)&&(t===e.Transaction.prototype||t instanceof e.Transaction?p(t,n,{get:function(){return this.table(n)},set:function(e){f(this,n,{value:e,writable:!0,configurable:!0,enumerable:!0})}}):t[n]=new e.Table(n,i))})})}function In(e,t){t.forEach(function(t){for(var n in t)t[n]instanceof e.Table&&delete t[n]})}function Ln(e,t){return e._cfg.version-t._cfg.version}function Rn(e,t,n,r){var i=e._dbSchema;n.objectStoreNames.contains(`$meta`)&&!i.$meta&&(i.$meta=Cn(`$meta`,Zn(``)[0],[]),e._storeNames.push(`$meta`));var o=e._createTransaction(`readwrite`,e._storeNames,i);o.create(n),o._completion.catch(r);var s=o._reject.bind(o),c=L.transless||L;H(function(){if(L.trans=o,L.transless=c,t===0)a(i).forEach(function(e){Un(n,e,i[e].primKey,i[e].indexes)}),Pn(e,n),R.follow(function(){return e.on.populate.fire(o)}).catch(s);else return Pn(e,n),Bn(e,o,t).then(function(t){return Vn(e,t,o,n)}).catch(s)})}function zn(e,t){Wn(e._dbSchema,t),t.db.version%10==0&&!t.objectStoreNames.contains(`$meta`)&&t.db.createObjectStore(`$meta`).add(Math.ceil(t.db.version/10-1),`version`);var n=qn(e,e.idbdb,t);Xn(e,e._dbSchema,t);for(var r=Hn(n,e._dbSchema),i=function(e){if(e.change.length||e.recreate)return console.warn(`Unable to patch indexes of table ${e.name} because it has changes on the type of index or primary key.`),{value:void 0};var n=t.objectStore(e.name);e.add.forEach(function(t){P&&console.debug(`Dexie upgrade patch: Creating missing index ${e.name}.${t.src}`),Kn(n,t)})},a=0,o=r.change;a<o.length;a++){var s=o[a],c=i(s);if(typeof c==`object`)return c.value}}function Bn(e,t,n){return t.storeNames.includes(`$meta`)?t.table(`$meta`).get(`version`).then(function(e){return e??n}):R.resolve(n)}function Vn(e,t,n,r){var i=[],o=e._versions,s=e._dbSchema=qn(e,e.idbdb,r),c=o.filter(function(e){return e._cfg.version>=t});if(c.length===0)return R.resolve();c.forEach(function(o){i.push(function(){var i=s,c=o._cfg.dbschema;Xn(e,i,r),Xn(e,c,r),s=e._dbSchema=c;var l=Hn(i,c);l.add.forEach(function(e){Un(r,e[0],e[1].primKey,e[1].indexes)}),l.change.forEach(function(e){if(e.recreate)throw new j.Upgrade(`Not yet support for changing primary key`);var t=r.objectStore(e.name);e.add.forEach(function(e){return Kn(t,e)}),e.change.forEach(function(e){t.deleteIndex(e.name),Kn(t,e)}),e.del.forEach(function(e){return t.deleteIndex(e)})});var u=o._cfg.contentUpgrade;if(u&&o._cfg.version>t){Pn(e,r),n._memoizedTables={};var d=ee(c);l.del.forEach(function(e){d[e]=i[e]}),In(e,[e.Transaction.prototype]),Fn(e,[e.Transaction.prototype],a(d),d),n.schema=d;var f=O(u);f&&gt();var p,m=R.follow(function(){if(p=u(n),p&&f){var e=U.bind(null,null);p.then(e,e)}});return p&&typeof p.then==`function`?R.resolve(p):m.then(function(){return p})}}),i.push(function(t){var r=o._cfg.dbschema;Gn(r,t),In(e,[e.Transaction.prototype]),Fn(e,[e.Transaction.prototype],e._storeNames,e._dbSchema),n.schema=e._dbSchema}),i.push(function(t){e.idbdb.objectStoreNames.contains(`$meta`)&&(Math.ceil(e.idbdb.version/10)===o._cfg.version?(e.idbdb.deleteObjectStore(`$meta`),delete e._dbSchema.$meta,e._storeNames=e._storeNames.filter(function(e){return e!==`$meta`})):t.objectStore(`$meta`).put(o._cfg.version,`version`))})});function l(){return i.length?R.resolve(i.shift()(n.idbtrans)).then(l):R.resolve()}return l().then(function(){Wn(s,r)})}function Hn(e,t){var n={del:[],add:[],change:[]},r;for(r in e)t[r]||n.del.push(r);for(r in t){var i=e[r],a=t[r];if(!i)n.add.push([r,a]);else{var o={name:r,def:a,recreate:!1,del:[],add:[],change:[]};if(``+(i.primKey.keyPath||``)!=``+(a.primKey.keyPath||``)||i.primKey.auto!==a.primKey.auto)o.recreate=!0,n.change.push(o);else{var s=i.idxByName,c=a.idxByName,l=void 0;for(l in s)c[l]||o.del.push(l);for(l in c){var u=s[l],d=c[l];u?u.src!==d.src&&o.change.push(d):o.add.push(d)}(o.del.length>0||o.add.length>0||o.change.length>0)&&n.change.push(o)}}}return n}function Un(e,t,n,r){var i=e.db.createObjectStore(t,n.keyPath?{keyPath:n.keyPath,autoIncrement:n.auto}:{autoIncrement:n.auto});return r.forEach(function(e){return Kn(i,e)}),i}function Wn(e,t){a(e).forEach(function(n){t.db.objectStoreNames.contains(n)||(P&&console.debug(`Dexie: Creating missing table`,n),Un(t,n,e[n].primKey,e[n].indexes))})}function Gn(e,t){[].slice.call(t.db.objectStoreNames).forEach(function(n){return e[n]==null&&t.db.deleteObjectStore(n)})}function Kn(e,t){e.createIndex(t.name,t.keyPath,{unique:t.unique,multiEntry:t.multi})}function qn(e,t,n){var r={};return v(t.objectStoreNames,0).forEach(function(e){for(var t=n.objectStore(e),i=t.keyPath,a=xn(Sn(i),i||``,!0,!1,!!t.autoIncrement,i&&typeof i!=`string`,!0),o=[],s=0;s<t.indexNames.length;++s){var c=t.index(t.indexNames[s]);i=c.keyPath;var l=xn(c.name,i,!!c.unique,!!c.multiEntry,!1,i&&typeof i!=`string`,!1);o.push(l)}r[e]=Cn(e,a,o)}),r}function Jn(e,t,n){e.verno=t.version/10;var r=e._dbSchema=qn(e,t,n);e._storeNames=v(t.objectStoreNames,0),Fn(e,[e._allTables],a(r),r)}function Yn(e,t){var n=Hn(qn(e,e.idbdb,t),e._dbSchema);return!(n.add.length||n.change.some(function(e){return e.add.length||e.change.length}))}function Xn(e,t,n){for(var r=n.db.objectStoreNames,a=0;a<r.length;++a){var o=r[a],s=n.objectStore(o);e._hasGetAll=`getAll`in s;for(var c=0;c<s.indexNames.length;++c){var l=s.indexNames[c],u=s.index(l).keyPath,d=typeof u==`string`?u:`[`+v(u).join(`+`)+`]`;if(t[o]){var f=t[o].idxByName[d];f&&(f.name=l,delete t[o].idxByName[d],t[o].idxByName[l]=f)}}}typeof navigator<`u`&&/Safari/.test(navigator.userAgent)&&!/(Chrome\/|Edge\/)/.test(navigator.userAgent)&&i.WorkerGlobalScope&&i instanceof i.WorkerGlobalScope&&[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]<604&&(e._hasGetAll=!1)}function Zn(e){return e.split(`,`).map(function(e,t){var n=e.split(`:`),r=n[1]?.trim();e=n[0].trim();var i=e.replace(/([&*]|\+\+)/g,``),a=/^\[/.test(i)?i.match(/^\[(.*)\]$/)[1].split(`+`):i;return xn(i,a||null,/\&/.test(e),/\*/.test(e),/\+\+/.test(e),o(a),t===0,r)})}var Qn=function(){function e(){}return e.prototype._createTableSchema=function(e,t,n){return Cn(e,t,n)},e.prototype._parseIndexSyntax=function(e){return Zn(e)},e.prototype._parseStoresSpec=function(e,t){var n=this;a(e).forEach(function(r){if(e[r]!==null){var i=n._parseIndexSyntax(e[r]),a=i.shift();if(!a)throw new j.Schema(`Invalid schema for table `+r+`: `+e[r]);if(a.unique=!0,a.multi)throw new j.Schema(`Primary key cannot be multiEntry*`);i.forEach(function(e){if(e.auto)throw new j.Schema(`Only primary key can be marked as autoIncrement (++)`);if(!e.keyPath)throw new j.Schema(`Index must have a name and cannot be an empty string`)}),t[r]=n._createTableSchema(r,a,i)}})},e.prototype.stores=function(e){var t=this.db;this._cfg.storesSource=this._cfg.storesSource?s(this._cfg.storesSource,e):e;var n=t._versions,r={},i={};return n.forEach(function(e){s(r,e._cfg.storesSource),i=e._cfg.dbschema={},e._parseStoresSpec(r,i)}),t._dbSchema=i,In(t,[t._allTables,t,t.Transaction.prototype]),Fn(t,[t._allTables,t,t.Transaction.prototype,this._cfg.tables],a(i),i),t._storeNames=a(i),this},e.prototype.upgrade=function(e){return this._cfg.contentUpgrade=je(this._cfg.contentUpgrade||M,e),this},e}();function $n(e){return Wt(Qn.prototype,function(t){this.db=e,this._cfg={version:t,storesSource:null,dbschema:{},tables:{},contentUpgrade:null}})}var er=tr();function tr(){if(typeof FinalizationRegistry<`u`&&typeof WeakRef<`u`){var e=new Set,t=new FinalizationRegistry(function(t){e.delete(t)}),n=function(){return Array.from(e).map(function(e){return e.deref()}).filter(function(e){return e!==void 0})},r=function(n){var r=new WeakRef(n._novip);if(e.add(r),t.register(n._novip,r,r),e.size>n._options.maxConnections){var i=e.values().next().value;e.delete(i),t.unregister(i)}},i=function(n){if(n)for(var r=e.values(),i=r.next();!i.done;){var a=i.value;if(a.deref()===n._novip){e.delete(a),t.unregister(a);return}i=r.next()}};return{toArray:n,add:r,remove:i}}var a=[],n=function(){return a},r=function(e){a.push(e._novip)},i=function(e){if(e){var t=a.indexOf(e._novip);t!==-1&&a.splice(t,1)}};return{toArray:n,add:r,remove:i}}function nr(e,t){var n=e._dbNamesDB;return n||(n=e._dbNamesDB=new $(kt,{addons:[],indexedDB:e,IDBKeyRange:t}),n.version(1).stores({dbnames:`name`})),n.table(`dbnames`)}function rr(e){return e&&typeof e.databases==`function`}function ir(e){var t=e.indexedDB,n=e.IDBKeyRange;return rr(t)?Promise.resolve(t.databases()).then(function(e){return e.map(function(e){return e.name}).filter(function(e){return e!==kt})}):nr(t,n).toCollection().primaryKeys()}function ar(e,t){var n=e.indexedDB,r=e.IDBKeyRange;!rr(n)&&t!==kt&&nr(n,r).put({name:t}).catch(M)}function or(e,t){var n=e.indexedDB,r=e.IDBKeyRange;!rr(n)&&t!==kt&&nr(n,r).delete(t).catch(M)}function sr(e){return H(function(){return L.letThrough=!0,e()})}function cr(){if(navigator.userAgentData||!/Safari\//.test(navigator.userAgent)||/Chrom(e|ium)\//.test(navigator.userAgent)||!indexedDB.databases)return Promise.resolve();var e;return new Promise(function(t){var n=function(){return indexedDB.databases().finally(t)};e=setInterval(n,100),n()}).finally(function(){return clearInterval(e)})}var lr;function ur(e){return!(`from`in e)}var Q=function(e,t){if(this)s(this,arguments.length?{d:1,from:e,to:arguments.length>1?t:e}:{d:0});else{var n=new Q;return e&&`d`in e&&s(n,e),n}};d(Q.prototype,(lr={add:function(e){return fr(this,e),this},addKey:function(e){return dr(this,e,e),this},addKeys:function(e){var t=this;return e.forEach(function(e){return dr(t,e,e)}),this},hasKey:function(e){var t=mr(this).next(e).value;return t&&Y(t.from,e)<=0&&Y(t.to,e)>=0}},lr[de]=function(){return mr(this)},lr));function dr(e,t,n){var r=Y(t,n);if(!isNaN(r)){if(r>0)throw RangeError();if(ur(e))return s(e,{from:t,to:n,d:1});var i=e.l,a=e.r;if(Y(n,e.from)<0)return i?dr(i,t,n):e.l={from:t,to:n,d:1,l:null,r:null},hr(e);if(Y(t,e.to)>0)return a?dr(a,t,n):e.r={from:t,to:n,d:1,l:null,r:null},hr(e);Y(t,e.from)<0&&(e.from=t,e.l=null,e.d=a?a.d+1:1),Y(n,e.to)>0&&(e.to=n,e.r=null,e.d=e.l?e.l.d+1:1);var o=!e.r;i&&!e.l&&fr(e,i),a&&o&&fr(e,a)}}function fr(e,t){function n(e,t){var r=t.from,i=t.to,a=t.l,o=t.r;dr(e,r,i),a&&n(e,a),o&&n(e,o)}ur(t)||n(e,t)}function pr(e,t){var n=mr(t),r=n.next();if(r.done)return!1;for(var i=r.value,a=mr(e),o=a.next(i.from),s=o.value;!r.done&&!o.done;){if(Y(s.from,i.to)<=0&&Y(s.to,i.from)>=0)return!0;Y(i.from,s.from)<0?i=(r=n.next(s.from)).value:s=(o=a.next(i.from)).value}return!1}function mr(e){var t=ur(e)?null:{s:0,n:e};return{next:function(e){for(var n=arguments.length>0;t;)switch(t.s){case 0:if(t.s=1,n)for(;t.n.l&&Y(e,t.n.from)<0;)t={up:t,n:t.n.l,s:1};else for(;t.n.l;)t={up:t,n:t.n.l,s:1};case 1:if(t.s=2,!n||Y(e,t.n.to)<=0)return{value:t.n,done:!1};case 2:if(t.n.r){t.s=3,t={up:t,n:t.n.r,s:0};continue}case 3:t=t.up}return{done:!0}}}}function hr(e){var t=(e.r?.d||0)-(e.l?.d||0),r=t>1?`r`:t<-1?`l`:``;if(r){var i=r===`r`?`l`:`r`,a=n({},e),o=e[r];e.from=o.from,e.to=o.to,e[r]=o[r],a[r]=o[i],e[i]=a,a.d=gr(a)}e.d=gr(e)}function gr(e){var t=e.r,n=e.l;return(t?n?Math.max(t.d,n.d):t.d:n?n.d:0)+1}function _r(e,t){return a(t).forEach(function(n){e[n]?fr(e[n],t[n]):e[n]=ae(t[n])}),e}function vr(e,t){return e.all||t.all||Object.keys(e).some(function(n){return t[n]&&pr(t[n],e[n])})}var yr={},br={},xr=!1;function Sr(e,t){_r(br,e),xr||(xr=!0,setTimeout(function(){xr=!1;var e=br;br={},Cr(e,!1)},0))}function Cr(e,t){t===void 0&&(t=!1);var n=new Set;if(e.all)for(var r=0,i=Object.values(yr);r<i.length;r++){var a=i[r];wr(a,e,n,t)}else for(var o in e){var s=/^idb\:\/\/(.*)\/(.*)\//.exec(o);if(s){var a=yr[`idb://${s[1]}/${s[2]}`];a&&wr(a,e,n,t)}}n.forEach(function(e){return e()})}function wr(e,t,n,r){for(var i=[],a=0,o=Object.entries(e.queries.query);a<o.length;a++){for(var s=o[a],c=s[0],l=s[1],u=[],d=0,f=l;d<f.length;d++){var p=f[d];vr(t,p.obsSet)?p.subscribers.forEach(function(e){return n.add(e)}):r&&u.push(p)}r&&i.push([c,u])}if(r)for(var m=0,h=i;m<h.length;m++){var g=h[m],c=g[0],u=g[1];e.queries.query[c]=u}}function Tr(e){var t=e._state,n=e._deps.indexedDB;if(t.isBeingOpened||e.idbdb)return t.dbReadyPromise.then(function(){return t.dbOpenError?K(t.dbOpenError):e});t.isBeingOpened=!0,t.dbOpenError=null,t.openComplete=!1;var r=t.openCanceller,a=Math.round(e.verno*10),o=!1;function s(){if(t.openCanceller!==r)throw new j.DatabaseClosed(`db.open() was cancelled`)}var c=t.dbReadyResolve,l=null,u=!1,d=function(){return new R(function(r,i){if(s(),!n)throw new j.MissingAPI;var c=e.name,f=t.autoSchema||!a?n.open(c):n.open(c,a);if(!f)throw new j.MissingAPI;f.onerror=Z(i),f.onblocked=B(e._fireOnBlocked),f.onupgradeneeded=B(function(r){if(l=f.transaction,t.autoSchema&&!e._options.allowEmptyDB){f.onerror=hn,l.abort(),f.result.close();var a=n.deleteDatabase(c);a.onsuccess=a.onerror=B(function(){i(new j.NoSuchDatabase(`Database ${c} doesnt exist`))})}else{l.onerror=Z(i);var s=r.oldVersion>2**62?0:r.oldVersion;u=s<1,e.idbdb=f.result,o&&zn(e,l),Rn(e,s/10,l,i)}},i),f.onsuccess=B(function(){l=null;var n=e.idbdb=f.result,i=v(n.objectStoreNames);if(i.length>0)try{var s=n.transaction(wn(i),`readonly`);if(t.autoSchema)Jn(e,n,s);else if(Xn(e,e._dbSchema,s),!Yn(e,s)&&!o)return console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.`),n.close(),a=n.version+1,o=!0,r(d());Pn(e,s)}catch{}er.add(e),n.onversionchange=B(function(n){t.vcFired=!0,e.on(`versionchange`).fire(n)}),n.onclose=B(function(){e.close({disableAutoOpen:!1})}),u&&ar(e._deps,c),r()},i)}).catch(function(e){switch(e?.name){case`UnknownError`:if(t.PR1398_maxLoop>0)return t.PR1398_maxLoop--,console.warn(`Dexie: Workaround for Chrome UnknownError on open()`),d();break;case`VersionError`:if(a>0)return a=0,d()}return R.reject(e)})},f=typeof navigator<`u`&&!!n&&n===i.indexedDB;return R.race([r,(f?cr():R.resolve()).then(d)]).then(function(){return s(),t.onReadyBeingFired=[],R.resolve(sr(function(){return e.on.ready.fire(e.vip)})).then(function n(){if(t.onReadyBeingFired.length>0){var r=t.onReadyBeingFired.reduce(je,M);return t.onReadyBeingFired=[],R.resolve(sr(function(){return r(e.vip)})).then(n)}})}).finally(function(){t.openCanceller===r&&(t.onReadyBeingFired=null,t.isBeingOpened=!1)}).catch(function(n){t.dbOpenError=n;try{l&&l.abort()}catch{}return r===t.openCanceller&&e._close(),K(n)}).finally(function(){t.openComplete=!0,c()}).then(function(){if(u){var t={};e.tables.forEach(function(n){n.schema.indexes.forEach(function(r){r.name&&(t[`idb://${e.name}/${n.name}/${r.name}`]=new Q(-1/0,[[[]]]))}),t[`idb://${e.name}/${n.name}/`]=t[`idb://${e.name}/${n.name}/:dels`]=new Q(-1/0,[[[]]])}),vn(gn).fire(t),Cr(t,!0)}return e})}function Er(e){var t=function(t){return e.next(t)},n=function(t){return e.throw(t)},r=a(t),i=a(n);function a(e){return function(t){var n=e(t),a=n.value;return n.done?a:!a||typeof a.then!=`function`?o(a)?Promise.all(a).then(r,i):r(a):a.then(r,i)}}return a(t)()}function Dr(e,t,n){var r=arguments.length;if(r<2)throw new j.InvalidArgument(`Too few arguments`);for(var i=Array(r-1);--r;)i[r-1]=arguments[r];return n=i.pop(),[e,ne(i),n]}function Or(e,t,n,r,i){return R.resolve().then(function(){var a=L.transless||L,o=e._createTransaction(t,n,e._dbSchema,r);o.explicit=!0;var s={trans:o,transless:a};if(r)o.idbtrans=r.idbtrans;else try{o.create(),o.idbtrans._explicit=!0,e._state.PR1398_maxLoop=3}catch(r){return r.name===be.InvalidState&&e.isOpen()&&--e._state.PR1398_maxLoop>0?(console.warn(`Dexie: Need to reopen db`),e.close({disableAutoOpen:!1}),e.open().then(function(){return Or(e,t,n,null,i)})):K(r)}var c=O(i);c&&gt();var l,u=R.follow(function(){if(l=i.call(o,o),l){if(c){var e=U.bind(null,null);l.then(e,e)}else typeof l.next==`function`&&typeof l.throw==`function`&&(l=Er(l))}},s);return(l&&typeof l.then==`function`?R.resolve(l).then(function(e){return o.active?e:K(new j.PrematureCommit(`Transaction committed too early. See http://bit.ly/2kdckMn`))}):u.then(function(){return l})).then(function(e){return r&&o._resolve(),o._completion.then(function(){return e})}).catch(function(e){return o._reject(e),K(e)})})}function kr(e,t,n){for(var r=o(e)?e.slice():[e],i=0;i<n;++i)r.push(t);return r}function Ar(e){return n(n({},e),{table:function(t){var r=e.table(t),i=r.schema,a=Object.create(null),o=[];function s(e,t,r){var i=An(e),c=a[i]=a[i]||[],l=e==null?0:typeof e==`string`?1:e.length,u=t>0,d=n(n({},r),{name:u?`${i}(virtual-from:${r.name})`:r.name,lowLevelIndex:r,isVirtual:u,keyTail:t,keyLength:l,extractKey:En(e),unique:!u&&r.unique});return c.push(d),d.isPrimaryKey||o.push(d),l>1&&s(l===2?e[0]:e.slice(0,l-1),t+1,r),c.sort(function(e,t){return e.keyTail-t.keyTail}),d}var c=s(i.primaryKey.keyPath,0,i.primaryKey);a[`:id`]=[c];for(var l=0,u=i.indexes;l<u.length;l++){var d=u[l];s(d.keyPath,0,d)}function f(e){var t=a[An(e)];return t&&t[0]}function p(t,n){return{type:t.type===1?2:t.type,lower:kr(t.lower,t.lowerOpen?e.MAX_KEY:e.MIN_KEY,n),lowerOpen:!0,upper:kr(t.upper,t.upperOpen?e.MIN_KEY:e.MAX_KEY,n),upperOpen:!0}}function m(e){var t=e.query.index;return t.isVirtual?n(n({},e),{query:{index:t.lowLevelIndex,range:p(e.query.range,t.keyTail)}}):e}return n(n({},r),{schema:n(n({},i),{primaryKey:c,indexes:o,getIndexByKeyPath:f}),count:function(e){return r.count(m(e))},query:function(e){return r.query(m(e))},openCursor:function(t){var n=t.query.index,i=n.keyTail,a=n.isVirtual,o=n.keyLength;if(!a)return r.openCursor(t);function s(n){function r(r){r==null?t.unique?n.continue(n.key.slice(0,o).concat(t.reverse?e.MIN_KEY:e.MAX_KEY,i)):n.continue():n.continue(kr(r,t.reverse?e.MAX_KEY:e.MIN_KEY,i))}return Object.create(n,{continue:{value:r},continuePrimaryKey:{value:function(t,r){n.continuePrimaryKey(kr(t,e.MAX_KEY,i),r)}},primaryKey:{get:function(){return n.primaryKey}},key:{get:function(){var e=n.key;return o===1?e[0]:e.slice(0,o)}},value:{get:function(){return n.value}}})}return r.openCursor(m(t)).then(function(e){return e&&s(e)})}})}})}var jr={stack:`dbcore`,name:`VirtualIndexMiddleware`,level:1,create:Ar};function Mr(e,t,n,r){return n||={},r||=``,a(e).forEach(function(i){if(!u(t,i))n[r+i]=void 0;else{var a=e[i],o=t[i];if(typeof a==`object`&&typeof o==`object`&&a&&o){var s=ue(a);s===ue(o)?s===`Object`?Mr(a,o,n,r+i+`.`):a!==o&&(n[r+i]=t[i]):n[r+i]=t[i]}else a!==o&&(n[r+i]=t[i])}}),a(t).forEach(function(i){u(e,i)||(n[r+i]=t[i])}),n}function Nr(e,t){return t.type===`delete`?t.keys:t.keys||t.values.map(e.extractKey)}var Pr={stack:`dbcore`,name:`HooksMiddleware`,level:2,create:function(e){return n(n({},e),{table:function(t){var i=e.table(t),a=i.schema.primaryKey;return n(n({},i),{mutate:function(e){var o=L.trans,s=o.table(t).hook,c=s.deleting,l=s.creating,d=s.updating;switch(e.type){case`add`:if(l.fire===M)break;return o._promise(`readwrite`,function(){return f(e)},!0);case`put`:if(l.fire===M&&d.fire===M)break;return o._promise(`readwrite`,function(){return f(e)},!0);case`delete`:if(c.fire===M)break;return o._promise(`readwrite`,function(){return f(e)},!0);case`deleteRange`:if(c.fire===M)break;return o._promise(`readwrite`,function(){return p(e)},!0)}return i.mutate(e);function f(e){var t=L.trans,o=e.keys||Nr(a,e);if(!o)throw Error(`Keys missing`);return e=e.type===`add`||e.type===`put`?n(n({},e),{keys:o}):n({},e),e.type!==`delete`&&(e.values=r([],e.values,!0)),e.keys&&(e.keys=r([],e.keys,!0)),Fr(i,e,o).then(function(n){var r=o.map(function(r,i){var o=n[i],s={onerror:null,onsuccess:null};if(e.type===`delete`)c.fire.call(s,r,o,t);else if(e.type===`add`||o===void 0){var f=l.fire.call(s,r,e.values[i],t);r==null&&f!=null&&(r=f,e.keys[i]=r,a.outbound||w(e.values[i],a.keyPath,r))}else{var p=Mr(o,e.values[i]),m=d.fire.call(s,p,r,o,t);if(m){var h=e.values[i];Object.keys(m).forEach(function(e){u(h,e)?h[e]=m[e]:w(h,e,m[e])})}}return s});return i.mutate(e).then(function(t){for(var i=t.failures,a=t.results,s=t.numFailures,c=t.lastResult,l=0;l<o.length;++l){var u=a?a[l]:o[l],d=r[l];u==null?d.onerror&&d.onerror(i[l]):d.onsuccess&&d.onsuccess(e.type===`put`&&n[l]?e.values[l]:u)}return{failures:i,results:a,numFailures:s,lastResult:c}}).catch(function(e){return r.forEach(function(t){return t.onerror&&t.onerror(e)}),Promise.reject(e)})})}function p(e){return m(e.trans,e.range,1e4)}function m(e,t,r){return i.query({trans:e,values:!1,query:{index:a,range:t},limit:r}).then(function(i){var a=i.result;return f({type:`delete`,keys:a,trans:e}).then(function(i){return i.numFailures>0?Promise.reject(i.failures[0]):a.length<r?{failures:[],numFailures:0,lastResult:void 0}:m(e,n(n({},t),{lower:a[a.length-1],lowerOpen:!0}),r)})})}}})}})}};function Fr(e,t,n){return t.type===`add`?Promise.resolve([]):e.getMany({trans:t.trans,keys:n,cache:`immutable`})}function Ir(e,t,n){try{if(!t||t.keys.length<e.length)return null;for(var r=[],i=0,a=0;i<t.keys.length&&a<e.length;++i)Y(t.keys[i],e[a])===0&&(r.push(n?se(t.values[i]):t.values[i]),++a);return r.length===e.length?r:null}catch{return null}}var Lr={stack:`dbcore`,level:-1,create:function(e){return{table:function(t){var r=e.table(t);return n(n({},r),{getMany:function(e){if(!e.cache)return r.getMany(e);var t=Ir(e.keys,e.trans._cache,e.cache===`clone`);return t?R.resolve(t):r.getMany(e).then(function(t){return e.trans._cache={keys:e.keys,values:e.cache===`clone`?se(t):t},t})},mutate:function(e){return e.type!==`add`&&(e.trans._cache=null),r.mutate(e)}})}}}};function Rr(e,t){return e.trans.mode===`readonly`&&!!e.subscr&&!e.trans.explicit&&e.trans.db._options.cache!==`disabled`&&!t.schema.primaryKey.outbound}function zr(e,t){switch(e){case`query`:return t.values&&!t.unique;case`get`:return!1;case`getMany`:return!1;case`count`:return!1;case`openCursor`:return!1}}var Br={stack:`dbcore`,level:0,name:`Observability`,create:function(e){var t=e.schema.name,r=new Q(e.MIN_KEY,e.MAX_KEY);return n(n({},e),{transaction:function(t,n,r){if(L.subscr&&n!==`readonly`)throw new j.ReadOnly(`Readwrite transaction in liveQuery context. Querier source: ${L.querier}`);return e.transaction(t,n,r)},table:function(i){var s=e.table(i),c=s.schema,l=c.primaryKey,u=c.indexes,d=l.extractKey,f=l.outbound,p=l.autoIncrement&&u.filter(function(e){return e.compound&&e.keyPath.includes(l.keyPath)}),m=n(n({},s),{mutate:function(n){var a=n.trans,u=n.mutatedParts||={},d=function(e){var n=`idb://${t}/${i}/${e}`;return u[n]||(u[n]=new Q)},f=d(``),m=d(`:dels`),h=n.type,g=n.type===`deleteRange`?[n.range]:n.type===`delete`?[n.keys]:n.values.length<50?[Nr(l,n).filter(function(e){return e!=null}),n.values]:[],_=g[0],v=g[1],y=n.trans._cache;if(o(_)){f.addKeys(_);var b=h===`delete`||_.length===v.length?Ir(_,y):null;b||m.addKeys(_),(b||v)&&Vr(d,c,b,v)}else if(_){var x={from:_.lower??e.MIN_KEY,to:_.upper??e.MAX_KEY};m.add(x),f.add(x)}else f.add(r),m.add(r),c.indexes.forEach(function(e){return d(e.name).add(r)});return s.mutate(n).then(function(e){return _&&(n.type===`add`||n.type===`put`)&&(f.addKeys(e.results),p&&p.forEach(function(t){for(var r=n.values.map(function(e){return t.extractKey(e)}),i=t.keyPath.findIndex(function(e){return e===l.keyPath}),a=0,o=e.results.length;a<o;++a)r[a][i]=e.results[a];d(t.name).addKeys(r)})),a.mutatedParts=_r(a.mutatedParts||{},u),e})}}),h=function(t){var n=t.query,r=n.index,i=n.range;return[r,new Q(i.lower??e.MIN_KEY,i.upper??e.MAX_KEY)]},g={get:function(e){return[l,new Q(e.key)]},getMany:function(e){return[l,new Q().addKeys(e.keys)]},count:h,query:h,openCursor:h};return a(g).forEach(function(e){m[e]=function(a){var o=L.subscr,c=!!o,l=Rr(L,s)&&zr(e,a)?a.obsSet={}:o;if(c){var u=function(e){var n=`idb://${t}/${i}/${e}`;return l[n]||(l[n]=new Q)},p=u(``),m=u(`:dels`),h=g[e](a),_=h[0],v=h[1];if(e===`query`&&_.isPrimaryKey&&!a.values?m.add(v):u(_.name||``).add(v),!_.isPrimaryKey){if(e===`count`)m.add(r);else{var y=e===`query`&&f&&a.values&&s.query(n(n({},a),{values:!1}));return s[e].apply(this,arguments).then(function(t){if(e===`query`){if(f&&a.values)return y.then(function(e){var n=e.result;return p.addKeys(n),t});var n=a.values?t.result.map(d):t.result;a.values?p.addKeys(n):m.addKeys(n)}else if(e===`openCursor`){var r=t,i=a.values;return r&&Object.create(r,{key:{get:function(){return m.addKey(r.primaryKey),r.key}},primaryKey:{get:function(){var e=r.primaryKey;return m.addKey(e),e}},value:{get:function(){return i&&p.addKey(r.primaryKey),r.value}}})}return t})}}}return s[e].apply(this,arguments)}}),m}})}};function Vr(e,t,n,r){function i(t){var i=e(t.name||``);function a(e){return e==null?null:t.extractKey(e)}var s=function(e){return t.multiEntry&&o(e)?e.forEach(function(e){return i.addKey(e)}):i.addKey(e)};(n||r).forEach(function(e,t){var i=n&&a(n[t]),o=r&&a(r[t]);Y(i,o)!==0&&(i!=null&&s(i),o!=null&&s(o))})}t.indexes.forEach(i)}function Hr(e,t,r){if(r.numFailures===0)return t;if(t.type===`deleteRange`)return null;var i=t.keys?t.keys.length:`values`in t&&t.values?t.values.length:1;if(r.numFailures===i)return null;var a=n({},t);return o(a.keys)&&(a.keys=a.keys.filter(function(e,t){return!(t in r.failures)})),`values`in a&&o(a.values)&&(a.values=a.values.filter(function(e,t){return!(t in r.failures)})),a}function Ur(e,t){return t.lower===void 0?!0:t.lowerOpen?Y(e,t.lower)>0:Y(e,t.lower)>=0}function Wr(e,t){return t.upper===void 0?!0:t.upperOpen?Y(e,t.upper)<0:Y(e,t.upper)<=0}function Gr(e,t){return Ur(e,t)&&Wr(e,t)}function Kr(e,t,n,r,i,a){if(!n||n.length===0)return e;var s=t.query.index,c=s.multiEntry,l=t.query.range,u=r.schema.primaryKey.extractKey,d=s.extractKey,f=(s.lowLevelIndex||s).extractKey,p=n.reduce(function(e,n){var r=e,i=[];if(n.type===`add`||n.type===`put`)for(var a=new Q,s=n.values.length-1;s>=0;--s){var f=n.values[s],p=u(f);if(!a.hasKey(p)){var m=d(f);(c&&o(m)?m.some(function(e){return Gr(e,l)}):Gr(m,l))&&(a.addKey(p),i.push(f))}}switch(n.type){case`add`:var h=new Q().addKeys(t.values?e.map(function(e){return u(e)}):e);r=e.concat(t.values?i.filter(function(e){var t=u(e);return!h.hasKey(t)&&(h.addKey(t),!0)}):i.map(function(e){return u(e)}).filter(function(e){return!h.hasKey(e)&&(h.addKey(e),!0)}));break;case`put`:var g=new Q().addKeys(n.values.map(function(e){return u(e)}));r=e.filter(function(e){return!g.hasKey(t.values?u(e):e)}).concat(t.values?i:i.map(function(e){return u(e)}));break;case`delete`:var _=new Q().addKeys(n.keys);r=e.filter(function(e){return!_.hasKey(t.values?u(e):e)});break;case`deleteRange`:var v=n.range;r=e.filter(function(e){return!Gr(u(e),v)})}return r},e);if(p===e)return e;var m=function(e,t){return Y(f(e),f(t))||Y(u(e),u(t))};return p.sort(t.direction===`prev`||t.direction===`prevunique`?function(e,t){return m(t,e)}:m),t.limit&&t.limit<1/0&&(p.length>t.limit?p.length=t.limit:e.length===t.limit&&p.length<t.limit&&(i.dirty=!0)),a?Object.freeze(p):p}function qr(e,t){return Y(e.lower,t.lower)===0&&Y(e.upper,t.upper)===0&&!!e.lowerOpen==!!t.lowerOpen&&!!e.upperOpen==!!t.upperOpen}function Jr(e,t,n,r){if(e===void 0)return t===void 0?0:-1;if(t===void 0)return 1;var i=Y(e,t);if(i===0){if(n&&r)return 0;if(n)return 1;if(r)return-1}return i}function Yr(e,t,n,r){if(e===void 0)return t===void 0?0:1;if(t===void 0)return-1;var i=Y(e,t);if(i===0){if(n&&r)return 0;if(n)return-1;if(r)return 1}return i}function Xr(e,t){return Jr(e.lower,t.lower,e.lowerOpen,t.lowerOpen)<=0&&Yr(e.upper,t.upper,e.upperOpen,t.upperOpen)>=0}function Zr(e,t,n,r){var i=yr[`idb://${e}/${t}`];if(!i)return[];var a=i.queries[n];if(!a)return[null,!1,i,null];var o=a[(r.query?r.query.index.name:null)||``];if(!o)return[null,!1,i,null];switch(n){case`query`:var s=r.direction??`next`,c=o.find(function(e){return e.req.limit===r.limit&&e.req.values===r.values&&(e.req.direction??`next`)===s&&qr(e.req.query.range,r.query.range)});return c?[c,!0,i,o]:[o.find(function(e){return(`limit`in e.req?e.req.limit:1/0)>=r.limit&&(e.req.direction??`next`)===s&&(!r.values||e.req.values)&&Xr(e.req.query.range,r.query.range)}),!1,i,o];case`count`:var l=o.find(function(e){return qr(e.req.query.range,r.query.range)});return[l,!!l,i,o]}}function Qr(e,t,n,r){e.subscribers.add(n),r.addEventListener(`abort`,function(){e.subscribers.delete(n),e.subscribers.size===0&&$r(e,t)})}function $r(e,t){setTimeout(function(){e.subscribers.size===0&&E(t,e)},3e3)}var ei={stack:`dbcore`,level:0,name:`Cache`,create:function(e){var t=e.schema.name;return n(n({},e),{transaction:function(n,r,i){var a=e.transaction(n,r,i);if(r===`readwrite`){var o=new AbortController,s=o.signal,c=function(i){return function(){if(o.abort(),r===`readwrite`){for(var s=new Set,c=0,l=n;c<l.length;c++){var u=l[c],d=yr[`idb://${t}/${u}`];if(d){var f=e.table(u),p=d.optimisticOps.filter(function(e){return e.trans===a});if(a._explicit&&i&&a.mutatedParts)for(var m=0,h=Object.values(d.queries.query);m<h.length;m++)for(var g=h[m],_=0,v=g.slice();_<v.length;_++){var y=v[_];vr(y.obsSet,a.mutatedParts)&&(E(g,y),y.subscribers.forEach(function(e){return s.add(e)}))}else if(p.length>0){d.optimisticOps=d.optimisticOps.filter(function(e){return e.trans!==a});for(var b=0,x=Object.values(d.queries.query);b<x.length;b++)for(var g=x[b],S=0,C=g.slice();S<C.length;S++){var y=C[S];if(y.res!=null&&a.mutatedParts){if(i&&!y.dirty){var w=Object.isFrozen(y.res),T=Kr(y.res,y.req,p,f,y,w);y.dirty?(E(g,y),y.subscribers.forEach(function(e){return s.add(e)})):T!==y.res&&(y.res=T,y.promise=R.resolve({result:T}))}else y.dirty&&E(g,y),y.subscribers.forEach(function(e){return s.add(e)})}}}}}s.forEach(function(e){return e()})}}};a.addEventListener(`abort`,c(!1),{signal:s}),a.addEventListener(`error`,c(!1),{signal:s}),a.addEventListener(`complete`,c(!0),{signal:s})}return a},table:function(r){var i=e.table(r),a=i.schema.primaryKey;return n(n({},i),{mutate:function(e){var o=L.trans;if(a.outbound||o.db._options.cache===`disabled`||o.explicit||o.idbtrans.mode!==`readwrite`)return i.mutate(e);var s=yr[`idb://${t}/${r}`];if(!s)return i.mutate(e);var c=i.mutate(e);return(e.type===`add`||e.type===`put`)&&(e.values.length>=50||Nr(a,e).some(function(e){return e==null}))?c.then(function(t){var r=Hr(s,n(n({},e),{values:e.values.map(function(e,r){if(t.failures[r])return e;var i=a.keyPath?.includes(`.`)?se(e):n({},e);return w(i,a.keyPath,t.results[r]),i})}),t);s.optimisticOps.push(r),queueMicrotask(function(){return e.mutatedParts&&Sr(e.mutatedParts)})}):(s.optimisticOps.push(e),e.mutatedParts&&Sr(e.mutatedParts),c.then(function(t){if(t.numFailures>0){E(s.optimisticOps,e);var n=Hr(s,e,t);n&&s.optimisticOps.push(n),e.mutatedParts&&Sr(e.mutatedParts)}}),c.catch(function(){E(s.optimisticOps,e),e.mutatedParts&&Sr(e.mutatedParts)})),c},query:function(e){if(!Rr(L,i)||!zr(`query`,e))return i.query(e);var n=L.trans?.db._options.cache===`immutable`,a=L,o=a.requery,s=a.signal,c=Zr(t,r,`query`,e),l=c[0],u=c[1],d=c[2],f=c[3];if(l&&u)l.obsSet=e.obsSet;else{var p=i.query(e).then(function(e){var t=e.result;if(l&&(l.res=t),n){for(var r=0,i=t.length;r<i;++r)Object.freeze(t[r]);Object.freeze(t)}return e}).catch(function(e){return f&&l&&E(f,l),Promise.reject(e)});l={obsSet:e.obsSet,promise:p,subscribers:new Set,type:`query`,req:e,dirty:!1},f?f.push(l):(f=[l],d||=yr[`idb://${t}/${r}`]={queries:{query:{},count:{}},objs:new Map,optimisticOps:[],unsignaledParts:{}},d.queries.query[e.query.index.name||``]=f)}return Qr(l,f,o,s),l.promise.then(function(t){var r=Kr(t.result,e,d?.optimisticOps,i,l,n);return{result:n?r:se(r)}})}})}})}};function ti(e,t){return new Proxy(e,{get:function(e,n,r){return n===`db`?t:Reflect.get(e,n,r)}})}var $=function(){function e(t,r){var i=this;this._middlewares={},this.verno=0;var a=e.dependencies;this._options=r=n({addons:e.addons,autoOpen:!0,indexedDB:a.indexedDB,IDBKeyRange:a.IDBKeyRange,cache:`cloned`,maxConnections:Ot},r),this._deps={indexedDB:r.indexedDB,IDBKeyRange:r.IDBKeyRange};var o=r.addons;this._dbSchema={},this._versions=[],this._storeNames=[],this._allTables={},this.idbdb=null,this._novip=this;var s={dbOpenError:null,isBeingOpened:!1,onReadyBeingFired:null,openComplete:!1,dbReadyResolve:M,dbReadyPromise:null,cancelOpen:M,openCanceller:null,autoSchema:!0,PR1398_maxLoop:3,autoOpen:r.autoOpen};s.dbReadyPromise=new R(function(e){s.dbReadyResolve=e}),s.openCanceller=new R(function(e,t){s.cancelOpen=t}),this._state=s,this.name=t,this.on=Ut(this,`populate`,`blocked`,`versionchange`,`close`,{ready:[je,M]}),this.once=function(e,t){var n=function(){var r=[...arguments];i.on(e).unsubscribe(n),t.apply(i,r)};return i.on(e,n)},this.on.ready.subscribe=y(this.on.ready.subscribe,function(t){return function(n,r){e.vip(function(){var e=i._state;if(e.openComplete)e.dbOpenError||R.resolve().then(n),r&&t(n);else if(e.onReadyBeingFired)e.onReadyBeingFired.push(n),r&&t(n);else{t(n);var a=i;r||t(function e(){a.on.ready.unsubscribe(n),a.on.ready.unsubscribe(e)})}})}}),this.Collection=nn(this),this.Table=Gt(this),this.Transaction=bn(this),this.Version=$n(this),this.WhereClause=mn(this),this.on(`versionchange`,function(e){e.newVersion>0?console.warn(`Another connection wants to upgrade database '${i.name}'. Closing db now to resume the upgrade.`):console.warn(`Another connection wants to delete database '${i.name}'. Closing db now to resume the delete request.`),i.close({disableAutoOpen:!1})}),this.on(`blocked`,function(e){!e.newVersion||e.newVersion<e.oldVersion?console.warn(`Dexie.delete('${i.name}') was blocked`):console.warn(`Upgrade '${i.name}' blocked by other connection holding version ${e.oldVersion/10}`)}),this._maxKey=Tn(r.IDBKeyRange),this._createTransaction=function(e,t,n,r){return new i.Transaction(e,t,n,i._options.chromeTransactionDurability,r)},this._fireOnBlocked=function(e){i.on(`blocked`).fire(e),er.toArray().filter(function(e){return e.name===i.name&&e!==i&&!e._state.vcFired}).map(function(t){return t.on(`versionchange`).fire(e)})},this.use(Lr),this.use(ei),this.use(Br),this.use(jr),this.use(Pr);var c=new Proxy(this,{get:function(e,t,n){if(t===`_vip`)return!0;if(t===`table`)return function(e){return ti(i.table(e),c)};var r=Reflect.get(e,t,n);return r instanceof Ht?ti(r,c):t===`tables`?r.map(function(e){return ti(e,c)}):t===`_createTransaction`?function(){return ti(r.apply(this,arguments),c)}:r}});this.vip=c,o.forEach(function(e){return e(i)})}return e.prototype.version=function(e){if(isNaN(e)||e<.1)throw new j.Type(`Given version is not a positive number`);if(e=Math.round(e*10)/10,this.idbdb||this._state.isBeingOpened)throw new j.Schema(`Cannot add version when database is open`);this.verno=Math.max(this.verno,e);var t=this._versions,n=t.filter(function(t){return t._cfg.version===e})[0];return n||(n=new this.Version(e),t.push(n),t.sort(Ln),n.stores({}),this._state.autoSchema=!1,n)},e.prototype._whenReady=function(e){var t=this;return this.idbdb&&(this._state.openComplete||L.letThrough||this._vip)?e():new R(function(e,n){if(t._state.openComplete)return n(new j.DatabaseClosed(t._state.dbOpenError));if(!t._state.isBeingOpened){if(!t._state.autoOpen){n(new j.DatabaseClosed);return}t.open().catch(M)}t._state.dbReadyPromise.then(e,n)}).then(e)},e.prototype.use=function(e){var t=e.stack,n=e.create,r=e.level,i=e.name;i&&this.unuse({stack:t,name:i});var a=this._middlewares[t]||(this._middlewares[t]=[]);return a.push({stack:t,create:n,level:r??10,name:i}),a.sort(function(e,t){return e.level-t.level}),this},e.prototype.unuse=function(e){var t=e.stack,n=e.name,r=e.create;return t&&this._middlewares[t]&&(this._middlewares[t]=this._middlewares[t].filter(function(e){return r?e.create!==r:n?e.name!==n:!1})),this},e.prototype.open=function(){var e=this;return G(I,function(){return Tr(e)})},e.prototype._close=function(){this.on.close.fire(new CustomEvent(`close`));var e=this._state;if(er.remove(this),this.idbdb){try{this.idbdb.close()}catch{}this.idbdb=null}e.isBeingOpened||(e.dbReadyPromise=new R(function(t){e.dbReadyResolve=t}),e.openCanceller=new R(function(t,n){e.cancelOpen=n}))},e.prototype.close=function(e){var t=(e===void 0?{disableAutoOpen:!0}:e).disableAutoOpen,n=this._state;t?(n.isBeingOpened&&n.cancelOpen(new j.DatabaseClosed),this._close(),n.autoOpen=!1,n.dbOpenError=new j.DatabaseClosed):(this._close(),n.autoOpen=this._options.autoOpen||n.isBeingOpened,n.openComplete=!1,n.dbOpenError=null)},e.prototype.delete=function(e){var t=this;e===void 0&&(e={disableAutoOpen:!0});var n=arguments.length>0&&typeof arguments[0]!=`object`,r=this._state;return new R(function(i,a){var o=function(){t.close(e);var n=t._deps.indexedDB.deleteDatabase(t.name);n.onsuccess=B(function(){or(t._deps,t.name),i()}),n.onerror=Z(a),n.onblocked=t._fireOnBlocked};if(n)throw new j.InvalidArgument(`Invalid closeOptions argument to db.delete()`);r.isBeingOpened?r.dbReadyPromise.then(o):o()})},e.prototype.backendDB=function(){return this.idbdb},e.prototype.isOpen=function(){return this.idbdb!==null},e.prototype.hasBeenClosed=function(){var e=this._state.dbOpenError;return e&&e.name===`DatabaseClosedError`},e.prototype.hasFailed=function(){return this._state.dbOpenError!==null},e.prototype.dynamicallyOpened=function(){return this._state.autoSchema},Object.defineProperty(e.prototype,"tables",{get:function(){var e=this;return a(this._allTables).map(function(t){return e._allTables[t]})},enumerable:!1,configurable:!0}),e.prototype.transaction=function(){var e=Dr.apply(this,arguments);return this._transaction.apply(this,e)},e.prototype._transaction=function(e,t,n){var r=this,i=L.trans;i&&i.db===this&&e.indexOf(`!`)===-1||(i=null);var a=e.indexOf(`?`)!==-1;e=e.replace(`!`,``).replace(`?`,``);var o,s;try{if(s=t.map(function(e){var t=e instanceof r.Table?e.name:e;if(typeof t!=`string`)throw TypeError(`Invalid table argument to Dexie.transaction(). Only Table or String are allowed`);return t}),e==`r`||e===At)o=At;else if(e==`rw`||e==jt)o=jt;else throw new j.InvalidArgument(`Invalid transaction mode: `+e);if(i){if(i.mode===At&&o===jt){if(a)i=null;else throw new j.SubTransaction(`Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY`)}i&&s.forEach(function(e){if(i&&i.storeNames.indexOf(e)===-1){if(a)i=null;else throw new j.SubTransaction(`Table `+e+` not included in parent transaction.`)}}),a&&i&&!i.active&&(i=null)}}catch(e){return i?i._promise(null,function(t,n){n(e)}):K(e)}var c=Or.bind(null,this,o,s,i,n);return i?i._promise(o,c,`lock`):L.trans?G(L.transless,function(){return r._whenReady(c)}):this._whenReady(c)},e.prototype.table=function(e){if(!u(this._allTables,e))throw new j.InvalidTable(`Table ${e} does not exist`);return this._allTables[e]},e}(),ni=typeof Symbol<`u`&&`observable`in Symbol?Symbol.observable:`@@observable`,ri=function(){function e(e){this._subscribe=e}return e.prototype.subscribe=function(e,t,n){return this._subscribe(!e||typeof e==`function`?{next:e,error:t,complete:n}:e)},e.prototype[ni]=function(){return this},e}(),ii;try{ii={indexedDB:i.indexedDB||i.mozIndexedDB||i.webkitIndexedDB||i.msIndexedDB,IDBKeyRange:i.IDBKeyRange||i.webkitIDBKeyRange}}catch{ii={indexedDB:null,IDBKeyRange:null}}function ai(e){var t=!1,n,r=new ri(function(r){var i=O(e);function a(t){var n=it();try{i&&gt();var r=H(e,t);return i&&(r=r.finally(U)),r}finally{n&&at()}}var o=!1,s,c={},l={},u={get closed(){return o},unsubscribe:function(){o||(o=!0,s&&s.abort(),d&&vn.storagemutated.unsubscribe(m))}};r.start&&r.start(u);var d=!1,f=function(){return St(h)};function p(){return vr(l,c)}var m=function(e){_r(c,e),p()&&f()},h=function(){if(!o&&ii.indexedDB){c={};var i={};s&&s.abort(),s=new AbortController;var u={subscr:i,signal:s.signal,requery:f,querier:e,trans:null},h=a(u);d||=(vn.storagemutated.subscribe(m),!0),Promise.resolve(h).then(function(e){t=!0,n=e,o||u.signal.aborted||(p()?f():(l=i,p()?f():(c={},St(function(){return!o&&r.next&&r.next(e)}))))},function(e){o||u.signal.aborted||(t=!1,[`DatabaseClosedError`,`AbortError`].includes(e?.name)||o||St(function(){o||r.error&&r.error(e)}))})}};return setTimeout(f,0),u});return r.hasValue=function(){return t},r.getValue=function(){return n},r}var oi=$;d(oi,n(n({},we),{delete:function(e){return new oi(e,{addons:[]}).delete()},exists:function(e){return new oi(e,{addons:[]}).open().then(function(e){return e.close(),!0}).catch(`NoSuchDatabaseError`,function(){return!1})},getDatabaseNames:function(e){try{return ir(oi.dependencies).then(e)}catch{return K(new j.MissingAPI)}},defineClass:function(){function e(e){s(this,e)}return e},ignoreTransaction:function(e){return L.trans?G(L.transless||I,e):e()},vip:sr,async:function(e){return function(){try{var t=Er(e.apply(this,arguments));return!t||typeof t.then!=`function`?R.resolve(t):t}catch(e){return K(e)}}},spawn:function(e,t,n){try{var r=Er(e.apply(n,t||[]));return!r||typeof r.then!=`function`?R.resolve(r):r}catch(e){return K(e)}},currentTransaction:{get:function(){return L.trans||null}},waitFor:function(e,t){var n=R.resolve(typeof e==`function`?oi.ignoreTransaction(e):e).timeout(t||6e4);return L.trans?L.trans.waitFor(n):n},Promise:R,debug:{get:function(){return P},set:function(e){Me(e)}},derive:m,extend:s,props:d,override:y,Events:Ut,on:vn,liveQuery:ai,extendObservabilitySet:_r,getByKeyPath:C,setByKeyPath:w,delByKeyPath:T,shallowClone:ee,deepClone:se,getObjectDiff:Mr,cmp:Y,asap:x,minKey:Et,addons:[],connections:{get:er.toArray},errnames:be,dependencies:ii,cache:yr,semVer:wt,version:wt.split(`.`).map(function(e){return parseInt(e)}).reduce(function(e,t,n){return e+t/10**(n*2)})})),oi.maxKey=Tn(oi.dependencies.IDBKeyRange),typeof dispatchEvent<`u`&&typeof addEventListener<`u`&&(vn(gn,function(e){if(!ci){var t=new CustomEvent(_n,{detail:e});ci=!0,dispatchEvent(t),ci=!1}}),addEventListener(_n,function(e){var t=e.detail;ci||si(t)}));function si(e){var t=ci;try{ci=!0,vn.storagemutated.fire(e),Cr(e,!0)}finally{ci=t}}var ci=!1,li,ui=function(){};typeof BroadcastChannel<`u`&&(ui=function(){li=new BroadcastChannel(_n),li.onmessage=function(e){return e.data&&si(e.data)}},ui(),typeof li.unref==`function`&&li.unref(),vn(gn,function(e){ci||li.postMessage(e)})),typeof addEventListener<`u`&&(addEventListener(`pagehide`,function(e){if(!$.disableBfCache&&e.persisted){P&&console.debug(`Dexie: handling persisted pagehide`),li?.close();for(var t=0,n=er.toArray();t<n.length;t++)n[t].close({disableAutoOpen:!1})}}),addEventListener(`pageshow`,function(e){!$.disableBfCache&&e.persisted&&(P&&console.debug(`Dexie: handling persisted pageshow`),ui(),si({all:new Q(-1/0,[[]])}))}));function di(e){return new Bt({add:e})}function fi(e){return new Bt({remove:e})}function pi(e,t){return new Bt({replacePrefix:[e,t]})}return R.rejectionMapper=Ce,Me(P),n($,Object.freeze({__proto__:null,DEFAULT_MAX_CONNECTIONS:Ot,Dexie:$,Entity:Pt,PropModification:Bt,RangeSet:Q,add:di,cmp:Y,default:$,liveQuery:ai,mergeRanges:fr,rangesOverlap:pr,remove:fi,replacePrefix:pi}),{default:$}),$}))}))(),1),I=Symbol.for(`Dexie`),L=globalThis[I]||(globalThis[I]=qe.default);if(qe.default.semVer!==L.semVer)throw Error(`Two different versions of Dexie loaded in the same app: ${qe.default.semVer} and ${L.semVer}`);var{liveQuery:Je,mergeRanges:Ye,rangesOverlap:Xe,RangeSet:R,cmp:Ze,Entity:Qe,PropModification:$e,replacePrefix:et,add:tt,remove:nt,DexieYProvider:rt}=L,z=new class extends L{peers;messages;ownSeeds;processedProperties;ownProperties;settings;constructor(){super(`statim`),this.version(1).stores({peers:`email, lastSeen`,messages:`++id, &msgId, ts, from`,ownSeeds:`seedId, createdAt`,processedSignals:`commentId, ts`,ownComments:`commentId, kind, ts`,settings:`key`}),this.version(2).stores({processedSignals:null,ownComments:null,processedProperties:`propertyKey, ts`,ownProperties:`propertyKey, kind, ts`})}};async function it(e){return(await z.settings.get(e))?.value}async function at(e,t){await z.settings.put({key:e,value:t})}var ot=/^(\d{1,15}) ([\s\S]+)$/;function st(e,t){return`${e} ${t}`}function ct(e,t){if(typeof e!=`string`)return null;let n=ot.exec(e);return!n||n[2].length>t?null:{ts:Number(n[1]),text:n[2]}}function lt(e,t,n){let r=e.map(e=>st(e.ts,e.text)),i=t&&st(t.ts,t.text);for(;;){let e=S(JSON.stringify(i?{hist:r,current:i}:{hist:r}));if(e.length<=n||!r.length)return e;r=r.slice(Math.max(1,Math.ceil(r.length*.1)))}}function ut(e,t,n){let r;try{r=JSON.parse(e)}catch{return null}if(!r||typeof r!=`object`)return null;let{hist:i,current:a}=r;if(!Array.isArray(i)||i.length>t)return null;let o=[];for(let e of i){let t=ct(e,n);t&&o.push(t)}let s=a===void 0?null:ct(a,n);return s?{hist:o,current:s}:{hist:o}}var B=4e3,V=m.historyMaxBytes*10,dt=m.historyMaxBytes+1024,ft=5e3,pt=2e4,mt=7e3,ht=15e3,H=1e4,gt=2,U=50;function _t(e){return e.iceGatheringState===`complete`?Promise.resolve():new Promise(t=>{let n=()=>{clearTimeout(i),e.removeEventListener(`icegatheringstatechange`,r),t()},r=()=>e.iceGatheringState===`complete`&&n(),i=setTimeout(n,mt);e.addEventListener(`icegatheringstatechange`,r)})}var vt=(e,t)=>`${e}|${t}`,yt=class extends EventTarget{#e;#t;#n=new Map;#r=new Map;#i=new Map;#a=0;constructor(e,t){super(),this.#e=e,this.#t=t??m.iceServers}async start(){this.#e.addEventListener(`peer`,this.#c),this.#e.addEventListener(`signal`,this.#l);for(let e of await this.#e.activePeers())this.#u(e)}stop(){this.#e.removeEventListener(`peer`,this.#c),this.#e.removeEventListener(`signal`,this.#l);for(let e of[...this.#n.values()])this.#y(e)}connectedPeers(){return[...this.#n.values()].filter(e=>e.channel?.readyState===`open`).map(e=>e.email)}async send(e){let t=e.trim().slice(0,B);if(!t)throw Error(`Mensaje vacío`);let n=this.#e.email,r=Math.max(Date.now(),this.#a+1);this.#a=r;let i={msgId:vt(n,r),from:n,text:t,ts:r};i.id=await z.messages.add(i);let a=[...this.#n.values()].filter(e=>e.channel?.readyState===`open`);if(a.length){let e=await this.#o({ts:r,text:t});for(let t of a)t.channel.send(e)}return i}async#o(e){let t=Date.now()-m.historyWindowMs,n=lt((await z.messages.where(`ts`).aboveOrEqual(t).filter(t=>t.from===this.#e.email&&t.ts!==e?.ts).sortBy(`ts`)).map(e=>({ts:e.ts,text:e.text})),e,m.historyMaxBytes),r=await this.#e.currentSeed(),{iv:i,ct:a}=await oe(r.seed,n);return Ce({packetId:crypto.randomUUID(),seedId:r.seedId,iv:i,ct:a})}async#s(e){if(!await z.messages.where(`ts`).aboveOrEqual(Date.now()-m.historyWindowMs).filter(e=>e.from===this.#e.email).count())return;let t=await this.#o();e.channel?.readyState===`open`&&e.channel.send(t)}#c=e=>{let t=e.detail;this.#u(t),this.#_(t.email)};#l=e=>{this.#f(e.detail).catch(e=>this.#b(e))};#u(e,t=0){let n=this.#n.get(e.email);n&&n.session===e.session||(n&&this.#y(n),this.#e.email>=e.email||this.#n.size>=m.maxPeers-1||this.#d(e,t).catch(e=>this.#b(e)))}async#d(e,t){let n=this.#p(e.email,e.session,!0,t);this.#m(n,n.pc.createDataChannel(`chat`,{ordered:!0})),await n.pc.setLocalDescription(await n.pc.createOffer()),await _t(n.pc),this.#n.get(e.email)===n&&(await this.#e.sendSignal({to:e.email,toSession:e.session,kind:`offer`,data:n.pc.localDescription?.sdp}),n.releaseFastPolling=this.#e.holdFastPolling(),n.timer=setTimeout(()=>this.#v(n),m.answerTimeoutMs))}async#f(e){if(!(typeof e.data!=`string`||e.data.length>pt)){if(e.kind===`offer`){let t=this.#n.get(e.from);t&&this.#y(t);let n=this.#p(e.from,e.fromSession,!1,0);if(n.pc.ondatachannel=({channel:e})=>this.#m(n,e),await n.pc.setRemoteDescription({type:`offer`,sdp:e.data}),await n.pc.setLocalDescription(await n.pc.createAnswer()),await _t(n.pc),this.#n.get(e.from)!==n)return;await this.#e.sendSignal({to:e.from,toSession:e.fromSession,kind:`answer`,data:n.pc.localDescription?.sdp})}else if(e.kind===`answer`){let t=this.#n.get(e.from);if(!t||t.session!==e.fromSession||t.pc.signalingState!==`have-local-offer`)return;clearTimeout(t.timer),t.releaseFastPolling?.(),await t.pc.setRemoteDescription({type:`answer`,sdp:e.data})}}}#p(e,t,n,r){let i=new RTCPeerConnection({iceServers:this.#t}),a={email:e,session:t,pc:i,initiator:n,attempts:r};return this.#n.set(e,a),i.onconnectionstatechange=()=>{clearTimeout(a.timer),i.connectionState===`failed`?this.#v(a):i.connectionState===`disconnected`&&(a.timer=setTimeout(()=>this.#v(a),ht))},a}#m(e,t){e.channel=t,t.binaryType=`arraybuffer`,t.onopen=()=>{this.dispatchEvent(new Event(`links`)),this.#s(e).catch(e=>this.#b(e))},t.onclose=()=>{this.#n.get(e.email)===e&&this.#v(e)},t.onmessage=({data:t})=>{let n=we(t,dt);n&&this.#h(e.email,n)}}#h(e,t){let n=(this.#i.get(e)??Promise.resolve()).then(()=>this.#g(e,t)).catch(e=>this.#b(e));this.#i.set(e,n)}async#g(e,t){let n=(await z.peers.get(e))?.seeds.find(e=>e.seedId===t.seedId);if(!n){let n=this.#r.get(e)??[];n.length<U&&n.push(t),this.#r.set(e,n);return}let r;try{r=ut(C(await se(n.seed,t.iv,t.ct),V),ft,B)}catch{return}if(!r)return;let i=async({ts:t,text:n})=>{let r=vt(e,t);if(await z.messages.where(`msgId`).equals(r).count())return;let i={msgId:r,from:e,text:n,ts:t};return i.id=await z.messages.add(i),i},a=[];for(let e of r.hist){let t=await i(e);t&&a.push(t)}let o=r.current&&await i(r.current);o&&a.push(o),a.length&&(a.sort((e,t)=>e.ts-t.ts),this.dispatchEvent(new CustomEvent(`messages`,{detail:{from:e,messages:a,current:o}})))}async#_(e){let t=this.#r.get(e);if(t){this.#r.delete(e);for(let n of t)this.#h(e,n)}}#v(e){let t=e.channel?.readyState===`open`,n=e.pc.remoteDescription!==null;this.#y(e),t&&this.dispatchEvent(new Event(`links`)),!e.initiator||!n||e.attempts+1>=gt||setTimeout(async()=>{let t=await z.peers.get(e.email);t&&t.session===e.session&&!this.#n.has(t.email)&&this.#u(t,e.attempts+1)},H)}#y(e){clearTimeout(e.timer),e.releaseFastPolling?.(),e.pc.onconnectionstatechange=null,e.channel&&(e.channel.onclose=null),e.channel?.close(),e.pc.close(),this.#n.get(e.email)===e&&this.#n.delete(e.email)}#b(e){this.dispatchEvent(new CustomEvent(`error`,{detail:e}))}},W=5,bt=10,G=5,xt=60;async function St(e){let t=await ce(e.trim().toLowerCase()),n=(t[0]<<8|t[1])%360,r=`hsl(${n} 60% 50%)`,i=`hsl(${n} 30% 92%)`,a=[],o=Math.ceil(W/2);for(let e=0;e<W;e++)for(let n=0;n<o;n++)if(t[2+Math.floor((e*o+n)/8)]>>(e*o+n)%8&1)for(let t of new Set([n,4-n]))a.push(`<rect x="${G+t*bt}" y="${G+e*bt}" width="${bt}" height="${bt}"/>`);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${xt} ${xt}"><rect width="${xt}" height="${xt}" fill="${i}"/><g fill="${r}">${a.join(``)}</g></svg>`}function K(e){return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(e)}`}var Ct=new Map;function wt(e){let t=e.trim().toLowerCase(),n=Ct.get(t);return n||(n=St(t).then(K),Ct.set(t,n)),n}async function Tt(e,t=5e3){let n=new RTCPeerConnection({iceServers:e});n.createDataChannel(`ip`);try{return await new Promise(e=>{let r=setTimeout(()=>e(``),t);n.onicecandidate=({candidate:t})=>{t?(t.type===`srflx`||t.type===`relay`)&&t.address&&(clearTimeout(r),e(t.address)):(clearTimeout(r),e(``))},n.createOffer().then(e=>n.setLocalDescription(e)).catch(()=>e(``))})}finally{n.close()}}var Et=3e4,q=3,Dt=e=>new Promise(t=>setTimeout(t,e)),Ot=class extends EventTarget{session=crypto.randomUUID();email;#e;#t;#n=``;#r=0;#i=!1;#a=!1;#o;#s;#c=0;#l=0;#u=0;#d=[];constructor(e,t,n){super(),this.#e=e,this.email=t.trim().toLowerCase(),this.#t=n??m.iceServers}async start(){this.#i||(this.#i=!0,this.#r=Date.now()-m.announceTtlMs,this.#l=Date.now()+m.startupFastPollMs,this.#n=await Tt(this.#t),await this.#h(!0),this.#o=setInterval(()=>{this.#h(!1).catch(e=>this.#x(e))},6e4),this.#v())}stop(){this.#i=!1,clearInterval(this.#o),clearTimeout(this.#s),this.#e.close()}get remainingFastBudget(){return this.#e.remainingFastBudget}async currentSeed(){let e=await z.ownSeeds.orderBy(`createdAt`).last();if(!e)throw Error(`Registro no iniciado`);return e}holdFastPolling(){this.#u++,this.#e.reschedule();let e=!1,t=()=>{e||(e=!0,clearTimeout(n),this.#u--)},n=setTimeout(t,m.fastHoldMs);return t}activePeers(){return z.peers.where(`lastSeen`).above(Date.now()-m.announceTtlMs).toArray()}sendSignal(e){return new Promise((t,n)=>{this.#d.push({item:e,resolve:t,reject:n}),this.#s??=setTimeout(()=>void this.#p(),m.signalBatchDelayMs)})}#f=()=>this.#i&&(this.#u>0||Date.now()<this.#l);async#p(){this.#s=void 0;let e=this.#d.splice(0,20);this.#d.length&&(this.#s=setTimeout(()=>void this.#p(),0)),e.length&&await this.#m(e)}async#m(e){let t={t:`signals`,v:1,from:this.email,fromSession:this.session,items:e.map(e=>e.item),ts:Date.now()};try{Me(t);let n=await this.#e.post(t,!0);await z.ownProperties.add({propertyKey:n,kind:`signal`,ts:Date.now()}),e.forEach(e=>e.resolve())}catch(t){if(t instanceof P&&e.length>1){let t=Math.ceil(e.length/2);await this.#m(e.slice(0,t)),await this.#m(e.slice(t));return}e.forEach(e=>e.reject(t))}}async#h(e){let t=Date.now(),n=await z.ownSeeds.orderBy(`createdAt`).last(),r=!n||t-n.createdAt>=m.seedRotationMs;if(r||!n){n={...ne(),createdAt:t},await z.ownSeeds.add(n);let e=await z.ownSeeds.where(`createdAt`).below(t-m.seedGraceMs).toArray();e.forEach(e=>ae(e.seed)),await z.ownSeeds.bulkDelete(e.map(e=>e.seedId)),this.dispatchEvent(new Event(`seed`))}(r||e)&&await this.#g(n,e),await z.processedProperties.where(`ts`).below(t-m.announceTtlMs).delete(),this.#_().catch(e=>this.#x(e))}async#g(e,t){let n={t:`announce`,v:1,email:this.email,session:this.session,ip:this.#n,seedId:e.seedId,seed:e.seed,ts:Date.now()},r=await this.#e.post(n,t);await z.ownProperties.add({propertyKey:r,kind:`announce`,ts:Date.now()})}async#_(){if(!this.#a){this.#a=!0;try{let e=Date.now(),t=await z.ownProperties.where(`kind`).equals(`announce`).sortBy(`ts`),n=await z.ownProperties.where(`kind`).equals(`signal`).toArray(),r=[...t.slice(0,-1),...n.filter(t=>e-t.ts>m.signalTtlMs)];for(let e of r){if(!this.#i)return;try{await this.#e.remove(e.propertyKey)}catch(e){if(!(e instanceof ke&&e.status===404))throw e}await z.ownProperties.delete(e.propertyKey)}}finally{this.#a=!1}}}async#v(){for(;this.#i;)try{await this.#y(),this.#c=0}catch(e){if(!this.#i)return;this.#x(e),this.#c=Math.min(m.maxPollBackoffMs,Math.max(m.idlePollMs,this.#c*2)),await Dt(this.#c)}}async#y(){let e=(await this.#e.listSince(this.#r,this.#f)).reverse();for(let{propertyKey:t,createdAt:n,envelope:r}of e){if(this.#r=Math.max(this.#r,n-Et),r.t===`announce`){r.email!==this.email&&await this.#b(r,n);continue}let e=r.items.filter(e=>e.to===this.email&&e.toSession===this.session);if(e.length&&!await z.processedProperties.get(t)){await z.processedProperties.add({propertyKey:t,ts:Date.now()});for(let t of e){let e={...t,from:r.from,fromSession:r.fromSession};this.dispatchEvent(new CustomEvent(`signal`,{detail:e}))}}}}async#b(e,t){let n=await z.peers.get(e.email);if(n&&n.lastSeen>=t)return;let r={email:e.email,session:e.session,ip:e.ip,seeds:[{seedId:e.seedId,seed:e.seed,receivedAt:t},...n?.seeds.filter(t=>t.seedId!==e.seedId)??[]].slice(0,q),avatarSvg:n?.avatarSvg??await St(e.email),lastSeen:t};await z.peers.put(r),this.dispatchEvent(new CustomEvent(`peer`,{detail:r}))}#x(e){this.dispatchEvent(new CustomEvent(`error`,{detail:e}))}},kt=[`baseUrl`,`pageId`,`email`,`token`];async function At(){let[e,t,n,r]=await Promise.all(kt.map(it));return{baseUrl:e??m.confluenceBaseUrl,pageId:t??m.pageId,email:n,token:r}}function jt(e){return!!(e.pageId&&e.email&&e.token)}async function J(e){await Promise.all(kt.map(t=>at(t,e[t])))}async function Mt(){await z.settings.delete(`token`)}var Nt=class{registry;mesh;constructor(e,t){this.registry=new Ot(new Pe(e),e.email,t),this.mesh=new yt(this.registry,t)}async start(){O(`session.start`,{email:this.registry.email});try{await this.registry.start(),await this.mesh.start(),O(`session.started`)}catch(e){throw O(`session.start_failed`,{error:e}),this.stop(),e}}stop(){O(`session.stop`),this.mesh.stop(),this.registry.stop()}},Pt=document.createElement(`template`);Pt.innerHTML=`
  <style>
    :host {
      position: relative;
      display: inline-block;
      flex: none;
      width: var(--avatar-size, 2.25rem);
      height: var(--avatar-size, 2.25rem);
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--surface);
    }
    .dot {
      display: none;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 28%;
      height: 28%;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid var(--bg);
      box-shadow: 0 0 0 1px var(--celery-mist, #a8b899);
    }
    :host([online]) .dot {
      display: block;
    }
  </style>
  <img alt="" />
  <span class="dot"></span>
`;var Y=class extends HTMLElement{static observedAttributes=[`email`];#e;constructor(){super();let e=this.attachShadow({mode:`open`});e.append(Pt.content.cloneNode(!0)),this.#e=e.querySelector(`img`)}attributeChangedCallback(){let e=this.getAttribute(`email`)??``;this.#e.alt=e,e&&wt(e).then(t=>{this.getAttribute(`email`)===e&&(this.#e.src=t)})}};customElements.define(`peer-avatar`,Y);var Ft=200,It=80,Lt=18e4,Rt=document.createElement(`template`);Rt.innerHTML=`
  <style>
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      height: 100%;
      min-height: 0;
      position: relative;
    }
    .notice {
      margin: 0;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      text-align: center;
      background: var(--surface);
      color: var(--muted);
    }
    .notice:empty {
      display: none;
    }
    .viewport {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      overflow: hidden;
    }
    .pull-indicator {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: var(--accent);
      color: var(--accent-text);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
      z-index: 15;
      pointer-events: none;
      animation: fadeIn 0.15s ease-out;
    }
    .sticky-date {
      position: absolute;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: var(--surface);
      color: var(--muted);
      border: 1px solid var(--border);
      box-shadow: 0 2px 8px rgb(0 0 0 / 0.12);
      z-index: 5;
      pointer-events: none;
      user-select: none;
      transition: opacity 0.2s ease;
    }
    .sticky-date[hidden],
    .pull-indicator[hidden] {
      display: none;
    }
    ol {
      position: relative;
      list-style: none;
      margin: 0;
      padding: 0.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      overflow-anchor: none;
    }
    li {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      max-width: 88%;
      transition: margin 0.15s ease;
      touch-action: pan-y;
      -webkit-touch-callout: none;
      user-select: text;
    }
    li.arrived {
      animation: arrive 240ms ease-out;
    }
    @keyframes arrive {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      li.arrived {
        animation: none;
      }
    }
    li.mine {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    /* Grouped consecutive messages from the same sender */
    li.grouped {
      margin-top: -0.375rem;
    }
    li.grouped peer-avatar {
      visibility: hidden;
      pointer-events: none;
    }
    li.grouped .meta {
      display: none;
    }
    .bubble {
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius);
      background: var(--surface);
      border: 1px solid var(--border);
      min-width: 0;
      word-break: break-word;
      cursor: pointer;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
    }
    li:not(.mine).grouped .bubble {
      border-top-left-radius: 4px;
    }
    li.mine .bubble {
      background: var(--accent);
      color: var(--accent-text);
      border: 1px solid transparent;
      box-shadow: 0 2px 8px rgb(59 130 246 / 0.25);
    }
    li.mine.grouped .bubble {
      border-top-right-radius: 4px;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      margin-bottom: 0.125rem;
    }
    li:not(.mine) .meta span:first-child {
      color: var(--author-accent, var(--soft-lavender, #c4b5fd));
      font-weight: 600;
    }
    li.mine .meta {
      opacity: 0.85;
    }
    .delivery-status {
      display: inline-flex;
      align-items: center;
      font-size: 0.6875rem;
      user-select: none;
      margin-left: 0.125rem;
    }
    .delivery-status.sent {
      color: var(--celery-mist, #a8b899);
      opacity: 1;
    }
    li.mine .delivery-status.sent {
      color: rgba(255, 255, 255, 0.9);
    }
    .delivery-status.pending {
      color: var(--topaz-volt, #f4a261);
      font-size: 0.625rem;
      opacity: 0.9;
    }
    li.mine .delivery-status.pending {
      color: rgba(255, 255, 255, 0.75);
    }
    .msg-quote {
      margin: 0 0 0.375rem 0;
      padding: 0.25rem 0.5rem;
      border-left: 3px solid var(--soft-lavender, #c4b5fd);
      background: rgba(196, 181, 253, 0.12);
      border-radius: 0 4px 4px 0;
      font-size: 0.8125rem;
      color: var(--muted);
      font-style: italic;
    }
    li.mine .msg-quote {
      border-left-color: rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.9);
    }
    .text {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.4;
    }
    .jump {
      position: absolute;
      left: 50%;
      bottom: 0.75rem;
      transform: translateX(-50%);
      min-height: 2.25rem;
      padding: 0 1rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      background: var(--surface);
      color: var(--text);
      box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      z-index: 10;
      transition: transform 0.1s ease, background 0.15s ease;
    }
    .jump:active {
      transform: translateX(-50%) scale(0.97);
    }
    .jump[hidden] {
      display: none;
    }
    form {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      padding-bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    textarea {
      flex: 1;
      font: inherit;
      font-size: 1rem;
      line-height: 1.4;
      resize: none;
      max-height: 9rem;
      padding: 0.625rem 0.75rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      -webkit-appearance: none;
      box-sizing: border-box;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    .btn-emoji-toggle {
      font-size: 1.25rem;
      line-height: 1;
      width: 2.75rem;
      min-width: 2.75rem;
      height: 2.75rem;
      display: grid;
      place-items: center;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      cursor: pointer;
      touch-action: manipulation;
      transition: background 0.15s ease, border-color 0.15s ease;
      padding: 0;
      color: var(--text);
      flex-shrink: 0;
    }
    .btn-emoji-toggle:active {
      background: var(--bg);
    }
    .btn-emoji-toggle.active {
      border-color: var(--accent);
      background: rgb(31 111 235 / 0.15);
    }
    .emoji-bar {
      display: flex;
      align-items: center;
      padding: 0.375rem 0.5rem;
      background: var(--surface);
      border-top: 1px solid var(--border);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      animation: fadeIn 0.15s ease-out;
    }
    .emoji-bar::-webkit-scrollbar {
      display: none;
    }
    .emoji-bar[hidden] {
      display: none !important;
    }
    .emoji-scroll {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin: 0 auto;
      max-width: 100%;
    }
    .emoji-btn {
      font-size: 1.35rem;
      line-height: 1;
      width: 2.375rem;
      height: 2.375rem;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
      touch-action: manipulation;
      transition: transform 0.1s ease, background 0.15s ease;
      flex-shrink: 0;
      padding: 0;
    }
    .emoji-btn:active {
      transform: scale(1.25);
      background: rgb(255 255 255 / 0.12);
    }
    button[type="submit"] {
      font: inherit;
      font-weight: 600;
      min-width: 3.25rem;
      min-height: 2.75rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 2px 8px rgb(59 130 246 / 0.3);
      transition: opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    button[type="submit"]:hover:not(:disabled) {
      background: var(--accent-hover);
      box-shadow: 0 4px 12px rgb(59 130 246 / 0.4);
    }
    button[type="submit"]:active {
      transform: scale(0.97);
    }

    /* Toast Notification */
    .toast {
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.5rem 1rem;
      background: var(--text);
      color: var(--bg);
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: 999px;
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.25);
      z-index: 100;
      pointer-events: none;
      animation: fadeIn 0.15s ease-out;
    }
    .toast[hidden] {
      display: none;
    }

    /* Context Menu Bottom Sheet */
    .msg-menu-backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.5);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 80;
      animation: fadeIn 0.15s ease-out;
    }
    .msg-menu-sheet {
      position: fixed;
      inset: auto 0 0 0;
      background: var(--bg);
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
      padding: 1rem;
      padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
      z-index: 85;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 28rem;
      margin: 0 auto;
      animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .msg-menu-backdrop[hidden],
    .msg-menu-sheet[hidden] {
      display: none;
    }
    .menu-handle {
      width: 36px;
      height: 4px;
      background: var(--muted);
      opacity: 0.35;
      border-radius: 999px;
      margin: 0 auto 0.5rem;
    }
    .menu-preview {
      font-size: 0.8125rem;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0.375rem 0.625rem;
      border-left: 3px solid var(--soft-lavender, #c4b5fd);
      background: var(--surface);
      border-radius: 0 6px 6px 0;
      margin-bottom: 0.5rem;
    }
    .menu-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      font: inherit;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      width: 100%;
      touch-action: manipulation;
    }
    .menu-btn:active {
      background: var(--border);
    }
    .menu-reactions {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0.375rem 0.25rem 0.625rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0.375rem;
    }
    .react-btn {
      font-size: 1.5rem;
      line-height: 1;
      width: 2.75rem;
      height: 2.75rem;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 50%;
      background: var(--surface);
      cursor: pointer;
      touch-action: manipulation;
      transition: transform 0.12s ease;
      padding: 0;
    }
    .react-btn:active {
      transform: scale(1.3);
    }
    .info-card {
      display: grid;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--surface);
      border-radius: var(--radius);
      font-size: 0.8125rem;
      margin-bottom: 0.25rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .info-label {
      color: var(--muted);
      font-weight: 500;
    }
    .info-val {
      font-weight: 600;
      color: var(--text);
      text-align: right;
      word-break: break-all;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  </style>
  <p class="notice" role="status"></p>
  <div class="viewport">
    <div class="pull-indicator" hidden>↓ Desliza para comprobar señales</div>
    <div class="sticky-date" hidden></div>
    <ol aria-live="polite"></ol>
    <button class="jump" type="button" hidden></button>
  </div>
  <div class="emoji-bar" role="toolbar" aria-label="Emojis rápidos" hidden>
    <div class="emoji-scroll">
      <button type="button" class="emoji-btn" data-emoji="👍" aria-label="👍">👍</button>
      <button type="button" class="emoji-btn" data-emoji="❤️" aria-label="❤️">❤️</button>
      <button type="button" class="emoji-btn" data-emoji="😂" aria-label="😂">😂</button>
      <button type="button" class="emoji-btn" data-emoji="🎉" aria-label="🎉">🎉</button>
      <button type="button" class="emoji-btn" data-emoji="👀" aria-label="👀">👀</button>
      <button type="button" class="emoji-btn" data-emoji="✅" aria-label="✅">✅</button>
      <button type="button" class="emoji-btn" data-emoji="🚀" aria-label="🚀">🚀</button>
      <button type="button" class="emoji-btn" data-emoji="🙏" aria-label="🙏">🙏</button>
      <button type="button" class="emoji-btn" data-emoji="🔥" aria-label="🔥">🔥</button>
      <button type="button" class="emoji-btn" data-emoji="👏" aria-label="👏">👏</button>
    </div>
  </div>
  <form>
    <button type="button" class="btn-emoji-toggle" aria-label="Reacciones y emojis rápidos" title="Emojis">😊</button>
    <textarea rows="1" maxlength="4000" enterkeyhint="send"></textarea>
    <button type="submit"></button>
  </form>
  <div class="toast" hidden></div>
  <div class="msg-menu-backdrop" hidden></div>
  <div class="msg-menu-sheet" hidden>
    <div class="menu-handle"></div>
    <div class="menu-preview"></div>
    <div class="menu-reactions">
      <button type="button" class="react-btn" data-emoji="👍" aria-label="👍">👍</button>
      <button type="button" class="react-btn" data-emoji="❤️" aria-label="❤️">❤️</button>
      <button type="button" class="react-btn" data-emoji="😂" aria-label="😂">😂</button>
      <button type="button" class="react-btn" data-emoji="🎉" aria-label="🎉">🎉</button>
      <button type="button" class="react-btn" data-emoji="👀" aria-label="👀">👀</button>
      <button type="button" class="react-btn" data-emoji="🚀" aria-label="🚀">🚀</button>
    </div>
    <div class="info-card" hidden>
      <div class="info-row"><span class="info-label label-from"></span><span class="info-val val-from"></span></div>
      <div class="info-row"><span class="info-label label-date"></span><span class="info-val val-date"></span></div>
      <div class="info-row"><span class="info-label label-id"></span><span class="info-val val-id"></span></div>
      <div class="info-row"><span class="info-label label-delivery"></span><span class="info-val val-delivery"></span></div>
    </div>
    <button type="button" class="menu-btn btn-copy">📋 <span class="txt-copy"></span></button>
    <button type="button" class="menu-btn btn-reply">💬 <span class="txt-reply"></span></button>
    <button type="button" class="menu-btn btn-info">ℹ️ <span class="txt-info"></span></button>
    <button type="button" class="menu-btn btn-close-menu">✕ <span class="txt-close"></span></button>
  </div>
`;var zt=class extends HTMLElement{#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;#d;#f;#p;#m;#h;#g;#_=new Set;#v=0;#y;#b;#x=0;#S=!1;constructor(){super();let e=this.attachShadow({mode:`open`});e.append(Rt.content.cloneNode(!0)),this.#e=e.querySelector(`ol`),this.#t=e.querySelector(`form`),this.#n=e.querySelector(`textarea`),this.#r=e.querySelector(`button[type="submit"]`),this.#i=e.querySelector(`.notice`),this.#a=e.querySelector(`.jump`),this.#o=e.querySelector(`.sticky-date`),this.#s=e.querySelector(`.pull-indicator`),this.#c=e.querySelector(`.toast`),this.#l=e.querySelector(`.msg-menu-backdrop`),this.#u=e.querySelector(`.msg-menu-sheet`),this.#d=e.querySelector(`.menu-preview`),this.#f=e.querySelector(`.menu-reactions`),this.#p=e.querySelector(`.info-card`),this.#m=e.querySelector(`.emoji-bar`),this.#h=e.querySelector(`.btn-emoji-toggle`);try{localStorage.getItem(`statim.emoji_open`)===`true`&&(this.#m.hidden=!1,this.#h.classList.add(`active`))}catch{}this.#h.addEventListener(`click`,()=>{let e=!!this.#m.hidden;this.#m.hidden=!e,this.#h.classList.toggle(`active`,e);try{localStorage.setItem(`statim.emoji_open`,String(e))}catch{}}),this.#m.addEventListener(`click`,e=>{let t=e.target.closest(`.emoji-btn`);if(!t)return;let n=t.dataset.emoji;if(!n)return;let r=this.#n.selectionStart??this.#n.value.length,i=this.#n.selectionEnd??this.#n.value.length,a=this.#n.value;this.#n.value=a.slice(0,r)+n+a.slice(i);let o=r+n.length;this.#n.setSelectionRange(o,o),this.#W(),this.#n.focus();try{navigator.vibrate?.(10)}catch{}}),this.#a.addEventListener(`click`,()=>this.#U()),this.#e.addEventListener(`scroll`,()=>{this.#P()&&this.#F(),this.#M()},{passive:!0}),this.#t.addEventListener(`submit`,e=>{e.preventDefault(),this.#O()}),this.#n.addEventListener(`keydown`,e=>{e.key===`Enter`&&!e.shiftKey&&!e.isComposing&&(e.preventDefault(),this.#t.requestSubmit())}),this.#n.addEventListener(`input`,()=>this.#W()),this.#n.addEventListener(`focus`,()=>{this.#P()&&setTimeout(()=>this.#U(),200)}),this.#H(),this.#B(),this.#w()}connectedCallback(){window.addEventListener(`statim:locale-changed`,this.#C)}disconnectedCallback(){window.removeEventListener(`statim:locale-changed`,this.#C),this.detach()}async attach(e){this.detach(),this.#g=e,e.mesh.addEventListener(`messages`,this.#T),e.mesh.addEventListener(`links`,this.#E);let t=await z.messages.orderBy(`ts`).reverse().limit(Ft).toArray();t.reverse(),this.#_=new Set(t.map(e=>e.msgId)),this.#e.replaceChildren(...t.map(e=>this.#I(e))),this.#A(),this.#j(),this.#M(),this.#D(),this.#U()}detach(){this.#g?.mesh.removeEventListener(`messages`,this.#T),this.#g?.mesh.removeEventListener(`links`,this.#E),this.#g=void 0}#C=()=>{this.#w(),this.#D(),this.#M(),this.#j(),this.#v>0&&(this.#a.textContent=this.#v===1?F(`chat.jump_one`):F(`chat.jump_many`,{count:this.#v}))};#w(){this.#n.placeholder=F(`chat.input_placeholder`),this.#n.setAttribute(`aria-label`,F(`chat.input_aria`)),this.#r.textContent=F(`chat.send_btn`),this.#r.setAttribute(`aria-label`,F(`chat.send_btn`));let e=this.shadowRoot;e.querySelector(`.txt-copy`).textContent=F(`menu.copy`),e.querySelector(`.txt-reply`).textContent=F(`menu.reply`),e.querySelector(`.txt-info`).textContent=F(`menu.info`),e.querySelector(`.txt-close`).textContent=F(`menu.close`),e.querySelector(`.label-from`).textContent=F(`menu.from`),e.querySelector(`.label-date`).textContent=F(`menu.date`),e.querySelector(`.label-id`).textContent=F(`menu.id`),e.querySelector(`.label-delivery`).textContent=F(`menu.delivery`),this.#h.setAttribute(`aria-label`,F(`chat.emoji_toggle`)),this.#h.title=F(`chat.emoji_toggle`),this.#m.setAttribute(`aria-label`,F(`chat.emoji_toggle`))}#T=e=>{this.#k(e.detail.messages,!0)};#E=()=>{this.#D(),this.#j()};#D=()=>{let e=this.#g?.mesh.connectedPeers().length??0;this.#i.textContent=e?``:F(`chat.notice_nobody`)};async#O(){let e=this.#n.value;if(e.trim()&&this.#g){this.#n.value=``,this.#W();try{this.#k([await this.#g.mesh.send(e)],!1,!0)}catch{this.#n.value=e,this.#i.textContent=F(`chat.send_failed`)}}}#k(e,t,n=!1){let r=e.filter(e=>!this.#_.has(e.msgId)).sort((e,t)=>t.ts-e.ts);if(!r.length)return;let i=n||this.#P(),a=i?null:this.#N(),o=a?a.offsetTop-this.#e.scrollTop:0,s=this.#e.lastElementChild,c=s?Number(s.dataset.ts):-1/0,l=s,u=0;for(let e of r){for(;l&&Number(l.dataset.ts)>e.ts;)l=l.previousElementSibling;let n=this.#I(e);t&&n.classList.add(`arrived`),l?l.after(n):this.#e.prepend(n),this.#_.add(e.msgId),e.ts>=c&&u++}this.#A(),this.#j(),i?this.#U():(a&&(this.#e.scrollTop=a.offsetTop-o),u&&(this.#v+=u,this.#a.textContent=this.#v===1?F(`chat.jump_one`):F(`chat.jump_many`,{count:this.#v}),this.#a.hidden=!1),this.#M())}#A(){let e=this.#e.children,t=null;for(let n of e){let e=!!t&&t.dataset.from===n.dataset.from&&Number(n.dataset.ts)-Number(t.dataset.ts)<Lt&&Number(n.dataset.ts)>=Number(t.dataset.ts);n.classList.toggle(`grouped`,e),t=n}}#j(){let e=(this.#g?.mesh.connectedPeers().length??0)>0;for(let t of this.#e.querySelectorAll(`li.mine`)){let n=t.querySelector(`.delivery-status`);n&&(n.className=`delivery-status ${e?`sent`:`pending`}`,n.textContent=e?`✓✓`:`🕒`,n.title=F(e?`chat.status_sent`:`chat.status_pending`))}}#M(){let e=this.#N();if(!e){this.#o.hidden=!0;return}let t=Number(e.dataset.ts);t?(this.#o.textContent=Ue(t),this.#o.hidden=!1):this.#o.hidden=!0}#N(){let e=this.#e.scrollTop;for(let t of this.#e.children)if(t.offsetTop+t.offsetHeight>e)return t;return null}#P(){return this.#e.scrollHeight-this.#e.scrollTop-this.#e.clientHeight<It}#F(){this.#v=0,this.#a.hidden=!0}#I(e){let t=document.createElement(`li`);t.dataset.ts=String(e.ts),t.dataset.from=e.from;let n=e.from===this.#g?.registry.email;t.classList.toggle(`mine`,n);let r=document.createElement(`peer-avatar`);r.setAttribute(`email`,e.from);let i=document.createElement(`div`);i.className=`bubble`;let a=document.createElement(`div`);a.className=`meta`;let o=document.createElement(`span`);o.textContent=e.from.split(`@`)[0];let s=document.createElement(`time`);if(s.dateTime=new Date(e.ts).toISOString(),s.textContent=He(e.ts),a.append(o,s),n){let e=document.createElement(`span`),t=(this.#g?.mesh.connectedPeers().length??0)>0;e.className=`delivery-status ${t?`sent`:`pending`}`,e.textContent=t?`✓✓`:`🕒`,e.title=F(t?`chat.status_sent`:`chat.status_pending`),a.append(e)}let c=document.createElement(`div`);if(c.className=`text`,e.text.startsWith(`> `)){let t=e.text.indexOf(`
`);if(t!==-1){let n=e.text.slice(2,t).trim(),r=e.text.slice(t+1).replace(/^\n+/,``),i=document.createElement(`div`);i.className=`msg-quote`,i.textContent=n;let a=document.createElement(`div`);a.textContent=r,c.append(i,a)}else c.textContent=e.text}else c.textContent=e.text;return i.append(a,c),this.#L(i,e),t.append(r,i),t}#L(e,t){let n,r=0,i=0,a=()=>{n&&=(clearTimeout(n),void 0)};e.addEventListener(`touchstart`,e=>{e.touches.length===1&&(r=e.touches[0].clientX,i=e.touches[0].clientY,n=setTimeout(()=>{typeof navigator<`u`&&`vibrate`in navigator&&navigator.vibrate?.(15),this.#R(t)},400))},{passive:!0}),e.addEventListener(`touchmove`,e=>{if(!n)return;let t=Math.abs(e.touches[0].clientX-r),o=Math.abs(e.touches[0].clientY-i);(t>10||o>10)&&a()},{passive:!0}),e.addEventListener(`touchend`,a),e.addEventListener(`touchcancel`,a),e.addEventListener(`contextmenu`,e=>{e.preventDefault(),this.#R(t)})}#R(e){this.#y=e,this.#d.textContent=`${e.from.split(`@`)[0]}: ${e.text.slice(0,80)}`,this.#p.hidden=!0,this.#l.hidden=!1,this.#u.hidden=!1}#z(){this.#l.hidden=!0,this.#u.hidden=!0,this.#y=void 0}#B(){this.#l.addEventListener(`click`,()=>this.#z()),this.shadowRoot.querySelector(`.btn-close-menu`).addEventListener(`click`,()=>this.#z()),this.shadowRoot.querySelector(`.btn-copy`).addEventListener(`click`,async()=>{if(!this.#y)return;let e=this.#y.text;this.#z();try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),this.#V(F(`chat.copied`)))}catch{}}),this.shadowRoot.querySelector(`.btn-reply`).addEventListener(`click`,()=>{if(!this.#y)return;let e=`> ${this.#y.from.split(`@`)[0]}: ${this.#y.text.split(`
`)[0].slice(0,60)}\n\n`;this.#n.value=`${e}${this.#n.value}`,this.#z(),this.#W(),this.#n.focus(),this.#n.setSelectionRange(this.#n.value.length,this.#n.value.length)}),this.shadowRoot.querySelector(`.btn-info`).addEventListener(`click`,()=>{if(!this.#y)return;let e=this.#y,t=e.from===this.#g?.registry.email,n=(this.#g?.mesh.connectedPeers().length??0)>0,r=this.shadowRoot;r.querySelector(`.val-from`).textContent=e.from,r.querySelector(`.val-date`).textContent=new Date(e.ts).toLocaleString(),r.querySelector(`.val-id`).textContent=e.msgId;let i=F(`menu.delivery_received`);t&&(i=F(n?`menu.delivery_sent`:`menu.delivery_pending`)),r.querySelector(`.val-delivery`).textContent=i,this.#p.hidden=!this.#p.hidden}),this.#f.addEventListener(`click`,e=>{let t=e.target.closest(`.react-btn`);if(!t||!this.#y)return;let n=t.dataset.emoji;if(!n)return;let r=`> ${this.#y.from.split(`@`)[0]}: ${this.#y.text.split(`
`)[0].slice(0,60)}\n${n} `;this.#n.value=`${r}${this.#n.value}`,this.#z(),this.#W(),this.#n.focus(),this.#n.setSelectionRange(this.#n.value.length,this.#n.value.length);try{navigator.vibrate?.(15)}catch{}})}#V(e){this.#b&&clearTimeout(this.#b),this.#c.textContent=e,this.#c.hidden=!1,this.#b=setTimeout(()=>{this.#c.hidden=!0},2e3)}#H(){this.#e.addEventListener(`touchstart`,e=>{this.#e.scrollTop<=0&&e.touches.length===1&&(this.#x=e.touches[0].clientY,this.#S=!0)},{passive:!0}),this.#e.addEventListener(`touchmove`,e=>{this.#S&&(e.touches[0].clientY-this.#x>40&&this.#e.scrollTop<=0?this.#s.hidden=!1:this.#s.hidden=!0)},{passive:!0}),this.#e.addEventListener(`touchend`,e=>{this.#S&&(this.#S=!1,e.changedTouches[0].clientY-this.#x>60&&this.#e.scrollTop<=0&&(typeof navigator<`u`&&`vibrate`in navigator&&navigator.vibrate?.(10),this.dispatchEvent(new CustomEvent(`statim:refresh`,{bubbles:!0,composed:!0}))),this.#s.hidden=!0)})}#U(){this.#e.scrollTop=this.#e.scrollHeight,this.#F(),this.#M()}#W(){this.#n.style.height=`auto`,this.#n.style.height=`${this.#n.scrollHeight}px`}};customElements.define(`chat-room`,zt);var Bt=document.createElement(`template`);Bt.innerHTML=`
  <style>
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      padding: 1.5rem 1rem calc(3rem + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    form {
      display: grid;
      gap: 1.25rem;
      max-width: 28rem;
      width: 100%;
      margin: 0 auto;
    }
    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .brand-title-logo {
      width: 2rem;
      height: 2rem;
      border-radius: 8px;
      flex-shrink: 0;
    }
    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }
    .lang-toggle {
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.375rem 0.625rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      touch-action: manipulation;
    }
    label {
      display: grid;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text);
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    input {
      display: block;
      width: 100%;
      min-height: 3.25rem;
      font: inherit;
      font-size: 1.0625rem;
      line-height: 1.5;
      padding: 0.875rem 1rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      -webkit-appearance: none;
      appearance: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    input::placeholder {
      color: var(--muted);
      opacity: 0.8;
      font-size: 0.9375rem;
    }
    .btn-toggle-pw {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      padding: 0.5rem;
      font-size: 1.125rem;
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius);
    }
    details.turn-section,
    details.proxy-section,
    details.logs-section {
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      overflow: hidden;
    }
    details.turn-section summary,
    details.proxy-section summary,
    details.logs-section summary {
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      user-select: none;
      min-height: 3.25rem;
      padding: 0.875rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.15s ease;
    }
    details.turn-section summary:hover,
    details.proxy-section summary:hover,
    details.logs-section summary:hover {
      background-color: rgba(128, 128, 128, 0.08);
    }
    .turn-fields,
    .proxy-fields,
    .logs-fields {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      border-top: 1.5px solid var(--border);
      margin-top: 0;
    }
    button[type="submit"] {
      display: block;
      width: 100%;
      font: inherit;
      font-size: 1.125rem;
      font-weight: 600;
      min-height: 3.375rem;
      padding: 0.875rem 1.25rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 14px rgb(59 130 246 / 0.3);
      transition: opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    button[type="submit"]:hover:not(:disabled) {
      background: var(--accent-hover);
      box-shadow: 0 6px 20px rgb(59 130 246 / 0.4);
    }
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
      transition: opacity 0.15s ease, transform 0.1s ease;
    }
    button[type="submit"]:active {
      transform: scale(0.99);
      opacity: 0.9;
    }
    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .hint {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.45;
      color: var(--muted);
    }
    .error {
      margin: 0;
      font-size: 0.9375rem;
      color: #cf222e;
      font-weight: 500;
      line-height: 1.4;
    }
    .error:empty {
      display: none;
    }
    .logs-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-secondary {
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      touch-action: manipulation;
      transition: background 0.15s ease;
    }
    .btn-secondary:active {
      opacity: 0.8;
    }
    .logs-output {
      margin: 0;
      padding: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8125rem;
      line-height: 1.4;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      max-height: 14rem;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
      color: var(--text);
    }
  </style>
  <form>
    <div class="form-header">
      <div class="brand-title">
        <svg class="brand-title-logo" viewBox="0 0 512 512" width="34" height="34" aria-hidden="true">
          <defs>
            <linearGradient id="login-logo-grad" x1="90%" y1="0%" x2="10%" y2="100%">
              <stop offset="0%" stop-color="#00daf3"/>
              <stop offset="35%" stop-color="#3b82f6"/>
              <stop offset="70%" stop-color="#1c222b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="login-bolt-grad" x1="85%" y1="5%" x2="15%" y2="95%">
              <stop offset="0%" stop-color="#00daf3"/>
              <stop offset="38%" stop-color="#3b82f6"/>
              <stop offset="68%" stop-color="#f4a261"/>
              <stop offset="100%" stop-color="#ff5a1f"/>
            </linearGradient>
          </defs>
          <path fill="url(#login-logo-grad)" fill-rule="evenodd" d="M 164 202 L 164 160 A 92 92 0 0 1 348 160 L 348 202 L 376 202 L 376 226 C 368 214 354 204 338 202 L 312 202 L 312 160 A 56 56 0 0 0 200 160 L 200 202 L 174 202 C 158 204 144 214 136 226 L 136 202 Z"/>
          <path fill="url(#login-logo-grad)" fill-rule="evenodd" d="M 256 198 A 120 120 0 1 1 255.9 198 Z M 256 238 A 80 80 0 1 0 256.1 238 Z"/>
          <path fill="url(#login-bolt-grad)" d="M 259 238 A 80 80 0 0 1 293 247 L 254 318 L 312 318 L 268 397 A 80 80 0 0 1 230 394 L 256 346 L 200 346 Z"/>
        </svg>
        <h2 class="title"></h2>
      </div>
      <span role="button" tabindex="0" class="lang-toggle" aria-label="Cambiar idioma">🌐 ES</span>
    </div>
    <label><span class="label-email"></span>
      <input name="email" type="email" autocomplete="username" required />
    </label>
    <label><span class="label-token"></span>
      <div class="input-wrapper">
        <input name="token" type="password" autocomplete="current-password" required />
        <span role="button" tabindex="0" class="btn-toggle-pw" aria-label="Mostrar contraseña">👁️</span>
      </div>
    </label>
    <label><span class="label-page-id"></span>
      <input name="pageId" inputmode="numeric" pattern="[0-9]+" required />
    </label>
    <label><span class="label-base-url"></span>
      <input name="baseUrl" type="url" />
    </label>
    <details class="turn-section">
      <summary class="summary-turn"></summary>
      <div class="turn-fields">
        <label><span class="label-turn-domain"></span>
          <input name="meteredDomain" type="text" autocomplete="off" />
        </label>
        <label><span class="label-turn-key"></span>
          <input name="meteredApiKey" type="password" autocomplete="off" />
        </label>
        <p class="hint hint-turn"></p>
      </div>
    </details>
    <details class="proxy-section">
      <summary class="summary-proxy"></summary>
      <div class="proxy-fields">
        <label><span class="label-proxy-url"></span>
          <input name="proxyUrl" type="text" autocomplete="off" />
        </label>
        <label><span class="label-proxy-user"></span>
          <input name="proxyUser" type="text" autocomplete="off" />
        </label>
        <label><span class="label-proxy-pass"></span>
          <input name="proxyPassword" type="password" autocomplete="current-password" />
        </label>
        <label><span class="label-proxy-excluded"></span>
          <input name="proxyExcludedDomains" type="text" autocomplete="off" />
        </label>
      </div>
    </details>
    <p class="hint hint-token"></p>
    <p class="error" role="alert"></p>
    <button type="submit"></button>
    <details class="logs-section">
      <summary class="summary-logs"></summary>
      <div class="logs-fields">
        <p class="hint hint-logs"></p>
        <div class="logs-actions">
          <button type="button" class="btn-secondary btn-copy-logs"></button>
          <button type="button" class="btn-secondary btn-clear-logs"></button>
        </div>
        <pre class="logs-output" tabindex="0">Sin eventos registrados aún.</pre>
      </div>
    </details>
  </form>
`;var Vt=class extends HTMLElement{#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u=!1;constructor(){super();let e=this.attachShadow({mode:`open`});e.append(Bt.content.cloneNode(!0)),this.#e=e.querySelector(`form`),this.#t=e.querySelector(`.error`),this.#n=e.querySelector(`button[type="submit"]`)||e.querySelector(`button`),this.#r=e.querySelector(`.lang-toggle`),this.#i=e.querySelector(`details.logs-section`),this.#a=e.querySelector(`.logs-output`),this.#o=e.querySelector(`.btn-copy-logs`),this.#s=e.querySelector(`.btn-clear-logs`),this.#c=e.querySelector(`input[name="token"]`),this.#l=e.querySelector(`.btn-toggle-pw`);let t=()=>Ve();this.#r.addEventListener(`click`,t),this.#r.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),t())});let n=()=>{let e=this.#c.type===`password`;this.#c.type=e?`text`:`password`,this.#l.textContent=e?`🔒`:`👁️`};this.#l.addEventListener(`click`,n),this.#l.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n())});let r=()=>{this.#a.textContent=k()};this.#i.addEventListener(`toggle`,()=>{this.#i.open&&r()}),this.#o.addEventListener(`click`,async()=>{let e=k();try{navigator.clipboard&&typeof navigator.clipboard.writeText==`function`&&await navigator.clipboard.writeText(e);let t=this.#o.textContent;this.#o.textContent=`¡Copiado!`,setTimeout(()=>{this.#o.textContent=t},1500)}catch{let e=document.createRange();e.selectNodeContents(this.#a);let t=window.getSelection();t?.removeAllRanges(),t?.addRange(e)}}),this.#s.addEventListener(`click`,()=>{_e(),r()}),typeof window<`u`&&(window.addEventListener(`statim-trace`,()=>{this.#i.open&&r()}),window.addEventListener(`statim-trace-cleared`,()=>{this.#i.open&&r()})),this.#e.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(this.#e),n=e=>String(t.get(e)??``).trim(),r={email:n(`email`),token:n(`token`),pageId:n(`pageId`),baseUrl:n(`baseUrl`)},i=n(`meteredDomain`),a=n(`meteredApiKey`);i&&(r.meteredDomain=i),a&&(r.meteredApiKey=a);let o=n(`proxyUrl`),s=n(`proxyUser`),c=n(`proxyPassword`),l=n(`proxyExcludedDomains`);o&&(r.proxyUrl=o),s&&(r.proxyUser=s),c&&(r.proxyPassword=c),l&&(r.proxyExcludedDomains=l),O(`ui.login.submit`,{email:r.email,pageId:r.pageId,hasTurn:!!r.meteredApiKey,hasProxy:!!r.proxyUrl}),this.dispatchEvent(new CustomEvent(`login`,{detail:r}))}),this.#f()}connectedCallback(){window.addEventListener(`statim:locale-changed`,this.#d)}disconnectedCallback(){window.removeEventListener(`statim:locale-changed`,this.#d)}#d=()=>{this.#f()};#f(){let e=this.shadowRoot,t=ze();this.#r.textContent=`🌐 ${t.toUpperCase()}`,e.querySelector(`.title`).textContent=F(`login.title`),e.querySelector(`.label-email`).textContent=F(`login.email`),e.querySelector(`.label-token`).textContent=F(`login.token`),e.querySelector(`.label-page-id`).textContent=F(`login.page_id`),e.querySelector(`.label-base-url`).textContent=F(`login.base_url`);let n=e.querySelector(`input[name="email"]`);n&&(n.placeholder=F(`login.email_placeholder`));let r=e.querySelector(`input[name="token"]`);r&&(r.placeholder=F(`login.token_placeholder`));let i=e.querySelector(`input[name="pageId"]`);i&&(i.placeholder=F(`login.page_id_placeholder`));let a=e.querySelector(`input[name="baseUrl"]`);a&&(a.placeholder=F(`login.base_url_placeholder`)),e.querySelector(`.summary-turn`).textContent=F(`login.turn_section`),e.querySelector(`.label-turn-domain`).textContent=F(`login.metered_domain`),e.querySelector(`.label-turn-key`).textContent=F(`login.metered_api_key`);let o=e.querySelector(`input[name="meteredDomain"]`);o&&(o.placeholder=F(`login.metered_domain_placeholder`));let s=e.querySelector(`input[name="meteredApiKey"]`);s&&(s.placeholder=F(`login.metered_api_key_placeholder`)),e.querySelector(`.hint-turn`).textContent=t===`es`?`Usará TURNS sobre TLS (puerto 443). Estos datos son sensibles y no se almacenan.`:`Uses TURNS over TLS (port 443). This data is sensitive and not stored.`,e.querySelector(`.summary-proxy`).textContent=F(`login.proxy_section`),e.querySelector(`.label-proxy-url`).textContent=F(`login.proxy_url`),e.querySelector(`.label-proxy-user`).textContent=F(`login.proxy_user`),e.querySelector(`.label-proxy-pass`).textContent=F(`login.proxy_password`),e.querySelector(`.label-proxy-excluded`).textContent=F(`login.proxy_excluded`);let c=e.querySelector(`input[name="proxyUrl"]`);c&&(c.placeholder=F(`login.proxy_url_placeholder`));let l=e.querySelector(`input[name="proxyUser"]`);l&&(l.placeholder=F(`login.proxy_user_placeholder`));let u=e.querySelector(`input[name="proxyPassword"]`);u&&(u.placeholder=F(`login.proxy_password_placeholder`));let d=e.querySelector(`input[name="proxyExcludedDomains"]`);d&&(d.placeholder=F(`login.proxy_excluded_placeholder`)),e.querySelector(`.hint-token`).textContent=t===`es`?`El token se guarda sin cifrar en este dispositivo.`:`Token is saved unencrypted on this device.`,this.#n.textContent=this.#u?F(`login.connecting`):F(`login.submit`),e.querySelector(`.summary-logs`).textContent=F(`login.logs_section`),e.querySelector(`.hint-logs`).textContent=t===`es`?`Trazas y eventos del sistema útiles para diagnosticar incidencias de conexión o red.`:`System traces and events useful for diagnosing network or connection issues.`,this.#o.textContent=F(`login.export_logs`),this.#s.textContent=F(`login.clear_logs`)}set values(e){for(let t of[`email`,`token`,`pageId`,`baseUrl`]){let n=this.#e.elements.namedItem(t);n.value=e[t]??``}let t=this.#e.elements.namedItem(`meteredDomain`);t&&(t.value=``);let n=this.#e.elements.namedItem(`meteredApiKey`);n&&(n.value=``);let r=this.#e.elements.namedItem(`proxyUrl`);r&&(r.value=e.proxyUrl??``);let i=this.#e.elements.namedItem(`proxyUser`);i&&(i.value=e.proxyUser??``);let a=this.#e.elements.namedItem(`proxyPassword`);a&&(a.value=``);let o=this.#e.elements.namedItem(`proxyExcludedDomains`);o&&(o.value=e.proxyExcludedDomains??``)}set error(e){this.#t.textContent=e,e&&O(`ui.login.error`,{error:e})}set busy(e){this.#u=e,this.#n.disabled=e,this.#n.textContent=F(e?`login.connecting`:`login.submit`)}};customElements.define(`login-view`,Vt);var Ht=document.createElement(`template`);Ht.innerHTML=`
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      background: var(--bg);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text);
    }
    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border: none;
      border-radius: 50%;
      background: var(--surface);
      color: var(--text);
      font-size: 1rem;
      cursor: pointer;
    }
    @media (min-width: 900px) {
      .close-btn {
        display: none;
      }
      .header {
        border-bottom: none;
        padding: 1rem;
      }
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0.5rem;
      overflow-y: auto;
      flex: 1;
      -webkit-overflow-scrolling: touch;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: var(--radius);
      transition: background-color 0.15s ease;
    }
    li:hover {
      background: var(--surface);
    }
    .info {
      display: grid;
      min-width: 0;
      gap: 0.125rem;
    }
    .name {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--text);
    }
    .email {
      font-size: 0.8125rem;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .empty {
      padding: 1.5rem 1rem;
      text-align: center;
      color: var(--muted);
      font-size: 0.875rem;
    }
  </style>
  <div class="header">
    <h2 class="title"></h2>
    <button class="close-btn" type="button" aria-label="Cerrar">✕</button>
  </div>
  <ul></ul>
`;var Ut=class extends HTMLElement{#e;#t;#n;#r;constructor(){super();let e=this.attachShadow({mode:`open`});e.append(Ht.content.cloneNode(!0)),this.#e=e.querySelector(`ul`),this.#t=e.querySelector(`.title`),this.#n=e.querySelector(`.close-btn`),this.#n.addEventListener(`click`,()=>{this.dispatchEvent(new CustomEvent(`close`,{bubbles:!0,composed:!0}))}),this.#a()}connectedCallback(){window.addEventListener(`statim:locale-changed`,this.#i)}disconnectedCallback(){window.removeEventListener(`statim:locale-changed`,this.#i),this.detach()}attach(e){this.detach(),this.#r=e,e.registry.addEventListener(`peer`,this.#o),e.mesh.addEventListener(`links`,this.#o),this.#o()}detach(){this.#r?.registry.removeEventListener(`peer`,this.#o),this.#r?.mesh.removeEventListener(`links`,this.#o),this.#r=void 0,this.#e.replaceChildren()}#i=()=>{this.#a(),this.#o()};#a(){this.#t.textContent=F(`peers.title`),this.#n.setAttribute(`aria-label`,F(`peers.close`))}#o=async()=>{let e=this.#r;if(!e)return;let t=await e.registry.activePeers(),n=new Set(e.mesh.connectedPeers());if(t.sort((e,t)=>Number(n.has(t.email))-Number(n.has(e.email))||e.email.localeCompare(t.email)),t.length)this.#e.replaceChildren(...t.map(e=>{let t=document.createElement(`li`),r=document.createElement(`peer-avatar`);r.setAttribute(`email`,e.email),r.toggleAttribute(`online`,n.has(e.email));let i=document.createElement(`div`);i.className=`info`;let a=document.createElement(`span`);a.className=`name`,a.textContent=e.email.split(`@`)[0];let o=document.createElement(`span`);return o.className=`email`,o.textContent=n.has(e.email)?e.email:`${e.email} · ${F(`peers.no_direct_connection`)}`,i.append(a,o),t.append(r,i),t}));else{let e=document.createElement(`li`);e.className=`empty`,e.textContent=F(`peers.empty`),this.#e.replaceChildren(e)}this.dispatchEvent(new CustomEvent(`count`,{detail:n.size}))}};customElements.define(`peer-list`,Ut);var Wt=document.createElement(`template`);Wt.innerHTML=`
  <style>
    :host {
      display: grid;
      grid-template-rows: auto auto 1fr;
      height: var(--viewport-height, 100%);
      max-height: var(--viewport-height, 100dvh);
      padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) 0 env(safe-area-inset-left, 0px);
      box-sizing: border-box;
      overflow: hidden;
    }
    header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-height: var(--header-h);
      padding: 0 0.5rem 0 1rem;
      background: var(--mineral-slate, #1c222b);
      color: var(--pure-alabaster, #f7f7f5);
      border-bottom: 1px solid var(--border);
      z-index: 110;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-shrink: 0;
    }
    .brand-logo {
      width: 1.375rem;
      height: 1.375rem;
      border-radius: 5px;
      flex-shrink: 0;
    }
    h1 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      flex: 1;
      min-width: 0;
      font: inherit;
      font-size: 0.8125rem;
      min-height: 2.25rem;
      padding: 0 0.5rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 999px;
      color: inherit;
      cursor: pointer;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      touch-action: manipulation;
    }
    .status:hover {
      background: rgb(255 255 255 / 0.1);
      border-color: rgb(255 255 255 / 0.2);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--topaz-volt, #f4a261);
      flex-shrink: 0;
      transition: background-color 0.2s ease;
    }
    .status-dot.online {
      background: #10b981;
    }
    .status-dot.offline {
      background: #f85149;
    }
    .status-dot.searching {
      background: var(--topaz-volt, #f4a261);
      animation: pulse 1.6s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.85); }
    }
    .status-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    header button:not(.status) {
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      min-height: 2.375rem;
      padding: 0 0.75rem;
      border: 1px solid rgb(255 255 255 / 0.22);
      border-radius: var(--radius);
      background: rgba(255 255 255 / 0.06);
      color: var(--pure-alabaster, #f7f7f5);
      cursor: pointer;
      touch-action: manipulation;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    header button:not(.status):hover {
      background: rgba(255 255 255 / 0.12);
      border-color: rgb(255 255 255 / 0.35);
    }
    header button:not(.status):active {
      background: rgba(255 255 255 / 0.18);
    }
    .lang-btn {
      font-weight: 600;
      font-size: 0.8125rem;
      padding: 0 0.5rem;
    }
    .update-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      color: var(--text);
      font-size: 0.8125rem;
      z-index: 5;
    }
    .update-msg {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .update-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    .update-apply {
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      min-height: 2rem;
      padding: 0 0.75rem;
      border: none;
      border-radius: var(--radius);
      background: var(--accent-cta, #ff5a1f);
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0 2px 6px rgb(255 90 31 / 0.3);
      transition: opacity 0.15s ease, background 0.15s ease;
    }
    .update-apply:hover:not(:disabled) {
      background: var(--accent-cta-hover, #ea4a10);
    }
    .update-apply:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .update-dismiss {
      font: inherit;
      font-size: 0.875rem;
      min-height: 2rem;
      min-width: 2rem;
      padding: 0;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
    }
    .update-indicator {
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      min-height: 2.25rem;
      padding: 0 0.75rem;
      border: 1px solid rgb(255 255 255 / 0.5);
      border-radius: var(--radius);
      background: rgb(255 255 255 / 0.15);
      color: inherit;
      cursor: pointer;
    }
    .update-indicator:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .install-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      font-size: 0.8125rem;
      color: var(--text);
      animation: fadeIn 0.2s ease-out;
      z-index: 100;
    }
    .install-banner[hidden] {
      display: none !important;
    }
    .install-content {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      flex: 1;
      min-width: 0;
    }
    .install-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .install-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      overflow: hidden;
    }
    .install-title {
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .install-desc {
      color: var(--muted);
      font-size: 0.75rem;
      line-height: 1.3;
    }
    .install-actions {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-shrink: 0;
    }
    .install-btn {
      font: inherit;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.375rem 0.625rem;
      min-height: 2rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent-cta, #ff5a1f);
      color: #ffffff;
      cursor: pointer;
      touch-action: manipulation;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgb(255 90 31 / 0.3);
      transition: background 0.15s ease;
    }
    .install-btn:hover {
      background: var(--accent-cta-hover, #ea4a10);
    }
    .install-dismiss {
      background: transparent;
      border: 0;
      color: var(--muted);
      font-size: 1rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      touch-action: manipulation;
    }
    main {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      overflow: hidden;
    }
    /* Mobile Bottom Sheet */
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.5);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 90;
      animation: fadeIn 0.2s ease-out;
    }
    aside {
      position: fixed;
      inset: auto 0 0 0;
      width: 100%;
      max-height: 80dvh;
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      background: var(--bg);
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
      z-index: 100;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .sheet-handle {
      width: 36px;
      height: 4px;
      background: var(--muted);
      opacity: 0.35;
      border-radius: 999px;
      margin: 0.625rem auto 0.25rem;
      flex-shrink: 0;
    }

    /* Network & Sync Bottom Sheet */
    .net-backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 0.5);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 95;
      animation: fadeIn 0.2s ease-out;
    }
    .net-sheet {
      position: fixed;
      inset: auto 0 0 0;
      background: var(--bg);
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.35);
      z-index: 105;
      display: flex;
      flex-direction: column;
      padding: 1rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom, 0px));
      max-width: 32rem;
      margin: 0 auto;
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .net-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .net-title {
      margin: 0;
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--text);
    }
    .net-close {
      background: var(--surface);
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: grid;
      place-items: center;
      cursor: pointer;
      color: var(--muted);
      font-size: 1rem;
    }
    .net-body {
      display: grid;
      gap: 0.875rem;
    }
    .net-section {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 0.875rem 1rem;
      display: grid;
      gap: 0.5rem;
    }
    .section-title {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text);
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }
    .stat-label {
      color: var(--muted);
    }
    .stat-val {
      font-weight: 600;
      color: var(--text);
    }
    .stat-desc {
      font-size: 0.75rem;
      color: var(--muted);
      opacity: 0.85;
      line-height: 1.35;
    }
    .btn-sync-now {
      font: inherit;
      font-size: 0.9375rem;
      font-weight: 600;
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      touch-action: manipulation;
      transition: opacity 0.15s ease;
    }
    .btn-sync-now:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    [hidden] {
      display: none !important;
    }
    @media (min-width: 900px) {
      :host {
        max-width: 1200px;
        margin: 0 auto;
        border-inline: 1px solid var(--border);
      }
      :host(.in-session) main {
        grid-template-columns: 1fr 20rem;
      }
      :host(.in-session) aside {
        display: flex !important;
        position: static;
        width: auto;
        max-height: none;
        border-radius: 0;
        border-top: none;
        border-left: 1px solid var(--border);
        box-shadow: none;
        animation: none;
        z-index: auto;
        padding-bottom: 0;
      }
      .net-sheet {
        inset: auto auto auto auto;
        top: 4.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: 24rem;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: 0 12px 36px rgb(0 0 0 / 0.25);
        animation: fadeIn 0.15s ease-out;
        padding-bottom: 1.25rem;
      }
      .backdrop,
      .sheet-handle {
        display: none !important;
      }
      :host(.in-session) .peers {
        display: none !important;
      }
    }
  </style>
  <header>
    <div class="brand">
      <svg class="brand-logo" viewBox="0 0 512 512" aria-hidden="true">
        <defs>
          <linearGradient id="header-logo-grad" x1="90%" y1="0%" x2="10%" y2="100%">
            <stop offset="0%" stop-color="#00daf3"/>
            <stop offset="35%" stop-color="#3b82f6"/>
            <stop offset="70%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
          <linearGradient id="header-bolt-grad" x1="85%" y1="5%" x2="15%" y2="95%">
            <stop offset="0%" stop-color="#00daf3"/>
            <stop offset="38%" stop-color="#3b82f6"/>
            <stop offset="68%" stop-color="#f4a261"/>
            <stop offset="100%" stop-color="#ff5a1f"/>
          </linearGradient>
        </defs>
        <path fill="url(#header-logo-grad)" fill-rule="evenodd" d="M 164 202 L 164 160 A 92 92 0 0 1 348 160 L 348 202 L 376 202 L 376 226 C 368 214 354 204 338 202 L 312 202 L 312 160 A 56 56 0 0 0 200 160 L 200 202 L 174 202 C 158 204 144 214 136 226 L 136 202 Z"/>
        <path fill="url(#header-logo-grad)" fill-rule="evenodd" d="M 256 198 A 120 120 0 1 1 255.9 198 Z M 256 238 A 80 80 0 1 0 256.1 238 Z"/>
        <path fill="url(#header-bolt-grad)" d="M 259 238 A 80 80 0 0 1 293 247 L 254 318 L 312 318 L 268 397 A 80 80 0 0 1 230 394 L 256 346 L 200 346 Z"/>
      </svg>
      <h1>Statim</h1>
    </div>
    <button class="status" type="button" aria-haspopup="dialog" aria-expanded="false" title="Ver detalles de red y sincronización">
      <span class="status-dot"></span>
      <span class="status-text"></span>
    </button>
    <button class="lang-btn" type="button" aria-label="Cambiar idioma">EN</button>
    <button class="update-indicator" type="button" hidden title="Actualización disponible">Actualizar</button>
    <button class="peers" type="button" hidden aria-expanded="false">Equipo</button>
    <button class="logout" type="button" hidden>Salir</button>
  </header>
  <div class="update-banner" role="status" hidden>
    <span class="update-msg">Nueva versión de Statim disponible.</span>
    <div class="update-actions">
      <button class="update-apply" type="button">Actualizar</button>
      <button class="update-dismiss" type="button" aria-label="Cerrar aviso de actualización">✕</button>
    </div>
  </div>
  <div class="install-banner" role="region" aria-label="Instalación" hidden>
    <div class="install-content">
      <span class="install-icon" aria-hidden="true">
        <svg viewBox="0 0 512 512" width="22" height="22" aria-hidden="true">
          <defs>
            <linearGradient id="install-logo-grad" x1="90%" y1="0%" x2="10%" y2="100%">
              <stop offset="0%" stop-color="#00daf3"/>
              <stop offset="35%" stop-color="#3b82f6"/>
              <stop offset="70%" stop-color="#ffffff"/>
              <stop offset="100%" stop-color="#cbd5e1"/>
            </linearGradient>
            <linearGradient id="install-bolt-grad" x1="85%" y1="5%" x2="15%" y2="95%">
              <stop offset="0%" stop-color="#00daf3"/>
              <stop offset="38%" stop-color="#3b82f6"/>
              <stop offset="68%" stop-color="#f4a261"/>
              <stop offset="100%" stop-color="#ff5a1f"/>
            </linearGradient>
          </defs>
          <path fill="url(#install-logo-grad)" fill-rule="evenodd" d="M 164 202 L 164 160 A 92 92 0 0 1 348 160 L 348 202 L 376 202 L 376 226 C 368 214 354 204 338 202 L 312 202 L 312 160 A 56 56 0 0 0 200 160 L 200 202 L 174 202 C 158 204 144 214 136 226 L 136 202 Z"/>
          <path fill="url(#install-logo-grad)" fill-rule="evenodd" d="M 256 198 A 120 120 0 1 1 255.9 198 Z M 256 238 A 80 80 0 1 0 256.1 238 Z"/>
          <path fill="url(#install-bolt-grad)" d="M 259 238 A 80 80 0 0 1 293 247 L 254 318 L 312 318 L 268 397 A 80 80 0 0 1 230 394 L 256 346 L 200 346 Z"/>
        </svg>
      </span>
      <div class="install-info">
        <strong class="install-title"></strong>
        <span class="install-desc"></span>
      </div>
    </div>
    <div class="install-actions">
      <button class="install-btn" type="button"></button>
      <button class="install-dismiss" type="button" aria-label="Cerrar aviso de instalación">✕</button>
    </div>
  </div>
  <main>
    <login-view hidden></login-view>
    <chat-room hidden></chat-room>
    <div class="backdrop" hidden></div>
    <aside hidden>
      <div class="sheet-handle" aria-hidden="true"></div>
      <peer-list></peer-list>
    </aside>
    <div class="net-backdrop" hidden></div>
    <div class="net-sheet" hidden role="dialog" aria-modal="true">
      <div class="sheet-handle"></div>
      <div class="net-header">
        <h3 class="net-title"></h3>
        <button class="net-close" type="button" aria-label="Cerrar">✕</button>
      </div>
      <div class="net-body">
        <div class="net-section">
          <h4 class="section-title net-mesh-title"></h4>
          <div class="stat-row"><span class="stat-label stat-connected-label"></span><span class="stat-val stat-connected-val">0</span></div>
          <div class="stat-row"><span class="stat-label stat-active-label"></span><span class="stat-val stat-active-val">0</span></div>
        </div>
        <div class="net-section">
          <h4 class="section-title net-sync-title"></h4>
          <div class="stat-row"><span class="stat-label stat-budget-label"></span><span class="stat-val stat-budget-val">100 / 100</span></div>
          <div class="stat-desc">Intervalo normal: 60 s · Mínimo urgente: 10 s</div>
        </div>
        <button type="button" class="btn-sync-now"></button>
      </div>
    </div>
  </main>
`;function Gt(e){return e instanceof Error&&e.message.includes(`Metered`)?F(`error.metered`):e instanceof ke?e.status===401||e.status===403?F(`error.confluence_auth`):e.status===404?F(`error.confluence_404`):e.status===429?F(`error.confluence_429`):e.message:e instanceof TypeError?F(`error.confluence_network`):F(`error.unexpected`)}var Kt=class extends HTMLElement{#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;#d;#f;#p;#m;#h;#g;#_;#v;#y;#b;#x;#S;#C;#w;#T;#E;#D;#O;#k;#A;#j;#M;#N;#P;#F=null;#I=!1;#L=0;#R;#z=0;#B=``;constructor(){super();let e=this.attachShadow({mode:`open`});e.append(Wt.content.cloneNode(!0)),this.#e=e.querySelector(`.status`),this.#t=e.querySelector(`.status-dot`),this.#n=e.querySelector(`.status-text`),this.#r=e.querySelector(`.lang-btn`),this.#i=e.querySelector(`.peers`),this.#a=e.querySelector(`.logout`),this.#o=e.querySelector(`login-view`),this.#s=e.querySelector(`chat-room`),this.#c=e.querySelector(`aside`),this.#l=e.querySelector(`.backdrop`),this.#u=e.querySelector(`peer-list`),this.#d=e.querySelector(`.net-backdrop`),this.#f=e.querySelector(`.net-sheet`),this.#p=e.querySelector(`.net-title`),this.#m=e.querySelector(`.net-close`),this.#h=e.querySelector(`.net-mesh-title`),this.#g=e.querySelector(`.stat-connected-label`),this.#_=e.querySelector(`.stat-connected-val`),this.#v=e.querySelector(`.stat-active-label`),this.#y=e.querySelector(`.stat-active-val`),this.#b=e.querySelector(`.net-sync-title`),this.#x=e.querySelector(`.stat-budget-label`),this.#S=e.querySelector(`.stat-budget-val`),this.#C=e.querySelector(`.btn-sync-now`),this.#w=e.querySelector(`.update-banner`),this.#T=e.querySelector(`.update-msg`),this.#E=e.querySelector(`.update-apply`),this.#D=e.querySelector(`.update-dismiss`),this.#O=e.querySelector(`.update-indicator`),this.#A=e.querySelector(`.install-banner`),this.#j=e.querySelector(`.install-title`),this.#M=e.querySelector(`.install-desc`),this.#N=e.querySelector(`.install-btn`),this.#P=e.querySelector(`.install-dismiss`),this.#P.addEventListener(`click`,()=>{this.#A.hidden=!0;try{localStorage.setItem(`statim.install_dismissed`,`1`)}catch{}}),this.#N.addEventListener(`click`,async()=>{if(this.#I){this.#A.hidden=!0;try{localStorage.setItem(`statim.install_dismissed`,`1`)}catch{}}else if(this.#F){this.#F.prompt();try{(await this.#F.userChoice)?.outcome===`accepted`&&(this.#A.hidden=!0)}catch{}this.#F=null}}),document.addEventListener(`visibilitychange`,()=>{document.hidden||(this.#L=0,this.#le())}),this.#e.addEventListener(`click`,()=>this.#W()),this.#m.addEventListener(`click`,()=>this.#G()),this.#d.addEventListener(`click`,()=>this.#G()),this.#C.addEventListener(`click`,()=>this.#K()),this.#r.addEventListener(`click`,()=>{Ve()}),this.#o.addEventListener(`login`,e=>void this.#X(e.detail)),this.#a.addEventListener(`click`,()=>void this.#Q(``)),this.#i.addEventListener(`click`,()=>this.#ee()),this.#l.addEventListener(`click`,()=>this.#ee(!1)),this.#u.addEventListener(`close`,()=>this.#ee(!1)),this.#E.addEventListener(`click`,()=>this.#J()),this.#O.addEventListener(`click`,()=>this.#J()),this.#D.addEventListener(`click`,()=>this.#Y()),this.#u.addEventListener(`count`,e=>{this.#z=e.detail,this.#de()}),this.addEventListener(`statim:refresh`,()=>{this.#K()}),this.#V(),this.#U()}async connectedCallback(){window.addEventListener(`online`,this.#de),window.addEventListener(`offline`,this.#de),window.addEventListener(`statim:update-available`,this.#q),window.addEventListener(`statim:locale-changed`,this.#H),window.addEventListener(`beforeinstallprompt`,this.#ie),this.#ae(),this.#de();let e=await At();if(!jt(e))this.#$(e,``);else try{await this.#Z(e)}catch(t){this.#$(e,Gt(t))}}disconnectedCallback(){window.removeEventListener(`online`,this.#de),window.removeEventListener(`offline`,this.#de),window.removeEventListener(`statim:update-available`,this.#q),window.removeEventListener(`statim:locale-changed`,this.#H),window.removeEventListener(`beforeinstallprompt`,this.#ie),this.#R?.stop()}showUpdateNotification(e){this.#k=e,this.#w.hidden=!1,this.#O.hidden=!0}setSessionForTesting(e){this.#R=e}#V(){if(typeof window<`u`&&window.visualViewport){let e=()=>{let e=window.visualViewport?window.visualViewport.height:window.innerHeight;this.style.setProperty(`--viewport-height`,`${e}px`)};window.visualViewport.addEventListener(`resize`,e),window.visualViewport.addEventListener(`scroll`,e),e()}}#H=()=>{this.#U()};#U(){let e=ze();this.#r.textContent=e===`es`?`EN`:`ES`,this.#r.setAttribute(`aria-label`,F(`app.switch_lang`)),this.#a.textContent=F(`app.logout`),this.#O.textContent=F(`app.update`),this.#O.title=F(`app.update_available`),this.#T.textContent=F(`app.update_banner_msg`),this.#E.textContent=F(`app.update`),this.#D.setAttribute(`aria-label`,F(`app.update_dismiss`)),this.#p.textContent=F(`net.title`),this.#h.textContent=F(`net.mesh_status`),this.#g.textContent=F(`net.connected_peers`),this.#v.textContent=F(`net.active_peers`),this.#b.textContent=F(`net.confluence_sync`),this.#x.textContent=F(`net.budget`),this.#C.textContent=F(`net.sync_now`),this.#I?(this.#j.textContent=F(`pwa.install_title`),this.#M.textContent=F(`pwa.install_ios`),this.#N.textContent=`OK`):(this.#j.textContent=F(`pwa.install_title`),this.#M.textContent=F(`pwa.install_desc`),this.#N.textContent=F(`pwa.install_btn`)),this.#P.setAttribute(`aria-label`,F(`pwa.install_dismiss`)),this.#de()}#W(){if(!this.#R)return;this.#d.hidden=!1,this.#f.hidden=!1,this.#e.setAttribute(`aria-expanded`,`true`),this.#_.textContent=String(this.#z);let e=this.#R.registry.remainingFastBudget;this.#S.textContent=`${e} / 100`,this.#R.registry.activePeers().then(e=>{this.#y.textContent=String(e.length)})}#G(){this.#d.hidden=!0,this.#f.hidden=!0,this.#e.setAttribute(`aria-expanded`,`false`)}#K(){this.#R&&(this.#R.registry.holdFastPolling(),this.#C.disabled=!0,this.#C.textContent=F(`net.syncing`),this.#t.className=`status-dot searching`,setTimeout(()=>{this.#C.disabled=!1,this.#C.textContent=F(`net.sync_now`),this.#de()},1500))}#q=e=>{let t=e.detail;this.showUpdateNotification(t)};#J(){O(`pwa.update.applying`),this.#E.disabled=!0,this.#E.textContent=F(`app.updating`),this.#O.disabled=!0,this.#O.textContent=F(`app.updating`),this.#k?.()}#Y(){O(`pwa.update.dismissed`),this.#w.hidden=!0,this.#O.hidden=!1}async#X(e){O(`app.login_attempt`,{email:e.email,pageId:e.pageId,hasTurn:!!e.meteredApiKey,hasProxy:!!e.proxyUrl}),this.#o.busy=!0,this.#o.error=``,`Notification`in window&&Notification.permission==="default"&&Notification.requestPermission();try{let t;e.meteredApiKey&&(t=await Ke(e.meteredApiKey,e.meteredDomain));let n={email:e.email,token:e.token,pageId:e.pageId,baseUrl:e.baseUrl};await this.#Z(n,t),await J(n),O(`app.login_success`,{email:e.email})}catch(e){O(`app.login_failed`,{error:Gt(e)}),this.#o.error=Gt(e)}finally{this.#o.busy=!1}}async#Z(e,t){O(`session.start`,{email:e.email,pageId:e.pageId,iceServerCount:t?.length??0});let n=new Nt(e,t);n.registry.addEventListener(`error`,this.#te),n.registry.addEventListener(`signal`,this.#ne),n.registry.addEventListener(`peer`,this.#ne),n.mesh.addEventListener(`messages`,this.#re),await n.start(),this.#R=n,this.#B=``,this.classList.add(`in-session`),this.#o.hidden=!0,this.#s.hidden=!1,this.#i.hidden=!1,this.#a.hidden=!1,await this.#s.attach(n),this.#u.attach(n),this.#de()}async#Q(e){O(`app.logout`,{error:e});let t=this.#R;this.#R=void 0,t?.stop(),this.#s.detach(),this.#u.detach(),await Mt(),this.#$(await At(),e)}#$(e,t){this.classList.remove(`in-session`),this.#s.hidden=!0,this.#c.hidden=!0,this.#l.hidden=!0,this.#f.hidden=!0,this.#d.hidden=!0,this.#i.hidden=!0,this.#a.hidden=!0,this.#o.values=e,this.#o.error=t,this.#o.hidden=!1,this.#z=0,this.#de()}#ee(e){let t=e===void 0?this.#c.hidden:e;this.#c.hidden=!t,this.#l.hidden=!t,this.#i.setAttribute(`aria-expanded`,String(t))}#te=e=>{let t=e.detail;t instanceof ke&&(t.status===401||t.status===403)?this.#Q(Gt(t)):(this.#B=Gt(t),this.#de())};#ne=()=>{this.#B&&(this.#B=``,this.#de())};#re=e=>{let t=e.detail;typeof document<`u`&&document.hidden&&(this.#L+=t.current?1:t.messages.length,this.#ce()),this.#ue(t)};#ie=e=>{e.preventDefault(),this.#F=e;try{localStorage.getItem(`statim.install_dismissed`)||this.#oe()}catch{this.#oe()}};#ae(){if(!(typeof window<`u`&&window.matchMedia?.(`(display-mode: standalone)`).matches||typeof navigator<`u`&&navigator.standalone===!0)){try{if(localStorage.getItem(`statim.install_dismissed`))return}catch{}typeof navigator<`u`&&/iphone|ipad|ipod/i.test(navigator.userAgent)&&(this.#I=!0,this.#se())}}#oe(){this.#I=!1,this.#j.textContent=F(`pwa.install_title`),this.#M.textContent=F(`pwa.install_desc`),this.#N.textContent=F(`pwa.install_btn`),this.#N.hidden=!1,this.#A.hidden=!1}#se(){this.#j.textContent=F(`pwa.install_title`),this.#M.textContent=F(`pwa.install_ios`),this.#N.textContent=`OK`,this.#N.hidden=!1,this.#A.hidden=!1}#ce(){typeof navigator<`u`&&`setAppBadge`in navigator&&this.#L>0&&navigator.setAppBadge(this.#L).catch(()=>{})}#le(){typeof navigator<`u`&&`clearAppBadge`in navigator&&navigator.clearAppBadge().catch(()=>{})}async#ue({from:e,messages:t,current:n}){if(!document.hidden||!(`Notification`in window)||Notification.permission!==`granted`)return;let r=e.split(`@`)[0],i={body:n?n.text.slice(0,140):F(`notify.recovered`,{count:t.length}),tag:`statim`,icon:typeof window<`u`?new URL(`icons/icon.svg`,window.location.href).href:`./icons/icon.svg`},a=await navigator.serviceWorker?.getRegistration();a?await a.showNotification(r,i):new Notification(r,i)}#de=()=>{let e=``,t=`searching`;navigator.onLine?this.#B?(e=this.#B,t=`offline`):this.#R&&(this.#z>0?(e=this.#z===1?F(`app.connected_one`):F(`app.connected_many`,{count:this.#z}),t=`online`):(e=F(`app.connected_many`,{count:0}),t=`searching`)):(e=F(`app.offline`),t=`offline`),this.#n.textContent=e,this.#t.className=`status-dot ${t}`,this.#i.textContent=F(`app.peers_btn_count`,{count:this.#z})}};customElements.define(`statim-app`,Kt);function qt(e={}){let{swUrl:t=`./sw.js`,checkIntervalMs:n=36e5,onUpdateAvailable:r,serviceWorker:i=typeof navigator<`u`?navigator.serviceWorker:void 0}=e,a=!1,o=!1,s=null,c=null,l=!1,u=()=>{l||(l=!0,typeof window<`u`&&window.location.reload())},d=()=>{if(!i){typeof window<`u`&&window.location.reload();return}i.addEventListener(`controllerchange`,u);let e=s||c?.waiting;e?(e.postMessage({type:`SKIP_WAITING`}),typeof setTimeout<`u`&&setTimeout(u,3e3)):u()},f=e=>{a||o||(o=!0,s=e,typeof window<`u`&&window.dispatchEvent(new CustomEvent(`statim:update-available`,{detail:d})),r?.(d))},p=e=>{e.addEventListener(`statechange`,()=>{e.state===`installed`&&(i?.controller||c?.active)&&f(e)})},m=async()=>{if(!a&&c)try{await c.update()}catch{}};if(!i)return{checkNow:async()=>{},applyUpdate:d,isUpdateAvailable:()=>!1,destroy:()=>{}};i.register(t,{updateViaCache:`none`}).then(e=>{a||(c=e,e.waiting&&(i.controller||e.active)&&f(e.waiting),e.installing&&p(e.installing),e.addEventListener(`updatefound`,()=>{e.installing&&p(e.installing)}))}).catch(()=>{});let h=()=>{typeof document<`u`&&document.visibilityState===`visible`&&m()},g=()=>{m()},_=()=>{m()};typeof document<`u`&&document.addEventListener(`visibilitychange`,h),typeof window<`u`&&(window.addEventListener(`focus`,g),window.addEventListener(`online`,_));let v;return n>0&&typeof setInterval<`u`&&(v=setInterval(()=>{m()},n)),{checkNow:m,applyUpdate:d,isUpdateAvailable:()=>o,destroy:()=>{a=!0,v!==void 0&&clearInterval(v),typeof document<`u`&&document.removeEventListener(`visibilitychange`,h),typeof window<`u`&&(window.removeEventListener(`focus`,g),window.removeEventListener(`online`,_)),i&&i.removeEventListener(`controllerchange`,u)}}}ve(),O(`app.init`,{userAgent:typeof navigator<`u`?navigator.userAgent:``,standalone:typeof window<`u`&&window.matchMedia(`(display-mode: standalone)`).matches}),`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{O(`pwa.sw.register_start`),qt()});