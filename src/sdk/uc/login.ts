import { getChannelOtherApi } from '../../api'
import { GetChannelOtherApiParamsType } from '../../types'
import { p8Log } from '../../utils/common'
import {
    getGlobalData,
    setPlatAuthorInfo,
    setUserInfo,
} from '../../constants/globalData'
import type { UC_Author_Status_Type, UC_Type, UC_User_info } from './types'
// @ts-ignore
const UC = window.uc as UC_Type

/** UC登录 */
export function UCLoginApi(): Promise<{
    code: string
}> {
    return new Promise((resolve, reject) => {
        UC.login({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
        })
    })
}

/**
 * 申请用户UC浏览器授权
 * @param type 类型
 */
export async function getUCAuthorApi(
    type: keyof UC_Author_Status_Type = 'userInfo'
) {
    return new Promise((resolve, reject) => {
        UC.authorize({
            scope: type,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
        })
    }) as UC_Author_Status_Type
}

/** 获取用户UC浏览器授权状态 */
export async function getUCAuthorStatusApi(): Promise<UC_Author_Status_Type> {
    return new Promise((resolve, reject) => {
        UC.getSetting({
            success: (res) => {
                setPlatAuthorInfo(res)
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
        })
    })
}

/** 是否登录UC浏览器 */
export async function isUCLoginApi() {
    const res = (await new Promise((resolve, reject) => {
        UC.isLogin({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
        })
    })) as any
    p8Log('是否有登录UC浏览器-isUCLoginApi', res.isLogin)

    return res.isLogin
}

export function getUCUserInfoApi(): Promise<UC_User_info> {
    return new Promise((resolve, reject) => {
        UC.getUserInfo({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
        })
    })
}

/** UC校验登录是否有效 */
export async function checkUCSessionApi() {
    const res = await new Promise((resolve, reject) => {
        UC.checkSession({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            },
        })
    })
    p8Log('UUC校验登录是否有效:', res)
    if (typeof res === 'string') {
        return true
    }
    return false
}

/** P8登录 */
export async function P8loginApi(
    params: Omit<GetChannelOtherApiParamsType, 'code'>
) {
    const res = await UCLoginApi()
    if (!res) {
        p8Log('UC登录失败！！！')
        return
    }
    setUserInfo({
        code: res.code,
    })
    const loginRes = await getChannelOtherApi(
        {
            ...params,
            code: res.code,
        },
        getGlobalData().urlConfig.url_address.platform_url
    )
    const { result, data } = loginRes
    if (isSucResCode(result)) {
        setUserInfo(data)
    } else {
        p8Log('getChannelOtherApi 错误：', data.msg)
    }
    return loginRes
}

export function isSucResCode(code: number) {
    return code === 0
}
