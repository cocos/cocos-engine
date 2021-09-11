import { ccclass, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { remove, removeAt, removeIf } from '../../utils/array';
import { assertIsNonNullable, assertIsTrue } from '../../data/utils/asserts';
import { Pose, PoseEval, PoseEvalContext } from './pose';
import type { Condition } from './condition';
import { Asset } from '../../assets';
import { OwnedBy, assertsOwnedBy, own, markAsDangling, ownerSymbol } from './ownership';
import { Value } from './variable';
import { InvalidTransitionError } from './errors';
import { createEval } from './create-eval';
import { PoseNode } from './pose-node';
import { GraphNode, outgoingsSymbol, incomingsSymbol } from './graph-node';
import { SkeletonMask } from '../skeleton-mask';
import { EditorExtendable } from '../../data/editor-extendable';
import { array } from '../../utils/js';
import { move } from '../../algorithm/move';
import { onAfterDeserializedTag } from '../../data/deserialize-symbols';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

export { GraphNode };

@ccclass(`${CLASS_NAME_PREFIX_ANIM}Transition`)
class Transition extends EditorExtendable implements OwnedBy<PoseSubgraph>, Transition {
    declare [ownerSymbol]: PoseSubgraph | undefined;

    /**
     * The transition source.
     */
    @serializable
    public from: GraphNode;

    /**
     * The transition target.
     */
    @serializable
    public to: GraphNode;

    /**
     * The transition condition.
     */
    @serializable
    public conditions: Condition[] = [];

    /**
     * @internal
     */
    constructor (from: GraphNode, to: GraphNode, conditions?: Condition[]) {
        super();
        this.from = from;
        this.to = to;
        if (conditions) {
            this.conditions = conditions;
        }
    }

    [ownerSymbol]: PoseSubgraph | undefined;
}

type TransitionView = Omit<Transition, 'from' | 'to'> & {
    readonly from: Transition['from'];
    readonly to: Transition['to'];
};

export type { TransitionView as Transition };

export type TransitionInternal = Transition;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseTransition`)
class PoseTransition extends Transition {
    @serializable
    public duration = 0.3;

    @serializable
    public exitConditionEnabled = true;

    get exitCondition () {
        return this._exitCondition;
    }

    set exitCondition (value) {
        assertIsTrue(value >= 0.0);
        this._exitCondition = value;
    }

    @serializable
    private _exitCondition = 1.0;
}

type PoseTransitionView = Omit<PoseTransition, 'from' | 'to'> & {
    readonly from: PoseTransition['from'];
    readonly to: PoseTransition['to'];
};

export type { PoseTransition };

export function isPoseTransition (transition: TransitionView): transition is PoseTransitionView {
    return transition instanceof PoseTransition;
}

@ccclass('cc.animation.PoseSubgraph')
export class PoseSubgraph extends GraphNode implements OwnedBy<Layer | PoseSubgraph> {
    [ownerSymbol]: Layer | PoseSubgraph | undefined;

    @serializable
    private _nodes: GraphNode[] = [];

    @serializable
    private _transitions: Transition[] = [];

    @serializable
    private _entryNode: GraphNode;

    @serializable
    private _exitNode: GraphNode;

    @serializable
    private _anyNode: GraphNode;

    /**
     * @internal
     */
    constructor () {
        super();
        this._entryNode = this._addNode(new GraphNode());
        this._entryNode.name = 'Entry';
        this._exitNode = this._addNode(new GraphNode());
        this._exitNode.name = 'Exit';
        this._anyNode = this._addNode(new GraphNode());
        this._anyNode.name = 'Any';
    }

    public [onAfterDeserializedTag] () {
        this._nodes.forEach((node) => own(node, this));
        this._transitions.forEach((transition) => {
            transition.from[outgoingsSymbol].push(transition);
            transition.to[incomingsSymbol].push(transition);
        });
    }

    [createEval] (context: PoseEvalContext): PoseEval | null {
        throw new Error('Method not implemented.');
    }

    /**
     * The entry node.
     */
    get entryNode () {
        return this._entryNode;
    }

    /**
     * The exit node.
     */
    get exitNode () {
        return this._exitNode;
    }

    /**
     * The any node.
     */
    get anyNode () {
        return this._anyNode;
    }

    /**
     * Gets an iterator to all nodes within this graph.
     * @returns The iterator.
     */
    public nodes (): Iterable<GraphNode> {
        return this._nodes;
    }

    /**
     * Gets an iterator to all transitions within this graph.
     * @returns The iterator.
     */
    public transitions (): Iterable<Transition> {
        return this._transitions;
    }

    /**
     * Gets the transition between specified nodes.
     * @param from Transition source.
     * @param to Transition target.
     * @returns The transition, if one existed.
     */
    public getTransition (from: GraphNode, to: GraphNode): Transition | undefined {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);
        return from[outgoingsSymbol].find((transition) => transition.to === to);
    }

    /**
     * Gets all outgoing transitions of specified node.
     * @param to The node.
     * @returns Result transitions.
     */
    public getOutgoings (from: GraphNode): Iterable<Transition> {
        assertsOwnedBy(from, this);
        return from[outgoingsSymbol];
    }

    /**
     * Gets all incoming transitions of specified node.
     * @param to The node.
     * @returns Result transitions.
     */
    public getIncomings (to: GraphNode): Iterable<Transition> {
        assertsOwnedBy(to, this);
        return to[incomingsSymbol];
    }

    /**
     * Adds a pose node into this subgraph.
     * @returns The newly created pose node.
     */
    public addPoseNode (): PoseNode {
        return this._addNode(new PoseNode());
    }

    /**
     * Adds a subgraph into this subgraph.
     * @returns The newly created subgraph.
     */
    public addSubgraph (): PoseSubgraph {
        return this._addNode(new PoseSubgraph());
    }

    /**
     * Removes specified node from this subgraph.
     * @param node The node to remove.
     */
    public remove (node: GraphNode) {
        assertsOwnedBy(node, this);

        if (node === this.entryNode
            || node === this.exitNode
            || node === this.anyNode) {
            return;
        }

        this.eraseTransitionsIncludes(node);
        remove(this._nodes, node);

        markAsDangling(node);
    }

    /**
     * Connect two nodes.
     * @param from Source node.
     * @param to Target node.
     * @param condition The transition condition.
     */
    public connect (from: PoseNode, to: GraphNode, conditions?: Condition[]): PoseTransitionView;

    /**
     * Connect two nodes.
     * @param from Source node.
     * @param to Target node.
     * @param condition The transition condition.
     * @throws `InvalidTransitionError` if:
     * - the target node is entry or any, or
     * - the source node is exit.
     */
    public connect (from: GraphNode, to: GraphNode, conditions?: Condition[]): TransitionView;

    public connect (from: GraphNode, to: GraphNode, conditions?: Condition[]): TransitionView {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);

        if (to === this.entryNode) {
            throw new InvalidTransitionError('to-entry');
        }
        if (to === this.anyNode) {
            throw new InvalidTransitionError('to-any');
        }
        if (from === this.exitNode) {
            throw new InvalidTransitionError('from-exit');
        }

        this.disconnect(from, to);

        const transition = from instanceof PoseNode
            ? new PoseTransition(from, to, conditions)
            : new Transition(from, to, conditions);

        own(transition, this);
        this._transitions.push(transition);
        from[outgoingsSymbol].push(transition);
        to[incomingsSymbol].push(transition);

        return transition;
    }

    public disconnect (from: GraphNode, to: GraphNode) {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);

        const oTransitions = from[outgoingsSymbol];
        for (let iOTransition = 0; iOTransition < oTransitions.length; ++iOTransition) {
            const oTransition = oTransitions[iOTransition];
            if (oTransition.to === to) {
                assertIsTrue(
                    remove(this._transitions, oTransition),
                );
                removeAt(oTransitions, iOTransition);
                assertIsNonNullable(
                    removeIf(to[incomingsSymbol], (transition) => transition === oTransition),
                );
                markAsDangling(oTransition);
                break;
            }
        }
    }

    public eraseOutgoings (from: GraphNode) {
        assertsOwnedBy(from, this);

        const oTransitions = from[outgoingsSymbol];
        for (let iOTransition = 0; iOTransition < oTransitions.length; ++iOTransition) {
            const oTransition = oTransitions[iOTransition];
            const to = oTransition.to;
            assertIsTrue(
                remove(this._transitions, oTransition),
            );
            assertIsNonNullable(
                removeIf(to[incomingsSymbol], (transition) => transition === oTransition),
            );
            markAsDangling(oTransition);
        }
        oTransitions.length = 0;
    }

    public eraseIncomings (to: GraphNode) {
        assertsOwnedBy(to, this);

        const iTransitions = to[incomingsSymbol];
        for (let iITransition = 0; iITransition < iTransitions.length; ++iITransition) {
            const iTransition = iTransitions[iITransition];
            const from = iTransition.from;
            assertIsTrue(
                remove(this._transitions, iTransition),
            );
            assertIsNonNullable(
                removeIf(from[outgoingsSymbol], (transition) => transition === iTransition),
            );
            markAsDangling(iTransition);
        }
        iTransitions.length = 0;
    }

    public eraseTransitionsIncludes (node: GraphNode) {
        this.eraseIncomings(node);
        this.eraseOutgoings(node);
    }

    private _addNode<T extends GraphNode> (node: T) {
        own(node, this);
        this._nodes.push(node);
        return node;
    }
}

@ccclass('cc.animation.Layer')
export class Layer implements OwnedBy<PoseGraph> {
    [ownerSymbol]: PoseGraph | undefined;

    @serializable
    private _graph!: PoseSubgraph;

    @serializable
    public name: string = '';

    @serializable
    public weight = 1.0;

    @serializable
    public mask: SkeletonMask | null = null;

    @serializable
    public blending: LayerBlending = LayerBlending.additive;

    /**
     * @internal
     */
    constructor () {
        this._graph = new PoseSubgraph();
    }

    get graph () {
        return this._graph;
    }
}

export enum LayerBlending {
    override,
    additive,
}

export enum VariableType {
    NUMBER,

    BOOLEAN,

    TRIGGER,
}

@ccclass('cc.animation.Variable')
export class Variable {
    // TODO: we should not specify type here but due to de-serialization limitation
    // See: https://github.com/cocos-creator/3d-tasks/issues/7909
    @serializable
    private _type: VariableType = VariableType.NUMBER;

    // Same as `_type`
    @serializable
    private _value: Value = 0.0;

    constructor (type?: VariableType) {
        if (typeof type === 'undefined') {
            return;
        }

        this._type = type;
        switch (type) {
        default:
            break;
        case VariableType.NUMBER:
            this._value = 0.0;
            break;
        case VariableType.BOOLEAN:
        case VariableType.TRIGGER:
            this._value = false;
            break;
        }
    }

    get type () {
        return this._type;
    }

    get value () {
        return this._value;
    }

    set value (value) {
        if (DEBUG) {
            switch (this._type) {
            default:
                break;
            case VariableType.NUMBER:
                assertIsTrue(typeof value === 'number');
                break;
            case VariableType.BOOLEAN:
                assertIsTrue(typeof value === 'boolean');
                break;
            }
        }
        this._value = value;
    }
}

@ccclass('cc.animation.PoseGraph')
export class PoseGraph extends Asset {
    @serializable
    private _layers: Layer[] = [];

    @serializable
    private _variables: Record<string, Variable> = {};

    constructor () {
        super();
    }

    get layers (): readonly Layer[] {
        return this._layers;
    }

    get variables (): Iterable<[string, { type: VariableType, value: Value }]> {
        return Object.entries(this._variables);
    }

    /**
     * Adds a layer.
     * @returns The new layer.
     */
    public addLayer () {
        const layer = new Layer();
        this._layers.push(layer);
        return layer;
    }

    /**
     * Removes a layer.
     * @param index Index to the layer to remove.
     */
    public removeLayer (index: number) {
        array.removeAt(this._layers, index);
    }

    /**
     * Adjusts the layer's order.
     * @param index
     * @param newIndex
     */
    public moveLayer (index: number, newIndex: number) {
        move(this._layers, index, newIndex);
    }

    public addVariable (name: string, type: VariableType, value?: Value) {
        const variable = new Variable(type);
        if (typeof value !== 'undefined') {
            variable.value = value;
        }
        this._variables[name] = variable;
    }

    public removeVariable (name: string) {
        delete this._variables[name];
    }

    public getVariable (name: string) {
        return this._variables[name];
    }
}
