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

import { OwnedBy, ownerSymbol } from '../ownership';
import type { Layer, StateMachine, TransitionInternal } from '../animation-graph';
import { EditorExtendable, js, editorExtrasTag, _decorator } from '../../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { StateMachineComponent } from './state-machine-component';
import { instantiate } from '../../../serialization/instantiate';
import { cloneAnimationGraphEditorExtrasFrom } from '../animation-graph-editor-extras-clone-helper';

export const outgoingsSymbol = Symbol('[[Outgoing transitions]]');

export const incomingsSymbol = Symbol('[[Incoming transitions]]');

const { ccclass, serializable } = _decorator;

@ccclass('cc.animation.State')
export class State extends EditorExtendable implements OwnedBy<Layer | StateMachine> {
    declare [ownerSymbol]: StateMachine | undefined;

    @serializable
    public name = '';

    public [outgoingsSymbol]: TransitionInternal[] = [];

    public [incomingsSymbol]: TransitionInternal[] = [];

    constructor () {
        super();
    }

    public copyTo (that: State): void {
        that.name = this.name;
        that[editorExtrasTag] = cloneAnimationGraphEditorExtrasFrom(this);
    }
}

type StateMachineComponentConstructor<T extends StateMachineComponent> = Constructor<T>;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}InteractiveState`)
export class InteractiveState extends State {
    get components (): Iterable<StateMachineComponent> {
        return this._components;
    }

    public addComponent<T extends StateMachineComponent> (constructor: StateMachineComponentConstructor<T>): T {
        const component = new constructor();
        this._components.push(component);
        return component;
    }

    public removeComponent (component: StateMachineComponent): void {
        js.array.remove(this._components, component);
    }

    public instantiateComponents (): StateMachineComponent[] {
        const instantiatedComponents = this._components.map((component): StateMachineComponent => {
            const instantiated = instantiate(component) as unknown as StateMachineComponent;
            return instantiated;
        });
        return instantiatedComponents;
    }

    public copyTo (that: InteractiveState): void {
        super.copyTo(that);
        that._components = this.instantiateComponents();
    }

    @serializable
    private _components: StateMachineComponent[] = [];
}
