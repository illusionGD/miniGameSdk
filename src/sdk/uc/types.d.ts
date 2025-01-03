import { AnyObject, GameInfo } from '../../types'

export interface UC_Type {
    login: (
        opt: UC_Api_Option_Type<
            { code: string },
            { errCode: number; ext: string }
        >
    ) => void
    getUserInfo: (
        opt: UC_Api_Option_Type<UC_User_info, UC_User_Err_info>
    ) => void
    checkSession: (
        opt: UC_Api_Option_Type<any, { errCode: number; ext: string }>
    ) => void
    getGuestInfo: (opt: UC_Api_Option_Type<UC_User_info, any>) => void
    isLogin: (
        opt: UC_Api_Option_Type<{ isLogin: boolean }, { isLogin: boolean }>
    ) => void
    requestScreenOrientation: (
        opt: UC_Request_ScreenOrientation_Opt_Type
    ) => void
    getSystemInfo: (opt: UC_System_Info_Type) => void
    getSystemInfoSync: () => string
    /** 获取授权信息 */
    getSetting: (opt: UC_Api_Option_Type<UC_Author_Status_Type, any>) => void
    /** 请求用户权限 */
    authorize: (opt: UC_Authorize_Opt_Type) => void
    onLaunch: Function<(res: string) => void>
    exit: () => void
    enableWebGL: () => void

    createBannerAd: (opts: {
        style: UC_Banner_Add_Style_Type | undefined
    }) => UC_Banner_Add_Instantiation_Type
    createRewardVideoAd: () => UC_IW_Add_Instantiation_Type
    createInterstitialAd: () => UC_IW_Add_Instantiation_Type

    requestPayment: (opt: UC_Request_Payment_Type) => void

    /** 主动发起转发 / 分享操作 */
    shareAppMessage(opt: UC_Share_App_Message_Opt_Type)
    /** 获取回流时分享出去带的 query，UCSDKVersion >= 1.0.3 */
    getLaunchOptionsSync: () => any
}
export interface UC_Author_Status_Type {
    userInfo?: boolean
    camera?: boolean
    mic?: boolean
    userLocation?: boolean
    writePhotosAlbum?: boolean
}
interface UC_Request_Payment_Type
    extends UC_Api_Option_Type<
        {
            code: number
            data: {
                order_id: string
            }
        },
        {
            code: number
            msg: string
        }
    > {
    biz_id: string
    token: string
    order_id: string
}

export interface UC_Banner_Add_Instantiation_Type {
    show: () => void
    hide: () => void
    onLoad: (cb?: Function) => void
    onError: (cb?: Function) => void
    destroy: () => void
}

export interface UC_IW_Add_Instantiation_Type {
    load: () => Promise<any>
    onLoad: (cb?: Function) => void
    show: () => Promise<any>
    onError: (cb?: Function) => void
    onClose: (cb?: Function) => void
    offLoad: (cb?: Function) => void
    offError: (cb?: Function) => void
    offClose: (cb?: Function) => void
}

export interface UC_Banner_Add_Style_Type {
    top?: number
    left?: number
    right?: number
    bottom?: number
    width?: number
    height?: number
    gravity?: number
}

export interface UC_Authorize_Opt_Type
    extends UC_Api_Option_Type<UC_Author_Status_Type, any> {
    scope: string
}

export interface UC_User_Err_info {
    errCode: number
    ext: string
}

export interface UC_User_info {
    nickname: string
    avatar_url: string
    guestid?: string
}

export interface UC_Api_Option_Type<S, F> {
    success?: (res: S) => void
    fail?: (err: F) => void
}

export interface UC_Share_App_Message_Opt_Type
    extends UC_Api_Option_Type<any, any> {
    query: string
    target: string
}

export interface UC_Request_ScreenOrientation_Opt_Type
    extends UC_Api_Option_Type<any, any> {
    /** 1: 竖屏模式 2：横屏模式 */
    orientaiton: number
}

export interface UC_System_Info_Type
    extends UC_Api_Option_Type<UC_Get_System_Info_Res_Type, any> {}

export interface UC_Get_System_Info_Res_Type {
    pixelRatio: number
    screenWidth: number
    screenHeight: number
    windowWidth: number
    windowHeight: number
    brand: string
    model: string
    version: string
    system: string
    platform: string
    SDKVersion: string
    payVersion: string
    statusBarHeight: number
    safeArea: {
        left: number
        top: number
        right: number
        bottom: number
        width: number
        height: number
    }
    env: string
}
