/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { DEBUG } from 'internal:constants';
import { AnimationGraph } from './animation-graph';
import type { Node } from '../../scene-graph/node';
import { Value, VarInstance, TriggerResetMode, createInstanceTag, VarInstanceTrigger } from './variable';
import { VariableType } from './parametric';
import { assertIsTrue } from '../../core';
import { MAX_ANIMATION_LAYER } from '../../3d/skeletal-animation/limits';
import type { AnimationController } from './animation-controller';
import {
    AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphPoseLayoutMaintainer, defaultTransformsTag, LayoutChangeFlag, AuxiliaryCurveRegistry,
    AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator,
    AnimationGraphSettleContext,
    DeferredPoseStashAllocator,
} from './animation-graph-context';
import { PoseTransformSpaceRequirement } from './pose-graph/pose-node';
import { DefaultTopLevelPoseNode } from './pose-graph/default-top-level-pose-node';
import {
    ClipStatus,
    MotionStateStatus,
    TransitionStatus,
} from './state-machine/state-machine-eval';
import { ReadonlyClipOverrideMap } from './clip-overriding';

export class AnimationGraphEval {
    private _currentTransitionCache: TransitionStatus = {
        duration: 0.0,
        time: 0.0,
    };

    constructor (
        graph: AnimationGraph,
        root: Node,
        controller: AnimationController,
        clipOverrides: ReadonlyClipOverrideMap | null,
    ) {
        if (DEBUG) {
            if (graph.layers.length >= MAX_ANIMATION_LAYER) {
                throw new Error(
                    `Max layer count exceeds. `
                    + `Allowed: ${MAX_ANIMATION_LAYER}, actual: ${graph.layers.length}`,
                );
            }
        }

        for (const [name, variable] of graph.variables) {
            const varInstance = variable[createInstanceTag]();
            this._varInstances[name] = varInstance;
            if (varInstance instanceof VarInstanceTrigger) {
                if (varInstance.resetMode === TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED) {
                    this._hasAutoTrigger = true;
                }
            }
        }

        const poseLayoutMaintainer = new AnimationGraphPoseLayoutMaintainer(root, this._auxiliaryCurveRegistry);
        this._poseLayoutMaintainer = poseLayoutMaintainer;

        const bindingContext = new AnimationGraphBindingContext(root, poseLayoutMaintainer, this._varInstances, controller);
        bindingContext._setClipOverrides(clipOverrides ?? undefined);
        this._bindingContext = bindingContext;

        const settleContext = new AnimationGraphSettleContext(poseLayoutMaintainer);
        this._settleContext = settleContext;

        poseLayoutMaintainer.startBind();

        const poseStashAllocator = new DeferredPoseStashAllocator();
        this._poseStashAllocator = poseStashAllocator;

        this._rootPoseNode = new DefaultTopLevelPoseNode(
            graph,
            bindingContext,
            poseStashAllocator,
        );

        this._root = root;
        this._initializeContexts();
    }

    public destroy (): void {
        this._evaluationContext.destroy();
    }

    public _destroyAfterException_debugging (): void {
        const stackSize = this._evaluationContext._stackSize_debugging;
        if (stackSize !== 0) { // Should only caused by exception.
            for (let i = 0; i < stackSize; ++i) {
                this._evaluationContext.popPose();
            }
        }

        this._evaluationContext.destroy();
    }

    public get layerCount (): number {
        return this._rootPoseNode.layerCount;
    }

    public update (deltaTime: number): void {
        const {
            _evaluationContext: evaluationContext,
            _poseLayoutMaintainer: poseLayoutMaintainer,
            _rootUpdateContextGenerator: rootUpdateContextGenerator,
            _rootPoseNode: rootPoseNode,
        } = this;

        const updateContext = rootUpdateContextGenerator.generate(
            deltaTime,
            1.0,
        );

        rootPoseNode.update(updateContext);

        const finalPose = rootPoseNode.evaluate(evaluationContext, PoseTransformSpaceRequirement.LOCAL);

        if (this._hasAutoTrigger) {
            const { _varInstances: varInstances } = this;
            for (const varName in varInstances) {
                const varInstance = varInstances[varName];
                if (varInstance instanceof VarInstanceTrigger
                    && varInstance.resetMode === TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED) {
                    varInstance.value = false;
                }
            }
        }

        poseLayoutMaintainer.apply(finalPose);
        evaluationContext.popPose();

        if (DEBUG) {
            assertIsTrue(evaluationContext.allocatedPoseCount === 0, `Pose leaked.`);
            assertIsTrue(this._poseStashAllocator.allocatedPoseCount === 0, `Pose leaked.`);
        }
    }

    public getVariables (): Iterable<Readonly<[string, Readonly<{ type: VariableType }>]>> {
        return Object.entries(this._varInstances);
    }

    public getCurrentStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        return this._rootPoseNode.getLayerTopLevelStateMachineEvaluation(layer).getCurrentStateStatus();
    }

    public getCurrentClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        return this._rootPoseNode.getLayerTopLevelStateMachineEvaluation(layer).getCurrentClipStatuses();
    }

    public getCurrentTransition (layer: number): Readonly<TransitionStatus> | null {
        const {
            _currentTransitionCache: currentTransition,
        } = this;
        const isInTransition = this._rootPoseNode.getLayerTopLevelStateMachineEvaluation(layer).getCurrentTransition(currentTransition);
        return isInTransition ? currentTransition : null;
    }

    public getNextStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        return this._rootPoseNode.getLayerTopLevelStateMachineEvaluation(layer).getNextStateStatus();
    }

    public getNextClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        return this._rootPoseNode.getLayerTopLevelStateMachineEvaluation(layer).getNextClipStatuses();
    }

    public getValue (name: string): Value | undefined {
        const varInstance = this._varInstances[name];
        if (!varInstance) {
            return undefined;
        } else {
            return varInstance.value;
        }
    }

    public setValue (name: string, value: Value): void {
        const varInstance = this._varInstances[name];
        if (!varInstance) {
            return;
        }
        varInstance.value = value;
    }

    public getLayerWeight (layerIndex: number): number {
        return this._rootPoseNode.getLayerWeight(layerIndex);
    }

    public setLayerWeight (layerIndex: number, weight: number): void {
        this._rootPoseNode.setLayerWeight(layerIndex, weight);
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap): void {
        const {
            _poseLayoutMaintainer: poseLayoutMaintainer,
        } = this;

        poseLayoutMaintainer.startBind();

        this._bindingContext._setClipOverrides(overrides);
        this._rootPoseNode.overrideClips(this._bindingContext);

        this._updateAfterPossiblePoseLayoutChange();
    }

    public getAuxiliaryCurveValue (curveName: string): number {
        return this._auxiliaryCurveRegistry.get(curveName);
    }

    private _rootPoseNode: DefaultTopLevelPoseNode;
    private _varInstances: Record<string, VarInstance> = {};
    private _hasAutoTrigger = false;
    private _auxiliaryCurveRegistry = new AuxiliaryCurveRegistry();
    private _poseLayoutMaintainer: AnimationGraphPoseLayoutMaintainer;
    private _bindingContext: AnimationGraphBindingContext;
    private _settleContext: AnimationGraphSettleContext;
    /**
     * Preserved here for clip overriding.
     */
    private declare _root: Node;
    private declare _evaluationContext: AnimationGraphEvaluationContext;
    private declare _poseStashAllocator: DeferredPoseStashAllocator;
    private _rootUpdateContextGenerator = new AnimationGraphUpdateContextGenerator();

    private _initializeContexts (): void {
        const {
            _poseLayoutMaintainer: poseLayoutMaintainer,
        } = this;

        // Ignore in initialization.
        // eslint-disable-next-line no-void
        void poseLayoutMaintainer.endBind();

        this._createOrUpdateTransformFilters();

        const evaluationContext = poseLayoutMaintainer.createEvaluationContext();
        this._evaluationContext = evaluationContext;

        // Capture the default transforms.
        poseLayoutMaintainer.fetchDefaultTransforms(evaluationContext[defaultTransformsTag]);

        poseLayoutMaintainer.resetPoseStashAllocator(this._poseStashAllocator);
    }

    private _updateAfterPossiblePoseLayoutChange (): void {
        const {
            _poseLayoutMaintainer: poseLayoutMaintainer,
        } = this;

        const layoutChangeFlags = poseLayoutMaintainer.endBind();

        // Nothing changed, this should be the commonest case in real world.
        if (layoutChangeFlags === 0) {
            return;
        }

        // No matter count or order changed, we should update the transform filters.
        if ((layoutChangeFlags & LayoutChangeFlag.TRANSFORM_COUNT)
            || (layoutChangeFlags & LayoutChangeFlag.TRANSFORM_ORDER)) {
            this._createOrUpdateTransformFilters();
        }

        // Either transform count or auxiliary curve count changed, we should recreate the eval context.
        let evaluationContextRecreated = false;
        if ((layoutChangeFlags & LayoutChangeFlag.TRANSFORM_COUNT)
        || (layoutChangeFlags & LayoutChangeFlag.AUXILIARY_CURVE_COUNT)) {
            const evaluationContext = poseLayoutMaintainer.createEvaluationContext();
            this._evaluationContext.destroy();
            this._evaluationContext = evaluationContext;
            evaluationContextRecreated = true;
            poseLayoutMaintainer.resetPoseStashAllocator(this._poseStashAllocator);
        }

        // If the eval context was recreated or the layout has changed, we should update the default transforms.
        if (evaluationContextRecreated
            || (layoutChangeFlags & LayoutChangeFlag.TRANSFORM_COUNT)
            || (layoutChangeFlags & LayoutChangeFlag.TRANSFORM_ORDER)) {
            poseLayoutMaintainer.fetchDefaultTransforms(this._evaluationContext[defaultTransformsTag]);
        }
    }

    private _createOrUpdateTransformFilters (): void {
        this._rootPoseNode.settle(this._settleContext);
    }
}

export type { VarInstance } from './variable';
