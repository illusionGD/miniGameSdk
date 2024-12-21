import type { AnyObject, BaseRequestOptionsType } from '../../types/index'
import ajax from './ajax'
import fetchRequest from './fetch'
import jsonp from './jsonp'

export class Http {
    /** 是否支持fetch */
    supportFetch = true
    /** 请求拦截器 */
    requestInterceptor = new Set<Function>()
    /** 响应拦截器 */
    responseInterceptor = new Set<Function>()

    constructor() {
        this.supportFetch = !!window.fetch
    }

    interceptor(type: 'req' | 'res') {
        const ic =
            type === 'req' ? this.requestInterceptor : this.responseInterceptor
        return {
            /** 添加拦截器 */
            add: (fn: Function | Function[]) => {
                if (fn instanceof Array) {
                    for (let index = 0; index < fn.length; index++) {
                        ic.add(fn[index])
                    }
                } else {
                    ic.add(fn)
                }
            },
            /** 删除拦截器 */
            del: (fn: Function) => {
                ic.delete(fn)
            },
        }
    }

    async get<T>(
        url: string,
        params?: AnyObject,
        config?: Omit<BaseRequestOptionsType, 'method' | 'params'>
    ) {
        const method = 'GET'
        const p = {
            method,
            params,
        }

        if (config) {
            Object.assign(p, config)
        }

        if (this.supportFetch) {
            const { data } = await fetchRequest<T>(url, p)
            return data
        } else {
            const { data } = await ajax<T>(url, p)

            return data
        }
    }

    async post<T>(
        url: string,
        body: AnyObject,
        opts?: Partial<BaseRequestOptionsType>
    ) {
        const method = 'POST'
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        }
        const options = {
            method,
            headers,
            body,
        }

        if (opts) {
            Object.assign(options, opts)
        }

        if (this.supportFetch) {
            const { data } = await fetchRequest<T>(url, options)
            return data
        } else {
            const { data } = await ajax<T>(url, options)
            return data
        }
    }

    jsonp = jsonp
}

export const HTTP = new Http()
