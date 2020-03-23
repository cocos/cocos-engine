import { DEBUG } from 'internal:constants';

export function assertIsNonNullable<T> (expr: T, message?: string): asserts expr is NonNullable<T> {
    assertIsTrue(!(expr === null || expr === undefined), message);
}

export function assertIsTrue (expr: boolean, message?: string) {
    if (DEBUG && !expr) {
        throw new Error(`Assertion failed: ${message ?? '<no-message>'}`);
    }
}