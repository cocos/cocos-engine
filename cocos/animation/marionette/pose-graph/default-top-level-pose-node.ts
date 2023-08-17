import { assertIsTrue } from '../../../core';
import { applyDeltaPose, blendPoseInto, Pose, TransformFilter } from '../../core/pose';
import { AnimationGraph, Layer } from '../animation-graph';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../animation-graph-context';
import { AnimationMask } from '../animation-mask';
import { TopLevelStateMachineEvaluation } from '../state-machine/state-machine-eval';
import { PoseNode } from './pose-node';
import { RuntimeMotionSyncManager } from './motion-sync/runtime-motion-sync';
import { PoseStashAllocator, RuntimeStashManager } from './stash/runtime-stash';

export class DefaultTopLevelPoseNode extends PoseNode {
    constructor (
        graph: AnimationGraph,
        bindingContext: AnimationGraphBindingContext,
        poseStashAllocator: PoseStashAllocator,
    ) {
        super();

        const layerEvaluationRecords = graph.layers.map((layer) => {
            const record = new LayerEvaluationRecord(
                layer,
                bindingContext,
                poseStashAllocator,
            );

            return record;
        });

        this._layerRecords = layerEvaluationRecords;
    }

    get layerCount (): number {
        return this._layerRecords.length;
    }

    public reenter (): void {
        // Default top level pose is meant to be non-reenter-able.
        // Do nothing here.
    }

    public bind (_context: AnimationGraphBindingContext): void {
        // `LayerEvaluationRecord` should have already been bound.
        // Do nothing here.
    }

    public settle (context: AnimationGraphSettleContext): void {
        const { _layerRecords: layerRecords } = this;
        const nLayers = layerRecords.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            layerRecords[iLayer].settle(context);
        }
    }

    public getLayerWeight (layerIndex: number): number {
        assertIsTrue(layerIndex >= 0 && layerIndex < this._layerRecords.length, `Invalid layer index`);
        return this._layerRecords[layerIndex].weight;
    }

    public setLayerWeight (layerIndex: number, weight: number): void {
        assertIsTrue(layerIndex >= 0 && layerIndex < this._layerRecords.length, `Invalid layer index`);
        this._layerRecords[layerIndex].weight = weight;
    }

    public getLayerTopLevelStateMachineEvaluation (layerIndex: number): TopLevelStateMachineEvaluation {
        return this._layerRecords[layerIndex].stateMachineEvaluation;
    }

    public overrideClips (context: AnimationGraphBindingContext): void {
        const { _layerRecords: layerRecords } = this;
        const nLayers = layerRecords.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layerRecord = layerRecords[iLayer];
            context._pushAdditiveFlag(layerRecord.additive);
            layerRecord.stateMachineEvaluation.overrideClips(context);
            context._popAdditiveFlag();
        }
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const { _layerRecords: layerRecords } = this;
        const nLayers = layerRecords.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            layerRecords[iLayer].update(context);
        }
    }

    protected doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const finalPose = context.pushDefaultedPose();
        const { _layerRecords: layerRecords } = this;
        const nLayers = layerRecords.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layer = layerRecords[iLayer];
            const layerPose = layer.stateMachineEvaluation.evaluate(context);
            const layerActualWeight = layer.weight * layer.stateMachineEvaluation.passthroughWeight;
            const { transformFilter } = layer;
            if (layer.additive) {
                applyDeltaPose(finalPose, layerPose, layerActualWeight, transformFilter);
            } else {
                blendPoseInto(finalPose, layerPose, layerActualWeight, transformFilter);
            }
            context.popPose();

            layer.postEvaluate();
        }
        return finalPose;
    }

    private _layerRecords: LayerEvaluationRecord[];
}

class LayerEvaluationRecord {
    constructor (
        layer: Layer,
        bindingContext: AnimationGraphBindingContext,
        poseStashAllocator: PoseStashAllocator,
    ) {
        const stashManager = new RuntimeStashManager(poseStashAllocator);
        for (const [stashId, _] of layer.stashes()) {
            stashManager.addStash(stashId);
        }
        this._stashManager = stashManager;

        const motionSyncManager = new RuntimeMotionSyncManager();
        this._motionSyncManager = motionSyncManager;

        bindingContext._setLayerWideContextProperties(
            stashManager,
            motionSyncManager,
        );

        for (const [stashId, stash] of layer.stashes()) {
            stashManager.setStash(stashId, stash, bindingContext);
        }

        this.weight = layer.weight;
        const additive = this.additive = layer.additive;
        this._mask = layer.mask ?? undefined;
        bindingContext._pushAdditiveFlag(additive);
        this._topLevelStateMachineEval = new TopLevelStateMachineEvaluation(
            layer.stateMachine,
            layer.name,
            bindingContext,
        );
        bindingContext._popAdditiveFlag();

        bindingContext._unsetLayerWideContextProperties();
    }

    get stateMachineEvaluation (): TopLevelStateMachineEvaluation {
        return this._topLevelStateMachineEval;
    }

    public settle (context: AnimationGraphSettleContext): void {
        if (this._mask) {
            this.transformFilter = context.createTransformFilter(this._mask);
        }

        // Settle layer stashes.
        this._stashManager.settle(context);

        // Settle the top level state machine.
        this._topLevelStateMachineEval.settle(context);
    }

    public update (context: AnimationGraphUpdateContext): void {
        this.stateMachineEvaluation.update(context);

        this._motionSyncManager.sync();
    }

    public postEvaluate (): void {
        // Reset stash resources.
        this._stashManager.reset();
    }

    public additive = false;

    public weight = 0.0;

    private _topLevelStateMachineEval: TopLevelStateMachineEvaluation;

    private _stashManager: RuntimeStashManager;

    private _motionSyncManager: RuntimeMotionSyncManager;

    private _mask: AnimationMask | undefined = undefined;

    public transformFilter: TransformFilter | undefined = undefined;
}

export type { LayerEvaluationRecord };
