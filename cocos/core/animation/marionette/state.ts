import { ccclass, serializable } from 'cc.decorator';
import { OwnedBy, ownerSymbol } from './ownership';
import type { Layer, StateMachine, TransitionInternal } from './animation-graph';
import { EditorExtendable } from '../../data/editor-extendable';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { StateMachineComponent } from './state-machine-component';
import { remove } from '../../utils/array';
import { instantiate } from '../../data/instantiate';

export const outgoingsSymbol = Symbol('[[Outgoing transitions]]');

export const incomingsSymbol = Symbol('[[Incoming transitions]]');

@ccclass('cc.animation.State')
export class State extends EditorExtendable implements OwnedBy<Layer | StateMachine> {
    declare [ownerSymbol]: StateMachine | undefined;

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

@ccclass(`${CLASS_NAME_PREFIX_ANIM}InteractiveState`)
export class InteractiveState extends State {
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
