class o {
  init() {
    console.log(wx.getLaunchOptionsSync());
  }
}
const n = window.wxGameSdk || new o();
window.wxGameSdk = n;
console.log("🚀 ~ wxGameSdk:", n.init());
//# sourceMappingURL=sdk-wx-1.0.0.es.js.map
