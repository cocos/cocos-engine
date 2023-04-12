import { assertIsTrue } from '../../../core';
import { applyDeltaPose, blendPoseInto, Pose, TransformFilter } from '../../core/pose';
import { Layer } from '../animation-graph';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../animation-graph-context';
import { AnimationMask } from '../animation-mask';
import { ReadonlyClipOverrideMap, TopLevelStateMachineEvaluation } from '../graph-eval';
import { PoseNode } from './pose-node';

export class DefaultTopLevelPoseNode extends PoseNode {
    constructor (
        private _layerRecords: readonly LayerEvaluationRecord[],
    ) {
        super();
    }

    get layerCount () {
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

    public getLayerWeight (layerIndex: number) {
        assertIsTrue(layerIndex >= 0 && layerIndex < this._layerRecords.length, `Invalid layer index`);
        return this._layerRecords[layerIndex].weight;
    }

    public setLayerWeight (layerIndex: number, weight: number) {
        assertIsTrue(layerIndex >= 0 && layerIndex < this._layerRecords.length, `Invalid layer index`);
        this._layerRecords[layerIndex].weight = weight;
    }

    public getLayerTopLevelStateMachineEvaluation (layerIndex: number) {
        return this._layerRecords[layerIndex].stateMachineEvaluation;
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap, context: AnimationGraphBindingContext) {
        const { _layerRecords: layerRecords } = this;
        const nLayers = layerRecords.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layerRecord = layerRecords[iLayer];
            context._pushAdditiveFlag(layerRecord.additive);
            layerRecord.stateMachineEvaluation.overrideClips(overrides, context);
            context._popAdditiveFlag();
        }
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const { _layerRecords: layerRecords } = this;
        const nLayers = layerRecords.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            layerRecords[iLayer].stateMachineEvaluation.update(context);
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
        }
        return finalPose;
    }
}

export function createLayerEvaluationRecord (
    layer: Layer,
    bindingContext: AnimationGraphBindingContext,
    clipOverrides: ReadonlyClipOverrideMap | null,
): LayerEvaluationRecord {
    return new LayerEvaluationRecord(
        layer,
        bindingContext,
        clipOverrides,
    );
}

class LayerEvaluationRecord {
    constructor (
        layer: Layer,
        bindingContext: AnimationGraphBindingContext,
        clipOverrides: ReadonlyClipOverrideMap | null,
    ) {
        this.weight = layer.weight;
        const additive = this.additive = layer.additive;
        this._mask = layer.mask ?? undefined;
        bindingContext._pushAdditiveFlag(additive);
        this._topLevelStateMachineEval = new TopLevelStateMachineEvaluation(
            layer.stateMachine,
            layer.name,
            bindingContext,
            clipOverrides,
        );
        bindingContext._popAdditiveFlag();
    }

    get stateMachineEvaluation () {
        return this._topLevelStateMachineEval;
    }

    public settle (context: AnimationGraphSettleContext) {
        if (this._mask) {
            this.transformFilter = context.createTransformFilter(this._mask);
        }

        // Settle the top level state machine.
        this._topLevelStateMachineEval.settle(context);
    }

    public update (context: AnimationGraphUpdateContext) {
        this.stateMachineEvaluation.update(context);
    }

    public additive = false;

    public weight = 0.0;

    private _topLevelStateMachineEval: TopLevelStateMachineEvaluation;

    private _mask: AnimationMask | undefined = undefined;

    public transformFilter: TransformFilter | undefined = undefined;
}

export type { LayerEvaluationRecord };
