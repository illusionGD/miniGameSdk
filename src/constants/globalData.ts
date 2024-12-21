import { AnyObject } from '@/types'
import { deepCloneObj, isInvalidVal, sdkLog } from '@/utils/common'

interface GlobalDataType extends AnyObject {
    /** 版本号 */
    version: string
    /** 初始化信息 */
    initInfo: AnyObject
    /** 系统设备信息 */
    systemInfo: AnyObject
    /** 用户信息 */
    userInfo: AnyObject
    /** 场景或加载信息 */
    launchInfo: AnyObject
}

const data: GlobalDataType = {
    version: '1.0.0',
    initInfo: {},
    systemInfo: {},
    userInfo: {},
    launchInfo: {},
}

const dataProxy = new Proxy(data, {
    get: (target: GlobalDataType, key: string) => {
        return target[key]
    },
    set: (target: GlobalDataType, key: string, val) => {
        if (typeof target[key] !== 'object' || isInvalidVal(val)) {
            target[key] = val
        } else {
            Object.assign(target[key], val)
        }

        sdkLog(`${key}: `, target[key])
        return true
    },
})

export function getGlobalData(): GlobalDataType {
    return dataProxy
}
