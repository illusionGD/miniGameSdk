import { ResponseTypeEnum } from './enum'

export interface BaseRequestOptionsType {
    method?: string
    headers?: HeadersInit
    responseType?: ResponseTypeEnum
    params?: AnyObject
    body?: AnyObject
    cache?: RequestCache
    credentials?: RequestCredentials
    timeout?: number
}

export interface BaseResponseType<T> {
    code: number
    data?: T
    msg?: string
}

export interface ResponseResultType<T> {
    data: T
    status: number
    headers: AnyObject
    statusText: string
}

export interface AnyObject {
    [key: string]: any
}

export interface LocalStorageWithExpireValType {
    value: any
    expire: number
}
export interface JsonpConfigType {
    timeout?: number
    params?: any
}

export interface SdkType {
    /** 初始化 */
    init: (data?: AnyObject) => any
    /** 登录 */
    login: (data?: AnyObject) => any
    /** 显示激励广告 */
    showRewardedVideoAd: (data?: any) => any
    /** 显示插屏广告 */
    showInterstitialAd?: (data?: any) => any
    /** 显示banner广告 */
    showBannerAd?: (data?: any) => any
    /** 热启动监听 */
    onShow?: (callback?: (res?: any) => void) => any
    /** 购买游戏商品 */
    payGameShop?: (data?: AnyObject) => any
    /** 直购 */
    payShop?: (data?: AnyObject) => any
}

export interface AdMangerType {
    adMap: Map<AdTypeEnum, any[]>
    /** 创建广告 */
    createAd?: (type: AdTypeEnum, data?: any) => any
    /** 获取广告实例 */
    getAdInstance?: (type: AdTypeEnum) => any
    /** 显示广告 */
    showAd?: (type: AdTypeEnum, data: any) => any
    /** 隐藏广告 */
    hide?: (type: AdTypeEnum) => any
    /** 销毁广告 */
    destroyAd?: (type: AdTypeEnum) => any
    /** 监听广告关闭 */
    onAdClose?: (type: AdTypeEnum, cb: Function) => any
}
