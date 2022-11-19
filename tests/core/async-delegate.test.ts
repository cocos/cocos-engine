import { AsyncDelegate } from '../../cocos/core/event/async-delegate';

describe('Async Delegate', function () {
    test('base', () => {
        const asyncDelegate = new AsyncDelegate<() => void>();
        const func = jest.fn(() => {});
        asyncDelegate.add(func);
        expect(asyncDelegate.hasListener(func)).toBeTruthy();
        asyncDelegate.dispatch();
        expect(func).toBeCalledTimes(1);
        asyncDelegate.remove(func);
        expect(asyncDelegate.hasListener(func)).toBeFalsy();
        asyncDelegate.dispatch();
        expect(func).toBeCalledTimes(1);
        asyncDelegate.add(func);
        asyncDelegate.add(func);
        asyncDelegate.dispatch();
        expect(func).toBeCalledTimes(2);
        asyncDelegate.remove(func);
        expect(asyncDelegate.hasListener(func)).toBeFalsy();
        const func1 = jest.fn(() => {});
        const func2 = jest.fn(() => {});
        asyncDelegate.add(func1);
        asyncDelegate.add(func2);
        for (let i = 0; i < 5; i++) {
            asyncDelegate.dispatch();
        }
        expect(func1).toBeCalledTimes(5);
        expect(func2).toBeCalledTimes(5);
        asyncDelegate.remove(func1);
        for (let i = 0; i < 5; i++) {
            asyncDelegate.dispatch();
        }
        expect(func1).toBeCalledTimes(5);
        expect(func2).toBeCalledTimes(10);
    });

    test('parameter transfer', () => {
        const asyncDelegate = new AsyncDelegate<(a: number, b: string, c: any) => void>();
        let a = 10;
        let b = 'haha';
        let c = {};
        const func = jest.fn((realA, realB, realC) => { 
            expect(realA).toBe(a);
            expect(realB).toBe(b);
            expect(realC).toBe(c);
        });

        asyncDelegate.add(func);
        asyncDelegate.dispatch(a, b, c);
        expect(func).toBeCalledTimes(1);
        a = 20;
        b = 'hello world';
        asyncDelegate.dispatch(a, b, c);
        expect(func).toBeCalledTimes(2);
    });

    test('async', (cb) => {
        const asyncDelegate = new AsyncDelegate<() => Promise<void> | void>();
        let resolved = 0;
        const func1 = jest.fn(() => {
            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    resolved++;
                    resolve();
                }, 20);
            });
        });
        const func2 = jest.fn(() => {
            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    resolved++;
                    resolve();
                }, 100);
            });
        });
        const func3 = jest.fn(() => {
            resolved++;
        });
        asyncDelegate.add(func1);
        asyncDelegate.add(func2);
        asyncDelegate.add(func3);
        Promise.resolve()
        .then(() => asyncDelegate.dispatch())
        .then(() => {
            expect(func1).toBeCalledTimes(1);
            expect(func2).toBeCalledTimes(1);
            expect(func2).toBeCalledTimes(1);
            expect(resolved).toBe(3);
            cb();
        });

    });
});