/*
 * @Author: IT-hollow
 * @Date: 2024-05-10 21:10:40
 * @LastEditors: hollow
 * @LastEditTime: 2024-12-21 15:26:15
 * @Description: 常量文件
 *
 * Copyright (c) 2024 by efun, All Rights Reserved.
 */

import { ResponseTypeEnum } from '../types/enum'

/**基本请求配置 */
export const BASE_REQUEST_OPTIONS = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    cache: 'no-cache',
    credentials: 'include',
    responseType: ResponseTypeEnum.JSON,
    timeout: 60000,
}

/**timestamp数 */
export const TIMESTAMP_NUMBER = {
    /**秒 */
    second: 1000,
    /**分 */
    min: 60 * 1000,
    /**小时 */
    hour: 60 * 60 * 1000,
    /**天 */
    day: 24 * 60 * 60 * 1000,
    /**周 */
    week: 7 * 24 * 60 * 60 * 1000,
    /**月(30天) */
    month: 30 * 24 * 60 * 60 * 1000,
}
