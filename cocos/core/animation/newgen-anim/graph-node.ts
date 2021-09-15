import { ccclass, serializable } from 'cc.decorator';
import { OwnedBy, ownerSymbol } from './ownership';
import { BindingHost } from './parametric';
import type { Layer, PoseSubgraph, TransitionInternal } from './pose-graph';
import { EditorExtendableMixin } from '../../data/editor-extendable';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { StateMachineComponent } from './state-machine-component';
import { remove } from '../../utils/array';
import { instantiate } from '../../data/instantiate';

export const outgoingsSymbol = Symbol('[[Outgoing transitions]]');

export const incomingsSymbol = Symbol('[[Incoming transitions]]');

@ccclass('cc.animation.GraphNode')
export class GraphNode extends EditorExtendableMixin(BindingHost) implements OwnedBy<Layer | PoseSubgraph> {
    declare [ownerSymbol]: Layer | PoseSubgraph | undefined;

    @serializable
    public name = '';

    public [outgoingsSymbol]: TransitionInternal[] = [];

    public [incomingsSymbol]: TransitionInternal[] = [];

    /**
     * @internal
     */
    constructor () {
        super();
    }
}

type StateMachineComponentConstructor<T extends StateMachineComponent> = Constructor<T>;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}InteractiveGraphNode`)
export class InteractiveGraphNode extends GraphNode {
    get components (): Iterable<StateMachineComponent> {
        return this._components;
    }

    public addComponent<T extends StateMachineComponent> (constructor: StateMachineComponentConstructor<T>) {
        const component = new constructor();
        this._components.push(component);
        return component;
    }

    public removeComponent (component: StateMachineComponent) {
        remove(this._components, component);
    }

    public instantiateComponents (): StateMachineComponent[] {
        const instantiatedComponents = this._components.map((component) => {
            // @ts-expect-error Typing
            const instantiated = instantiate(component, true) as unknown as StateMachineComponent;
            return instantiated;
        });
        return instantiatedComponents;
    }

    @serializable
    private _components: StateMachineComponent[] = [];
}
