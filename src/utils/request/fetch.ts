/*
 * @Author: IT-hollow
 * @Date: 2024-05-10 22:14:01
 * @LastEditors: hollow
 * @LastEditTime: 2024-12-01 14:54:23
 * @Description: fetch请求封装
 *
 * Copyright (c) 2024 by efun, All Rights Reserved.
 */
import { BASE_REQUEST_OPTIONS } from '../../constants'
import { ResponseTypeEnum } from '../../types/enum'
import type {
    BaseRequestOptionsType,
    ResponseResultType,
} from '../../types/index'
import {
    deepCloneObj,
    formatPostBody,
    isPlainObject,
    qsString,
} from '../../utils/common'

const inital = BASE_REQUEST_OPTIONS

export default async function fetchRequest<T>(
    url: string,
    config?: Partial<BaseRequestOptionsType>,
    interceptor?: {
        req?: Function[]
        res?: Function[]
    }
): Promise<ResponseResultType<T>> {
    if (typeof url !== 'string')
        throw new TypeError('url must be required and of string type')
    const options = deepCloneObj<BaseRequestOptionsType>(inital)

    Object.assign(options, config || {})

    const { method, params, body, headers, cache, credentials, responseType } =
        options

    if (params != null) {
        const paramsStr = qsString(params)
        url += `${url.includes('?') ? '' : '?'}${paramsStr}`
    }

    let bodyInit = {
        method: method?.toUpperCase(),
        headers,
        credentials,
        cache,
    }

    if (/^(POST|PUT|PATCH)$/i.test(method) && body != null) {
        if (isPlainObject(body)) {
            bodyInit['body'] = formatPostBody(
                body,
                headers['Content-Type']
            ) as BodyInit
        }
    }

    // 请求拦截器
    if (interceptor && interceptor.req) {
        const reqIc = interceptor.req
        for (let index = 0; index < reqIc.length; index++) {
            const fn = reqIc[index]
            bodyInit = fn(bodyInit) || bodyInit
        }
    }

    try {
        const req = await fetch(url, bodyInit)
        const { status, statusText } = req
        const result = {
            status,
            statusText,
            headers: {},
        }

        let data: any = null
        if (status >= 200 && status < 400) {
            switch (responseType.toUpperCase()) {
                case ResponseTypeEnum.JSON:
                    data = await req.json()
                    break
                case ResponseTypeEnum.TEXT:
                    data = await req.text()
                    break
                case ResponseTypeEnum.BLOB:
                    data = await req.blob()
                    break
                case ResponseTypeEnum.ARRAYBUFFER:
                    data = await req.arrayBuffer()
                    break
            }
        }
        const newResult = Object.assign(
            {
                data,
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
        return newResult
    } catch (error) {
        console.error('🚀 ~ error:', error)
        return error as any
    }
}
