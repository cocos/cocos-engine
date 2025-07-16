import { EDITOR } from 'internal:constants';
import { ccclass, displayName, editable, serializable, unit } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { ClipMotion } from '../../motion/clip-motion';
import { createEval } from '../../create-eval';
import { Motion, MotionEval, MotionPort } from '../../motion/motion';
import { PoseNode } from '../pose-node';
import { input } from '../decorator/input';
import { PoseGraphType } from '../foundation/type-system';
import { MotionSyncInfo } from '../motion-sync/motion-sync-info';
import { RuntimeMotionSyncRecord } from '../motion-sync/runtime-motion-sync';
import { poseGraphCreateNodeFactory, poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { getEnterInfo, getTileBase, makeCreateNodeFactory } from './play-or-sample-motion-pose-node-shared';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphSettleContext, AnimationGraphUpdateContext,
} from '../../animation-graph-context';
import { clamp01 } from '../../../../core';
import type { Pose } from '../../../core/pose';

const ZERO_DURATION_THRESHOLD = 1e-5;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodePlayMotion`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
@poseGraphCreateNodeFactory(makeCreateNodeFactory(
    (motion) => {
        const node = new PoseNodePlayMotion();
        node.motion = motion;
        return node;
    },
))
@poseGraphNodeAppearance({
    themeColor: '#227F9B',
})
export class PoseNodePlayMotion extends PoseNode {
    @serializable
    @editable
    public motion: Motion | null = new ClipMotion();

    @serializable
    @editable
    public readonly syncInfo = new MotionSyncInfo();

    @serializable
    @input({ type: PoseGraphType.FLOAT })
    @unit('s')
    public startTime = 0.0;

    @serializable
    @input({ type: PoseGraphType.FLOAT })
    public speedMultiplier = 1.0;

    /**
     * The weight of this node indicated in last update.
     */
    get lastIndicativeWeight (): number {
        return this._workspace?.lastIndicativeWeight ?? 0.0;
    }

    /**
     * Normalized time elapsed on specified motion.
     */
    get elapsedMotionTime (): number {
        return this._workspace?.normalizedTime ?? 0.0;
    }

    public bind (context: AnimationGraphBindingContext): void {
        const { motion } = this;
        if (!motion) {
            return;
        }
        const motionEval = motion[createEval](context, false);
        if (!motionEval) {
            return;
        }
        this._workspace = new Workspace(motionEval, motionEval.createPort());
        if (this.syncInfo.group) {
            this._runtimeSyncRecord = context.motionSyncManager.register(this.syncInfo);
        }
    }

    public settle (context: AnimationGraphSettleContext): void {
        // override
    }

    public reenter (): void {
        if (this._workspace) {
            const {
                _runtimeSyncRecord: runtimeSyncRecord,
                _workspace: { motionEval: { duration } },
            } = this;

            // TODO: cocos/cocos-engine#15305
            this._forceEvaluateEvaluation();

            const startTimeNormalized = duration < ZERO_DURATION_THRESHOLD
                ? 0.0
                : clamp01(this.startTime / duration);
            if (runtimeSyncRecord) {
                runtimeSyncRecord.notifyRenter(startTimeNormalized);
            } else {
                this._workspace.normalizedTime = startTimeNormalized;
            }
            this._workspace.lastIndicativeWeight = 0.0;
        }
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        if (this._workspace) {
            const { deltaTime } = context;
            const { _runtimeSyncRecord: runtimeSyncRecord } = this;
            const duration = this._workspace.motionEval.duration;
            let normalizedDeltaTime = 0.0;
            if (duration > ZERO_DURATION_THRESHOLD) {
                normalizedDeltaTime = (deltaTime * this.speedMultiplier) / duration;
            }
            if (runtimeSyncRecord) {
                runtimeSyncRecord.notifyUpdate(normalizedDeltaTime, context.indicativeWeight);
            } else {
                this._workspace.normalizedTime += normalizedDeltaTime;
            }
            this._workspace.lastIndicativeWeight = context.indicativeWeight;
        }
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        if (!this._workspace) {
            return context.pushDefaultedPose();
        } else {
            const normalizedTime = this._runtimeSyncRecord
                ? this._runtimeSyncRecord.getSyncedEnterTime()
                : this._workspace.normalizedTime;
            return this._workspace.motionEvalPort.evaluate(normalizedTime, context);
        }
    }

    private _workspace: Workspace | null = null;
    private _runtimeSyncRecord: RuntimeMotionSyncRecord | undefined = undefined;
}

class Workspace {
    constructor (
        public motionEval: MotionEval,
        public motionEvalPort: MotionPort,
    ) {

    }

    public normalizedTime = 0.0;
    public lastIndicativeWeight = 0.0;
}

if (EDITOR) {
    PoseNodePlayMotion.prototype.getTitle = function getTitle (this: PoseNodePlayMotion): string | [string, Record<string, string>] | undefined {
        return getTileBase(`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodePlayMotion.title`, this.motion);
    };

    PoseNodePlayMotion.prototype.getEnterInfo = getEnterInfo;
}
