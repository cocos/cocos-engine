import { ccclass, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { remove, removeAt, removeIf } from '../../utils/array';
import { assertIsNonNullable, assertIsTrue } from '../../data/utils/asserts';
import { Pose, PoseEval, PoseEvalContext } from './pose';
import { Condition } from './condition';
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

export { GraphNode };

export interface Transition extends EditorExtendable {
    /**
     * The transition source.
     */
    readonly from: GraphNode;

    /**
     * The transition target.
     */
    readonly to: GraphNode;

    /**
     * The duration of the transition.
     */
    duration: number;

    /**
     * The transition condition.
     */
    condition: Condition | null;

    exitCondition: number;
}

@ccclass('cc.animation.TransitionInternal')
export class TransitionInternal extends EditorExtendable implements OwnedBy<PoseSubgraph>, Transition {
    declare [ownerSymbol]: PoseSubgraph | undefined;

    @serializable
    public from: GraphNode;

    @serializable
    public to: GraphNode;

    @serializable
    public condition: Condition | null;

    @serializable
    public duration = 0.3;

    @serializable
    public exitCondition = -1;

    /**
     * @internal
     */
    constructor (from: GraphNode, to: GraphNode, condition?: Condition) {
        super();
        this.from = from;
        this.to = to;
        this.condition = condition ?? null;
    }
    [ownerSymbol]: PoseSubgraph | undefined;
}

@ccclass('cc.animation.PoseSubgraph')
export class PoseSubgraph extends GraphNode implements OwnedBy<Layer | PoseSubgraph> {
    [ownerSymbol]: Layer | PoseSubgraph | undefined;

    @serializable
    private _nodes: GraphNode[] = [];

    @serializable
    private _transitions: TransitionInternal[] = [];

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

    get entryNode () {
        return this._entryNode;
    }

    get exitNode () {
        return this._exitNode;
    }

    get anyNode () {
        return this._anyNode;
    }

    public nodes (): Iterable<GraphNode> {
        return this._nodes;
    }

    public transitions (): Iterable<Transition> {
        return this._transitions;
    }

    public getTransition (from: GraphNode, to: GraphNode): Transition | undefined {
        assertsOwnedBy(from, this);
        assertsOwnedBy(to, this);
        return from[outgoingsSymbol].find((transition) => transition.to === to);
    }

    public getOutgoings (from: GraphNode): Iterable<Transition> {
        assertsOwnedBy(from, this);
        return from[outgoingsSymbol];
    }

    public getIncomings (to: GraphNode): Iterable<Transition> {
        assertsOwnedBy(to, this);
        return to[incomingsSymbol];
    }

    public add (): PoseNode {
        return this._addNode(new PoseNode());
    }

    public addSubgraph (): PoseSubgraph {
        return this._addNode(new PoseSubgraph());
    }

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
     * @param from
     * @param to
     * @param condition
     */
    public connect (from: GraphNode, to: GraphNode, condition?: Condition): Transition {
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
        const transition = new TransitionInternal(from, to, condition);
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

    get variables (): Iterable<[string, { value: Value }]> {
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
