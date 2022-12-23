import { DEBUG } from 'internal:constants';
import { Node } from '../../scene-graph';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose, TransformFilter } from '../core/pose';
import { PoseAllocator } from '../core/pose-allocator';
import { TransformArray } from '../core/transform-array';
import { TransformHandle, MetaValueHandle } from '../core/animation-handle';
import { Transform, ZERO_DELTA_TRANSFORM } from '../core/transform';
import { VarInstance } from './variable';
import { AnimationMask } from './animation-mask';
import { error } from '../../core';
import { partition } from '../../core/algorithm/partition';

/**
 * This module contains stuffs related to animation graph's evaluation.
 *
 * The typical workflow to setup a animation graph evaluation is:
 *
 * At binding phase:
 * - Creates a `PoseLayoutMaintainer`.
 * - Creates a `AnimationGraphBindingContext`, which collects animation bindings and report them to the `PoseLayoutMaintainer`.
 * - Binding all portion of the animation graph under such a context.
 *
 * At each evaluation phase:
 * - Creates a (or reuse a) `AnimationGraphEvaluationContext`.
 * - Do the evaluation, generate a pose.
 * - Call `PoseLayoutMaintainer.apply()` to apply the pose into scene graph.
 *
 * When an override-clip request is fired, the binding phase is performed again.
 */

function findBoneByNameRecursively (from: Node, name: string): Node | null {
    if (from.name === name) {
        return from;
    }
    const nChildren = from.children.length;
    for (let iChild = 0; iChild < nChildren; ++iChild) {
        const found = findBoneByNameRecursively(from.children[iChild], name);
        if (found) {
            return found;
        }
    }
    return null;
}

/**
 * The binding context of an animation graph in layer-wide.
 */
export interface AnimationGraphLayerWideBindingContext {
    /**
     * Indicates if the current layer is an additive layer.
     */
    additive: boolean;

    /**
     * The outer binding context.
     */
    outerContext: AnimationGraphBindingContext;
}

export type VarRegistry = Record<string, VarInstance>;

/**
 * The binding context of an animation graph.
 */
export class AnimationGraphBindingContext {
    constructor (origin: Node, poseLayoutMaintainer: AnimationGraphPoseLayoutMaintainer, varRegistry: VarRegistry) {
        this._origin = origin;
        this._layoutMaintainer = poseLayoutMaintainer;
        this._varRegistry = varRegistry;
    }

    get origin () {
        return this._origin;
    }

    public bindTransform (bone: string): TransformHandle | null {
        const boneNode = this._origin.getChildByPath(bone);
        if (!boneNode) {
            return null;
        }
        return this._layoutMaintainer.getOrCreateTransformBinding(boneNode);
    }

    public bindTransformByName (bone: string): TransformHandle | null {
        const boneNode = findBoneByNameRecursively(this._origin, bone);
        if (!boneNode) {
            return null;
        }
        return this._layoutMaintainer.getOrCreateTransformBinding(boneNode);
    }

    public getBoneChildren (bone: string): string[] {
        const boneNode = findBoneByNameRecursively(this._origin, bone);
        if (!boneNode) {
            return [];
        }
        return boneNode.children.map((childNode) => childNode.name);
    }

    public bineMetaValue (name: string): MetaValueHandle {
        return this._layoutMaintainer.getOrCreateMetaValueBinding(name);
    }

    public getVar (id: string): VarInstance | undefined {
        return this._varRegistry[id];
    }

    private _origin: Node;

    private _layoutMaintainer: AnimationGraphPoseLayoutMaintainer;

    private _varRegistry: VarRegistry
}

const cacheTransform = new Transform();

export class MetaValueRegistry {
    public names () {
        return this._namedCurves.keys();
    }

    public has (name: string) {
        return this._namedCurves.has(name);
    }

    public get (name: string) {
        return this._namedCurves.get(name) ?? 0.0;
    }

    public set (name: string, value: number) {
        this._namedCurves.set(name, value);
    }

    private _namedCurves: Map<string, number> = new Map();
}

export enum LayoutChangeFlag {
    /**
     * If this flag is set, means the transform count and order has been changed.
     */
    TRANSFORM_COUNT = 1,

    /**
     * If this flag is set, means the transform count is not change but the order has been changed.
     */
    TRANSFORM_ORDER = 2,

    /**
     * If this flag is set, means the meta value count has been changed.
     */
    META_VALUE_COUNT = 4,
}

const checkBindStatus = (bindStarted = false): MethodDecorator => (_, _propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    if (!DEBUG) {
        return;
    }

    const vendor = descriptor.value;
    if (vendor) {
        // eslint-disable-next-line func-names
        descriptor.value = function (this: { readonly _bindStarted: boolean }, ...args: unknown[]) {
            assertIsTrue(this._bindStarted === bindStarted,
                bindStarted
                    ? `The operation is invalid since bind has not been started.`
                    : `The operation is invalid since bind has already been started.`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return vendor.call(this, ...args);
        };
    }
};

export class AnimationGraphPoseLayoutMaintainer {
    constructor (metaValueRegistry: MetaValueRegistry) {
        this._metaValueRegistry = metaValueRegistry;
    }

    get transformCount () {
        return this._transformRecords.length;
    }

    get metaValueCount () {
        return this._metaValueRecords.length;
    }

    @checkBindStatus(true)
    public getOrCreateTransformBinding (node: Node) {
        const { _transformRecords: transformRecords } = this;

        const transformIndex = transformRecords.findIndex((transformRecord) => transformRecord.node === node);
        if (transformIndex >= 0) {
            const transformRecord = transformRecords[transformIndex];
            ++transformRecord.refCount;
            return transformRecord.handle;
        }

        // Ensure parent is preceding to children.
        let newNodeIndex = 0;
        for (let parent = node.parent; parent; parent = parent.parent) {
            const parentIndex = transformRecords.findIndex((transformRecord) => transformRecord.node === parent);
            if (parentIndex >= 0) {
                newNodeIndex = parentIndex + 1;
                break;
            }
        }

        // Update necessary bone handle.
        for (let transformIndex = newNodeIndex; transformIndex < transformRecords.length; ++transformIndex) {
            ++transformRecords[transformIndex].handle.index;
        }

        // Insert new transform record.
        const transformRecord = new TransformRecord(
            new TransformHandleInternal(this, newNodeIndex),
            node,
        );
        transformRecords.splice(newNodeIndex, 0, transformRecord);

        return transformRecord.handle;
    }

    @checkBindStatus(true)
    public getOrCreateMetaValueBinding (name: string) {
        const { _metaValueRecords: metaValueRecords } = this;

        const metaValueIndex = metaValueRecords.findIndex((record) => record.name === name);
        if (metaValueIndex >= 0) {
            const metaValueRecord = metaValueRecords[metaValueIndex];
            ++metaValueRecord.refCount;
            return metaValueRecord.handle;
        } else {
            const newMetaValueIndex = metaValueRecords.length;
            const metaValueRecord = new MetaValueRecord(
                new MetaValueHandleInternal(this, newMetaValueIndex),
                name,
            );
            metaValueRecords.push(metaValueRecord);
            return metaValueRecord.handle;
        }
    }

    public createTransformFilter (mask: Readonly<AnimationMask>, origin: Node) {
        const involvedTransformIndices: number[] = [];
        for (const { node, handle } of this._transformRecords) {
            const path = countPath(origin, node);
            if (typeof path === 'undefined') {
                error(`${node.getPathInHierarchy()} is not a child of ${origin.getPathInHierarchy()}`);
                // fallthrough
            } else if (mask.isExcluded(path)) {
                continue;
            }
            involvedTransformIndices.push(handle.index);
        }
        involvedTransformIndices.sort();
        const poseFilter = new TransformFilter(involvedTransformIndices);
        return poseFilter;

        function countPath (from: Node, to: Node) {
            const path: string[] = [];
            for (let node: Node | null = to; node; node = node.parent) {
                if (node === from) {
                    return path.join('/');
                } else {
                    path.unshift(node.name);
                }
            }
            return undefined; // Non-closed.
        }
    }

    public fetchDefaultTransforms (transforms: TransformArray) {
        const nTransforms = this._transformRecords.length;
        assertIsTrue(transforms.length === nTransforms);
        for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
            const { defaultTransform } = this._transformRecords[iTransform];
            transforms.setTransform(iTransform, defaultTransform);
        }
    }

    public apply (pose: Pose) {
        const {
            transforms,
            metaValues,
        } = pose;

        const nTransforms = this._transformRecords.length;
        assertIsTrue(transforms.length === nTransforms);
        for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
            const transform = transforms.getTransform(iTransform, cacheTransform);
            const { node } = this._transformRecords[iTransform];
            node.setRTS(
                transform.rotation,
                transform.position,
                transform.scale,
            );
        }

        const nMetaValues = this._metaValueRecords.length;
        for (let iMetaValue = 0; iMetaValue < nMetaValues; ++iMetaValue) {
            const { name: curveName } = this._metaValueRecords[iMetaValue];
            const curveValue = metaValues[iMetaValue];
            this._metaValueRegistry.set(curveName, curveValue);
        }
    }

    /**
     * @engineInternal
     */
    @checkBindStatus(true)
    public _destroyTransformHandle (index: number) {
        assertIsTrue(index >= 0 && index < this._transformRecords.length, `Invalid transform handle.`);
        const record = this._transformRecords[index];
        assertIsTrue(record.refCount > 0, `Something work wrong: refCount mismatch.`);
        --record.refCount;
    }

    /**
     * @engineInternal
     */
    @checkBindStatus(true)
    public _destroyMetaValueHandle (index: number) {
        assertIsTrue(index >= 0 && index < this._metaValueRecords.length, `Invalid meta value handle.`);
        const record = this._metaValueRecords[index];
        assertIsTrue(record.refCount > 0, `Something work wrong: refCount mismatch.`);
        --record.refCount;
    }

    @checkBindStatus(false)
    public startBind () {
        this._bindStarted = true;
        this._transformCountBeforeBind = this._transformRecords.length;
        this._metaValueCountBeforeBind = this._metaValueRecords.length;
    }

    @checkBindStatus(true)
    public endBind () {
        const {
            _transformRecords: transformRecords,
            _metaValueRecords: metaValueRecords,
        } = this;

        let changeFlags = 0;

        // Detect changes in transforms.
        trimRecords(transformRecords);
        if (transformRecords.length !== this._transformCountBeforeBind) {
            changeFlags |= LayoutChangeFlag.TRANSFORM_COUNT;
            // If the transform's count is changed, we only sync orders.
            const nRecords = transformRecords.length;
            for (let iRecord = 0; iRecord < nRecords; ++iRecord) {
                const record = transformRecords[iRecord];
                record.order = iRecord;
            }
        } else {
            // Sync order and detect change.
            const nRecords = transformRecords.length;
            let orderChanged = false;
            for (let iRecord = 0; iRecord < nRecords; ++iRecord) {
                const record = transformRecords[iRecord];
                if (record.order !== iRecord) {
                    orderChanged = true;
                    record.order = iRecord;
                }
            }
            if (orderChanged) {
                changeFlags |= LayoutChangeFlag.TRANSFORM_ORDER;
            }
        }

        // Detect changes in meta values.
        trimRecords(metaValueRecords);
        if (metaValueRecords.length !== this._metaValueCountBeforeBind) {
            changeFlags |= LayoutChangeFlag.META_VALUE_COUNT;
        }

        this._bindStarted = false;

        // Do some checks in debug mode.
        if (DEBUG) {
            transformRecords.forEach((transformRecord, index, transformRecords) => {
                assertIsTrue(transformRecord.handle.index === index, `Bad transform handle.`);

                assertIsTrue(transformRecord.order === index, `Bad transform order field.`);

                // Ensure that transforms are sorted so that parent is in front of child.
                for (let parent = transformRecord.node.parent; parent; parent = parent.parent) {
                    const parentIndex = transformRecords.findIndex((r) => r.node === parent);
                    if (parentIndex >= 0) {
                        assertIsTrue(parentIndex < index, `Bad transform order.`);
                    }
                }
            });

            this._transformCountBeforeBind = -1;
            this._metaValueCountBeforeBind = -1;
        }

        return changeFlags;
    }

    private _metaValueRegistry: MetaValueRegistry;
    private _metaValueRecords: MetaValueRecord[] = [];
    private _transformRecords: TransformRecord[] = [];

    private _bindStarted = false;
    private _transformCountBeforeBind = -1;
    private _metaValueCountBeforeBind = -1;
}

interface AnimationRecord<THandle extends { index: number; }> {
    handle: THandle;

    refCount: number;
}

class TransformRecord implements AnimationRecord<TransformHandleInternal> {
    constructor (handle: TransformHandleInternal, node: Node) {
        this.handle = handle;
        this.node = node;
        const defaultTransform = new Transform();
        defaultTransform.position = node.position;
        defaultTransform.rotation = node.rotation;
        defaultTransform.scale = node.scale;
        this.defaultTransform = defaultTransform;
    }

    /** The order of the transform. */
    public order = -1;

    public refCount = 1;

    public readonly handle: TransformHandleInternal;

    public readonly node: Node;

    public readonly defaultTransform: Readonly<Transform>;
}

class MetaValueRecord implements AnimationRecord<MetaValueHandleInternal> {
    constructor (handle: MetaValueHandleInternal, name: string) {
        this.handle = handle;
        this.name = name;
    }

    public refCount = 1;

    public readonly handle: MetaValueHandleInternal;

    public readonly name: string;
}

function trimRecords<TRecord extends AnimationRecord<any>> (records: TRecord[]) {
    const nUsedRecords = partition(records, (record) => {
        assertIsTrue(record.refCount >= 0);
        return record.refCount > 0;
    });
    assertIsTrue(nUsedRecords <= records.length);
    if (nUsedRecords === records.length) {
        return;
    }
    // Reassign indices.
    for (let iRecord = 0; iRecord < nUsedRecords; ++iRecord) {
        records[iRecord].handle.index = iRecord;
    }
    // Trim the array.
    if (DEBUG) {
        records.slice(nUsedRecords).forEach((record) => record.refCount = -1);
    }
    records.splice(nUsedRecords, records.length - nUsedRecords);
}

export const defaultTransformsTag = Symbol('[[DefaultTransforms]]');

export class AnimationGraphEvaluationContext {
    constructor (layout: PoseLayout) {
        this._poseAllocator = new PoseAllocator(layout.transformCount, layout.metaValueCount);
        this[defaultTransformsTag] = new TransformArray(layout.transformCount);
    }

    public destroy () {
        this._poseAllocator.destroy();
    }

    /**
     * @engineInternal
     */
    public readonly [defaultTransformsTag]: TransformArray;

    public get allocatedPoseCount () {
        return this._poseAllocator.allocatedCount;
    }

    public pushDefaultedPose () {
        const pose = this._poseAllocator.push();
        pose.transforms.set(this[defaultTransformsTag]);
        pose.metaValues.fill(0.0);
        return pose;
    }

    public pushZeroDeltaPose () {
        const pose = this._poseAllocator.push();
        pose.transforms.fill(ZERO_DELTA_TRANSFORM);
        pose.metaValues.fill(0.0);
        return pose;
    }

    public pushDuplicatedPose (src: Pose) {
        const pose = this._poseAllocator.push();
        pose.transforms.set(src.transforms);
        pose.metaValues.set(src.metaValues);
        return pose;
    }

    public popPose () {
        this._poseAllocator.pop();
    }

    private _poseAllocator: PoseAllocator;
}

export interface PoseLayout {
    transformCount: number;

    metaValueCount: number;
}

class TransformHandleInternal implements TransformHandle {
    declare __brand: TransformHandle['__brand'];

    constructor (host: AnimationGraphPoseLayoutMaintainer, index: number) {
        this._host = host;
        this.index = index;
    }

    public index = -1;

    public destroy () {
        this._host._destroyTransformHandle(this.index);
    }

    private _host: AnimationGraphPoseLayoutMaintainer;
}

class MetaValueHandleInternal implements MetaValueHandle {
    constructor (host: AnimationGraphPoseLayoutMaintainer, index: number) {
        this._host = host;
        this.index = index;
    }

    declare __brand: MetaValueHandle['__brand'];

    public index = -1;

    public destroy () {
        this._host._destroyMetaValueHandle(this.index);
    }

    private _host: AnimationGraphPoseLayoutMaintainer;
}
