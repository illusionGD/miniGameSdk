import { sdkWarnLog } from '@/utils/common'

export function wxCompareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}
/**
 * 当前版本是否支持
 * @param version 目标版本
 * @returns
 */
export function isSupportVersion(version: string) {
    if (!version) {
        sdkWarnLog('请填写要校验的版本号')
        return false
    }

    const currentVersion = wx.getAppBaseInfo
        ? wx.getAppBaseInfo().SDKVersion
        : wx.getAccountInfoSync().miniProgram.version
    const flag = wxCompareVersion(currentVersion, version)
    return flag >= 0
}
