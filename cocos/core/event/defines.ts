
export type EventArgumentsOf<
    K extends string,
    Map extends any,
    AllowCustomEvents extends boolean = false
> = K extends (keyof Map) ?
    Parameters<Map[K]> :
    (AllowCustomEvents extends true ?
        any[] :
        never);

export type EventCallbackOf<
    K extends string,
    Map extends any,
    AllowCustomEvents extends boolean = false
> = K extends (keyof Map) ?
    (...args: Parameters<Map[K]>) => void :
    (AllowCustomEvents extends true ?
        (...args: any[]) => void :
        never);
