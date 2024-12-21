import { ResponseTypeEnum } from './enum'

export interface BaseRequestOptionsType {
    method?: string
    headers?: HeadersInit
    responseType?: ResponseTypeEnum
    params?: AnyObject
    body?: AnyObject
    cache?: RequestCache
    credentials?: RequestCredentials
    timeout?: number
}

export interface BaseResponseType<T> {
    code: number
    data?: T
    msg?: string
}

export interface ResponseResultType<T> {
    data: T
    status: number
    headers: AnyObject
    statusText: string
}

export interface AnyObject {
    [key: string]: any
}

export interface LocalStorageWithExpireValType {
    value: any
    expire: number
}
export interface JsonpConfigType {
    timeout?: number
    params?: any
}
