/*
 * @Author: IT-hollow
 * @Date: 2024-05-14 21:42:51
 * @LastEditors: hollow
 * @LastEditTime: 2024-11-30 12:33:38
 * @Description: xhr ajax请求封装
 *
 * Copyright (c) 2024 by efun, All Rights Reserved.
 */
import { BASE_REQUEST_OPTIONS } from '../../constants/index'
import { BaseRequestOptionsType, ResponseResultType } from '../../types/index'
import { formatPostBody, qsString } from '../../utils/common'
const defaultOptions = BASE_REQUEST_OPTIONS

function ajax<T>(
    url: string,
    options: Partial<BaseRequestOptionsType>,
    interceptor?: {
        req?: Function[]
        res?: Function[]
    }
): Promise<ResponseResultType<T>> {
    const p = Object.assign({}, defaultOptions, options)

    // 请求拦截器
    if (interceptor && interceptor.req) {
        const reqIc = interceptor.req
        for (let index = 0; index < reqIc.length; index++) {
            const fn = reqIc[index]
            fn(p)
        }
    }

    const { method, params, body, headers } = p

    const xhr = new XMLHttpRequest()

    const paramStr = qsString(params)

    //启动并发送一个请求
    if ((method as string)?.toLocaleLowerCase() === 'get') {
        xhr.open(
            'GET',
            `${url}${url.includes('?') ? '' : '?'}${paramStr}`,
            true
        )
        xhr.send(null)
    } else {
        xhr.open('post', url, true)
        for (const key in headers as any) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                xhr.setRequestHeader(key, headers[key])
            }
        }
        xhr.send(formatPostBody(body, headers['Content-Type']))
    }

    return new Promise((resolve, reject) => {
        const result = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: {},
        }
        xhr.ontimeout = function () {
            result.status = xhr.status
            reject(result)
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return
            }
            const status = xhr.status
            const statusText = xhr.statusText
            result.status = status
            result.statusText = statusText

            if (status >= 200 && status < 400) {
                const newResult = Object.assign(
                    {
                        data: JSON.parse(xhr.response),
                    },
                    result
                )
                // 响应拦截器
                if (interceptor && interceptor.res) {
                    const resIc = interceptor.res
                    for (let index = 0; index < resIc.length; index++) {
                        const fn = resIc[index]
                        fn(newResult)
                    }
                }

                resolve(newResult)
            } else {
                reject(result)
            }
        }
    })
}

export default ajax
