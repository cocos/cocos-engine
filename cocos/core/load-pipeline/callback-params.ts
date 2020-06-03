/**
 * @hidden
 */

export type LoadCompleteCallback<T> = (error: Error | null | undefined, asset?: T) => void;

export type LoadProgressCallback = (completedCount: number, totalCount: number, item: any) => void;
