import { expect, test } from '@jest/globals';
import ps from 'path';
import { createTsPathResolver } from '../src/ts-paths';

const engineRoot = ps.resolve(__dirname, '../../..');
const resolveTsPath = createTsPathResolver(ps.join(engineRoot, 'tsconfig.json'));

test('resolves exact tsconfig path aliases', () => {
    expect(resolveTsPath('cc.decorator')).toBe(
        ps.join(engineRoot, 'cocos/core/data/decorators/index.ts'),
    );
});

test('resolves wildcard tsconfig path aliases and completes file extensions', () => {
    expect(resolveTsPath('@cocos/engine/cocos/core/platform/debug')).toBe(
        ps.join(engineRoot, 'cocos/core/platform/debug.ts'),
    );
});

test('resolves wildcard tsconfig path aliases to directory indexes', () => {
    expect(resolveTsPath('@cocos/engine/cocos/core/math')).toBe(
        ps.join(engineRoot, 'cocos/core/math/index.ts'),
    );
});

test('falls through when a wildcard alias target does not exist', () => {
    expect(resolveTsPath('@cocos/engine/not-exists')).toBeNull();
});
