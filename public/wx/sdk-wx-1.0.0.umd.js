(function(a){typeof define=="function"&&define.amd?define(a):a()})(function(){"use strict";var L=Object.defineProperty;var U=(a,f,u)=>f in a?L(a,f,{enumerable:!0,configurable:!0,writable:!0,value:u}):a[f]=u;var A=(a,f,u)=>U(a,typeof f!="symbol"?f+"":f,u);function a(e,n){const t=new Date,o=t.getFullYear(),s=t.getMonth()+1,i=t.getDate(),c=w=>String(w).padStart(2,"0");let l=`${o}-${c(s)}-${c(i)}`;{const w=t.getHours(),x=t.getMinutes(),h=t.getSeconds();l+=` ${c(w)}:${c(x)}:${c(h)}`}return l}function f(e){return["",NaN,void 0,null,"null","undefined","NaN"].indexOf(e)>=0}function u(...e){console.log(`sdkLog: ${a()} ========> `,...e)}function p(...e){console.warn(`sdkLog: ${a()} ========> `,...e)}const V={version:"1.0.0",initInfo:{},systemInfo:{},userInfo:{},launchInfo:{}},C=new Proxy(V,{get:(e,n)=>e[n],set:(e,n,t)=>(typeof e[n]!="object"||f(t)?e[n]=t:Object.assign(e[n],t),u(`${n}: `,e[n]),!0)});function b(){return C}function k(e,n){e=e.split("."),n=n.split(".");const t=Math.max(e.length,n.length);for(;e.length<t;)e.push("0");for(;n.length<t;)n.push("0");for(let o=0;o<t;o++){const s=parseInt(e[o]),i=parseInt(n[o]);if(s>i)return 1;if(s<i)return-1}return 0}function m(e){if(!e)return p("请填写要校验的版本号"),!1;const n=wx.getAppBaseInfo?wx.getAppBaseInfo().SDKVersion:wx.getAccountInfoSync().miniProgram.version;return k(n,e)>=0}var r=(e=>(e.banner="banner",e.rewardVideo="rewardVideo",e.interstitial="interstitial",e))(r||{});const d=new Map,I=new Map;class ${constructor(){A(this,"adMap",d);[r.banner,r.rewardVideo,r.interstitial].forEach(n=>{d.set(n,[]),I.set(n,[])})}createAd(n,t){if(!m("2.0.4")){p("广告创建版本要求最低2.0.4");return}const s=()=>{n!==r.banner&&I.get(n).splice(0).forEach(l=>this.onAdClose(n,l))};let i=this.getAdInstance(n,t.adUnitId);return i?(s(),i):(n===r.banner?i=wx.createBannerAd(t):n===r.rewardVideo?i=wx.createRewardedVideoAd(t):n===r.interstitial&&(i=wx.createInterstitialAd(t)),i.id=t.adUnitId,d.get(n).push(i),s(),i)}showAd(n,t){const o=this.createAd(n,t);return o&&o.show(),o}hide(n,t){if(n===r.banner)if(t){const o=this.getAdInstance(n,t);o&&o.hide()}else d.get(n).forEach(o=>{o.hide()})}destroyAd(n,t){if(t){const o=this.getAdInstance(n,t);if(o){o.destroy();const s=d.get(n).findIndex(i=>i.id===o.id);s>=0&&d.get(n).splice(s,1)}}else d.get(n).forEach(o=>{o.destroy()}),d.get(n).splice(0)}getAdInstance(n,t){return t?d.get(n).find(({id:o})=>o===t):d.get(n)[0]}onAdClose(n,t){if(n===r.banner)return;const o=d.get(n);if(o.length){o.forEach(s=>{s.onClose(t)});return}I.get(n).push(t)}}class B{constructor(){A(this,"adManger",new $)}init(n){const t=b();if(n&&(t.initInfo=n),wx.onShow(s=>{t.launchInfo=s}),m("2.25.3")){const s=wx.getWindowInfo(),i=wx.getDeviceInfo(),c=wx.getAppBaseInfo(),l=wx.getSystemSetting();t.systemInfo=Object.assign({},s,i,c,l,wx.getAppAuthorizeSetting())}else t.systemInfo=wx.getSystemInfoSync()}login(n){}showBannerAd(n){return this.adManger.showAd(r.banner,n)}showRewardedVideoAd(n){return this.adManger.showAd(r.rewardVideo,n)}showInterstitialAd(n){return this.adManger.showAd(r.interstitial,n)}onShow(n){n&&wx.onShow(t=>{n(t)})}onHide(n){n&&wx.onHide(n)}getSystemInfo(){return b().systemInfo}}const g=window.wxGameSdk||new B;window.wxGameSdk=g,console.log("🚀 ~ wxGameSdk:",g),g.init({});const D=[{label:"登录",onClick:()=>{g.login({})}},{label:"banner广告",onClick:()=>{const e=g.showBannerAd({adUnitId:"adunit-3a241b4da2d0fb46",style:{left:0,top:0,width:100,height:100}});console.log("🚀 ~ ad:",e)}},{label:"激励广告",onClick:()=>{const e=g.showRewardedVideoAd({adUnitId:"adunit-3a241b4da2d0fb46"});console.log("🚀 ~ ad:",e)}},{label:"插屏广告",onClick:()=>{const e=g.showInterstitialAd({adUnitId:"adunit-3a241b4da2d0fb46"});console.log("🚀 ~ ad:",e)}}];function G(){const{windowHeight:o,windowWidth:s}=g.getSystemInfo(),i=Math.floor(s/100),c=(s-20-i*100)/i;let l=100;D.forEach(({label:w,onClick:x},h)=>{const S=h%i;let M=(100+c)*S+20;h&&S===0&&(M=20,l+=50+c),wx.createUserInfoButton({type:"text",text:w,style:{left:M,top:l,width:100,height:50,backgroundColor:"#ff5722",color:"#ffffff",fontSize:16,borderRadius:8,textAlign:"center",lineHeight:50}}).onTap(x)})}G()});
//# sourceMappingURL=sdk-wx-1.0.0.umd.js.map
