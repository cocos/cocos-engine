import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import type { MatcherResult } from 'jest-matcher-deep-close-to';

expect.extend({ toBeDeepCloseTo });

declare global {
    namespace jest {
        interface Matchers<R> extends jest.Matchers<unknown> {
            toBeDeepCloseTo: (expected: unknown, numDigits?: number) => MatcherResult;
        }
    }
}

