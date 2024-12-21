import { AnyObject } from '../types'
import { getFormatDate } from './date'

/**
 * 将对象转成参数
 * @param obj 对象
 * @param isEncode 是否encode
 * @returns a=1&b=2...
 */
export function qsString(obj: any, isEncode: boolean = true) {
    if (obj instanceof Object) {
        let str = ''
        Object.keys(obj).forEach((key, index) => {
            str += `${index ? '&' : ''}${key}=${
                isEncode ? encodeURIComponent(obj[key]) : obj[key]
            }`
        })
        return str
    } else if (typeof obj === 'string') {
        return obj
    } else if (typeof obj === 'number') {
        return `${obj}`
    } else {
        return ''
    }
}

/**
 * 校验是否为纯粹的对象
 * @param obj
 */
export function isPlainObject(obj) {
    let proto, Ctor
    if (!obj || typeof obj !== 'object') return false
    proto = Object.getPrototypeOf(obj)
    if (!proto) return true
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor
    return typeof Ctor === 'function' && Ctor === Object
}
/**
 * 是否为空对象
 * @param obj
 */
export function isEmptyObj(obj) {
    return Object.keys(obj).length <= 0
}

/**
 * 格式化post请求的body
 * @param body
 * @param contentType
 */
export function formatPostBody(body?: AnyObject, contentType?: string) {
    if (!body) {
        return ''
    }
    if (!contentType || contentType.includes('urlencoded'))
        return qsString(body)
    if (contentType.includes('json'))
        return typeof body === 'string' ? body : JSON.stringify(body)
}

export function deepCloneObj<T>(obj: AnyObject) {
    return JSON.parse(JSON.stringify(obj)) as T
}

/**是否为无效值 */
export function isInvalidVal(val: any) {
    return [NaN, undefined, null, 'null', 'undefined', 'NaN'].indexOf(val) >= 0
}

/** p8Log日志 */
export function p8Log(...args) {
    console.log(
        `P8Log: ${getFormatDate(null, 'YYYY-MM-DD hh:mm:ss')} ========> `,
        ...args
    )
}
