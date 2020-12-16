declare type UndefinedName<T> = { [key in keyof T]: T[key] extends undefined ? key : never }[keyof T]
declare interface OutMessageMap {
    StartServer: string;
    SyncText: string;
    AddFile: { fsPath: string; url: string } | null;
}
declare interface InMessageMap {
    StartServer: undefined;
    StopServer: undefined;
    SyncText: string;
    AddFile: undefined;
    RemoveFile: string;
    CopyFileUrl: string;
}

declare type InMessageCB<T extends keyof InMessageMap> = T extends UndefinedName<InMessageMap> ?
    () => void : (data: InMessageMap[T]) => void
declare type OutMessage<T extends keyof OutMessageMap> = T extends UndefinedName<OutMessageMap> ? {
    type: T;
} : {
    type: T;
    data: OutMessageMap[T];
}