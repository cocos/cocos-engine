
import { remove, removeAt, removeIf } from '../../utils/array';
import { assertIsNonNullable, assertIsTrue } from '../../data/utils/asserts';
import { instantiateSymbol } from './instantiate-symbol';
import { ccclass, property, string, type } from '../../data/class-decorator';
import { ccenum } from '../../value-types/enum';
import { CodeSnippet, CodeSnippetsProvider } from './code-snippets-provider';

const outgoingsSymbol = Symbol('[[Outgoing transitions]]');
const incomingsSymbol = Symbol('[[Incoming transitions]]');

export enum Operator {
    lessThan,
    greaterThan,
    lessThanOrEqualTo,
    greaterThanOrEqualTo,
    equalTo,
    notEqualTo,
}

ccenum(Operator);

@ccclass
export class ConditionTemplate {
    @property
    public code: CodeSnippet;

    constructor (code: CodeSnippet) {
        this.code = code;
    }
}

@ccclass
export class GraphNodeTemplate {
    @property
    public motion: IMotionTemplate | null = null;

    public [outgoingsSymbol]: TransitionTemplate[] = [];

    public [incomingsSymbol]: TransitionTemplate[] = [];
}

@ccclass
export class TransitionTemplate {
    @type(GraphNodeTemplate)
    public from: GraphNodeTemplate;

    @type(GraphNodeTemplate)
    public to: GraphNodeTemplate;

    @type(ConditionTemplate)
    public condition: ConditionTemplate | null = null;

    constructor (from: GraphNodeTemplate, to: GraphNodeTemplate, condition: ConditionTemplate) {
        this.from = from;
        this.to = to;
        this.condition = condition;
    }
}

export class ConditionVarTemplate {
    @string
    public name: string;

    @property
    public value: any;

    constructor (name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}

@ccclass
export class AnimationGraphTemplate {
    @type(CodeSnippetsProvider)
    public codeSnippets: CodeSnippetsProvider | null = null;

    @type([GraphNodeTemplate])
    private _nodes: GraphNodeTemplate[] = [];

    @type([ConditionVarTemplate])
    private _conditionVars: ConditionVarTemplate[] = [];

    @property
    private _entryNode: GraphNodeTemplate;

    @property
    private _existNode: GraphNodeTemplate;

    @property
    private _anyNode: GraphNodeTemplate;

    constructor () {
        this._entryNode = this.add();
        this._existNode = this.add();
        this._anyNode = this.add();
    }

    get nodes (): readonly GraphNodeTemplate[] {
        return this._nodes;
    }

    get entryNode (): Readonly<GraphNodeTemplate> {
        return this._entryNode;
    }

    get existNode (): Readonly<GraphNodeTemplate> {
        return this._existNode;
    }

    get anyNode (): Readonly<GraphNodeTemplate> {
        return this._anyNode;
    }

    get conditionVars () {
        return this._conditionVars;
    }

    public getTransitionBetween (from: GraphNodeTemplate, to: GraphNodeTemplate) {
        return from[outgoingsSymbol].find((transition) => transition.to === to);
    }

    public getOutgoings (from: GraphNodeTemplate): Iterable<TransitionTemplate> {
        return from[outgoingsSymbol];
    }

    public getIncomings (to: GraphNodeTemplate): Iterable<TransitionTemplate> {
        return to[incomingsSymbol];
    }

    public add () {
        const node = new GraphNodeTemplate();
        return node;
    }

    public remove (node: GraphNodeTemplate) {
        if (node === this.entryNode ||
            node === this.existNode ||
            node === this.anyNode) {
            return;
        }

        this.eraseTransitionsIncludes(node);
        remove(this._nodes, node);
    }

    /**
     * Connect two nodes.
     * @param from 
     * @param to 
     * @param condition 
     */
    public connect (from: GraphNodeTemplate, to: GraphNodeTemplate, condition: ConditionTemplate) {
        if (from === to) {
            return;
        }
        if (to === this.entryNode) {
            return;
        }
        if (to === this.anyNode) {
            return;
        }
        if (from === this.existNode) {
            return;
        }

        this.disconnect(from, to);
        const transition = new TransitionTemplate(from, to, condition);
        from[outgoingsSymbol].push(transition);
        to[incomingsSymbol].push(transition);
    }

    public disconnect (from: GraphNodeTemplate, to: GraphNodeTemplate) {
        const oTransitions = from[outgoingsSymbol];
        for (let iOTransition = 0; iOTransition < oTransitions.length; ++iOTransition) {
            const oTransition = oTransitions[iOTransition];
            if (oTransition.to === to) {
                removeAt(oTransitions, iOTransition);
                assertIsNonNullable(
                    removeIf(to[incomingsSymbol], (transition) => transition === oTransition));
                break;
            }
        }
    }

    public eraseOutgoings (from: GraphNodeTemplate) {
        const oTransitions = from[outgoingsSymbol];
        for (let iOTransition = 0; iOTransition < oTransitions.length; ++iOTransition) {
            const oTransition = oTransitions[iOTransition];
            const to = oTransition.to;
            assertIsNonNullable(
                removeIf(to[incomingsSymbol], (transition) => transition === oTransition));
        }
        oTransitions.length = 0;
    }

    public eraseIncomings (to: GraphNodeTemplate) {
        const iTransitions = to[incomingsSymbol];
        for (let iITransition = 0; iITransition < iTransitions.length; ++iITransition) {
            const iTransition = iTransitions[iITransition];
            const from = iTransition.from;
            assertIsNonNullable(
                removeIf(from[outgoingsSymbol], (transition) => transition === iTransition));
        }
        iTransitions.length = 0;
    }

    public eraseTransitionsIncludes (node: GraphNodeTemplate) {
        this.eraseIncomings(node);
        this.eraseOutgoings(node);
    }
}

export interface IMotionTemplate {
    [instantiateSymbol] (): IMotion;
}

export class IMotion {
    public active () {

    }

    public inactive () {

    }

    public setBaseWeight (weight: number) {

    }
}

export class AnimationGraph {
    private _template: AnimationGraphTemplate;
    private _conditionVars: Record<string, any>;
    private declare _nodes: Set<IGraphNode>;
    private _currentNode: IGraphNode;
    private _anyNode: IGraphNode;

    constructor (template: AnimationGraphTemplate) {
        this._template = template;

        this._conditionVars = {};
        template.conditionVars.forEach((conditionVarTemplate) => {
            this._conditionVars[conditionVarTemplate.name] = conditionVarTemplate.value;
        });

        const nodes = template.nodes.map((nodeTemplate): IGraphNode => {
            return {
                kind: nodeTemplate === template.entryNode ?
                    NodeKind.entry:
                    nodeTemplate === template.existNode ?
                        NodeKind.exist:
                        nodeTemplate === template.anyNode ?
                            NodeKind.any:
                            NodeKind.motion,
                motion: nodeTemplate.motion?.[instantiateSymbol]() ?? null,
                outgoingTransitions: [],
            };
        });

        for (let iNode = 0; iNode < template.nodes.length; ++iNode) {
            const nodeTemplate = template.nodes[iNode];
            const outgoingTemplates = template.getOutgoings(nodeTemplate);
            const outgoingTransitions: IOutgoingTransition[] = [];
            for (const outgoing of outgoingTemplates) {
                if (!outgoing.condition) {
                    // An empty condition means `false`.
                    continue;
                }
                const iOutgoingNode = template.nodes.findIndex((nodeTemplate) => nodeTemplate === outgoing.to);
                if (iOutgoingNode < 0) {
                    assertIsTrue(false, "Bad animation data");
                    continue;
                }
                const condition = outgoing.condition.code.get().bind(this._conditionVars);
                const outgoingTransition: IOutgoingTransition = {
                    to: nodes[iOutgoingNode],
                    condition,
                };
                outgoingTransitions.push(outgoingTransition);
            }
            nodes[iNode].outgoingTransitions = outgoingTransitions;
        }

        this._nodes = new Set(nodes);
        const entryNode = nodes.find((node) => node.kind === NodeKind.entry);
        assertIsNonNullable(entryNode, 'Entry node is missing');
        this._currentNode = entryNode;

        const anyNode = nodes.find((node) => node.kind === NodeKind.any);
        assertIsNonNullable(anyNode, 'Any node is missing');
        this._anyNode = entryNode;
    }

    public update () {
        // Apply transitions
        const firstEnterNode = this._currentNode;
        let currentNode = firstEnterNode;
        while (true) {
            let satisfiedTransition = this._getSatisfiedTransition(currentNode);
            if (!satisfiedTransition) {
                satisfiedTransition = this._getSatisfiedTransition(this._anyNode);
            }
            if (!satisfiedTransition) {
                break;
            }
            currentNode = satisfiedTransition.to;
        }
        if (currentNode !== firstEnterNode) {
            firstEnterNode.motion?.inactive();
            currentNode.motion?.active();
        }
    }

    public set (name: string, value: any) {
        if (!(name in this._conditionVars)) {
            // TODO warning
        }
        this._conditionVars[name] = value;
    }

    private _getSatisfiedTransition (node: IGraphNode): IOutgoingTransition | null {
        const { outgoingTransitions } = node;
        for (let iTransition = 0; iTransition < outgoingTransitions.length; ++iTransition) {
            const transition = outgoingTransitions[iTransition];
            if (transition.condition()) {
                return transition;
            }
        }
        return null;
    }
}

enum NodeKind {
    motion, entry, exist, any,
}

interface IGraphNode {
    motion: IMotion | null;
    outgoingTransitions: IOutgoingTransition[];
    kind: NodeKind;
}

interface IOutgoingTransition {
    to: IGraphNode;
    condition: () => boolean;
}
