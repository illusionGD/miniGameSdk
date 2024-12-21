var S = Object.defineProperty;
var M = (e, n, t) => n in e ? S(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var h = (e, n, t) => M(e, typeof n != "symbol" ? n + "" : n, t);
function p(e, n) {
  const t = /* @__PURE__ */ new Date(), o = t.getFullYear(), i = t.getMonth() + 1, s = t.getDate(), a = (f) => String(f).padStart(2, "0");
  let c = `${o}-${a(i)}-${a(s)}`;
  {
    const f = t.getHours(), w = t.getMinutes(), g = t.getSeconds();
    c += ` ${a(f)}:${a(w)}:${a(g)}`;
  }
  return c;
}
function V(e) {
  return ["", NaN, void 0, null, "null", "undefined", "NaN"].indexOf(e) >= 0;
}
function C(...e) {
  console.log(
    `sdkLog: ${p()} ========> `,
    ...e
  );
}
function b(...e) {
  console.warn(
    `sdkLog: ${p()} ========> `,
    ...e
  );
}
const k = {
  version: "1.0.0",
  initInfo: {},
  systemInfo: {},
  userInfo: {},
  launchInfo: {}
}, $ = new Proxy(k, {
  get: (e, n) => e[n],
  set: (e, n, t) => (typeof e[n] != "object" || V(t) ? e[n] = t : Object.assign(e[n], t), C(`${n}: `, e[n]), !0)
});
function A() {
  return $;
}
function B(e, n) {
  e = e.split("."), n = n.split(".");
  const t = Math.max(e.length, n.length);
  for (; e.length < t; )
    e.push("0");
  for (; n.length < t; )
    n.push("0");
  for (let o = 0; o < t; o++) {
    const i = parseInt(e[o]), s = parseInt(n[o]);
    if (i > s)
      return 1;
    if (i < s)
      return -1;
  }
  return 0;
}
function m(e) {
  if (!e)
    return b("请填写要校验的版本号"), !1;
  const n = wx.getAppBaseInfo ? wx.getAppBaseInfo().SDKVersion : wx.getAccountInfoSync().miniProgram.version;
  return B(n, e) >= 0;
}
var r = /* @__PURE__ */ ((e) => (e.banner = "banner", e.rewardVideo = "rewardVideo", e.interstitial = "interstitial", e))(r || {});
const d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
class D {
  constructor() {
    h(this, "adMap", d);
    [
      r.banner,
      r.rewardVideo,
      r.interstitial
    ].forEach((n) => {
      d.set(n, []), u.set(n, []);
    });
  }
  /**
   * @param type AdTypeEnum
   * @param data
   */
  createAd(n, t) {
    if (!m("2.0.4")) {
      b("广告创建版本要求最低2.0.4");
      return;
    }
    const i = () => {
      n !== r.banner && u.get(n).splice(0).forEach((c) => this.onAdClose(n, c));
    };
    let s = this.getAdInstance(n, t.adUnitId);
    return s ? (i(), s) : (n === r.banner ? s = wx.createBannerAd(t) : n === r.rewardVideo ? s = wx.createRewardedVideoAd(t) : n === r.interstitial && (s = wx.createInterstitialAd(t)), s.id = t.adUnitId, d.get(n).push(s), i(), s);
  }
  /**
   * @param type AdTypeEnum
   * @param adId 广告id
   */
  showAd(n, t) {
    const o = this.createAd(n, t);
    return o && o.show(), o;
  }
  /**
   * 隐藏广告，不传广告id，则全部隐藏
   * @param type AdTypeEnum
   * @param adId 广告id
   */
  hide(n, t) {
    if (n === r.banner)
      if (t) {
        const o = this.getAdInstance(n, t);
        o && o.hide();
      } else
        d.get(n).forEach((o) => {
          o.hide();
        });
  }
  /**
   * 销毁广告，不传广告id，则全部销毁
   * @param type AdTypeEnum
   * @param adId 广告id
   */
  destroyAd(n, t) {
    if (t) {
      const o = this.getAdInstance(n, t);
      if (o) {
        o.destroy();
        const i = d.get(n).findIndex((s) => s.id === o.id);
        i >= 0 && d.get(n).splice(i, 1);
      }
    } else
      d.get(n).forEach((o) => {
        o.destroy();
      }), d.get(n).splice(0);
  }
  /**
   * 获取广告实例，不传adId（广告id），则返回第一个实例缓存
   * @param type
   * @param adId
   * @returns
   */
  getAdInstance(n, t) {
    return t ? d.get(n).find(({ id: o }) => o === t) : d.get(n)[0];
  }
  /**
   * @param type AdTypeEnum
   * @param cb 回调
   */
  onAdClose(n, t) {
    if (n === r.banner)
      return;
    const o = d.get(n);
    if (o.length) {
      o.forEach((i) => {
        i.onClose(t);
      });
      return;
    }
    u.get(n).push(t);
  }
}
class G {
  constructor() {
    h(this, "adManger", new D());
  }
  init(n) {
    const t = A();
    if (n && (t.initInfo = n), wx.onShow((i) => {
      t.launchInfo = i;
    }), m("2.25.3")) {
      const i = wx.getWindowInfo(), s = wx.getDeviceInfo(), a = wx.getAppBaseInfo(), c = wx.getSystemSetting();
      t.systemInfo = Object.assign(
        {},
        i,
        s,
        a,
        c,
        wx.getAppAuthorizeSetting()
      );
    } else
      t.systemInfo = wx.getSystemInfoSync();
  }
  login(n) {
  }
  showBannerAd(n) {
    return this.adManger.showAd(r.banner, n);
  }
  showRewardedVideoAd(n) {
    return this.adManger.showAd(r.rewardVideo, n);
  }
  showInterstitialAd(n) {
    return this.adManger.showAd(r.interstitial, n);
  }
  onShow(n) {
    n && wx.onShow((t) => {
      n(t);
    });
  }
  onHide(n) {
    n && wx.onHide(n);
  }
  getSystemInfo() {
    return A().systemInfo;
  }
}
const l = window.wxGameSdk || new G();
window.wxGameSdk = l;
console.log("🚀 ~ wxGameSdk:", l);
l.init({});
const L = [
  {
    label: "登录",
    onClick: () => {
      l.login({});
    }
  },
  {
    label: "banner广告",
    onClick: () => {
      const e = l.showBannerAd({
        adUnitId: "adunit-3a241b4da2d0fb46",
        style: { left: 0, top: 0, width: 100, height: 100 }
      });
      console.log("🚀 ~ ad:", e);
    }
  },
  {
    label: "激励广告",
    onClick: () => {
      const e = l.showRewardedVideoAd({
        adUnitId: "adunit-3a241b4da2d0fb46"
      });
      console.log("🚀 ~ ad:", e);
    }
  },
  {
    label: "插屏广告",
    onClick: () => {
      const e = l.showInterstitialAd({
        adUnitId: "adunit-3a241b4da2d0fb46"
      });
      console.log("🚀 ~ ad:", e);
    }
  }
];
function U() {
  const { windowHeight: o, windowWidth: i } = l.getSystemInfo(), s = Math.floor(i / 100), a = (i - 20 - s * 100) / s;
  let c = 100;
  L.forEach(({ label: f, onClick: w }, g) => {
    const I = g % s;
    let x = (100 + a) * I + 20;
    g && I === 0 && (x = 20, c += 50 + a), wx.createUserInfoButton({
      type: "text",
      // 文本按钮
      text: f,
      // 按钮文字
      style: {
        left: x,
        top: c,
        width: 100,
        // 按钮宽度
        height: 50,
        // 按钮高度
        backgroundColor: "#ff5722",
        // 按钮背景色
        color: "#ffffff",
        // 按钮文字颜色
        fontSize: 16,
        // 按钮文字大小
        borderRadius: 8,
        // 按钮圆角
        textAlign: "center",
        // 按钮文字对齐方式
        lineHeight: 50
        // 按钮文字行高
      }
    }).onTap(w);
  });
}
U();
//# sourceMappingURL=sdk-wx-1.0.0.es.js.map
