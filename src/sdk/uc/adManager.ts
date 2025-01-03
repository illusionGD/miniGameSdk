import { biAdLogApi } from '../../api/log'
import { BiAdLogApiParams } from '../../types'
import { LogAdTypeEnum } from '../../types/enum'
import { getGlobalData } from '../../constants/globalData'
import type {
    UC_Banner_Add_Instantiation_Type,
    UC_Banner_Add_Style_Type,
    UC_Type,
} from './types'
import { p8Log } from '../../utils/common'
// @ts-ignore
const UC = window.uc as UC_Type
export enum UC_Ad_Type_Enum {
    /** banner广告 */
    banner = 'banner',
    /** 激励广告 */
    rewardVideo = 'rewardVideo',
    /** 插屏广告 */
    interstitial = 'interstitial',
}

/** 广告管理 */
export class UCAdManager {
    adMap: { [key: string]: any[] } = {}
    /** 激励广告关闭回调 */
    onCloseRewardVideoAdFn = null
    /** 插屏广告关闭回调 */
    onCloseInAdFn = null
    constructor() {
        // 初始化广告map
        ;[
            UC_Ad_Type_Enum.banner,
            UC_Ad_Type_Enum.interstitial,
            UC_Ad_Type_Enum.rewardVideo,
        ].forEach((key) => {
            this.adMap[key] = []
        })
    }

    /** 创建广告 */
    create<T>(opt: {
        type: UC_Ad_Type_Enum
        bannerStyle?: UC_Banner_Add_Style_Type
        onLoad?: () => void
        onError?: () => void
    }): T {
        const { type, onLoad, onError } = opt
        let ad: any = null

        if (type === UC_Ad_Type_Enum.banner) {
            const { bannerStyle } = opt

            ad = UC.createBannerAd({ style: bannerStyle })
        }

        if (type === UC_Ad_Type_Enum.rewardVideo) {
            ad = UC.createRewardVideoAd()
        }

        if (type === UC_Ad_Type_Enum.interstitial) {
            ad = UC.createInterstitialAd()
        }

        ad.onLoad(onLoad)
        ad.onError(onError)
        this.adMap[type].push(ad)

        return ad
    }

    /** 上报广告日志 */
    logAdFn(type: UC_Ad_Type_Enum, logConfig: any, status: string = '0') {
        const { urlConfig } = getGlobalData()
        if (!urlConfig || !urlConfig.url_address) {
            p8Log('获取url配置失败')
            return
        }
        let logAdType: LogAdTypeEnum = LogAdTypeEnum.banner

        if (type === UC_Ad_Type_Enum.banner) {
            logAdType = LogAdTypeEnum.banner
        }
        if (type === UC_Ad_Type_Enum.rewardVideo) {
            logAdType = LogAdTypeEnum.rewardVideo
        }

        if (type === UC_Ad_Type_Enum.interstitial) {
            logAdType = LogAdTypeEnum.interstitial
        }
        biAdLogApi(urlConfig.url_address.data_url, {
            ...logConfig,
            type: logAdType,
            status: type === UC_Ad_Type_Enum.banner ? '1' : status,
        })
    }

    /**
     * 显示广告
     * @param type 广告类型
     * @returns
     */
    showAd(
        type: UC_Ad_Type_Enum,
        logConfig: Omit<BiAdLogApiParams, 'type' | 'status'>,
        bannerStyle?: UC_Banner_Add_Style_Type
    ) {
        return new Promise((resolve, reject) => {
            let ad = this.findAdInstantiation(type)
            // 有缓存则直接显示
            if (ad) {
                ad.show()

                // this.logAdFn(type, logConfig)

                resolve(ad)
                return
            }

            const config = {
                type,
                onLoad: () => {
                    resolve(ad)
                },
                onError: () => {
                    reject(null)
                },
            }

            // banner需要配置style样式
            if (type === UC_Ad_Type_Enum.banner) {
                config['bannerStyle'] = bannerStyle || {}
            }

            ad = this.create<UC_Banner_Add_Instantiation_Type>(config)

            // banner广告没有关闭事件监听
            if (type !== UC_Ad_Type_Enum.banner) {
                // 监听关闭事件
                if (type === UC_Ad_Type_Enum.interstitial) {
                    p8Log(`监听-${type}广告关闭: `, this.onCloseInAdFn)
                    ad.onClose(this.onCloseInAdFn)
                } else if (type === UC_Ad_Type_Enum.rewardVideo) {
                    p8Log(`监听-${type}广告关闭: `, this.onCloseRewardVideoAdFn)
                    ad.onClose(this.onCloseRewardVideoAdFn)
                }
            }
            // this.logAdFn(type, logConfig)
            ad.show()
        })
    }

    /**
     * 隐藏广告
     * @param type 广告类型
     * @returns
     */
    hideAd(type: UC_Ad_Type_Enum) {
        // 只有banner广告才有隐藏功能
        if (type !== UC_Ad_Type_Enum.banner) {
            return
        }
        const ad = this.findAdInstantiation(type)
        if (!ad) {
            return
        }
        ad.hide()
    }

    /**
     * 监听广告关闭
     * @param type 广告类型
     * @returns
     */
    onCloseAd(type: UC_Ad_Type_Enum, fn: (res?: any) => void, logConfig: any) {
        // banner无监听广告关闭
        if (type === UC_Ad_Type_Enum.banner) {
            return
        }
        const ad = this.findAdInstantiation(type)
        // 播放回调
        const playCallback = (res) => {
            // this.logAdFn(type, logConfig, '1')
            if (res && res.isEnded) {
                p8Log('正常播放结束，可以下发游戏奖励: ', res)
            } else {
                p8Log('播放中途退出，不下发游戏奖励: ', res)
            }

            fn && fn instanceof Function && fn(res)
        }

        // 去掉之前的监听，放在重复调用导致多次监听
        if (ad) {
            if (type === UC_Ad_Type_Enum.interstitial) {
                this.onCloseInAdFn && ad.offClose(this.onCloseInAdFn)
            } else if (type === UC_Ad_Type_Enum.rewardVideo) {
                this.onCloseRewardVideoAdFn &&
                    ad.offClose(this.onCloseRewardVideoAdFn)
            }
        }

        // 缓存回调方法
        if (type === UC_Ad_Type_Enum.interstitial) {
            this.onCloseInAdFn = playCallback
        } else if (type === UC_Ad_Type_Enum.rewardVideo) {
            this.onCloseRewardVideoAdFn = playCallback
        }

        // 如果还没实例，实例化create后再监听
        if (!ad) {
            return
        }
        p8Log('监听广告关闭：', playCallback)

        ad.onClose(playCallback)
    }

    /**
     * 销毁广告
     * @param type 广告类型
     * @returns
     */
    destroyAd(type: UC_Ad_Type_Enum) {
        // 只有banner才能销毁
        if (type !== UC_Ad_Type_Enum.banner) {
            return
        }
        const ad = this.findAdInstantiation(type)
        if (!ad) {
            return
        }
        const index = this.adMap[type].findIndex((item) => item === ad)
        if (index >= 0) {
            this.adMap[type].splice(index, 1)
        }
        ad.destroy()
    }

    /** 获取已缓存的广告实例 */
    findAdInstantiation(type: UC_Ad_Type_Enum) {
        const adArr = this.adMap[type]
        // 如果已经创建对应广告，返回对应广告
        if (adArr.length) {
            return adArr[0]
        }
        return null
    }
}
