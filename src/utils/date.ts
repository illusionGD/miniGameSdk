/**
 * 获取当前时间戳
 */
export function getCurrentTimeStamp() {
    return new Date().getTime()
}

/**
 * 获取格式时间
 * @param timestamp
 * @param format
 */
export function getFormatDate(
    timestamp?: number,
    format?: 'YYYY-MM-DD hh:mm:ss' | 'YYYY-MM-DD'
) {
    const date = timestamp ? new Date(timestamp) : new Date()
    const years = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const formatNum = (num: string | number) => {
        return String(num).padStart(2, '0')
    }
    let dateStr = `${years}-${formatNum(month)}-${formatNum(day)}`

    if (format === 'YYYY-MM-DD hh:mm:ss') {
        const hour = date.getHours()
        const min = date.getMinutes()
        const second = date.getSeconds()
        dateStr += ` ${formatNum(hour)}:${formatNum(min)}:${formatNum(second)}`
    }

    return dateStr
}

/** 获取当前时间戳 */
export function getCurrentTimestamp() {
    return new Date().getTime()
}
