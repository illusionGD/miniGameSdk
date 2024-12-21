export interface wxLaunchInfoType {
    query: Record<string, string>
    referrerInfo: {
        appId: string
        extraData?: AnyObject
    }
    scene: number
    shareTicket: string
}
