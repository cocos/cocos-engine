import { DEBUG } from 'internal:constants';
import { Node } from '../../scene-graph';
import { assertIsTrue } from '../../core/data/utils/asserts';
import { Pose, PoseTransformSpace, TransformFilter } from '../core/pose';
import { PoseStackAllocator } from '../core/pose-allocator';
import { TransformArray } from '../core/transform-array';
import { TransformHandle, AuxiliaryCurveHandle } from '../core/animation-handle';
import { Transform, ZERO_DELTA_TRANSFORM } from '../core/transform';
import { VarInstance } from './variable';
import { AnimationMask } from './animation-mask';
import { error } from '../../core';
import { partition } from '../../core/algorithm/partition';
import { AnimationController } from './animation-controller';
import { TransformSpace } from './pose-graph/pose-nodes/transform-space';
import { PoseStashAllocator, RuntimeStashView } from './pose-graph/stash/runtime-stash';
import { PoseHeapAllocator } from '../core/pose-heap-allocator';
import { RuntimeMotionSyncManager } from './pose-graph/motion-sync/runtime-motion-sync';
import { ReadonlyClipOverrideMap } from './clip-overriding';

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
    get origin (): Node {
        return this._origin;
    }

    /**
     * The animation controller component currently running the animation graph.
     */
    get controller (): AnimationController {
        return this._controller;
    }

    /**
     * A free function to reset specified trigger.
     * @internal This function should only be accessed by the builtin state machine.
     */
    get triggerResetter (): TriggerResetter {
        return this._triggerResetter;
    }

    get clipOverrides (): ReadonlyClipOverrideMap | undefined {
        return this._clipOverrides;
    }

    /**
     * Returns if current context expects to have an additive pose.
     */
    get additive (): boolean {
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

    public getParentBoneNameByName (bone: string): string | null | undefined {
        const boneNode = findBoneByNameRecursively(this._origin, bone);
        if (!boneNode) {
            return null;
        }
        return boneNode === this._origin ? '' : boneNode.parent?.name;
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
    public _pushAdditiveFlag (additive: boolean): void {
        this._additiveFlagStack.push(additive);
    }

    /**
     * Undo last `_pushAdditiveFlag`.
     * @internal
     */
    public _popAdditiveFlag (): void {
        assertIsTrue(this._additiveFlagStack.length > 1);
        this._additiveFlagStack.pop();
    }

    /** @internal */
    public _integrityCheck (): boolean {
        return this._additiveFlagStack.length === 1;
    }

    public get stashView (): RuntimeStashView {
        assertIsTrue(this._stashView);
        return this._stashView;
    }

    public get motionSyncManager (): RuntimeMotionSyncManager {
        assertIsTrue(this._motionSyncManager);
        return this._motionSyncManager;
    }

    /**
     * @internal
     */
    public _setLayerWideContextProperties (
        stashView: RuntimeStashView,
        motionSyncManager: RuntimeMotionSyncManager,
    ): void {
        assertIsTrue(!this._isLayerWideContextPropertiesSet);
        this._isLayerWideContextPropertiesSet = true;
        this._stashView = stashView;
        this._motionSyncManager = motionSyncManager;
    }

    /**
     * @internal
     */
    public _unsetLayerWideContextProperties (): void {
        assertIsTrue(this._isLayerWideContextPropertiesSet);
        this._isLayerWideContextPropertiesSet = false;
        this._stashView = undefined;
        this._motionSyncManager = undefined;
    }

    /**
     * @internal
     */
    public _setClipOverrides (clipOverrides: ReadonlyClipOverrideMap | undefined): void {
        this._clipOverrides = clipOverrides;
    }

    private _origin: Node;

    private _layoutMaintainer: AnimationGraphPoseLayoutMaintainer;

    private _varRegistry: VarRegistry;

    /** At least has one. */
    private _additiveFlagStack: boolean[] = [];

    private _triggerResetter: TriggerResetter = (name: string) => this._resetTrigger(name);

    private _isLayerWideContextPropertiesSet = false;
    private _stashView: RuntimeStashView | undefined;
    private _motionSyncManager: RuntimeMotionSyncManager | undefined;
    private _clipOverrides: ReadonlyClipOverrideMap | undefined = undefined;

    private _resetTrigger (triggerName: string): void {
        const varInstance = this._varRegistry[triggerName];
        if (!varInstance) {
            return;
        }
        varInstance.value = false;
    }
}

const cacheTransform = new Transform();

export class AuxiliaryCurveRegistry {
    public names (): IterableIterator<string> {
        return this._namedCurves.keys();
    }

    public has (name: string): boolean {
        return this._namedCurves.has(name);
    }

    public get (name: string): number {
        return this._namedCurves.get(name) ?? 0.0;
    }

    public set (name: string, value: number): void {
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

const checkBindStatus = (bindStarted = false): MethodDecorator => (_, _propertyKey, descriptor: TypedPropertyDescriptor<any>): void => {
    if (!DEBUG) {
        return;
    }

    const vendor = descriptor.value;
    if (vendor) {
        // eslint-disable-next-line func-names
        descriptor.value = function (this: { readonly _bindStarted: boolean }, ...args: unknown[]): any {
            assertIsTrue(
                this._bindStarted === bindStarted,
                bindStarted
                    ? `The operation is invalid since bind has not been started.`
                    : `The operation is invalid since bind has already been started.`,
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return vendor.call(this, ...args);
        };
    }
};

export class AnimationGraphPoseLayoutMaintainer {
    /**
     * @param origin This node and all nodes under this node can be bound.
     */
    constructor (origin: Node, auxiliaryCurveRegistry: AuxiliaryCurveRegistry) {
        this._origin = origin;
        this._auxiliaryCurveRegistry = auxiliaryCurveRegistry;
    }

    get transformCount (): number {
        return this._transformRecords.length;
    }

    get auxiliaryCurveCount (): number {
        return this._auxiliaryCurveRecords.length;
    }

    get auxiliaryCurveRegistry (): { get(name: string): number; } {
        return this._auxiliaryCurveRegistry;
    }

    @checkBindStatus(true)
    public getOrCreateTransformBinding (node: Node): TransformHandleInternal | null {
        const {
            _origin: origin,
        } = this;

        // Ensure the node is origin or under origin.
        let debugIntegrityCheckLengthOfPathToOrigin = 0;
        let isValidNode = false;
        for (let current: Node | null = node; current; current = current.parent) {
            if (current === origin) {
                isValidNode = true;
                break;
            }
            if (DEBUG) {
                ++debugIntegrityCheckLengthOfPathToOrigin;
            }
        }
        if (!isValidNode) {
            return null;
        }

        // Get or create the handle for the node.
        const handle = this._getOrCreateTransformBinding(node);

        // Also try to create handles for ancestors if we're not bounding origin.
        // In other words, origin is not bound by default
        // except that you explicitly bind to it.
        if (node !== origin) {
            if (DEBUG) {
                --debugIntegrityCheckLengthOfPathToOrigin;
                assertIsTrue(debugIntegrityCheckLengthOfPathToOrigin >= 0);
            }

            for (let parent: Node | null = node.parent; parent !== origin; parent = parent.parent) {
                assertIsTrue(parent);
                // But discard the result.
                // eslint-disable-next-line no-void
                void this._getOrCreateTransformBinding(parent);

                if (DEBUG) {
                    --debugIntegrityCheckLengthOfPathToOrigin;
                    assertIsTrue(debugIntegrityCheckLengthOfPathToOrigin >= 0);
                }
            }
        }

        if (DEBUG) {
            assertIsTrue(debugIntegrityCheckLengthOfPathToOrigin === 0);
        }

        return handle;
    }

    @checkBindStatus(true)
    private _getOrCreateTransformBinding (node: Node): TransformHandleInternal {
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
    public getOrCreateAuxiliaryCurveBinding (name: string): AuxiliaryCurveHandleInternal {
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

    public createEvaluationContext (): AnimationGraphEvaluationContext {
        assertIsTrue(!this._bindStarted);
        return new AnimationGraphEvaluationContext(
            this.transformCount,
            this.auxiliaryCurveCount,
            this._parentTable.slice(),
            this._origin,
        );
    }

    public resetPoseStashAllocator (allocator: DeferredPoseStashAllocator): void {
        assertIsTrue(!this._bindStarted);
        allocator._reset(this.transformCount, this.auxiliaryCurveCount);
    }

    public createTransformFilter (mask: Readonly<AnimationMask>): TransformFilter {
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

        function countPath (from: Node, to: Node): string | undefined {
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

    public fetchDefaultTransforms (transforms: TransformArray): void {
        const nTransforms = this._transformRecords.length;
        assertIsTrue(transforms.length === nTransforms);
        for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
            const { defaultTransform } = this._transformRecords[iTransform];
            transforms.setTransform(iTransform, defaultTransform);
        }
    }

    public apply (pose: Pose): void {
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
    public _destroyTransformHandle (index: number): void {
        assertIsTrue(index >= 0 && index < this._transformRecords.length, `Invalid transform handle.`);
        const record = this._transformRecords[index];
        assertIsTrue(record.refCount > 0, `Something work wrong: refCount mismatch.`);
        --record.refCount;
    }

    /**
     * @engineInternal
     */
    @checkBindStatus(true)
    public _destroyAuxiliaryCurveHandle (index: number): void {
        assertIsTrue(index >= 0 && index < this._auxiliaryCurveRecords.length, `Invalid auxiliary value handle.`);
        const record = this._auxiliaryCurveRecords[index];
        assertIsTrue(record.refCount > 0, `Something work wrong: refCount mismatch.`);
        --record.refCount;
    }

    @checkBindStatus(false)
    public startBind (): void {
        this._bindStarted = true;
        this._transformCountBeforeBind = this._transformRecords.length;
        this._auxiliaryCurveCountBeforeBind = this._auxiliaryCurveRecords.length;
    }

    @checkBindStatus(true)
    public endBind (): number {
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

        // Reconstruct the parent table.
        const { _parentTable: parentTable, _origin: origin } = this;
        parentTable.length = transformRecords.length;
        for (let iTransform = 0; iTransform < transformRecords.length; ++iTransform) {
            const { node } = transformRecords[iTransform];
            if (node === origin) {
                parentTable[iTransform] = -1;
                continue;
            }
            const parent = node.parent;
            if (parent === origin) {
                // If the parent is the origin, the origin can be bound or not.
                const parentIndex = transformRecords.findIndex((record) => record.node === parent);
                parentTable[iTransform] = parentIndex >= 0 ? parentIndex : -1;
            } else {
                // In other case we have the promise: parent of a node should have also been bound.
                const parentIndex = transformRecords.findIndex((record) => record.node === parent);
                assertIsTrue(parentIndex >= 0, `Parent node is not bound!`);
                // This is what we promised and what the evaluation context required.
                assertIsTrue(parentIndex < iTransform);
                parentTable[iTransform] = parentIndex;
            }
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

    private _origin: Node;
    private _auxiliaryCurveRegistry: AuxiliaryCurveRegistry;
    private _auxiliaryCurveRecords: AuxiliaryCurveRecord[] = [];
    private _transformRecords: TransformRecord[] = [];
    private _parentTable: number[] = [];

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

function trimRecords<TRecord extends AnimationRecord<any>> (records: TRecord[]): void {
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
     * Gets the number of transforms in pose.
     */
    public get transformCount (): number {
        return this._layoutMaintainer.transformCount;
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

const cacheTransform_spaceConversion = new Transform();
const cacheParentTransform_spaceConversion = new Transform();

class AnimationGraphEvaluationContext {
    constructor (
        transformCount: number,
        metaValueCount: number,
        parentTable: readonly number[],
        componentNode: Node,
    ) {
        if (DEBUG) {
            assertIsTrue(transformCount === parentTable.length);
            // We requires all parents are in front of children in `parentTable`.
            assertIsTrue(parentTable.every((parentIndex, currentIndex) => {
                if (parentIndex < 0) { // Root node
                    return true;
                }
                return parentIndex < currentIndex;
            }));
        }
        this._poseAllocator = new PoseStackAllocator(transformCount, metaValueCount);
        this._parentTable = parentTable;
        this._componentNode = componentNode;
        this[defaultTransformsTag] = new TransformArray(transformCount);
    }

    public destroy (): void {
        this._poseAllocator.destroy();
    }

    /**
     * @engineInternal
     */
    public readonly [defaultTransformsTag]: TransformArray;

    public get allocatedPoseCount (): number {
        return this._poseAllocator.allocatedCount;
    }

    get parentTable (): readonly number[] {
        return this._parentTable;
    }

    public pushDefaultedPose (): Pose {
        const pose = this._poseAllocator.push();
        pose.transforms.set(this[defaultTransformsTag]);
        pose._poseTransformSpace = PoseTransformSpace.LOCAL;
        pose.auxiliaryCurves.fill(0.0);
        return pose;
    }

    public pushDefaultedPoseInComponentSpace (): Pose {
        const pose = this.pushDefaultedPose();
        this._poseTransformsSpaceLocalToComponent(pose);
        return pose;
    }

    public pushZeroDeltaPose (): Pose {
        const pose = this._poseAllocator.push();
        pose.transforms.fill(ZERO_DELTA_TRANSFORM);
        pose._poseTransformSpace = PoseTransformSpace.LOCAL;
        pose.auxiliaryCurves.fill(0.0);
        return pose;
    }

    public pushDuplicatedPose (src: Pose): Pose {
        const pose = this._poseAllocator.push();
        pose.transforms.set(src.transforms);
        pose._poseTransformSpace = src._poseTransformSpace;
        pose.auxiliaryCurves.set(src.auxiliaryCurves);
        return pose;
    }

    public popPose (): void {
        this._poseAllocator.pop();
    }

    /**
     * @internal
     */
    public get _stackSize_debugging (): number {
        return this._poseAllocator.allocatedCount;
    }

    /**
     * @internal
     */
    public _isStackTopPose_debugging (pose: Pose): boolean {
        return pose === this._poseAllocator.top;
    }

    /** @internal */
    public _poseTransformsSpaceLocalToComponent (pose: Pose): void {
        const { transforms } = pose;
        const { length: nTransforms } = transforms;
        for (let iTransform = 0; iTransform < nTransforms; ++iTransform) {
            const parentTransformIndex = this._parentTable[iTransform];
            if (parentTransformIndex < 0) { // Root node
                continue;
            }
            const transform = transforms.getTransform(iTransform, cacheTransform_spaceConversion);
            const parentTransform = transforms.getTransform(parentTransformIndex, cacheParentTransform_spaceConversion);
            Transform.multiply(transform, parentTransform, transform);
            transforms.setTransform(iTransform, transform);
        }

        pose._poseTransformSpace = PoseTransformSpace.COMPONENT;
    }

    /** @internal */
    public _poseTransformsSpaceComponentToLocal (pose: Pose): void {
        const { transforms } = pose;
        const { length: nTransforms } = transforms;
        for (let iTransform = nTransforms - 1; iTransform >= 0; --iTransform) {
            const parentTransformIndex = this._parentTable[iTransform];
            if (parentTransformIndex < 0) { // Root node
                continue;
            }
            const transform = transforms.getTransform(iTransform, cacheTransform_spaceConversion);
            const parentTransform = transforms.getTransform(parentTransformIndex, cacheParentTransform_spaceConversion);
            Transform.calculateRelative(transform, transform, parentTransform);
            transforms.setTransform(iTransform, transform);
        }

        pose._poseTransformSpace = PoseTransformSpace.LOCAL;
    }

    public _convertPoseSpaceTransformToTargetSpace (
        transform: Transform,
        outTransformSpace: TransformSpace,
        pose: Pose,
        poseTransformIndex: number,
    ): Transform {
        const poseSpace = pose._poseTransformSpace;
        switch (outTransformSpace) {
        default:
            if (DEBUG) { assertIsTrue(false); }
            break;
        case TransformSpace.WORLD:
            if (poseSpace === PoseTransformSpace.COMPONENT) {
                // Component -> World.
                Transform.multiply(transform, this._getComponentToWorldTransform(), transform);
            } else {
                assertIsTrue(poseSpace === PoseTransformSpace.LOCAL);
                // Local -> World.
                Transform.multiply(
                    transform,
                    this._getLocalToWorldTransform(cacheParentTransform_spaceConversion, pose, poseTransformIndex),
                    transform,
                );
            }
            break;
        case TransformSpace.COMPONENT:
            if (poseSpace === PoseTransformSpace.COMPONENT) {
                // The transform is already in component.
            } else {
                assertIsTrue(poseSpace === PoseTransformSpace.LOCAL);
                // Local -> Component.
                Transform.multiply(
                    transform,
                    this._getLocalToComponentTransform(cacheParentTransform_spaceConversion, pose, poseTransformIndex),
                    transform,
                );
            }
            break;
        case TransformSpace.PARENT: {
            if (poseSpace === PoseTransformSpace.COMPONENT) {
                // Component -> Parent.
                // Parent_Component_Transform * result = Component
                // result = inv(Component_Transform_of_Parent) * component
                const parentTransformIndex = this._parentTable[poseTransformIndex];
                if (parentTransformIndex >= 0) {
                    const parentComponentTransform = pose.transforms.getTransform(parentTransformIndex, cacheParentTransform_spaceConversion);
                    const invParentComponentTransform = Transform.invert(parentComponentTransform, parentComponentTransform);
                    Transform.multiply(transform, invParentComponentTransform, transform);
                }
            } else {
                assertIsTrue(poseSpace === PoseTransformSpace.LOCAL);
                // Local -> Parent.
                // The transform is already under parent.
            }
            break;
        }
        case TransformSpace.LOCAL: { // Local -> *
            // Bone_Local_Transform * result = input
            // result = inv(Bone_Local_Transform) * input
            assertIsTrue(poseSpace === PoseTransformSpace.COMPONENT || poseSpace === PoseTransformSpace.LOCAL);
            const boneTransform = pose.transforms.getTransform(poseTransformIndex, cacheParentTransform_spaceConversion);
            const invBoneTransform = Transform.invert(boneTransform, boneTransform);
            Transform.multiply(transform, invBoneTransform, transform);
            break;
        }
        }
        return transform;
    }

    public _convertTransformToPoseTransformSpace (
        transform: Transform,
        transformSpace: TransformSpace,
        pose: Pose,
        poseTransformIndex: number,
    ): Transform {
        const poseSpace = pose._poseTransformSpace;

        switch (transformSpace) {
        default:
            if (DEBUG) { assertIsTrue(false); }
            break;
        case TransformSpace.WORLD:
            if (poseSpace === PoseTransformSpace.COMPONENT) {
                // World -> Component.
                const worldToComponent = Transform.invert(cacheParentTransform_spaceConversion, this._getComponentToWorldTransform());
                Transform.multiply(transform, worldToComponent, transform);
            } else {
                assertIsTrue(poseSpace === PoseTransformSpace.LOCAL);
                // World -> Local.
                const localToWorld = this._getLocalToWorldTransform(cacheParentTransform_spaceConversion, pose, poseTransformIndex);
                const worldToLocal = Transform.invert(localToWorld, localToWorld);
                Transform.multiply(transform, worldToLocal, transform);
            }
            break;
        case TransformSpace.COMPONENT:
            if (poseSpace === PoseTransformSpace.COMPONENT) {
                // Identity.
            } else {
                assertIsTrue(poseSpace === PoseTransformSpace.LOCAL);
                // Component -> Local.
                const localToComponent = this._getLocalToComponentTransform(cacheParentTransform_spaceConversion, pose, poseTransformIndex);
                const componentToLocal = Transform.invert(localToComponent, localToComponent);
                Transform.multiply(transform, componentToLocal, transform);
            }
            break;
        case TransformSpace.PARENT: {
            if (poseSpace === PoseTransformSpace.COMPONENT) {
                // Parent -> Component.
                const parentTransformIndex = this._parentTable[poseTransformIndex];
                if (parentTransformIndex >= 0) {
                    const parentTransform = pose.transforms.getTransform(parentTransformIndex, cacheParentTransform_spaceConversion);
                    Transform.multiply(transform, parentTransform, transform);
                }
            } else {
                // Parent -> Local.
                // The transform is already in local space.
            }
            break;
        }
        case TransformSpace.LOCAL: {
            assertIsTrue(poseSpace === PoseTransformSpace.COMPONENT || poseSpace === PoseTransformSpace.LOCAL);
            // Bone_Local_Transform * result = input
            // result = inv(Bone_Local_Transform) * input
            const currentTransform = pose.transforms.getTransform(poseTransformIndex, cacheParentTransform_spaceConversion);
            Transform.multiply(transform, currentTransform, transform);
            break;
        }
        }

        return transform;
    }

    private _poseAllocator: PoseStackAllocator;

    private _parentTable: readonly number[];

    private _componentNode: Node;

    private _cacheComponentToWorldTransform = new Transform();

    private _getComponentToWorldTransform (): Transform {
        const result = this._cacheComponentToWorldTransform;
        const componentNode = this._componentNode;
        result.position = componentNode.worldPosition;
        result.rotation = componentNode.worldRotation;
        result.scale = componentNode.worldScale;
        return result;
    }

    private _getLocalToComponentTransform (out: Transform, pose: Pose, transformIndex: number): Transform {
        const { _parentTable: parentTable } = this;

        Transform.setIdentity(out);
        for (let iTransform = parentTable[transformIndex]; iTransform >= 0; iTransform = parentTable[iTransform]) {
            const localTransform = pose.transforms.getTransform(iTransform, cacheTransform_spaceConversion);
            Transform.multiply(out, localTransform, out);
        }

        return out;
    }

    private _getLocalToWorldTransform (out: Transform, pose: Pose, transformIndex: number): Transform {
        this._getLocalToComponentTransform(out, pose, transformIndex);
        Transform.multiply(out, this._getComponentToWorldTransform(), out);
        return out;
    }
}

export type { AnimationGraphEvaluationContext };

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

    public destroy (): void {
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

    public destroy (): void {
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
    ): AnimationGraphUpdateContext {
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
    ): void {
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

export class DeferredPoseStashAllocator implements PoseStashAllocator {
    get allocatedPoseCount (): number {
        assertIsTrue(this._allocator);
        return this._allocator.allocatedCount;
    }

    /** @internal */
    public _reset (transformCount: number, auxiliaryCurveCount: number): void {
        this._allocator = new PoseHeapAllocator(transformCount, auxiliaryCurveCount);
    }

    public allocatePose (): Pose {
        assertIsTrue(this._allocator);
        const pose = this._allocator.allocatePose();
        return pose;
    }

    public destroyPose (pose: Pose): void {
        assertIsTrue(this._allocator);
        return this._allocator.destroyPose(pose);
    }

    private _allocator: PoseHeapAllocator | null = null;
}
