import { isInvalidVal } from './common'

/** cookie有效期-8小时 */
const DEFAULT_COOKIE_EXPIRE_TIME = 1000 * 60 * 60 * 8

/**
 * 根据传入的key删除对应的cookie
 * @param key
 */
export function delCookie(key: string): void {
    setCookie(key, '', -1)
}

/**
 * 清除全部cookie
 */
export function clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].indexOf('_') === 0) continue
            delCookie(keys[i])
        }
    }
}

/**
 * 根据传入的key获取cookie
 * @param key
 * @returns
 */
export function getCookie(key: string): string {
    const arrStr = document.cookie.split('; ')
    for (let i = arrStr.length - 1; i >= 0; i--) {
        const temp = arrStr[i].split('=')
        if (temp[0].trim() === key) {
            try {
                return decodeURIComponent(temp[1])
            } catch (e) {
                return unescape(temp[1])
            }
        }
    }
    return ''
}

/**
 * 添加cookie
 * @param objName
 * @param objValue
 * @param objHours 过期时间，单位h
 */
export function setCookie(
    key: string,
    val: string,
    timestamp?: number,
    domain?: string
): void {
    const expireTime = isInvalidVal(timestamp)
        ? DEFAULT_COOKIE_EXPIRE_TIME
        : timestamp
    let str = key + '=' + encodeURIComponent(val)
    if (expireTime && expireTime > 0) {
        // 为时不设定过期时间，浏览器关闭时cookie自动消失，默认为30天
        const date = new Date()
        const ms = expireTime
        date.setTime(date.getTime() + ms)
        str += '; expires=' + date.toUTCString()
    }
    if (domain) {
        str += '; domain=' + domain
    }
    str += '; path=/'
    document.cookie = str
}
