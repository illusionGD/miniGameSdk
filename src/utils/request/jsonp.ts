/*
 * @Author: IT-hollow
 * @Date: 2024-05-10 23:06:28
 * @LastEditors: hollow
 * @LastEditTime: 2024-11-30 21:58:41
 * @Description: jsonp封装
 *
 * Copyright (c) 2024 by efun, All Rights Reserved.
 */
import { JsonpConfigType } from '../../types'
import { isInvalidVal, isPlainObject } from '../../utils/common'

const defaultConfig = {
    timeout: 60000,
    params: {},
}
const count = 0

export default function jsonp<T>(url, opts: JsonpConfigType): Promise<T> {
    if (!window) {
        return Promise.reject('it is not browser env!')
    }
    // 实现Promise化
    return new Promise((resolve, reject) => {
        //设置默认参数
        const { timeout, params } = Object.assign({}, defaultConfig, opts)

        const name = 'jsonpcallback' + new Date().getTime() + count
        let timer: any = null

        //清除script标签以及注册的全局函数以及超时定时器
        function cleanup() {
            // 清除函数
            if (script.parentNode) {
                script.parentNode.removeChild(script)
                window[name] = null
                if (timer) {
                    clearTimeout(timer)
                }
            }
        }
        if (!isInvalidVal(timeout)) {
            // 超时
            timer = setTimeout(() => {
                cleanup()
                reject('timeout')
            }, timeout)
        }

        // 注册全局函数，等待执行中...
        window[name] = (res) => {
            // 只要这个函数一执行，就表示请求成功，可以使用清除函数了
            if (window[name]) {
                cleanup()
            }
            // 将请求到的数据扔给then
            resolve(res)
        }

        // 以下将params对象格式的参数拼接到url的后面
        let str = ''
        if (isPlainObject(params)) {
            for (const key in params) {
                const value = params[key] || ''
                str += `&${key}=${encodeURIComponent(value)}`
            }
        }

        url = url + (url.indexOf('?') > 0 ? '' : '?') + str.substr(1)

        // 最后加上与服务端协商的jsonp请求字段
        url = `${url}&callback=${name}`

        const script = document.createElement('script')
        script.src = url

        // 以下这条执行且成功后，全局等待函数就会被执行
        document.head.appendChild(script)
    })
}
