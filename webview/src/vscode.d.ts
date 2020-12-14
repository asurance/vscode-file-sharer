declare type UndefinedName<T> = { [key in keyof T]: T[key] extends undefined ? key : never }[keyof T]
declare interface InMessageMap {
    StartServer: string;
    StopServer: undefined;
    SyncText: string;
    AddFile: string | undefined;
}
declare interface OutMessageMap {
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
declare interface VSCode {
    postMessage<K extends keyof OutMessageMap>(message: OutMessage<K>): void;
}
declare function acquireVsCodeApi(): VSCode;

declare module '*.css';