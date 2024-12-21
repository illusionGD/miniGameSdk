import { getGlobalData } from '@/constants/globalData'
import { AnyObject, SdkType } from '@/types'
import { isSupportVersion } from './wxUtils'
import { wxLaunchInfoType } from './wxTypes'
import { WxAdManger } from './wxAdManger'
import { AdTypeEnum } from '@/types/enum'

class WXGAMESDK implements SdkType {
    adManger = new WxAdManger()
    init(opt?: AnyObject) {
        const data = getGlobalData()
        if (opt) {
            data.initInfo = opt
        }
        // 初始化启动信息
        // data.launchInfo = wx.getLaunchOptionsSync()
        wx.onShow((e) => {
            data.launchInfo = e
        })

        // 初始化设备信息：做兼容
        const support = isSupportVersion('2.25.3')
        if (support) {
            const windowInfo = wx.getWindowInfo()
            const sysInfo = wx.getDeviceInfo()
            const appInfo = wx.getAppBaseInfo()
            const settingInfo = wx.getSystemSetting()
            data.systemInfo = Object.assign(
                {},
                windowInfo,
                sysInfo,
                appInfo,
                settingInfo,
                wx.getAppAuthorizeSetting()
            )
        } else {
            data.systemInfo = wx.getSystemInfoSync()
        }
    }
    login(opt: AnyObject) {}

    showBannerAd(opt: WechatMinigame.CreateBannerAdOption) {
        return this.adManger.showAd(AdTypeEnum.banner, opt)
    }

    showRewardedVideoAd(opt: WechatMinigame.CreateRewardedVideoAdOption) {
        return this.adManger.showAd(AdTypeEnum.rewardVideo, opt)
    }

    showInterstitialAd(opt: WechatMinigame.CreateInterstitialAdOption) {
        return this.adManger.showAd(AdTypeEnum.interstitial, opt)
    }

    onShow(cb?: (res: wxLaunchInfoType) => void) {
        cb &&
            wx.onShow((e) => {
                cb(e as wxLaunchInfoType)
            })
    }
    onHide(cb: () => void) {
        cb && wx.onHide(cb)
    }

    getSystemInfo() {
        return getGlobalData().systemInfo
    }
}
const wxGameSdk = window['wxGameSdk'] || new WXGAMESDK()
window['wxGameSdk'] = wxGameSdk

export default wxGameSdk as WXGAMESDK
