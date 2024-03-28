import { Pool } from '../../../cocos/core/memop/pool';

class Test {
    public tag: number;
    public destroyed: boolean = false;
    constructor (num: number) {
        this.tag = num;
    }
}

let tagValue = 0;
function createTest () {
    return new Test(tagValue++);
}

let calledTimes = 0;
function destroyTest (obj) {
    calledTimes++;
    obj.destroyed = true;
}

const ARRAY_SIZE = 10;
let pool = new Pool<Test>(createTest, ARRAY_SIZE, destroyTest);

test('alloc', () => {
    for (let i = 0; i < ARRAY_SIZE + 2; ++i) {
        const obj = pool.alloc();
        expect(obj).not.toStrictEqual(undefined);
    }
});

test('free', () => {
    const tmp = createTest();
    pool.free(tmp);
    const newElement = pool.alloc();
    expect(newElement).toStrictEqual(tmp);
});

test('freeArray', () => {
    let tmpArr: Test[] = [];
    const TEST_SIZE = 5;
    for (let i = 0; i < TEST_SIZE; ++i) {
        tmpArr[i] = createTest();
    }
    pool.freeArray(tmpArr);
    for (let i = 0; i < TEST_SIZE; ++i) {
        const tmpObj = pool.alloc();
        expect(tmpArr[TEST_SIZE - i - 1]).toStrictEqual(tmpObj);
    }
});

test('shrink', () => {
    // free length = 10
    pool = new Pool<Test>(createTest, 10, destroyTest, 30);
    calledTimes = 0;

    // free length = 110
    const test: Test[] = [];
    for (let i = 0; i < 100; ++i) {
        test[i] = createTest();
    }
    pool.freeArray(test);
    // @ts-expect-error
    expect(pool._freePool.length).toEqual(100 + 10);
    // @ts-expect-error
    expect(pool._nextAvail).toEqual(100 + 10 - 1);
    // @ts-expect-error
    const beforeShrink = pool._freePool.length;

    pool.tryShrink();

    // @ts-expect-error
    expect(pool._freePool.length).toEqual(beforeShrink / 2);

    // @ts-expect-error
    expect(calledTimes).toEqual(beforeShrink - pool._freePool.length);

    pool.tryShrink();

    // @ts-expect-error
    expect(pool._freePool.length).toEqual(42);
    
    // @ts-expect-error
    expect(calledTimes).toBe(beforeShrink - pool._freePool.length);

    const items: Test[] = [];
    for (let i = 0; i < 50; i++) {
        const item = pool.alloc();
        items.push(item);
        expect(item.destroyed).toBeFalsy();
    }

    pool.freeArray(items);

    // can not shrink anymore
    pool.tryShrink();
    pool.tryShrink();
    pool.tryShrink();
    pool.tryShrink();
    pool.tryShrink();

    // @ts-expect-error
    expect(pool._freePool.length).toEqual(30);

    // If not pass shrinkThreshold, then the value equals to elementsPerBatch(10);

    pool = new Pool<Test>(createTest, 10, destroyTest);

    pool.tryShrink();
    // @ts-expect-error
    expect(pool._freePool.length).toEqual(10);

    items.length = 0;
    for (let i = 0; i < 20; i++) {
        const item = pool.alloc();
        items.push(item);
    }
    pool.freeArray(items);
    pool.tryShrink();
    pool.tryShrink();
    pool.tryShrink();
    pool.tryShrink();
    pool.tryShrink();
    // @ts-expect-error
    expect(pool._freePool.length).toEqual(10);
    
});

test('destroy', () => {
    calledTimes = 0;
    // @ts-expect-error
    const beforeDestroy = pool._nextAvail;
    // @ts-expect-error
    expect(pool._nextAvail).toBeGreaterThan(0);

    pool.destroy();

    expect(calledTimes).toBe(beforeDestroy + 1);
    // @ts-expect-error
    expect(pool._nextAvail).toBe(-1);
    // @ts-expect-error
    expect(pool._freePool.length).toBe(0);
});