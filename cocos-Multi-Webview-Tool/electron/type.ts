export type ProfileRecord = { value: number, time: string };

export type GameMonitorType = {
    stats: StatsType
    messageList: string[]
}

export type ProfileInfoType = {
    start: number
    end?: number
    value: number
    avg: number
    count?: number
    list: ProfileRecord[]
}

export type StatsType = {
    fps: ProfileInfoType & { lowFpsList: ProfileRecord[] } & Required<Pick<ProfileInfoType, "count">>
    frame: ProfileInfoType
    logic: ProfileInfoType
    physics: ProfileInfoType
    render: ProfileInfoType
    ping: ProfileInfoType & { over100PingList: ProfileRecord[] }
    draws: number
    instances: number
    triCount: number
    textureMemory: number
    bufferMemory: number
    renderer: string
}
