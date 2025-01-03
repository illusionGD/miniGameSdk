import { createChannelUserApi } from '../../api'
import { biActiveLogApi, biLoginLogApi } from '../../api/log'
import type { AnyObject, P8_Quick_Game_SDK_Init_Data } from '../../types'
import {
    getResFormatData,
    p8Log,
    p8LogWarn,
    qsString,
    toJSON,
} from '../../utils/common'
import { UC_Ad_Type_Enum, UCAdManager } from './adManager'
import {
    getGlobalData,
    setSystemInfo,
    setLaunchInfo,
    setUserInfo,
    setPlatAuthorInfo,
    getCdnUrlConfig,
    getBaseLogParams,
    getGlobalUserInfo,
    setInitDataInfo,
    getInitData,
    setSdkVersion,
    getCdnQuickUrlConfig,
} from '../../constants/globalData'
import {
    getUCAuthorApi,
    getUCAuthorStatusApi,
    getUCUserInfoApi,
    isUCLoginApi,
    P8loginApi,
    checkUCSessionApi,
    UCLoginApi,
    isSucResCode,
} from './login'
import type {
    UC_Author_Status_Type,
    UC_Banner_Add_Style_Type,
    UC_Type,
    UC_User_info,
} from './types'
// @ts-ignore
const UC: UC_Type = window.uc
let adManager: UCAdManager

class UCSDK {
    loginLock = false
    defaultInitData = {
        channel: '270', // 渠道ID UC快游戏的为270
    }

    constructor() {
        setSdkVersion('1.0.4')
    }

    async init(data: Partial<P8_Quick_Game_SDK_Init_Data>) {
        // // @ts-ignore
        // UC = window.uc
        if (!data.appid) {
            p8LogWarn('appid 不能为空')
            return getResFormatData({
                result: 1,
                msg: 'appid不能为空',
            })
        }
        // 初始化快应用数据
        const initData = setInitDataInfo(
            Object.assign(data, this.defaultInitData)
        )
        // 创建uc 广告管理器
        adManager = new UCAdManager()
        // 初始化UC加载监听
        UC.onLaunch((res: AnyObject) => {
            setLaunchInfo(typeof res === 'string' ? JSON.parse(res) : res)
            getUCAuthorStatusApi()
        })
        // 初始化设备信息
        const ucDeviceInfo = JSON.parse(UC.getSystemInfoSync())
        setSystemInfo(ucDeviceInfo)

        // setUserInfo()
        p8Log('P8UCSDK初始化：', initData)
        // 获取cdn上的url配置
        const res = await getCdnUrlConfig(initData.appid)
        // const res = await getCdnQuickUrlConfig('936563179129315397')
        if (!res) {
            p8Log('域名获取失败，请联系运营配置!!')
            return getResFormatData({
                result: 1,
                msg: '域名获取失败，请联系运营配置',
            })
        }
        setInitDataInfo(
            res.mini_game[
                (ucDeviceInfo.platform as string)
                    .toLocaleLowerCase()
                    .includes('ios')
                    ? 'ios'
                    : 'android'
            ]
        )

        return getResFormatData({
            result: 0,
            msg: '初始化成功',
        })
    }

    /**
     * 登录
     * @param isApplyUserInfoAuthorize
     */
    async login() {
        // 是否有登录UC
        const isUCLogin = await isUCLoginApi()
        if (!isUCLogin) {
            return getResFormatData({
                result: 1,
                msg: '请先登录UC账号',
            })
        }
        if (this.loginLock) {
            return getResFormatData({
                result: 1,
                msg: '正在登录',
            })
        }
        this.loginLock = true
        const userInfo = getGlobalUserInfo()
        const initData = getInitData()
        const { result, data: loginData } = await P8loginApi({
            site: 'minigamety_data', // 固定写死
            function: 'getChannelId', // 固定写死
            channel: initData.channel,
            version: '1.0.0', // 固定写死
        })
        this.loginLock = false
        // 没登录成功则不继续执行
        if (!isSucResCode(result)) {
            return getResFormatData({
                result: 1,
                msg: '登录失败',
            })
        }
        // 更新用户信息
        setUserInfo(loginData)
        const { open_id } = loginData as any
        const { urlConfig } = getGlobalData()
        const { result: createResCode, data } = await createChannelUserApi(
            urlConfig.url_address.platform_url,
            {
                channelid: initData.channel,
                aid: initData.aid,
                site: initData.site,
                channelUid: open_id,
                adid: open_id,
                udid: open_id,
                channelUserName: '',
                key: initData.key,
                device: open_id, // 必须传，要关联激活日志上报
            }
        )
        if (!isSucResCode(createResCode)) {
            p8Log('createChannelUserApi接口获取uid失败：', (data as any).msg)
            return getResFormatData({
                result: 1,
                msg: (data as any).msg || '登录失败',
            })
        }
        const { password, ...other } = data
        // 更新用户信息
        setUserInfo(other)
        const logData = getBaseLogParams()
        // 激活上报
        biActiveLogApi(urlConfig.url_address.data_url, logData)

        // 登录bi事件上报
        biLoginLogApi(urlConfig.url_address.data_url, logData)
        // // 是否需要UC用户信息授权，默认true
        // if (isApplyUserInfoAuthorize) {
        //     // 用户信息授权
        //     await this.applyUCAuthorize('userInfo')
        // }
        // 有用户信息授权则获取uc用户信息
        const { userInfo: isGetUCInfo } = await this.getUCAuthorizeStatus()
        if (isGetUCInfo) {
            const userInfo = await getUCUserInfoApi()
            setUserInfo(userInfo)
        }

        return getResFormatData({
            result: 0,
            data: {
                open_id: userInfo.open_id,
                session_key: userInfo.session_key,
                avatar_url: userInfo.avatar_url || '',
                nickname: userInfo.nickname || '',
                ...other,
            },
        })
    }

    /** 申请用户UC浏览器权限 */
    async applyUCAuthorize(type: keyof UC_Author_Status_Type) {
        const isUCLogin = await isUCLoginApi()
        if (!isUCLogin) {
            const res = await this.login()
            return res
        }

        // 校验session是否过期
        const isValid = await checkUCSessionApi()
        if (!isValid) {
            p8Log('session是否有效:', isValid)
            return
        }
        // 先校验用户是否有授权
        const authorInfo = await getUCAuthorStatusApi()
        const isGet = authorInfo[type]
        // 没授权，去授权
        if (!isGet) {
            const res = await getUCAuthorApi(type)
            setPlatAuthorInfo(res)
            return res
        }
        const info = await getUCAuthorStatusApi()
        setPlatAuthorInfo(info)
        return info
    }

    /** 是否登录UC浏览器 */
    isUcLogin() {
        return isUCLoginApi()
    }

    /** 分享到app */
    shareApp(target?: string, query?: AnyObject | string) {
        let newQuery = ''
        if (query) {
            newQuery = query === 'string' ? query : qsString(query)
        }
        return new Promise((resolve, reject) => {
            UC.shareAppMessage({
                query: newQuery, // 查询字符串，必须是 key1=val1&key2=val2 的格式。
                // 从这条转发消息进入后，可通过 uc.getLaunchOptionsSync() 获取启动参数中的 query。
                target: target || '', // wechat:微信好友，qq: qq好友，不设置的话会调起分享面板
                success: (res) => {
                    p8Log('分享成功：', JSON.stringify(res))
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                    p8Log('分享失败：', JSON.stringify(err))
                },
            })
        })
    }

    /** 获取游客信息 */
    getUCGuestInfo(): Promise<UC_User_info> {
        return new Promise((resolve, reject) => {
            UC.getGuestInfo({
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                },
            })
        })
    }

    /** 获取用户UC浏览器授权状态 */
    async getUCAuthorizeStatus(): Promise<UC_Author_Status_Type> {
        const res = await getUCAuthorStatusApi()
        return res
    }

    getLaunchOptionsSync() {
        let launchOptions = UC.getLaunchOptionsSync()
        if (typeof launchOptions === 'string') {
            launchOptions = toJSON(launchOptions)
        }
        setLaunchInfo(launchOptions)
        return launchOptions
    }

    /** 退出 */
    exit() {
        UC.exit()
    }

    /** 显示banner广告 */
    showBannerAd(styleConfig: UC_Banner_Add_Style_Type) {
        return adManager.showAd(
            UC_Ad_Type_Enum.banner,
            getBaseLogParams(),
            styleConfig
        )
    }

    /** 隐藏banner广告 */
    hideBannerAd() {
        return adManager.hideAd(UC_Ad_Type_Enum.banner)
    }

    /** 销毁banner广告 */
    destroyBannerAd() {
        adManager.destroyAd(UC_Ad_Type_Enum.banner)
    }

    /** 显示激励视频广告 */
    showRewardVideoAd() {
        return adManager.showAd(UC_Ad_Type_Enum.rewardVideo, getBaseLogParams())
    }

    /** 监听激励视频广告关闭 */
    onCloseRewardVideoAd(fn) {
        adManager.onCloseAd(UC_Ad_Type_Enum.rewardVideo, fn, getBaseLogParams())
    }

    /** 显示插屏广告 */
    showInterstitialAd() {
        return adManager.showAd(
            UC_Ad_Type_Enum.interstitial,
            getBaseLogParams()
        )
    }

    /** 监听激励视频广告关闭 */
    onCloseInterstitialAd(fn) {
        adManager.onCloseAd(
            UC_Ad_Type_Enum.interstitial,
            fn,
            getBaseLogParams()
        )
    }
}

const P8UCSDK = new UCSDK()
window['P8UCSDK'] = P8UCSDK
export default P8UCSDK
