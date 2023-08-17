import { DEBUG } from 'internal:constants';
import { ccclass, serializable } from '../../../../../core/data/decorators';
import { blendPoseInto, Pose } from '../../../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../../../define';
import { PoseNode, PoseTransformSpaceRequirement } from '../../pose-node';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext,
    AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator,
} from '../../../animation-graph-context';
import { poseGraphNodeHide } from '../../decorator/node';
import { assertIsTrue, lerp } from '../../../../../core';
import { isIgnorableWeight } from '../../utils';

const ZERO_ALTERING_DURATION_THRESHOLD = 1e-5;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeChoosePoseBase`)
@poseGraphNodeHide()
export abstract class PoseNodeChoosePoseBase extends PoseNode {
    constructor (initialChoiceCount = 0) {
        super();
        this._poses.length = initialChoiceCount;
        this._poses.fill(null);
        this._fadeInDurations.length = initialChoiceCount;
        this._fadeInDurations.fill(0.0);
    }

    public bind (context: AnimationGraphBindingContext): void {
        for (const pose of this._poses) {
            pose?.bind(context);
        }
        const evaluationRecord = new EvaluationRecord(this._poses.length, this.getChosenIndex());
        this._evaluationRecord = evaluationRecord;
    }

    public settle (context: AnimationGraphSettleContext): void {
        for (const pose of this._poses) {
            pose?.settle(context);
        }
    }

    public reenter (): void {
        for (const pose of this._poses) {
            pose?.reenter();
        }
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const {
            _poses: poses,
            _evaluationRecord: evaluationRecord,
        } = this;
        assertIsTrue(evaluationRecord);

        // Update the record for weights.
        evaluationRecord.update(
            context.deltaTime,
            this.getChosenIndex(),
            this._fadeInDurations,
        );

        // Don't have to update if all weights are zero.
        if (evaluationRecord.allWeightsAreZero()) {
            return;
        }

        const nPoses = poses.length;
        const { items } = evaluationRecord;
        assertIsTrue(items.length === nPoses);

        // Dispatch update requests to non-zero weighted items.
        for (let iPose = 0; iPose < nPoses; ++iPose) {
            const weight = items[iPose].weight;
            if (isIgnorableWeight(weight)) {
                continue;
            }
            const pose = poses[iPose];
            const itemUpdateContext = this._updateContextGenerator.generate(
                context.deltaTime,
                context.indicativeWeight * weight,
            );
            pose?.update(itemUpdateContext);
        }
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const {
            _poses: poses,
            _evaluationRecord: evaluationRecord,
        } = this;
        assertIsTrue(evaluationRecord);
        const spaceRequirement = PoseTransformSpaceRequirement.LOCAL;
        const nPoses = poses.length;
        const { items } = evaluationRecord;
        assertIsTrue(items.length === poses.length);

        let finalPose: Pose | null = null;
        if (!evaluationRecord.allWeightsAreZero()) {
            let sumWeight = 0.0;
            for (let iInputPose = 0; iInputPose < nPoses; ++iInputPose) {
                const inputPoseWeight = evaluationRecord.items[iInputPose].weight;
                if (isIgnorableWeight(inputPoseWeight)) {
                    continue;
                }
                const inputPose = poses[iInputPose]?.evaluate(context, PoseTransformSpaceRequirement.LOCAL);
                if (!inputPose) {
                    continue;
                }
                sumWeight += inputPoseWeight;
                if (!finalPose) {
                    finalPose = inputPose;
                } else {
                    if (sumWeight) {
                        const t = inputPoseWeight / sumWeight;
                        blendPoseInto(finalPose, inputPose, t);
                    }
                    context.popPose();
                }
            }
        }

        if (finalPose) {
            return finalPose;
        }

        return PoseNodeChoosePoseBase.evaluateDefaultPose(context, spaceRequirement);
    }

    @serializable
    protected _poses: (PoseNode | null)[] = [];

    @serializable
    protected _fadeInDurations: number[] = [];

    protected getChosenIndex (): number {
        return 0;
    }

    private _updateContextGenerator = new AnimationGraphUpdateContextGenerator();

    private _evaluationRecord: EvaluationRecord | undefined = undefined;
}

class EvaluationRecord {
    constructor (
        itemCount: number,
        initialChosenIndex: number,
    ) {
        const items =  Array.from({ length: itemCount }, (): ItemEvaluationRecord => new ItemEvaluationRecord());
        if (initialChosenIndex >= 0 && initialChosenIndex < itemCount) {
            items[initialChosenIndex].selfSourceWeight = 1.0;
            items[initialChosenIndex].selfTargetWeight = 1.0;
            items[initialChosenIndex].weight = 1.0;
        }
        this._items = items;
    }

    get items (): readonly ReadonlyItemEvaluationRecord[] {
        return this._items;
    }

    public allWeightsAreZero (): boolean {
        return this._chosenPoseIndex < 0;
    }

    public update (deltaTime: number, newChoseIndex: number, fadeInDurations: readonly number[]): void {
        assertIsTrue(deltaTime >= 0.0);

        this._checkAlternation(newChoseIndex, fadeInDurations);

        if (this._chosenPoseIndex < 0) {
            return;
        }

        const {
            _elapsedTransitionTime: elapsedTransitionTime,
            _blendingDuration: blendingDuration,
            _items: items,
        } = this;

        // There's no blending task.
        // #no-weights-update-if-done
        if (elapsedTransitionTime >= blendingDuration) {
            return;
        }

        const nPoses = items.length;
        let sumWeight = 0.0;
        let newUniformTransformRatio = 0.0;
        const remain = blendingDuration - elapsedTransitionTime;
        if (deltaTime > remain) {
            this._elapsedTransitionTime = blendingDuration;
            newUniformTransformRatio = 1.0;
        } else {
            this._elapsedTransitionTime += deltaTime;
            newUniformTransformRatio = this._elapsedTransitionTime / blendingDuration;
        }
        assertIsTrue(newUniformTransformRatio >= 0.0 && newUniformTransformRatio <= 1.0);
        for (let iPose = 0; iPose < nPoses; ++iPose) {
            const item = items[iPose];
            const selfWeight = lerp(item.selfSourceWeight, item.selfTargetWeight, newUniformTransformRatio);
            sumWeight += selfWeight;
            item.weight = selfWeight;
        }
        if (!isIgnorableWeight(sumWeight)) {
            for (let iPose = 0; iPose < nPoses; ++iPose) {
                const item = items[iPose];
                item.weight /= sumWeight;
            }
        } else if (DEBUG) {
            assertIsTrue(items.every((item) => item.weight === 0.0));
        }
    }

    private _items: ItemEvaluationRecord[];

    private _chosenPoseIndex = -1;

    private _elapsedTransitionTime = 0.0;

    private _blendingDuration = 0.0;

    private _checkAlternation (newChoseIndex: number, fadeInDurations: readonly number[]): void {
        const {
            _items: items,
            _chosenPoseIndex: oldChoseIndex,
        } = this;
        const nPoses = items.length;
        if (!nPoses) {
            return;
        }

        // If no alternation happened, do nothing.
        if (newChoseIndex === oldChoseIndex) {
            return;
        }

        // If the new chose is invalid, do nothing. That means:
        // - if there's a valid chose before, that chose keeps not changed.
        // - otherwise, keep no chose state.
        if (newChoseIndex < 0 || newChoseIndex >= nPoses) {
            return;
        }

        // Otherwise, plan so that in new chosen pose's fade-in duration:
        // - new chosen pose starts transitioning to weight 1,
        // - other poses start transitioning to weight 0.

        const newFadeInDuration = Math.max(fadeInDurations[newChoseIndex], 0.0);
        // If the new altering duration is zero, directly fill the weights.
        // We do this since we treat `this._elapsedTransitionTime <= this._blendingDuration` as "done",
        // and then weights would not get not further update.
        // See line #no-weights-update-if-done .
        if (newFadeInDuration < ZERO_ALTERING_DURATION_THRESHOLD) {
            for (let iPose = 0; iPose < nPoses; ++iPose) {
                const item = items[iPose];
                if (iPose === newChoseIndex) {
                    item.selfSourceWeight = 1.0;
                    item.selfTargetWeight = 1.0;
                    item.weight = 1.0;
                } else {
                    item.selfSourceWeight = 0.0;
                    item.selfTargetWeight = 0.0;
                    item.weight = 0.0;
                }
            }
        } else {
            const oldUniformTransitionRatio = this._blendingDuration < ZERO_ALTERING_DURATION_THRESHOLD
                ? 1.0
                : this._elapsedTransitionTime / this._blendingDuration;
            for (let iPose = 0; iPose < nPoses; ++iPose) {
                const item = items[iPose];
                // Reset starting weight as current weight.
                // Don't use `item.weight` since it's absolute weight.
                item.selfSourceWeight = lerp(
                    item.selfSourceWeight, item.selfTargetWeight, oldUniformTransitionRatio,
                );
                if (iPose === newChoseIndex) {
                    item.selfTargetWeight = 1.0;
                } else {
                    item.selfTargetWeight = 0.0;
                }
            }
        }

        this._chosenPoseIndex = newChoseIndex;
        this._elapsedTransitionTime = 0.0;
        this._blendingDuration = newFadeInDuration;
    }
}

interface ReadonlyItemEvaluationRecord {
    readonly weight: number;
}

class ItemEvaluationRecord implements ReadonlyItemEvaluationRecord {
    public selfSourceWeight = 0.0;

    public selfTargetWeight = 0.0;

    /** Absolute weight in node. Used by node. */
    public weight = 0.0;
}
