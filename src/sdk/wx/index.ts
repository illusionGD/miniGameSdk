class WXGAMESDK {
    init() {
        console.log(wx.getLaunchOptionsSync())
    }
}
const wxGameSdk = window['wxGameSdk'] || new WXGAMESDK()
window['wxGameSdk'] = wxGameSdk
export default wxGameSdk as WXGAMESDK
