type LoadSuccessParams<T> = Parameters<(error: null, asset: T) => void>;

type LoadErrorParams<T> = Parameters<(error?: Error) => void>;

export type LoadCallbackParams<T> = LoadSuccessParams<T> | LoadErrorParams<T>;
