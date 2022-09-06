import { Transform } from "../../../cocos/animation/core/transform";
import { TransformArray } from "../../../cocos/animation/core/transform-array";
import 'jest-extended';
import { Quat, Vec3 } from "../../../cocos/core";

test('Constructor/Class statics/Buffer related', () => {
    expect(TransformArray.BYTES_PER_ELEMENT).toBe(80);

    // `new TransformArray()`
    {
        const transforms = new TransformArray();
        expect(transforms.length).toBe(0);
        expect(transforms.buffer.byteLength).toBe(0);
        expect(transforms.byteLength).toBe(0);
        expect(transforms.byteOffset).toBe(0);
    }

    // `new TransformArray(length)`
    {
        const transforms = new TransformArray(6);
        expect(transforms.length).toBe(6);
        expect(transforms.buffer.byteLength).toBe(6 * TransformArray.BYTES_PER_ELEMENT);
        expect(transforms.byteLength).toBe(6 * TransformArray.BYTES_PER_ELEMENT);
        expect(transforms.byteOffset).toBe(0);
        expect(toPlainArray(transforms)).toSatisfyAll(
            (transform: Transform) => Transform.strictEquals(transform, Transform.ZERO));
    }

    // `new TransformArray(buffer)`
    {
        // TODO:
    }
});

test('Element access', () => {
    const TRANSFORM_0 = new Transform();
    TRANSFORM_0.position = new Vec3(1., 2., 3.);
    TRANSFORM_0.rotation = new Quat(4., 5., 6., 7.);
    TRANSFORM_0.scale = new Vec3(8., 9., 10.);

    const transformArray = new TransformArray(3);
    transformArray.setTransform(1, TRANSFORM_0);
    {
        const out = new Transform();
        expect(transformArray.getTransform(1, out)).toBe(out);
        expect(Transform.strictEquals(TRANSFORM_0, out)).toBe(true);
    }
    {
        const out = new Vec3();
        expect(transformArray.getPosition(1, out)).toBe(out);
        expect(Vec3.strictEquals(TRANSFORM_0.position, out)).toBe(true);
    }
    {
        const out = new Quat();
        expect(transformArray.getRotation(1, out)).toBe(out);
        expect(Quat.strictEquals(TRANSFORM_0.rotation, out)).toBe(true);
    }
    {
        const out = new Vec3();
        expect(transformArray.getScale(1, out)).toBe(out);
        expect(Vec3.strictEquals(TRANSFORM_0.scale, out)).toBe(true);
    }

    {
        const input = new Vec3(6., 7., 8.);
        transformArray.setPosition(1, input);
        expect(Vec3.strictEquals(input, transformArray.getTransform(1, new Transform()).position)).toBe(true);
        expect(Vec3.strictEquals(input, transformArray.getPosition(1, new Vec3()))).toBe(true);

        // Ensure other parts are not affected...
        expect(Quat.strictEquals(TRANSFORM_0.rotation, transformArray.getRotation(1, new Quat()))).toBe(true);
        expect(Vec3.strictEquals(TRANSFORM_0.scale, transformArray.getScale(1, new Vec3()))).toBe(true);
    }

    {
        const input = new Quat(3.14, 1.5, 6.2, 8.8);
        transformArray.setRotation(1, input);
        expect(Quat.strictEquals(input, transformArray.getTransform(1, new Transform()).rotation)).toBe(true);
        expect(Quat.strictEquals(input, transformArray.getRotation(1, new Quat()))).toBe(true);

        // Ensure other parts are not affected...
        expect(Vec3.strictEquals(TRANSFORM_0.scale, transformArray.getScale(1, new Vec3()))).toBe(true);
    }

    {
        const input = new Vec3(6., 6., 6.);
        transformArray.setScale(1, input);
        expect(Vec3.strictEquals(input, transformArray.getTransform(1, new Transform()).scale)).toBe(true);
        expect(Vec3.strictEquals(input, transformArray.getScale(1, new Vec3()))).toBe(true);
    }
});

test('Copy within', () => {
    const helper = new ArrayLikeOperationTestHelper(6);

    // This is a trick.
    // Each element in table denotes the expected transform index into `TRANSFORMS`.
    // In other word:
    // As long `transformArray.copyWithin` is sync with `table.copyWithin`,
    // we got correct result!
    const verify = (...args: Parameters<TransformArray['copyWithin']>) => {
        helper.transformArray.copyWithin(...args);
        helper.transformVerifyTable.copyWithin(...args);
        helper.verify();
    };

    // [0, 1, 2, 3, 4, 5]
    verify(0, 0);
    verify(1, 1);
    verify(0, 1);         // [1, 2, 3, 4, 5, 5]
    verify(1, 3, 5); // [1, 4, 5, 4, 5, 5]
    verify(2, 1, 3); // Who care
});

test('Fill', () => {
    const helper = new ArrayLikeOperationTestHelper(6, 3);
    
    const verify = (...args: Parameters<number[]['fill']>) => {
        const [value, start, end] = args;
        helper.transformArray.fill(
            helper.getFixtureTransform(value),
            start,
            end,
        );
        helper.transformVerifyTable.fill(...args);
        helper.verify();
    };

    verify(6);
    verify(7, 2);
    verify(8, 3, 5);

    const verifyFillZero = (start?: number, end?: number) => {
        helper.reset();
        helper.transformVerifyTable.fill(0, start, end);
        helper.transformArray.fillZero(start, end);
    };

    verifyFillZero();
    verifyFillZero(2);
    verifyFillZero(3, 5);
});

test('Set', () => {
    const helper = new ArrayLikeOperationTestHelper(6, 4);

    const transformArray2 = new TransformArray(4);
    const transformArray2VerifyTable = new Array(transformArray2.length).fill(0);
    for (let i = 0; i < transformArray2.length; ++i) {
        const fixtureIndex = 6 + i;
        transformArray2.setTransform(i, helper.getFixtureTransform(fixtureIndex));
        transformArray2VerifyTable[i] = fixtureIndex;
    }

    helper.transformArray.set(transformArray2);
    helper.transformVerifyTable.set(transformArray2VerifyTable);
    helper.verify();

    helper.transformArray.set(transformArray2, 2);
    helper.transformVerifyTable.set(transformArray2VerifyTable, 2);
    helper.verify();
});

test('Slice', () => {
    const helper = new ArrayLikeOperationTestHelper(6);

    const verify = (...args: Parameters<TransformArray['slice']>) => {
        const slicedTransformArray = helper.transformArray.slice(...args);
        const slicedTable = helper.transformVerifyTable.slice(...args);
        expect(slicedTransformArray).not.toBe(helper.transformArray);
        expect(slicedTransformArray.length).toEqual(slicedTable.length);
        for (let i = 0; i < slicedTransformArray.length; ++i) {
            expect(Transform.strictEquals(
                slicedTransformArray.getTransform(i, new Transform()),
                helper.getFixtureTransform(slicedTable[i]),
            )).toBe(true);
        }
    };
    
    verify();
    verify(2, 2);
    verify(1, 5);
});

/**
 * @zh 一个讨巧的帮助类。
 * 
 * `TransformArray` 有许多接口是对照 `TypedArray` 设计的，
 * 对于这些接口，我们可以借助这样的手段确保接口的正确：
 * - 生成一组我们不考虑其具体值、用于对照的“固定设施”变换，记为 FT（Fixture Transform）。
 * - 规定要测试的 `TransformArray` 的每个元素都等于 FT 数组中的某一个，
 *   这样一来我们就可以构造出一张对照表，这张表就是 `TransformArray` 中每个元素引用的 FT 的索引。
 * - 当 `TransformArray` 进行某些操作时，这张表也进行相应的操作。
 * - 最后通过比对 `TransformArray` 的每个元素是否和对照表匹配来确定是否操作如预期，见 `verify` 方法。
 * 
 * 例如，要测试 `fill` 接口，我们可以让 `TransformArray` 长度为 6，并且创建 7 个 FT。
 * 初始时，让第一个元素是第一个 FT，第二个元素是第二个 FT……那么对照表的内容就为 `[0, 1, 2, 3, 4, 5, 6]`。
 * 接下来，我们想验证第 7 个 FT 调用 `TransformArray.fill`的结果：
 * 首先我们调用对照表数组上的 `fill`，得到：`[7, 7, 7, 7, 7, 7]`。
 * 然后验证是否 `TransformArray` 每一个元素就是对照表所暗示的 FT 就行了。 
 */
class ArrayLikeOperationTestHelper {
    public transformArray: TransformArray;

    public transformVerifyTable: Float64Array;

    /**
     * @zh
     * - 创建 `transformArrayLength + additionalFixtureTransformCount` 个 FT。
     * - 创建长度为 `transformArrayLength` 的 `TransformArray` 和对照表，并让其每个元素初始化为相应的 FT。
     */
    constructor(transformArrayLength: number, additionalFixtureTransformCount = 0) {
        const fixtureTransforms = Array.from({ length: transformArrayLength + additionalFixtureTransformCount }, (_, index) => {
            const transform = new Transform();
            transform.position = new Vec3(1. + index, 2. + index, 3. + index);
            transform.rotation = new Quat(4. + index, 5. + index, 6., 7. + index);
            transform.scale = new Vec3(8. + index, 9. + index, 10. + index);
            return transform;
        });
        
        this._fixtureTransforms = fixtureTransforms;

        const transformArray = new TransformArray(transformArrayLength);
        for (let i = 0; i < transformArray.length; ++i) {
            transformArray.setTransform(i, fixtureTransforms[i]);
        }

        this.transformArray = transformArray;

        this.transformVerifyTable = Float64Array.from({ length: transformArrayLength }, (_, index) => {
            return index;
        });
    }

    public getFixtureTransform(index: number): Readonly<Transform> {
        return this._fixtureTransforms[index];
    }

    public verify() {
        const {
            transformArray,
            transformVerifyTable: transformVerifyTable,
            _fixtureTransforms: fixtureTransforms,
        } = this;
        for (let i = 0; i < transformArray.length; ++i) {
            expect(Transform.strictEquals(
                transformArray.getTransform(i, new Transform()),
                fixtureTransforms[transformVerifyTable[i]],
            )).toBe(true);
        }
    }

    public reset() {
        const {
            transformArray,
            transformVerifyTable: transformVerifyTable,
            _fixtureTransforms: fixtureTransforms,
        } = this;
        for (let i = 0; i < transformArray.length; ++i) {
            transformArray.setTransform(i, fixtureTransforms[i]);
            transformVerifyTable[i] = i;
        }
    }

    private _fixtureTransforms: Transform[];
}

function toPlainArray(transforms: TransformArray) {
    return Array.from({ length: transforms.length }, (_, iTransform) => {
        return transforms.getTransform(iTransform, new Transform());
    });
}
