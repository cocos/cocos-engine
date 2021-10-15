import { Pool } from '../../../cocos/core/memop/pool';

class Test {
    public tag: number;
    constructor (num: number) {
        this.tag = num;
    }
}

let tagValue = 0;
function createTest () {
    return new Test(tagValue++);
}

const ARRAY_SIZE = 10;
let pool = new Pool<Test>(createTest, ARRAY_SIZE);

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