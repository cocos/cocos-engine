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
import {
    AnimationGraph, Layer, StateMachine, State, isAnimationTransition,
    SubStateMachine, EmptyState, EmptyStateTransition, TransitionInterruptionSource,
} from './animation-graph';
import { MotionEval, MotionEvalContext, OverrideClipContext } from './motion';
import type { Node } from '../../scene-graph/node';
import { createEval } from './create-eval';
import { Value, VarInstance, TriggerResetMode } from './variable';
import { BindContext, validateVariableExistence, validateVariableType, VariableType } from './parametric';
import { ConditionEval, TriggerCondition } from './condition';
import { MotionState } from './motion-state';
import { AnimationMask } from './animation-mask';
import { warnID, assertIsTrue, assertIsNonNullable } from '../../core';
import { BlendStateBuffer, LayeredBlendStateBuffer } from '../../3d/skeletal-animation/skeletal-animation-blending';
import { MAX_ANIMATION_LAYER } from '../../3d/skeletal-animation/limits';
import { AnimationClip } from '../animation-clip';
import type { AnimationController } from './animation-controller';
import { StateMachineComponent } from './state-machine-component';
import { InteractiveState } from './state';

export class AnimationGraphEval {
    private declare _layerEvaluations: LayerEval[];
    private _blendBuffer = new LayeredBlendStateBuffer();
    private _currentTransitionCache: TransitionStatus = {
        duration: 0.0,
        time: 0.0,
    };

    constructor (graph: AnimationGraph, root: Node, controller: AnimationController, clipOverrides: ReadonlyClipOverrideMap | null) {
        if (DEBUG) {
            if (graph.layers.length >= MAX_ANIMATION_LAYER) {
                throw new Error(
                    `Max layer count exceeds. `
                    + `Allowed: ${MAX_ANIMATION_LAYER}, actual: ${graph.layers.length}`,
                );
            }
        }

        for (const [name, variable] of graph.variables) {
            const varInstance = this._varInstances[name] = new VarInstance(variable.type, variable.value);
            if (variable.type === VariableType.TRIGGER) {
                const { resetMode } = variable;
                varInstance.resetMode = resetMode;
                if (resetMode === TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED) {
                    this._hasAutoTrigger = true;
                }
            }
        }

        const context: LayerContext = {
            controller,
            blendBuffer: this._blendBuffer,
            node: root,
            clipOverrides,
            getVar: (id: string): VarInstance | undefined => this._varInstances[id],
            triggerResetFn: (name: string) => {
                this.setValue(name, false);
            },
        };

        const layerEvaluations = this._layerEvaluations = graph.layers.map((layer) => {
            const layerEval = new LayerEval(layer, {
                ...context,
            });
            return layerEval;
        });

        // Set layer masks.
        const nLayers = layerEvaluations.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const mask = graph.layers[iLayer].mask;
            if (mask) {
                const excludeNodes = mask.filterDisabledNodes(context.node);
                this._blendBuffer.setMask(iLayer, excludeNodes);
            }
        }

        this._root = root;
    }

    public get layerCount () {
        return this._layerEvaluations.length;
    }

    public update (deltaTime: number) {
        const {
            _blendBuffer: blendBuffer,
            _layerEvaluations: layerEvaluations,
        } = this;
        const nLayers = layerEvaluations.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layerEval = layerEvaluations[iLayer];
            layerEval.update(deltaTime);
            blendBuffer.commitLayerChanges(iLayer, layerEval.weight * layerEval.passthroughWeight);
        }
        if (this._hasAutoTrigger) {
            const { _varInstances: varInstances } = this;
            for (const varName in varInstances) {
                const varInstance = varInstances[varName];
                if (varInstance.type === VariableType.TRIGGER
                    && varInstance.resetMode === TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED) {
                    varInstance.value = false;
                }
            }
        }
        this._blendBuffer.apply();
    }

    public getVariables (): Iterable<Readonly<[string, Readonly<{ type: VariableType }>]>> {
        return Object.entries(this._varInstances);
    }

    public getCurrentStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        return this._layerEvaluations[layer].getCurrentStateStatus();
    }

    public getCurrentClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        return this._layerEvaluations[layer].getCurrentClipStatuses();
    }

    public getCurrentTransition (layer: number): Readonly<TransitionStatus> | null {
        const {
            _layerEvaluations: layers,
            _currentTransitionCache: currentTransition,
        } = this;
        const isInTransition = layers[layer].getCurrentTransition(currentTransition);
        return isInTransition ? currentTransition : null;
    }

    public getNextStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        return this._layerEvaluations[layer].getNextStateStatus();
    }

    public getNextClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        return this._layerEvaluations[layer].getNextClipStatuses();
    }

    public getValue (name: string) {
        const varInstance = this._varInstances[name];
        if (!varInstance) {
            return undefined;
        } else {
            return varInstance.value;
        }
    }

    public setValue (name: string, value: Value) {
        const varInstance = this._varInstances[name];
        if (!varInstance) {
            return;
        }
        varInstance.value = value;
    }

    public getLayerWeight (layerIndex: number) {
        assertIsTrue(layerIndex >= 0 && layerIndex < this._layerEvaluations.length, `Invalid layer index`);
        return this._layerEvaluations[layerIndex].weight;
    }

    public setLayerWeight (layerIndex: number, weight: number) {
        assertIsTrue(layerIndex >= 0 && layerIndex < this._layerEvaluations.length, `Invalid layer index`);
        this._layerEvaluations[layerIndex].weight = weight;
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap) {
        const { _layerEvaluations: layerEvaluations } = this;
        const nLayers = layerEvaluations.length;
        for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
            const layerEval = layerEvaluations[iLayer];
            layerEval.overrideClips(overrides, this._root, this._blendBuffer);
        }
    }

    private _varInstances: Record<string, VarInstance> = {};
    private _hasAutoTrigger = false;
    /**
     * Preserved here for clip overriding.
     */
    private _root: Node;
}

/**
 * @zh
 * 描述了如何对动画图中引用的动画剪辑进行替换。
 * @en
 * Describes how to override animation clips in an animation graph.
 */
export type ReadonlyClipOverrideMap = {
    /**
     * @zh
     * 获取指定原始动画剪辑应替换成的动画剪辑。
     * @en
     * Gets the overriding animation clip of specified original animation clip.
     *
     * @param animationClip @zh 原始动画剪辑。@en Original animation clip.
     *
     * @returns @zh 替换的动画剪辑；如果原始动画剪辑不应被替换，则应该返回 `undefined`。 @en
     * The overriding animation clip.
     * If the original animation clip should not be overrode, `undefined` should be returned.
     */
    get(animationClip: AnimationClip): AnimationClip | undefined;
};

/**
 * @en
 * Runtime status of a transition.
 * @zh
 * 过渡的运行状态。
 */
export interface TransitionStatus {
    /**
     * @en
     * The duration of the transition.
     * @zh
     * 过渡的周期。
     */
    duration: number;

    /**
     * @en
     * The progress of the transition.
     * @zh
     * 过渡的进度。
     */
    time: number;
}

/**
 * @en
 * Runtime clip status of a motion state.
 * @zh
 * 动作状态中包含的剪辑的运行状态。
 */
export interface ClipStatus {
    /**
     * @en
     * The clip object.
     * @zh
     * 剪辑对象。
     */
    clip: AnimationClip;

    /**
     * @en
     * The clip's weight.
     * @zh
     * 剪辑的权重。
     */
    weight: number;
}

/**
 * @en
 * Runtime status of a motion state.
 * @zh
 * 动作状态的运行状态。
 */
export interface MotionStateStatus {
    /**
     * For testing.
     * TODO: remove it.
     * @internal
     */
    __DEBUG_ID__?: string;

    /**
     * @en
     * The normalized time of the state.
     * It would be the fraction part of `elapsed-time / duration` if elapsed time is non-negative,
     * and would be 1 plus the fraction part of `(elapsed-time / duration)` otherwise.
     * This is **NOT** the clip's progress if the state is not a clip motion or its wrap mode isn't loop.
     * @zh
     * 状态的规范化时间。
     * 如果流逝的时间是非负的，它就是 `流逝时间 / 周期` 的小数部分；否则，它是 `(流逝时间 / 周期)` 的小数部分加 1。
     * 它并不一定代表剪辑的进度，因为该状态可能并不是一个剪辑动作，或者它的循环模式并非循环。
     */
    progress: number;
}

type TriggerResetFn = (name: string) => void;

interface LayerContext extends BindContext {
    controller: AnimationController;

    /**
     * The root node bind to the graph.
     */
    node: Node;

    /**
     * The blend buffer.
     */
    blendBuffer: BlendStateBuffer;

    /**
     * The mask applied to this layer.
     */
    mask?: AnimationMask;

    /**
     * TODO: A little hacky.
     * A function which resets specified trigger. This function can be stored.
     */
    triggerResetFn: TriggerResetFn;

    clipOverrides: ReadonlyClipOverrideMap | null;
}

class LayerEval {
    public declare name: string;

    public declare weight: number;

    public passthroughWeight = 1.0;

    constructor (layer: Layer, context: Omit<LayerContext, 'mask'>) {
        this.name = layer.name;
        this._controller = context.controller;
        this.weight = layer.weight;
        const { entry, exit } = this._addStateMachine(layer.stateMachine, null, {
            mask: layer.mask ?? undefined,
            ...context,
        }, layer.name);
        this._topLevelEntry = entry;
        this._topLevelExit = exit;
        this._currentNode = entry;
        this._resetTrigger = context.triggerResetFn;
        this._mask = layer.mask;
    }

    /**
     * Indicates if this layer's top level graph reached its exit.
     */
    get exited () {
        return this._currentNode === this._topLevelExit;
    }

    public update (deltaTime: number) {
        if (!this.exited) {
            this._fromWeight = 1.0;
            this._toWeight = 0.0;
            this._eval(deltaTime);
            this._sample();
        }
    }

    public getCurrentStateStatus (): Readonly<MotionStateStatus> | null {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.animation) {
            return currentNode.getFromPortStatus();
        } else if (currentNode.kind === NodeKind.transitionSnapshot) {
            return currentNode.first.getFromPortStatus();
        } else {
            return null;
        }
    }

    public getCurrentClipStatuses (): Iterable<ClipStatus> {
        const { _currentNode: currentNode } = this;
        if (currentNode.kind === NodeKind.animation) {
            return currentNode.getClipStatuses(this._fromWeight);
        } else if (currentNode.kind === NodeKind.transitionSnapshot) {
            return currentNode.first.getClipStatuses(this._fromWeight);
        } else {
            return emptyClipStatusesIterable;
        }
    }

    public getCurrentTransition (transitionStatus: TransitionStatus): boolean {
        const { _currentTransitionPath: currentTransitionPath } = this;
        if (currentTransitionPath.length !== 0) {
            const lastNode = currentTransitionPath[currentTransitionPath.length - 1];
            if (lastNode.to.kind !== NodeKind.animation && lastNode.to.kind !== NodeKind.empty) {
                return false;
            }
            const {
                duration,
                normalizedDuration,
            } = currentTransitionPath[0];
            const durationInSeconds = transitionStatus.duration = normalizedDuration
                ? duration * (this._currentNode.kind === NodeKind.animation
                    ? this._currentNode.duration
                    : this._currentNode.kind === NodeKind.transitionSnapshot
                        ? this._currentNode.first.duration
                        : 0.0
                )
                : duration;
            transitionStatus.time = this._transitionProgress * durationInSeconds;
            return true;
        } else {
            return false;
        }
    }

    public getNextStateStatus (): Readonly<MotionStateStatus> | null {
        if (!this._currentTransitionToNode
            || this._currentTransitionToNode.kind === NodeKind.empty) {
            return null;
        }
        return this._currentTransitionToNode.getToPortStatus();
    }

    public getNextClipStatuses (): Iterable<ClipStatus> {
        const { _currentTransitionPath: currentTransitionPath } = this;
        const nCurrentTransitionPath = currentTransitionPath.length;
        if (nCurrentTransitionPath === 0) {
            return emptyClipStatusesIterable;
        }
        const to = currentTransitionPath[nCurrentTransitionPath - 1].to;
        if (to.kind !== NodeKind.animation) {
            return emptyClipStatusesIterable;
        }
        return to.getClipStatuses(this._toWeight) ?? emptyClipStatusesIterable;
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap, node: Node, blendBuffer: BlendStateBuffer) {
        const { _motionStates: motionStates } = this;
        const overrideClipContext: OverrideClipContext = {
            node,
            blendBuffer,
            mask: this._mask ?? undefined,
        };
        const nMotionStates = motionStates.length;
        for (let iMotionState = 0; iMotionState < nMotionStates; ++iMotionState) {
            const node = motionStates[iMotionState];
            if (node.kind === NodeKind.animation) {
                node.overrideClips(overrides, overrideClipContext);
            }
        }
    }

    private declare _controller: AnimationController;
    /**
     * Preserved here for clip overriding.
     */
    private _motionStates: MotionStateEval[] = [];
    private _topLevelEntry: NodeEval;
    private _topLevelExit: NodeEval;
    private _currentNode: NodeEval;
    private _currentTransitionToNode: EmptyStateEval | MotionStateEval | null = null;
    private _currentTransitionPath: TransitionEval[] = [];
    private _transitionProgress = 0;
    private declare _triggerReset: TriggerResetFn;
    private _fromWeight = 0.0;
    private _toWeight = 0.0;
    private _fromUpdated = false;
    private _toUpdated = false;
    /**
     * A virtual state which represents the transition snapshot captured when a transition is interrupted.
     */
    private _transitionSnapshot = new TransitionSnapshotEval();
    /**
     * Preserved here for clip overriding.
     */
    private _mask: AnimationMask | null = null;

    private _addStateMachine (
        graph: StateMachine, parentStateMachineInfo: StateMachineInfo | null, context: LayerContext, __DEBUG_ID__: string,
    ): StateMachineInfo {
        const nodes = Array.from(graph.states());

        let entryEval: SpecialStateEval | undefined;
        let anyNode: SpecialStateEval | undefined;
        let exitEval: SpecialStateEval | undefined;

        const nodeEvaluations = nodes.map((node): NodeEval | null => {
            if (node instanceof MotionState) {
                const motionStateEval = new MotionStateEval(node, context);
                this._motionStates.push(motionStateEval);
                return motionStateEval;
            } else if (node === graph.entryState) {
                return entryEval = new SpecialStateEval(node, NodeKind.entry, node.name);
            } else if (node === graph.exitState) {
                return exitEval = new SpecialStateEval(node, NodeKind.exit, node.name);
            } else if (node === graph.anyState) {
                return anyNode = new SpecialStateEval(node, NodeKind.any, node.name);
            } else if (node instanceof EmptyState) {
                return new EmptyStateEval(node);
            } else {
                assertIsTrue(node instanceof SubStateMachine);
                return null;
            }
        });

        assertIsNonNullable(entryEval, 'Entry node is missing');
        assertIsNonNullable(exitEval, 'Exit node is missing');
        assertIsNonNullable(anyNode, 'Any node is missing');

        const stateMachineInfo: StateMachineInfo = {
            components: null,
            parent: parentStateMachineInfo,
            entry: entryEval,
            exit: exitEval,
            any: anyNode,
        };

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const nodeEval = nodeEvaluations[iNode];
            if (nodeEval) {
                nodeEval.stateMachine = stateMachineInfo;
            }
        }

        const subStateMachineInfos = nodes.map((node) => {
            if (node instanceof SubStateMachine) {
                const subStateMachineInfo = this._addStateMachine(node.stateMachine, stateMachineInfo, context, `${__DEBUG_ID__}/${node.name}`);
                subStateMachineInfo.components = new InstantiatedComponents(node);
                return subStateMachineInfo;
            } else {
                return null;
            }
        });

        if (DEBUG) {
            for (const nodeEval of nodeEvaluations) {
                if (nodeEval) {
                    nodeEval.__DEBUG_ID__ = `${nodeEval.name}(from ${__DEBUG_ID__})`;
                }
            }
        }

        for (let iNode = 0; iNode < nodes.length; ++iNode) {
            const node = nodes[iNode];
            const outgoingTemplates = graph.getOutgoings(node);
            const outgoingTransitions: TransitionEval[] = [];

            let fromNode: NodeEval;
            if (node instanceof SubStateMachine) {
                const subStateMachineInfo = subStateMachineInfos[iNode];
                assertIsNonNullable(subStateMachineInfo);
                fromNode = subStateMachineInfo.exit;
            } else {
                const nodeEval = nodeEvaluations[iNode];
                assertIsNonNullable(nodeEval);
                fromNode = nodeEval;
            }

            for (const outgoing of outgoingTemplates) {
                const outgoingNode = outgoing.to;
                const iOutgoingNode = nodes.findIndex((nodeTemplate) => nodeTemplate === outgoing.to);
                if (iOutgoingNode < 0) {
                    assertIsTrue(false, 'Bad animation data');
                }

                let toNode: NodeEval;
                if (outgoingNode instanceof SubStateMachine) {
                    const subStateMachineInfo = subStateMachineInfos[iOutgoingNode];
                    assertIsNonNullable(subStateMachineInfo);
                    toNode = subStateMachineInfo.entry;
                } else {
                    const nodeEval = nodeEvaluations[iOutgoingNode];
                    assertIsNonNullable(nodeEval);
                    toNode = nodeEval;
                }

                const conditions = outgoing.conditions.map((condition) => condition[createEval](context));

                const transitionEval: TransitionEval = {
                    conditions,
                    to: toNode,
                    triggers: undefined,
                    duration: 0.0,
                    normalizedDuration: false,
                    destinationStart: 0.0,
                    relativeDestinationStart: false,
                    exitCondition: 0.0,
                    exitConditionEnabled: false,
                    interruption: TransitionInterruptionSource.NONE,
                };

                if (isAnimationTransition(outgoing)) {
                    transitionEval.duration = outgoing.duration;
                    transitionEval.normalizedDuration = outgoing.relativeDuration;
                    transitionEval.exitConditionEnabled = outgoing.exitConditionEnabled;
                    transitionEval.exitCondition = outgoing.exitCondition;
                    transitionEval.destinationStart = outgoing.destinationStart;
                    transitionEval.relativeDestinationStart = outgoing.relativeDestinationStart;
                    transitionEval.interruption = outgoing.interruptionSource;
                } else if (outgoing instanceof EmptyStateTransition) {
                    transitionEval.duration = outgoing.duration;
                    transitionEval.destinationStart = outgoing.destinationStart;
                    transitionEval.relativeDestinationStart = outgoing.relativeDestinationStart;
                }

                transitionEval.conditions.forEach((conditionEval, iCondition) => {
                    const condition = outgoing.conditions[iCondition];
                    if (condition instanceof TriggerCondition && condition.trigger) {
                        // TODO: validates the existence of trigger?
                        (transitionEval.triggers ??= []).push(condition.trigger);
                    }
                });
                outgoingTransitions.push(transitionEval);
            }

            fromNode.outgoingTransitions = outgoingTransitions;
        }

        return stateMachineInfo;
    }

    /**
     * Updates this layer, return when the time piece exhausted or the graph reached exit state.
     * @param deltaTime The time piece to update.
     * @returns Remain time piece.
     */
    private _eval (deltaTime: Readonly<number>) {
        assertIsTrue(!this.exited);

        const haltOnNonMotionState = this._continueDanglingTransition();
        if (haltOnNonMotionState) {
            return 0.0;
        }

        const MAX_ITERATIONS = 100;

        let remainTimePiece = deltaTime;
        for (let continueNextIterationForce = true, // Force next iteration even remain time piece is zero
            iterations = 0;
            continueNextIterationForce || remainTimePiece > 0.0;
        ) {
            continueNextIterationForce = false;

            if (iterations === MAX_ITERATIONS) {
                warnID(14000, MAX_ITERATIONS);
                break;
            }

            ++iterations;

            // Update current transition if we're in transition.
            // If currently no transition, we simple fallthrough.
            if (this._currentTransitionPath.length > 0) {
                const transitionMatch = this._detectInterruption(remainTimePiece, interruptingTransitionMatchCache);
                if (transitionMatch) {
                    remainTimePiece -= transitionMatch.requires;
                    const ranIntoNonMotionState = this._interrupt(transitionMatch);
                    if (ranIntoNonMotionState) {
                        break;
                    }
                    continueNextIterationForce = true;
                    continue;
                }

                const currentUpdatingConsume = this._updateCurrentTransition(remainTimePiece);
                remainTimePiece -= currentUpdatingConsume;
                if (this._currentNode.kind === NodeKind.exit) {
                    break;
                }
                if (this._currentTransitionPath.length === 0) {
                    // If the update invocation finished the transition,
                    // We force restart the iteration
                    continueNextIterationForce = true;
                }
                continue;
            }

            const { _currentNode: currentNode } = this;

            const transitionMatch = this._matchCurrentNodeTransition(remainTimePiece);

            if (transitionMatch) {
                const {
                    transition,
                    requires: updateRequires,
                } = transitionMatch;

                remainTimePiece -= updateRequires;

                if (currentNode.kind === NodeKind.animation) {
                    currentNode.updateFromPort(updateRequires);
                    this._fromUpdated = true;
                }

                const ranIntoNonMotionState = this._switchTo(transition);
                if (ranIntoNonMotionState) {
                    break;
                }

                continueNextIterationForce = true;
            } else { // If no transition matched, we update current node.
                if (currentNode.kind === NodeKind.animation) {
                    currentNode.updateFromPort(remainTimePiece);
                    this._fromUpdated = true;
                    // Animation play eat all times.
                    remainTimePiece = 0.0;
                } else {
                    // Happened when firstly entered the layer's top level entry
                    // and no further transition.
                    // I'm sure conscious of it's redundant with above statement, just emphasize.
                    remainTimePiece = 0.0;
                }
                continue;
            }
        }

        if (this._fromUpdated && this._currentNode.kind === NodeKind.animation) {
            this._fromUpdated = false;
            this._currentNode.triggerFromPortUpdate(this._controller);
        }

        if (this._currentTransitionToNode && this._toUpdated && this._currentTransitionToNode.kind === NodeKind.animation) {
            this._toUpdated = false;
            this._currentTransitionToNode.triggerToPortUpdate(this._controller);
        }

        return remainTimePiece;
    }

    private _sample () {
        const {
            _currentNode: currentNode,
            _currentTransitionToNode: currentTransitionToNode,
            _fromWeight: fromWeight,
            _toWeight: toWeight,
        } = this;
        if (currentNode.kind === NodeKind.empty) {
            // If current state is empty:
            // - if there is no transition, the passthrough weight is 0.0, means this layer has no effect.
            // - otherwise,
            //   - if the destination is also empty state, it's as if no transition.
            //   - otherwise, asserts the destination to be motion state;
            //     the passthrough weight is set to the transition rate,
            //     the motion state is sampled with full weight.
            this.passthroughWeight = 0.0;
            if (currentTransitionToNode && currentTransitionToNode.kind === NodeKind.animation) {
                this.passthroughWeight = toWeight;
                currentTransitionToNode.sampleToPort(1.0);
            }
        } else if (currentTransitionToNode && currentTransitionToNode.kind === NodeKind.empty) {
            this.passthroughWeight = fromWeight;
            this._sampleSource(1.0);
        } else {
            this.passthroughWeight = 1.0;
            this._sampleSource(fromWeight);
            if (currentTransitionToNode && currentTransitionToNode.kind === NodeKind.animation) {
                currentTransitionToNode.sampleToPort(toWeight);
            }
        }
    }

    private _sampleSource (weight: number) {
        const {
            _currentNode: currentNode,
        } = this;
        if (currentNode.kind === NodeKind.animation) {
            currentNode.sampleFromPort(weight);
        } else if (currentNode.kind === NodeKind.transitionSnapshot) {
            currentNode.sample(weight);
        }
    }

    /**
     * Searches for a transition which should be performed
     * if current node update for no more than `deltaTime`.
     * @param deltaTime
     * @returns
     */
    private _matchCurrentNodeTransition (deltaTime: Readonly<number>): TransitionMatch | null {
        const currentNode = this._currentNode;

        const transitionMatch = transitionMatchCache.reset();

        this._matchTransition(
            currentNode,
            currentNode,
            deltaTime,
            null,
            transitionMatch,
        );
        if (transitionMatch.hasZeroCost()) {
            return transitionMatch;
        }

        if (currentNode.kind === NodeKind.animation) {
            this._matchAnyScoped(
                currentNode,
                deltaTime,
                transitionMatch,
            );
            if (transitionMatch.hasZeroCost()) {
                return transitionMatch;
            }
        }

        if (transitionMatch.isValid()) {
            return transitionMatch;
        }

        return null;
    }

    /**
     * Notes the real node is used:
     * - to determinate the starting state machine from where the any states are matched;
     * - so we can solve transitions' relative durations.
     */
    private _matchAnyScoped (realNode: MotionStateEval, deltaTime: number, result: TransitionMatchCache) {
        let transitionMatchUpdated = false;
        for (let ancestor: StateMachineInfo | null = realNode.stateMachine;
            ancestor !== null;
            ancestor = ancestor.parent) {
            const updated = this._matchTransition(
                ancestor.any,
                realNode,
                deltaTime,
                null,
                result,
            );
            if (updated) {
                transitionMatchUpdated = true;
            }
            if (result.hasZeroCost()) {
                break;
            }
        }
        return transitionMatchUpdated;
    }

    /**
     * Searches for a transition which should be performed
     * if specified node updates for no more than `deltaTime` and less than `result.requires`.
     * We solve the relative durations of transitions based on duration of `realNode`.
     * @returns True if a transition match is updated into the `result`.
     */
    private _matchTransition (
        node: NodeEval, realNode: NodeEval, deltaTime: Readonly<number>, except: TransitionEval | null, result: TransitionMatchCache,
    ) {
        assertIsTrue(node === realNode || node.kind === NodeKind.any);
        const { outgoingTransitions } = node;
        const nTransitions = outgoingTransitions.length;
        let resultUpdated = false;
        for (let iTransition = 0; iTransition < nTransitions; ++iTransition) {
            const transition = outgoingTransitions[iTransition];
            if (transition === except) {
                continue;
            }

            const { conditions } = transition;
            const nConditions = conditions.length;

            // Handle empty condition case.
            if (nConditions === 0) {
                if (node.kind === NodeKind.entry || node.kind === NodeKind.exit) {
                    // These kinds of transition is definitely chosen.
                    result.set(transition, 0.0);
                    resultUpdated = true;
                    break;
                }
                if (!transition.exitConditionEnabled) {
                    // Invalid transition, ignored.
                    continue;
                }
            }

            let deltaTimeRequired = 0.0;

            if (realNode.kind === NodeKind.animation && transition.exitConditionEnabled) {
                const exitTime = realNode.duration * transition.exitCondition;
                deltaTimeRequired = Math.max(exitTime - realNode.fromPortTime, 0.0);
                // Note: the >= is reasonable in compare to >: we select the first-minimal requires.
                if (deltaTimeRequired > deltaTime || deltaTimeRequired >= result.requires) {
                    continue;
                }
            }

            let satisfied = true;
            for (let iCondition = 0; iCondition < nConditions; ++iCondition) {
                const condition = conditions[iCondition];
                if (!condition.eval()) {
                    satisfied = false;
                    break;
                }
            }
            if (!satisfied) {
                continue;
            }

            if (deltaTimeRequired === 0.0) {
                // Exit condition is disabled or the exit condition is just 0.0.
                result.set(transition, 0.0);
                resultUpdated = true;
                break;
            }

            assertIsTrue(deltaTimeRequired <= result.requires);
            result.set(transition, deltaTimeRequired);
            resultUpdated = true;
        }
        return resultUpdated;
    }

    /**
     * Try switch current node or transition snapshot using specified transition.
     * @param transition The transition.
     * @returns If the transition finally ran into entry/exit state.
     */
    private _switchTo (transition: TransitionEval) {
        const { _currentTransitionPath: currentTransitionPath } = this;

        this._consumeTransition(transition);
        currentTransitionPath.push(transition);

        const motionNode = this._matchTransitionPathUntilMotion();
        if (motionNode) {
            // Apply transitions
            this._doTransitionToMotion(motionNode);
            return false;
        } else {
            return true;
        }
    }

    /**
     * Called every frame(not every iteration).
     * Returns if we ran into an entry/exit node and still no satisfied transition matched this frame.
     */
    private _continueDanglingTransition () {
        const {
            _currentTransitionPath: currentTransitionPath,
        } = this;

        const lenCurrentTransitionPath = currentTransitionPath.length;

        if (lenCurrentTransitionPath === 0) {
            return false;
        }

        const lastTransition = currentTransitionPath[lenCurrentTransitionPath - 1];
        const tailNode = lastTransition.to;

        if (tailNode.kind !== NodeKind.animation && tailNode.kind !== NodeKind.empty) {
            const motionNode = this._matchTransitionPathUntilMotion();
            if (motionNode) {
                // Apply transitions
                this._doTransitionToMotion(motionNode);
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    private _matchTransitionPathUntilMotion () {
        const {
            _currentTransitionPath: currentTransitionPath,
        } = this;

        const lenCurrentTransitionPath = currentTransitionPath.length;
        assertIsTrue(lenCurrentTransitionPath !== 0);

        const lastTransition = currentTransitionPath[lenCurrentTransitionPath - 1];
        let tailNode = lastTransition.to;
        for (; tailNode.kind !== NodeKind.animation && tailNode.kind !== NodeKind.empty;) {
            const transitionMatch = transitionMatchCache.reset();
            this._matchTransition(
                tailNode,
                tailNode,
                0.0,
                null,
                transitionMatch,
            );
            if (!transitionMatch.transition) {
                break;
            }
            const transition = transitionMatch.transition;
            this._consumeTransition(transition);
            currentTransitionPath.push(transition);
            tailNode = transition.to;
        }

        return tailNode.kind === NodeKind.animation || tailNode.kind === NodeKind.empty ? tailNode : null;
    }

    private _consumeTransition (transition: TransitionEval) {
        const { to } = transition;

        if (to.kind === NodeKind.entry) {
            // We're entering a state machine
            this._callEnterMethods(to);
        }
    }

    private _resetTriggersAlongThePath () {
        const { _currentTransitionPath: currentTransitionPath } = this;

        const nTransitions = currentTransitionPath.length;
        for (let iTransition = 0; iTransition < nTransitions; ++iTransition) {
            const transition = currentTransitionPath[iTransition];
            this._resetTriggersOnTransition(transition);
        }
    }

    private _doTransitionToMotion (targetNode: MotionStateEval | EmptyStateEval) {
        const {
            _currentTransitionPath: currentTransitionPath,
        } = this;

        assertIsTrue(currentTransitionPath.length !== 0);

        // Reset triggers
        this._resetTriggersAlongThePath();

        this._transitionProgress = 0.0;
        this._currentTransitionToNode = targetNode;
        this._toUpdated = false;

        if (targetNode.kind === NodeKind.animation) {
            const {
                destinationStart,
                relativeDestinationStart,
            } = currentTransitionPath[0];
            const destinationStartRatio = relativeDestinationStart
                ? destinationStart
                : targetNode.duration === 0
                    ? 0.0
                    : destinationStart / targetNode.duration;
            targetNode.resetToPort(destinationStartRatio);
        }
        this._callEnterMethods(targetNode);
    }

    /**
     * Update current transition.
     * Asserts: `!!this._currentTransition`.
     * @param deltaTime Time piece.
     * @returns
     */
    private _updateCurrentTransition (deltaTime: number) {
        const {
            _currentTransitionPath: currentTransitionPath,
            _currentTransitionToNode: currentTransitionToNode,
        } = this;

        assertIsNonNullable(currentTransitionPath.length > 0);
        assertIsNonNullable(currentTransitionToNode);

        const currentTransition = currentTransitionPath[0];

        const {
            duration: transitionDuration,
            normalizedDuration,
        } = currentTransition;

        const fromNode = this._currentNode;
        const toNode = currentTransitionToNode;

        let contrib = 0.0;
        let ratio = 0.0;
        if (transitionDuration <= 0) {
            contrib = 0.0;
            ratio = 1.0;
        } else {
            assertIsTrue(fromNode.kind === NodeKind.animation || fromNode.kind === NodeKind.empty || fromNode.kind === NodeKind.transitionSnapshot);
            const { _transitionProgress: transitionProgress } = this;
            const durationSeconds = fromNode.kind === NodeKind.empty
                ? transitionDuration
                : normalizedDuration
                    ? transitionDuration * (fromNode.kind === NodeKind.animation ? fromNode.duration : fromNode.first.duration)
                    : transitionDuration;
            const progressSeconds = transitionProgress * durationSeconds;
            const remain = durationSeconds - progressSeconds;
            assertIsTrue(remain >= 0.0);
            contrib = Math.min(remain, deltaTime);
            ratio = this._transitionProgress = (progressSeconds + contrib) / durationSeconds;
            assertIsTrue(ratio >= 0.0 && ratio <= 1.0);
        }

        const toNodeName = toNode?.name ?? '<Empty>';

        this._fromWeight = (1.0 - ratio);
        this._toWeight = ratio;

        const shouldUpdatePorts = contrib !== 0;
        const hasFinished = ratio === 1.0;

        if (fromNode.kind === NodeKind.animation && shouldUpdatePorts) {
            fromNode.updateFromPort(contrib);
            this._fromUpdated = true;
        }

        if (toNode.kind === NodeKind.animation && shouldUpdatePorts) {
            toNode.updateToPort(contrib);
            this._toUpdated = true;
        }

        if (hasFinished) {
            // Transition done.
            this._finishCurrentTransition();
        }

        return contrib;
    }

    private _finishCurrentTransition () {
        const {
            _currentTransitionPath: currentTransitionPath,
            _currentTransitionToNode: currentTransitionToNode,
        } = this;

        assertIsNonNullable(currentTransitionPath.length > 0);
        assertIsNonNullable(currentTransitionToNode);

        const fromNode = this._currentNode;
        const toNode = currentTransitionToNode;

        this._callExitMethods(fromNode);
        // Exiting overrides the updating
        // Processed below.
        // this._fromUpdated = false;
        const { _currentTransitionPath: transitions } = this;
        const nTransition = transitions.length;
        for (let iTransition = 0; iTransition < nTransition; ++iTransition) {
            const { to } = transitions[iTransition];
            if (to.kind === NodeKind.exit) {
                this._callExitMethods(to);
            }
        }
        this._fromUpdated = this._toUpdated;
        this._toUpdated = false;
        this._dropCurrentTransition();
        this._currentNode = toNode;
        if (fromNode.kind === NodeKind.transitionSnapshot) {
            fromNode.clear();
        }
    }

    private _dropCurrentTransition () {
        const {
            _currentTransitionToNode: currentTransitionToNode,
        } = this;
        assertIsNonNullable(currentTransitionToNode);
        if (currentTransitionToNode.kind === NodeKind.animation) {
            currentTransitionToNode.finishTransition();
        }
        this._currentTransitionToNode = null;
        this._currentTransitionPath.length = 0;
        // Make sure we won't suffer from precision problem
        this._fromWeight = 1.0;
        this._toWeight = 0.0;
    }

    private _detectInterruption (remainTimePiece: number, result: InterruptingTransitionMatchCache): InterruptingTransitionMatch | null {
        const {
            _currentTransitionPath: currentTransitionPath,
            _currentNode: currentNode,
            _currentTransitionToNode: currentTransitionToNode,
        } = this;

        if (currentNode.kind !== NodeKind.animation
            && currentNode.kind !== NodeKind.transitionSnapshot) {
            return null;
        }

        if (!currentTransitionToNode
            || currentTransitionToNode.kind !== NodeKind.animation) {
            return null;
        }

        assertIsTrue(currentTransitionPath.length !== 0);
        const currentTransition = currentTransitionPath[0];
        const { interruption } = currentTransition;
        if (interruption === TransitionInterruptionSource.NONE) {
            return null;
        }

        const transitionMatch = transitionMatchCache.reset();
        let transitionMatchSource: MotionStateEval | null = null;

        // We have to decide what to be used as unit 1
        // to interpret the relative transition duration.
        const anyTransitionMeasureBaseState = currentNode.kind === NodeKind.animation
            ? currentNode
            : currentNode.first;
        let transitionMatchUpdated = this._matchAnyScoped(
            anyTransitionMeasureBaseState,
            remainTimePiece,
            transitionMatch,
        );
        if (transitionMatchUpdated) {
            transitionMatchSource = anyTransitionMeasureBaseState; // TODO: shall be any?
        }
        if (transitionMatch.hasZeroCost()) {
            // TODO
        }

        const motion0: MotionStateEval                = interruption === TransitionInterruptionSource.CURRENT_STATE
                || interruption === TransitionInterruptionSource.CURRENT_STATE_THEN_NEXT_STATE
            ? getInterruptionSourceMotion(currentNode)
            : currentTransitionToNode;
        transitionMatchUpdated = this._matchTransition(
            motion0,
            motion0,
            remainTimePiece,
            currentTransition,
            transitionMatch,
        );
        if (transitionMatchUpdated) {
            transitionMatchSource = motion0;
        }
        if (transitionMatch.hasZeroCost()) {
            // TODO
        }

        const motion1 = interruption === TransitionInterruptionSource.NEXT_STATE_THEN_CURRENT_STATE ? getInterruptionSourceMotion(currentNode)
            : interruption === TransitionInterruptionSource.CURRENT_STATE_THEN_NEXT_STATE ? currentTransitionToNode
                : null;
        if (motion1) {
            transitionMatchUpdated = this._matchTransition(
                motion1,
                motion1,
                remainTimePiece,
                currentTransition,
                transitionMatch,
            );
            if (transitionMatchUpdated) {
                transitionMatchSource = motion1;
            }
            if (transitionMatch.hasZeroCost()) {
                // TODO
            }
        }

        if (transitionMatchCache.transition) {
            assertIsNonNullable(transitionMatchSource);
            return result.set(
                transitionMatchSource,
                transitionMatchCache.transition,
                transitionMatchCache.requires,
            );
        }

        return null;
    }

    /**
     * Important: `transitionSource` may not be `this._currentNode`.
     */
    private _interrupt ({
        from: transitionSource,
        transition,
        requires: transitionRequires,
    }: InterruptingTransitionMatch) {
        const {
            _currentNode: currentNode,
        } = this;
        assertIsTrue(currentNode.kind === NodeKind.animation || currentNode.kind === NodeKind.transitionSnapshot);
        // If we're interrupting motion->*,
        // we update the motion then do the first enqueue to transition snapshot.
        if (currentNode.kind === NodeKind.animation) {
            currentNode.updateFromPort(transitionRequires);
            this._fromUpdated = true;

            const { _transitionSnapshot: transitionSnapshot } = this;
            assertIsTrue(transitionSnapshot.empty);
            transitionSnapshot.enqueue(currentNode, 1.0);
        }
        this._takeCurrentTransitionSnapshot(transitionSource);
        this._dropCurrentTransition();
        // Install the snapshot as "current"
        this._currentNode = this._transitionSnapshot;
        const ranIntoNonMotionState = this._switchTo(transition);
        return ranIntoNonMotionState;
    }

    /**
     * A thing to note is `transitionSource` may not be `this._currentNode`.
     */
    private _takeCurrentTransitionSnapshot (transitionSource: MotionStateEval) {
        const {
            _currentTransitionPath: currentTransitionPath,
            _currentTransitionToNode: currentTransitionToNode,
            _transitionSnapshot: transitionSnapshot,
        } = this;

        assertIsTrue(currentTransitionPath.length !== 0);
        assertIsTrue(currentTransitionToNode && currentTransitionToNode.kind === NodeKind.animation);

        const currentTransition = currentTransitionPath[0];

        const {
            duration: transitionDuration,
            normalizedDuration,
        } = currentTransition;

        const fromNode = transitionSource;
        let ratio = 0.0;
        if (transitionDuration <= 0) {
            ratio = 1.0;
        } else {
            const { _transitionProgress: transitionProgress } = this;
            const durationSeconds = normalizedDuration ? transitionDuration * fromNode.duration : transitionDuration;
            const progressSeconds = transitionProgress * durationSeconds;
            const remain = durationSeconds - progressSeconds;
            assertIsTrue(remain >= 0.0);
            ratio = progressSeconds / durationSeconds;
            assertIsTrue(ratio >= 0.0 && ratio <= 1.0);
        }

        transitionSnapshot.enqueue(currentTransitionToNode, ratio);
    }

    private _resetTriggersOnTransition (transition: TransitionEval) {
        const { triggers } = transition;
        if (triggers) {
            const nTriggers = triggers.length;
            for (let iTrigger = 0; iTrigger < nTriggers; ++iTrigger) {
                const trigger = triggers[iTrigger];
                this._resetTrigger(trigger);
            }
        }
    }

    private _resetTrigger (name: string) {
        const { _triggerReset: triggerResetFn } = this;
        triggerResetFn(name);
    }

    private _callEnterMethods (node: NodeEval) {
        const { _controller: controller } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.animation: {
            node.components.callMotionStateEnterMethods(controller, node.getToPortStatus());
            break;
        }
        case NodeKind.entry:
            node.stateMachine.components?.callStateMachineEnterMethods(controller);
            break;
        }
    }

    private _callExitMethods (node: NodeEval) {
        const { _controller: controller } = this;
        switch (node.kind) {
        default:
            break;
        case NodeKind.animation: {
            node.components.callMotionStateExitMethods(controller, node.getFromPortStatus());
            break;
        }
        case NodeKind.exit:
            node.stateMachine.components?.callStateMachineExitMethods(controller);
            break;
        }
    }
}

/**
 * Gets the motion of current motion state or transition snapshot
 * whose outgoing transitions, called "interruption source", will be inspected to
 * detect the interrupting transition.
 */
function getInterruptionSourceMotion (state: MotionStateEval | TransitionSnapshotEval) {
    // If current state is a motion state, then it's the result.
    // Otherwise the current state is a transition snapshot --
    // we support nested interruptions, eg,
    // _A->B_ was interrupted by _B->C_,
    // then _(A->B)->C_ can be interrupted further by _C->D_.
    // In such cases, we need to decide which transition could interrupt _(A->B)->C_.
    // Outgoing transitions from destination motion are always inspected.
    // And as the code following suggested, we order that:
    // outgoing transitions from **the first** motion of "current transition snapshot"
    // are also inspected. No other transitions are considered.
    // This means for instance, in above example,
    // _(A->B)->C_ can and can only be further interrupted by:
    // - _A->D_, since it's outgoing from _A_;
    // - _C->D_, since it's outgoing from _D_.
    // However it can not be interrupted by _B->C_.
    //
    // > Tip: The term "nested interruption" was taken from here:
    // > https://stackoverflow.com/a/24128928
    return state.kind === NodeKind.animation ? state : state.first;
}

function createStateStatusCache (): MotionStateStatus {
    return {
        progress: 0.0,
    };
}

const emptyClipStatusesIterator: Readonly<Iterator<ClipStatus>> = Object.freeze({
    next (..._args: [] | [undefined]): IteratorResult<ClipStatus> {
        return {
            done: true,
            value: undefined,
        };
    },
});

const emptyClipStatusesIterable: Iterable<ClipStatus> = Object.freeze({
    [Symbol.iterator] () {
        return emptyClipStatusesIterator;
    },
});

interface TransitionMatch {
    /**
     * The matched result.
     */
    transition: TransitionEval;

    /**
     * The after after which the transition can happen.
     */
    requires: number;
}

interface InterruptingTransitionMatch extends TransitionMatch {
    from: MotionStateEval;
}

class TransitionMatchCache {
    public transition: TransitionMatch['transition'] | null = null;

    public requires = Infinity;

    public hasZeroCost (): this is TransitionMatch {
        return this.requires === 0;
    }

    public isValid (): this is TransitionMatch {
        return this.transition !== null;
    }

    public set (transition: TransitionMatch['transition'], requires: number) {
        this.transition = transition;
        this.requires = requires;
        return this;
    }

    public reset () {
        this.requires = Infinity;
        this.transition = null;
        return this;
    }
}

const transitionMatchCache = new TransitionMatchCache();

class InterruptingTransitionMatchCache {
    public transition: TransitionMatch['transition'] | null = null;

    public requires = 0.0;

    public from: InterruptingTransitionMatch['from'] | null = null;

    public set (from: MotionStateEval, transition: TransitionMatch['transition'], requires: number) {
        this.from = from;
        this.transition = transition;
        this.requires = requires;
        return this as InterruptingTransitionMatch;
    }
}

const interruptingTransitionMatchCache = new InterruptingTransitionMatchCache();

enum NodeKind {
    entry, exit, any, animation,
    empty,
    transitionSnapshot,
}

export class StateEval {
    /**
     * @internal
     */
    public declare __DEBUG_ID__?: string;

    public declare stateMachine: StateMachineInfo;

    constructor (node: { name: string }) {
        this.name = node.name;
    }

    public readonly name: string;

    public outgoingTransitions: readonly TransitionEval[] = [];
}

type StateMachineComponentMotionStateCallbackName = keyof Pick<
StateMachineComponent,
'onMotionStateEnter' | 'onMotionStateExit' | 'onMotionStateUpdate'
>;

type StateMachineComponentStateMachineCallbackName = keyof Pick<
StateMachineComponent,
'onStateMachineEnter' | 'onStateMachineExit'
>;

class InstantiatedComponents {
    constructor (node: InteractiveState) {
        this._components = node.instantiateComponents();
    }

    public callMotionStateEnterMethods (controller: AnimationController, status: Readonly<MotionStateStatus>) {
        this._callMotionStateCallbackIfNonDefault('onMotionStateEnter', controller, status);
    }

    public callMotionStateUpdateMethods (controller: AnimationController, status: Readonly<MotionStateStatus>) {
        this._callMotionStateCallbackIfNonDefault('onMotionStateUpdate', controller, status);
    }

    public callMotionStateExitMethods (controller: AnimationController, status: Readonly<MotionStateStatus>) {
        this._callMotionStateCallbackIfNonDefault('onMotionStateExit', controller, status);
    }

    public callStateMachineEnterMethods (controller: AnimationController) {
        this._callStateMachineCallbackIfNonDefault('onStateMachineEnter', controller);
    }

    public callStateMachineExitMethods (controller: AnimationController) {
        this._callStateMachineCallbackIfNonDefault('onStateMachineExit', controller);
    }

    private declare _components: StateMachineComponent[];

    private _callMotionStateCallbackIfNonDefault<
        TMethodName extends StateMachineComponentMotionStateCallbackName
    > (
        methodName: TMethodName,
        controller: AnimationController,
        status: MotionStateStatus,
    ) {
        const { _components: components } = this;
        const nComponents = components.length;
        for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
            const component = components[iComponent];
            if (component[methodName] !== StateMachineComponent.prototype[methodName]) {
                component[methodName](controller, status);
            }
        }
    }

    private _callStateMachineCallbackIfNonDefault<
        TMethodName extends StateMachineComponentStateMachineCallbackName
    > (
        methodName: TMethodName,
        controller: AnimationController,
    ) {
        const { _components: components } = this;
        const nComponents = components.length;
        for (let iComponent = 0; iComponent < nComponents; ++iComponent) {
            const component = components[iComponent];
            if (component[methodName] !== StateMachineComponent.prototype[methodName]) {
                component[methodName](controller);
            }
        }
    }
}

interface StateMachineInfo {
    parent: StateMachineInfo | null;
    entry: NodeEval;
    exit: NodeEval;
    any: NodeEval;
    components: InstantiatedComponents | null;
}

export class MotionStateEval extends StateEval {
    constructor (node: MotionState, context: LayerContext) {
        super(node);

        this._baseSpeed = node.speed;
        this._setSpeedMultiplier(1.0);

        if (node.speedMultiplierEnabled && node.speedMultiplier) {
            const speedMultiplierVarName = node.speedMultiplier;
            const varInstance = context.getVar(speedMultiplierVarName);
            if (validateVariableExistence(varInstance, speedMultiplierVarName)) {
                validateVariableType(varInstance.type, VariableType.FLOAT, speedMultiplierVarName);
                varInstance.bind(this._setSpeedMultiplier, this);
                const initialSpeedMultiplier = varInstance.value as number;
                this._setSpeedMultiplier(initialSpeedMultiplier);
            }
        }

        const sourceEvalContext: MotionEvalContext = {
            ...context,
        };
        const sourceEval = node.motion?.[createEval](sourceEvalContext) ?? null;
        if (sourceEval) {
            Object.defineProperty(sourceEval, '__DEBUG_ID__', { value: this.name });
        }
        this._source = sourceEval;
        this.components = new InstantiatedComponents(node);
    }

    public readonly kind = NodeKind.animation;

    public declare components: InstantiatedComponents;

    get duration () {
        return this._source?.duration ?? 0.0;
    }

    get fromPortTime () {
        return this._fromPort.progress * this.duration;
    }

    public updateFromPort (deltaTime: number) {
        this._fromPort.progress = calcProgressUpdate(
            this._fromPort.progress,
            this.duration,
            deltaTime * this._speed,
        );
    }

    public updateToPort (deltaTime: number) {
        if (DEBUG) {
            // See `this.finishTransition()`
            assertIsTrue(!Number.isNaN(this._toPort.progress));
        }
        this._toPort.progress = calcProgressUpdate(
            this._toPort.progress,
            this.duration,
            deltaTime * this._speed,
        );
    }

    public triggerFromPortUpdate (controller: AnimationController) {
        this.components.callMotionStateUpdateMethods(controller, this.getFromPortStatus());
    }

    public triggerToPortUpdate (controller: AnimationController) {
        this.components.callMotionStateUpdateMethods(controller, this.getToPortStatus());
    }

    public getFromPortStatus (): Readonly<MotionStateStatus> {
        const { statusCache: stateStatus } = this._fromPort;
        if (DEBUG) {
            stateStatus.__DEBUG_ID__ = this.name;
        }
        stateStatus.progress = normalizeProgress(this._fromPort.progress);
        return stateStatus;
    }

    public getToPortStatus (): Readonly<MotionStateStatus> {
        if (DEBUG) {
            // See `this.finishTransition()`
            assertIsTrue(!Number.isNaN(this._toPort.progress));
        }
        const { statusCache: stateStatus } = this._toPort;
        if (DEBUG) {
            stateStatus.__DEBUG_ID__ = this.name;
        }
        stateStatus.progress = normalizeProgress(this._toPort.progress);
        return stateStatus;
    }

    public resetToPort (at: number) {
        this._toPort.progress = at;
    }

    public finishTransition () {
        this._fromPort.progress = this._toPort.progress;
        if (DEBUG) {
            // Well, this statement exists for debugging purpose.
            // Once the transition was finished, this method is called to
            // switch this motion from "target" to "source".
            // After, this motion can no longer be used as "target"
            // unless `this.resetToPort()` is called.
            // Let's set progress of this motion's "to port" to NaN,
            // to catch such a violation.
            this._toPort.progress = Number.NaN;
        }
    }

    public sampleFromPort (weight: number) {
        this._source?.sample(this._fromPort.progress, weight);
    }

    public sampleToPort (weight: number) {
        if (DEBUG) {
            // See `this.finishTransition()`
            assertIsTrue(!Number.isNaN(this._toPort.progress));
        }
        this._source?.sample(this._toPort.progress, weight);
    }

    public getClipStatuses (baseWeight: number): Iterable<ClipStatus> {
        const { _source: source } = this;
        if (!source) {
            return emptyClipStatusesIterable;
        } else {
            return {
                [Symbol.iterator]: () => source.getClipStatuses(baseWeight),
            };
        }
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap, context: OverrideClipContext) {
        this._source?.overrideClips(overrides, context);
    }

    private _source: MotionEval | null = null;
    private _baseSpeed = 1.0;
    private _speed = 1.0;
    private _fromPort: MotionEvalPort = {
        progress: 0.0,
        statusCache: createStateStatusCache(),
    };
    private _toPort: MotionEvalPort = {
        progress: 0.0,
        statusCache: createStateStatusCache(),
    };

    private _setSpeedMultiplier (value: number) {
        this._speed = this._baseSpeed * value;
    }
}

function calcProgressUpdate (currentProgress: number, duration: number, deltaTime: number) {
    if (duration === 0.0) {
        // TODO?
        return 0.0;
    }
    const progress = currentProgress + deltaTime / duration;
    return progress;
}

function normalizeProgress (progress: number) {
    const signedFrac = progress - Math.trunc(progress);
    return signedFrac >= 0.0 ? signedFrac : (1.0 + signedFrac);
}

interface MotionEvalPort {
    progress: number;
    statusCache: MotionStateStatus;
}

export class SpecialStateEval extends StateEval {
    constructor (node: State, kind: SpecialStateEval['kind'], name: string) {
        super(node);
        this.kind = kind;
    }

    public readonly kind: NodeKind.entry | NodeKind.exit | NodeKind.any;
}

export class EmptyStateEval extends StateEval {
    public readonly kind = NodeKind.empty;

    constructor (node: State) {
        super(node);
    }
}

class QueuedMotion {
    constructor (public motion: MotionStateEval, public weight: number) {
    }
}

class TransitionSnapshotEval extends StateEval {
    public readonly kind = NodeKind.transitionSnapshot;

    constructor () {
        super({ name: `[[TransitionSnapshotEval]]` });
    }

    get empty () {
        return this._queue.length === 0;
    }

    get first () {
        const { _queue: queue } = this;
        assertIsTrue(queue.length > 0);
        return queue[0].motion;
    }

    public sample (weight: number) {
        const { _queue: queue } = this;
        const nQueue = queue.length;
        for (let iQueuedMotions = 0; iQueuedMotions < nQueue; ++iQueuedMotions) {
            const {
                motion,
                weight: snapshotWeight,
            } = queue[iQueuedMotions];
            // Here implies: motions added to snapshot should have been switched from "target" to "source".
            motion.sampleFromPort(snapshotWeight * weight);
        }
    }

    public clear () {
        this._queue.length = 0;
    }

    public enqueue (state: MotionStateEval, weight: number) {
        const { _queue: queue } = this;
        const nQueue = queue.length;
        const complementWeight = 1.0 - weight;
        for (let iQueuedMotions = 0; iQueuedMotions < nQueue; ++iQueuedMotions) {
            queue[iQueuedMotions].weight *= complementWeight;
        }
        queue.push(new QueuedMotion(state, weight));
    }

    private _queue: QueuedMotion[] = [];
}

export type NodeEval = MotionStateEval | SpecialStateEval | EmptyStateEval | TransitionSnapshotEval;

interface TransitionEval {
    to: NodeEval;
    duration: number;
    normalizedDuration: boolean;
    conditions: ConditionEval[];
    exitConditionEnabled: boolean;
    exitCondition: number;
    destinationStart: number;
    relativeDestinationStart: boolean;
    /**
     * Bound triggers, once this transition satisfied. All triggers would be reset.
     */
    triggers: string[] | undefined;
    interruption: TransitionInterruptionSource;
}

export type { VarInstance } from './variable';
