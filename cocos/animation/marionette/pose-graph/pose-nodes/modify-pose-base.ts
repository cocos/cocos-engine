import { DEBUG, EDITOR } from 'internal:constants';
import { ccclass, editable, serializable, type } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseNode, PoseTransformSpaceRequirement } from '../pose-node';
import { input } from '../decorator/input';
import { poseGraphNodeHide } from '../decorator/node';
import { Pose, PoseTransformSpace } from '../../../core/pose';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../../animation-graph-context';
import { PoseGraphType } from '../foundation/type-system';
import { assertIsTrue, CachedArray, Pool } from '../../../../core';
import { Transform } from '../../../core/transform';

class TransformModification {
    public transformIndex = -1;
    public transform = new Transform();
}

export type { TransformModification };

class TransformModificationQueue {
    get length (): number {
        return this._array.length;
    }

    get array (): TransformModification[] {
        return this._array.array;
    }

    public push (transformIndex: number, transform: Transform): void {
        if (DEBUG) {
            assertIsTrue(transformIndex > this._debugLastTransformIndex, `Unexpected transform modification order`);
            this._debugLastTransformIndex = transformIndex;
        }
        const mod = this._pool.alloc();
        mod.transformIndex = transformIndex;
        Transform.copy(mod.transform, transform);
        this._array.push(mod);
    }

    public clear (): void {
        const length = this._array.length;
        for (let iMod = 0; iMod < length; ++iMod) {
            const mod = this._array.get(iMod);
            assertIsTrue(mod);
            this._pool.free(mod);
        }
        this._array.clear();
        if (DEBUG) {
            this._debugLastTransformIndex = -1;
        }
    }

    private _pool: Pool<TransformModification> = new Pool((): TransformModification => new TransformModification(), 3);
    private _array = new CachedArray<TransformModification>(3);
    private _debugLastTransformIndex = -1;
}

export type { TransformModificationQueue };

class PoseTransformSpaceFlagTable {
    constructor (nTransforms: number) {
        this._transformFlags = new Array(nTransforms);
    }

    /**
     * Set all transforms' flags to false.
     */
    public clear (): void {
        this._transformFlags.fill(false);
    }

    /**
     * Test if the transform's flag is set to true.
     * @param transformIndex Transform index.
     * @returns True if the transform's flag is set to true.
     */
    public test (transformIndex: number): boolean {
        return this._transformFlags[transformIndex];
    }

    /**
     * Sets the transform's flag to true.
     * @param transformIndex Transform index.
     */
    public set (transformIndex: number): void {
        this._transformFlags[transformIndex] = true;
    }

    /**
     * Sets the transform's flag to false.
     * @param transformIndex Transform index.
     */
    public unset (transformIndex: number): void {
        this._transformFlags[transformIndex] = false;
    }

    private _transformFlags: boolean[] = [];
}

const cacheTransform_spaceConversion = new Transform();
const cacheParentTransform_spaceConversion = new Transform();

function applyTransformModificationQueue (
    context: AnimationGraphEvaluationContext,
    pose: Pose,
    queue: TransformModificationQueue,
    spaceFlagTable: PoseTransformSpaceFlagTable,
): void {
    const nMods = queue.length;
    if (nMods === 0) {
        return;
    }

    if (DEBUG) {
        let debugLastModTransformIndex = -1;
        for (let iMod = 0; iMod < nMods; ++iMod) {
            const { transformIndex } = queue.array[iMod];
            // Ensure the modifications are queued from parent to child.
            assertIsTrue(transformIndex > debugLastModTransformIndex);
            debugLastModTransformIndex = transformIndex;
        }
    }

    // In case of local space pose, no space conversion needed.
    if (pose._poseTransformSpace === PoseTransformSpace.LOCAL) {
        for (let iMod = 0; iMod < nMods; ++iMod) {
            const { transformIndex, transform } = queue.array[iMod];
            pose.transforms.setTransform(transformIndex, transform);
        }
        return;
    }

    assertIsTrue(pose._poseTransformSpace === PoseTransformSpace.COMPONENT);

    // In the following, the flag of a transform is defined as:
    // - False if it's in component space,
    // - True if it's in local space or is component space but need to be converted into local space.

    // At initial, all transforms are in component space.
    spaceFlagTable.clear();

    // From parent to child, collect all transforms needs to be converted into local space.
    const firstTransformToConvert = queue.array[0].transformIndex;
    let lastTransformToConvert = firstTransformToConvert;
    for (let iMod = 0; iMod < nMods; ++iMod) {
        const { transformIndex } = queue.array[iMod];
        spaceFlagTable.set(transformIndex); // Set as "need to be converted".
        lastTransformToConvert = transformIndex;
    }
    for (let transformIndex = firstTransformToConvert;
        transformIndex < pose.transforms.length;
        ++transformIndex) {
        const parentTransformIndex = context.parentTable[transformIndex];
        if (parentTransformIndex < 0) {
            continue;
        }
        // If parent need be converted, then the child need to be converted to.
        if (spaceFlagTable.test(parentTransformIndex)) {
            spaceFlagTable.set(transformIndex); // Set as "need to be converted".
            lastTransformToConvert = transformIndex;
        }
    }

    // From child to parent, convert transforms in to local space.
    // Now the "need to be converted" flags are turned into "in local space".
    for (let transformIndex = lastTransformToConvert;
        transformIndex >= firstTransformToConvert;
        --transformIndex) {
        if (spaceFlagTable.test(transformIndex)) {
            const parentTransformIndex = context.parentTable[transformIndex];
            if (parentTransformIndex >= 0) {
                const transform = pose.transforms.getTransform(transformIndex, cacheTransform_spaceConversion);
                const parentTransform = pose.transforms.getTransform(parentTransformIndex, cacheParentTransform_spaceConversion);
                Transform.calculateRelative(transform, transform, parentTransform);
                pose.transforms.setTransform(transformIndex, transform);
            }
        }
    }

    // From parent to child, apply modifications, these modified transforms are now in component space.
    for (let iMod = 0; iMod < nMods; ++iMod) {
        const { transformIndex, transform } = queue.array[iMod];
        pose.transforms.setTransform(transformIndex, transform);
        spaceFlagTable.unset(transformIndex); // Set as "in component space".
    }

    // Finally, from parent to child, recalculate component space back.
    for (let transformIndex = firstTransformToConvert;
        transformIndex <= lastTransformToConvert;
        ++transformIndex) {
        if (spaceFlagTable.test(transformIndex)) {
            const parentTransformIndex = context.parentTable[transformIndex];
            assertIsTrue(parentTransformIndex >= 0); // These changes should all be children of transforms in modification queue.
            const transform = pose.transforms.getTransform(transformIndex, cacheTransform_spaceConversion);
            const parentTransform = pose.transforms.getTransform(parentTransformIndex, cacheParentTransform_spaceConversion);
            Transform.multiply(transform, parentTransform, transform);
            pose.transforms.setTransform(transformIndex, transform);
        }
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeModifyPoseBase`)
@poseGraphNodeHide()
export abstract class PoseNodeModifyPoseBase extends PoseNode {
    @serializable
    @input({ type: PoseGraphType.POSE })
    public pose: PoseNode | null = null;

    public settle (context: AnimationGraphSettleContext): void {
        this.pose?.settle(context);
        this._spaceFlagTable = new PoseTransformSpaceFlagTable(context.transformCount);
    }

    public reenter (): void {
        this.pose?.reenter();
    }

    public bind (context: AnimationGraphBindingContext): void {
        this.pose?.bind(context);
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        this.pose?.update(context);
    }

    protected doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const poseTransformSpaceRequirement = this.getPoseTransformSpaceRequirement();
        const inputPose = this.pose?.evaluate(context, poseTransformSpaceRequirement)
            ?? PoseNode.evaluateDefaultPose(context, poseTransformSpaceRequirement);

        const { _modificationQueue: modificationQueue } = this;
        assertIsTrue(modificationQueue.length === 0);
        this.modifyPose(context, inputPose, modificationQueue);

        applyTransformModificationQueue(context, inputPose, modificationQueue, this._spaceFlagTable);
        modificationQueue.clear();

        return inputPose;
    }

    protected abstract getPoseTransformSpaceRequirement(): PoseTransformSpaceRequirement;

    protected abstract modifyPose(
        context: AnimationGraphEvaluationContext,
        pose: Pose,
        transformModificationQueue: TransformModificationQueue,
    ): void;

    private _modificationQueue = new TransformModificationQueue();
    private _spaceFlagTable = new PoseTransformSpaceFlagTable(0);
}
