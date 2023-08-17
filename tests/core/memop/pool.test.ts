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
    let tmpArr = [];
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
    const test = [];
    for (let i = 0; i < 100; ++i) {
        test[i] = createTest();
    }
    pool.freeArray(test);
    // @ts-expect-error
    expect(pool._freePool.length).toBeGreaterThan(100);
    // @ts-expect-error
    expect(pool._nextAvail).toBeGreaterThan(100);

    // @ts-expect-error
    const beforeShrink = pool._nextAvail;

    pool.tryShrink();

    // @ts-expect-error
    expect(pool._freePool.length >= 50 && pool._freePool.length <= 100).toBeTruthy();
    
    // @ts-expect-error
    expect(pool._nextAvail >= 50 && pool._nextAvail <= 100).toBeTruthy();

    // @ts-expect-error
    expect(calledTimes).toBe(beforeShrink - pool._nextAvail);

    pool.tryShrink();

    // @ts-expect-error
    expect(pool._freePool.length >= 25 && pool._freePool.length <= 50).toBeTruthy();
    
    // @ts-expect-error
    expect(pool._nextAvail >= 25 && pool._nextAvail <= 50).toBeTruthy();
    // @ts-expect-error
    expect(calledTimes).toBe(beforeShrink - pool._nextAvail);

    const items = [];
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
    expect(pool._nextAvail).toBeGreaterThan(10);
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