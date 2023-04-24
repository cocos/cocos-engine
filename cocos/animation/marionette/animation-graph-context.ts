import { DEBUG } from 'internal:constants';
import { Node } from '../../scene-graph';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose, TransformFilter } from '../core/pose';
import { PoseStackAllocator } from '../core/pose-allocator';
import { TransformArray } from '../core/transform-array';
import { TransformHandle, AuxiliaryCurveHandle } from '../core/animation-handle';
import { Transform, ZERO_DELTA_TRANSFORM } from '../core/transform';
import { VarInstance } from './variable';
import { AnimationMask } from './animation-mask';
import { error } from '../../core';
import { partition } from '../../core/algorithm/partition';
import { AnimationController } from './animation-controller';
import { AnimationGraphCustomEventEmitter } from './event/custom-event-emitter';

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

export type VarRegistry = Record<string, VarInstance>;

export type TriggerResetter = (triggerName: string) => void;

export interface EvaluationTimeAuxiliaryCurveView {
    get(curveName: string): number;
}

/**
 * The binding context of an animation graph.
 */
export class AnimationGraphBindingContext {
    constructor (
        origin: Node,
        poseLayoutMaintainer: AnimationGraphPoseLayoutMaintainer,
        varRegistry: VarRegistry,
        private _controller: AnimationController,

        /**
         * The associated custom event emitter.
         * Any portion of the animation graph may hold and use this emitter to emit custom events.
         */
        public readonly customEventEmitter: AnimationGraphCustomEventEmitter,
    ) {
        this._origin = origin;
        this._layoutMaintainer = poseLayoutMaintainer;
        this._varRegistry = varRegistry;
        this._additiveFlagStack = [false]; // By default, non-additive.
    }

    /**
     * The origin node.
     *
     * The origin node is the origin from where the animation target start to resolve.
     * It's now definitely the node hosting the running animation controller component.
     */
    get origin () {
        return this._origin;
    }

    /**
     * The animation controller component currently running the animation graph.
     */
    get controller () {
        return this._controller;
    }

    /**
     * A free function to reset specified trigger.
     * @internal This function should only be accessed by the builtin state machine.
     */
    get triggerResetter () {
        return this._triggerResetter;
    }

    /**
     * Returns if current context expects to have an additive pose.
     */
    get additive () {
        const { _additiveFlagStack: additiveFlagStack } = this;
        return additiveFlagStack[additiveFlagStack.length - 1];
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

    public bindAuxiliaryCurve (name: string): AuxiliaryCurveHandle {
        return this._layoutMaintainer.getOrCreateAuxiliaryCurveBinding(name);
    }

    public getEvaluationTimeAuxiliaryCurveView (): EvaluationTimeAuxiliaryCurveView {
        return this._layoutMaintainer.auxiliaryCurveRegistry;
    }

    public getVar (id: string): VarInstance | undefined {
        return this._varRegistry[id];
    }

    /**
     * Pushes the `additive` flag. A later `_popAdditiveFlag` is required to pop the change.
     * @internal
     */
    public _pushAdditiveFlag (additive: boolean) {
        this._additiveFlagStack.push(additive);
    }

    /**
     * Undo last `_pushAdditiveFlag`.
     * @internal
     */
    public _popAdditiveFlag () {
        assertIsTrue(this._additiveFlagStack.length > 1);
        this._additiveFlagStack.pop();
    }

    /** @internal */
    public _integrityCheck () {
        return this._additiveFlagStack.length === 1;
    }

    private _origin: Node;

    private _layoutMaintainer: AnimationGraphPoseLayoutMaintainer;

    private _varRegistry: VarRegistry;

    /** At least has one. */
    private _additiveFlagStack: boolean[] = [];

    private _triggerResetter: TriggerResetter = (name: string) => this._resetTrigger(name);

    private _resetTrigger (triggerName: string) {
        const varInstance = this._varRegistry[triggerName];
        if (!varInstance) {
            return;
        }
        varInstance.value = false;
    }
}

const cacheTransform = new Transform();

export class AuxiliaryCurveRegistry {
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
     * If this flag is set, means the auxiliary curve count has been changed.
     */
    AUXILIARY_CURVE_COUNT = 4,
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
    constructor (private _origin: Node, auxiliaryCurveRegistry: AuxiliaryCurveRegistry) {
        this._auxiliaryCurveRegistry = auxiliaryCurveRegistry;
    }

    get transformCount () {
        return this._transformRecords.length;
    }

    get auxiliaryCurveCount () {
        return this._auxiliaryCurveRecords.length;
    }

    get auxiliaryCurveRegistry (): { get(name: string): number; } {
        return this._auxiliaryCurveRegistry;
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
    public getOrCreateAuxiliaryCurveBinding (name: string) {
        const { _auxiliaryCurveRecords: auxiliaryCurveRecords } = this;

        const auxiliaryCurveIndex = auxiliaryCurveRecords.findIndex((record) => record.name === name);
        if (auxiliaryCurveIndex >= 0) {
            const auxiliaryCurveRecord = auxiliaryCurveRecords[auxiliaryCurveIndex];
            ++auxiliaryCurveRecord.refCount;
            return auxiliaryCurveRecord.handle;
        } else {
            const newAuxiliaryCurveIndex = auxiliaryCurveRecords.length;
            const auxiliaryCurveRecord = new AuxiliaryCurveRecord(
                new AuxiliaryCurveHandleInternal(this, newAuxiliaryCurveIndex),
                name,
            );
            auxiliaryCurveRecords.push(auxiliaryCurveRecord);
            return auxiliaryCurveRecord.handle;
        }
    }

    public createTransformFilter (mask: Readonly<AnimationMask>) {
        const { _origin: origin } = this;
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
            auxiliaryCurves,
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

        const nAuxiliaryCurves = this._auxiliaryCurveRecords.length;
        for (let iAuxiliaryCurve = 0; iAuxiliaryCurve < nAuxiliaryCurves; ++iAuxiliaryCurve) {
            const { name: curveName } = this._auxiliaryCurveRecords[iAuxiliaryCurve];
            const curveValue = auxiliaryCurves[iAuxiliaryCurve];
            this._auxiliaryCurveRegistry.set(curveName, curveValue);
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
    public _destroyAuxiliaryCurveHandle (index: number) {
        assertIsTrue(index >= 0 && index < this._auxiliaryCurveRecords.length, `Invalid auxiliary value handle.`);
        const record = this._auxiliaryCurveRecords[index];
        assertIsTrue(record.refCount > 0, `Something work wrong: refCount mismatch.`);
        --record.refCount;
    }

    @checkBindStatus(false)
    public startBind () {
        this._bindStarted = true;
        this._transformCountBeforeBind = this._transformRecords.length;
        this._auxiliaryCurveCountBeforeBind = this._auxiliaryCurveRecords.length;
    }

    @checkBindStatus(true)
    public endBind () {
        const {
            _transformRecords: transformRecords,
            _auxiliaryCurveRecords: auxiliaryCurveRecords,
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

        // Detect changes in auxiliary values.
        trimRecords(auxiliaryCurveRecords);
        if (auxiliaryCurveRecords.length !== this._auxiliaryCurveCountBeforeBind) {
            changeFlags |= LayoutChangeFlag.AUXILIARY_CURVE_COUNT;
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
            this._auxiliaryCurveCountBeforeBind = -1;
        }

        return changeFlags;
    }

    private _auxiliaryCurveRegistry: AuxiliaryCurveRegistry;
    private _auxiliaryCurveRecords: AuxiliaryCurveRecord[] = [];
    private _transformRecords: TransformRecord[] = [];

    private _bindStarted = false;
    private _transformCountBeforeBind = -1;
    private _auxiliaryCurveCountBeforeBind = -1;
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

class AuxiliaryCurveRecord implements AnimationRecord<AuxiliaryCurveHandleInternal> {
    constructor (handle: AuxiliaryCurveHandleInternal, name: string) {
        this.handle = handle;
        this.name = name;
    }

    public refCount = 1;

    public readonly handle: AuxiliaryCurveHandleInternal;

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

/**
 * The settle context for animation graph building blocks(state machine/pose node/motion...etc).
 */
export class AnimationGraphSettleContext {
    constructor (
        private _layoutMaintainer: AnimationGraphPoseLayoutMaintainer,
    ) {

    }

    /**
     * Creates a transform filter expressing specified animation mask effect.
     * @param mask Animation mask.
     * @returns Result transform filter.
     */
    public createTransformFilter (mask: Readonly<AnimationMask>): TransformFilter {
        return this._layoutMaintainer.createTransformFilter(mask);
    }
}

export class AnimationGraphEvaluationContext {
    constructor (layout: PoseLayout) {
        this._poseAllocator = new PoseStackAllocator(layout.transformCount, layout.auxiliaryCurveCount);
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
        pose.auxiliaryCurves.fill(0.0);
        return pose;
    }

    public pushZeroDeltaPose () {
        const pose = this._poseAllocator.push();
        pose.transforms.fill(ZERO_DELTA_TRANSFORM);
        pose.auxiliaryCurves.fill(0.0);
        return pose;
    }

    public pushDuplicatedPose (src: Pose) {
        const pose = this._poseAllocator.push();
        pose.transforms.set(src.transforms);
        pose.auxiliaryCurves.set(src.auxiliaryCurves);
        return pose;
    }

    public popPose () {
        this._poseAllocator.pop();
    }

    /**
     * @internal
     */
    public get _stackSize_debugging () {
        return this._poseAllocator.allocatedCount;
    }

    /**
     * @internal
     */
    public _isStackTopPose_debugging (pose: Pose) {
        return pose === this._poseAllocator.top;
    }

    private _poseAllocator: PoseStackAllocator;
}

export interface PoseLayout {
    transformCount: number;

    auxiliaryCurveCount: number;
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

class AuxiliaryCurveHandleInternal implements AuxiliaryCurveHandle {
    constructor (host: AnimationGraphPoseLayoutMaintainer, index: number) {
        this._host = host;
        this.index = index;
    }

    declare __brand: AuxiliaryCurveHandle['__brand'];

    public index = -1;

    public destroy () {
        this._host._destroyAuxiliaryCurveHandle(this.index);
    }

    private _host: AnimationGraphPoseLayoutMaintainer;
}

/**
 * The update context for animation graph building blocks(state machine/pose node/motion...etc).
 */
export interface AnimationGraphUpdateContext {
    /**
     * Delta time to update.
     */
    readonly deltaTime: number;

    /**
     * Indicative weight of the updating target.
     *
     * The updating target shall not, for example, weight the result pose by this weight.
     */
    readonly indicativeWeight: number;
}

/**
 * Utility class to generate animation graph context.
 *
 * The result of each method of this class is kept available until next call on any of these methods.
 */
export class AnimationGraphUpdateContextGenerator {
    /**
     * Generates a context which has specified attributes.
     * @param deltaTime The result context's `.deltaTime`.
     * @param indicativeWeight The result context's `.indicativeWeight`.
     * @returns The result context.
     */
    public generate (
        deltaTime: number,
        indicativeWeight: number,
    ) {
        this._context.deltaTime = deltaTime;
        this._context.indicativeWeight = indicativeWeight;
        return this._context as AnimationGraphUpdateContext;
    }

    /**
     * Forks specified `base` context so that the result context is same with the base
     * except that the result indicative weight is taken from base and multiplied by `subWeight`.
     * @param base The base context.
     * @param subWeight The sub weight.
     * @returns The result context.
     */
    public forkSubWeight (
        base: AnimationGraphUpdateContext,
        subWeight: number,
    ) {
        this._context.deltaTime = base.deltaTime;
        this._context.indicativeWeight = base.indicativeWeight * subWeight;
    }

    private readonly _context: ReusableUpdateContext = {
        deltaTime: 0.0,
        indicativeWeight: 0.0,
    };
}

interface ReusableUpdateContext extends AnimationGraphUpdateContext {
    deltaTime: number;

    indicativeWeight: number;
}
