declare type UndefinedName<T> = { [key in keyof T]: T[key] extends undefined ? key : never }[keyof T]
declare interface InMessageMap {
    StartServer: string;
    StopServer: undefined;
}
declare interface OutMessageMap {
    StartServer: undefined;
    StopServer: undefined;
}
declare interface State {
    text: string;
}
declare type InMessageCB<T extends keyof InMessageMap> = T extends UndefinedName<InMessageMap> ?
    () => void : (data: InMessageMap[T]) => void
declare type OutMessage<T extends keyof OutMessageMap> = T extends UndefinedName<OutMessageMap> ? {
    type: T;
} : {
    type: T;
    data: OutMessageMap[T];
}
declare interface VSCode<T> {
    getState(): T | undefined;
    setState(state: T): void;
    postMessage<K extends keyof OutMessageMap>(message: OutMessage<K>): void;
}
declare function acquireVsCodeApi(): VSCode<Partial<State>>;

declare module '*.css';