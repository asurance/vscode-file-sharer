declare type UndefinedName<T> = { [key in keyof T]: T[key] extends undefined ? key : never }[keyof T]

declare interface ServerInfo {
    host: string;
    port: string;
}

declare interface FileInfo {
    fsPath: string;
    uuid: string;
}
declare interface OutMessageMap {
    StartServer: ServerInfo | null;
    SyncText: string;
    AddFile: FileInfo;
}
declare interface InMessageMap {
    ShowError: string;
    StartServer: number | null;
    StopServer: undefined;
    SyncText: string;
    AddFile: undefined;
    RemoveFile: string;
    CopyFileUrl: string;
    SaveQRCode: string;
}

declare type InMessageCB<T extends keyof InMessageMap> = T extends UndefinedName<InMessageMap> ?
    () => void : (data: InMessageMap[T]) => void
declare type OutMessage<T extends keyof OutMessageMap> = T extends UndefinedName<OutMessageMap> ? {
    type: T;
} : {
    type: T;
    data: OutMessageMap[T];
}