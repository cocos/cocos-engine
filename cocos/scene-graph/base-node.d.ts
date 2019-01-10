/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
import { CCObject } from '../core/data/object';
import { Component } from '../components/component';

export class BaseNode extends CCObject {
    protected static _setScene(node: BaseNode): void;

    protected _parent: this | null;
    protected _children: this[];
    protected _active: boolean;
    protected _level: number;
    protected _components: Component[];
    protected _persistNode: boolean;

    protected uuid: string;
    protected children: this[];
    protected childrenCount: number;
    protected active: boolean;
    protected parent: this;

    public getParent(): this;
    public setParent(value: this): void;
    public getChildByUuid(uuid: string): this;
    public getChildByName(name: string): this;
    public getChildByPath(path: string): this;
    public addChild(child: this): void;
    public insertChild(child: this, siblingIndex: number): void;
    public getSiblingIndex(): number;
    public setSiblingIndex(index: number): void;
    public walk(prefunc: (target: this) => any, postfunc: (target: this) => any): void;
    public removeFromParent(cleanup: boolean): void;
    public removeChild(child: this, cleanup: boolean): void;
    public removeAllChildren(cleanup: boolean): void;
    public isChildOf(parent: this): boolean;

    public getComponent(typeOrClassName: object | string): Component | null;
    public getComponents(typeOrClassName: object | string): Component[];
    public getComponentInChildren(typeOrClassName: object | string): Component | null;
    public getComponentsInChildren(typeOrClassName: object | string): Component[];
    public addComponent(typeOrClassName: object | string): Component | null;
    public removeComponent(typeOrClassName: object | string): void;
    public destroyAllChildren(): void;
    public cleanup(): void;
    public onRestore(): void;

    protected _onSetParent(oldParent: this): void;
    protected _onPostActivated(): void;
    protected _onBatchRestored(): void;
    protected _onBatchCreated(): void;
    protected _onHierarchyChanged(oldParent: this): void;
    protected _onHierarchyChangedBase(oldParent: this): void;
    protected _instantiate(cloned: this): this;
}
