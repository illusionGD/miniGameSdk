import { AdMangerType, AnyObject } from '@/types'
import { AdTypeEnum } from '@/types/enum'
import { isSupportVersion } from './wxUtils'
import { sdkWarnLog } from '@/utils/common'
/** 广告map */
const adMap: Map<AdTypeEnum, any[]> = new Map()
/** 广告关闭回调map缓存 */
const adCloseCallback: Map<AdTypeEnum, Function[]> = new Map()
type adOptType =
    | WechatMinigame.CreateBannerAdOption
    | WechatMinigame.CreateRewardedVideoAdOption
    | WechatMinigame.CreateInterstitialAdOption

export class WxAdManger implements AdMangerType {
    adMap = adMap

    constructor() {
        // 初始化广告map
        ;[
            AdTypeEnum.banner,
            AdTypeEnum.rewardVideo,
            AdTypeEnum.interstitial,
        ].forEach((type) => {
            adMap.set(type, [])
            adCloseCallback.set(type, [])
        })
    }

    /**
     * @param type AdTypeEnum
     * @param data
     */
    createAd(type: AdTypeEnum, data: adOptType) {
        const support = isSupportVersion('2.0.4')
        if (!support) {
            sdkWarnLog('广告创建版本要求最低2.0.4')
            return
        }
        /** 添加广告关闭回调 */
        const addOnCloseFn = () => {
            if (type !== AdTypeEnum.banner) {
                // 清空回调缓存
                const cbArr = adCloseCallback.get(type).splice(0)
                cbArr.forEach((cb) => this.onAdClose(type, cb))
            }
        }

        let ad = this.getAdInstance(type, data.adUnitId)
        // 如果有广告实例，则返回
        if (ad) {
            addOnCloseFn()
            return ad
        }

        // 创建广告实例
        if (type === AdTypeEnum.banner) {
            ad = wx.createBannerAd(data as WechatMinigame.CreateBannerAdOption)
        } else if (type === AdTypeEnum.rewardVideo) {
            ad = wx.createRewardedVideoAd(data)
        } else if (type === AdTypeEnum.interstitial) {
            ad = wx.createInterstitialAd(data)
        }
        // 把广告id也加进去
        ad.id = data.adUnitId
        adMap.get(type).push(ad)
        addOnCloseFn()
        return ad
    }

    /**
     * @param type AdTypeEnum
     * @param adId 广告id
     */
    showAd(type: AdTypeEnum, data: adOptType) {
        const ad = this.createAd(type, data)
        ad && ad.show()
        return ad
    }

    /**
     * 隐藏广告，不传广告id，则全部隐藏
     * @param type AdTypeEnum
     * @param adId 广告id
     */
    hide(type: AdTypeEnum, adId?: string) {
        // 只有banner才能隐藏
        if (type !== AdTypeEnum.banner) {
            return
        }
        if (adId) {
            const ad = this.getAdInstance(type, adId)
            ad && ad.hide()
        } else {
            adMap.get(type).forEach((ad) => {
                ad.hide()
            })
        }
    }

    /**
     * 销毁广告，不传广告id，则全部销毁
     * @param type AdTypeEnum
     * @param adId 广告id
     */
    destroyAd(type: AdTypeEnum, adId?: string) {
        if (adId) {
            const ad = this.getAdInstance(type, adId)
            if (ad) {
                ad.destroy()
                const index = adMap
                    .get(type)
                    .findIndex((item) => item.id === ad.id)
                if (index >= 0) {
                    adMap.get(type).splice(index, 1)
                }
            }
        } else {
            adMap.get(type).forEach((ad) => {
                ad.destroy()
            })
            adMap.get(type).splice(0)
        }
    }

    /**
     * 获取广告实例，不传adId（广告id），则返回第一个实例缓存
     * @param type
     * @param adId
     * @returns
     */
    getAdInstance(type: AdTypeEnum, adId?: string) {
        if (adId) {
            return adMap.get(type).find(({ id }) => id === adId)
        }
        return adMap.get(type)[0]
    }

    /**
     * @param type AdTypeEnum
     * @param cb 回调
     */
    onAdClose(type: AdTypeEnum, cb: Function) {
        // banner没有监听
        if (type === AdTypeEnum.banner) {
            return
        }
        const adArr = adMap.get(type)
        if (adArr.length) {
            adArr.forEach((ad) => {
                ad.onClose(cb)
            })
            return
        }
        // 如果没有创建广告，先缓存回调方法
        adCloseCallback.get(type).push(cb)
    }
}
