/**
 * @category loader
 */
export type LoadCompleteCallback<T> = (error: Error | null | undefined, asset: T | undefined) => void;

export type LoadProgressCallback = (completedCount: number, totalCount: number, item: any) => void;
