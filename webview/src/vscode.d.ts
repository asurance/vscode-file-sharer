declare type UndefinedName<T> = { [key in keyof T]: T[key] extends undefined ? key : never }[keyof T]

declare interface ServerInfo {
    host: string;
    port: string;
}

declare interface FileInfo {
    fsPath: string;
    uuid: string;
}
declare interface InMessageMap {
    StartServer: ServerInfo;
    SyncText: string;
    AddFile: FileInfo;
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