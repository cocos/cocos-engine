import { DEBUG } from 'internal:constants';

/**
 * Asserts that the expression is non-nullable, i.e. is neither `null` nor `undefined`.
 * @param expr Testing expression.
 * @param message Optional message.
 */
export function assertIsNonNullable<T> (expr: T, message?: string): asserts expr is NonNullable<T> {
    assertIsTrue(!(expr === null || expr === undefined), message);
}

/**
 * Asserts that the expression evaluated to `true`.
 * @param expr Testing expression.
 * @param message Optional message.
 */
export function assertIsTrue (expr: boolean, message?: string) {
    if (DEBUG && !expr) {
        throw new Error(`Assertion failed: ${message ?? '<no-message>'}`);
    }
}