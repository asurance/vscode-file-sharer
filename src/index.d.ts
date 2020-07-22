declare type UndefinedName<T> = { [key in keyof T]: T[key] extends undefined ? key : never }[keyof T]
declare interface FileInfo {
    name: string;
    uuid: string;
}
declare interface OutMessageMap {
    FileInfo: FileInfo[];
}
declare interface InMessageMap {
    SelectFile: undefined;
    DeleteFile: string;
    Copy: string;
}
declare type InMessageCB<T extends keyof InMessageMap> = T extends UndefinedName<InMessageMap> ?
    () => void : (data: InMessageMap[T]) => void
declare type OutMessage<T extends keyof OutMessageMap> = T extends UndefinedName<OutMessageMap> ? {
    type: T;
} : {
    type: T;
    data: OutMessageMap[T];
}