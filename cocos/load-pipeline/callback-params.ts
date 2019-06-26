/**
 * @category load
 */

type LoadSuccessParams<T> = Parameters<(error: null | undefined, asset: T) => void>;

type LoadErrorParams<T> = Parameters<(error: Error) => void>;

export type LoadCallbackParams<T> = LoadSuccessParams<T> | LoadErrorParams<T>;

export type LoadCompleteCallback<T> = (...args: LoadCallbackParams<T>) => void;

export type LoadProgressCallback = (completedCount: number, totalCount: number, item: any) => void;
