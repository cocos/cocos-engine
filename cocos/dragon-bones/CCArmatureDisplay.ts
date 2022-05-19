/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

import { Armature, DisplayData, IEventDispatcher, Slot } from '@cocos/dragonbones-js';
import { ccclass } from '../core/data/class-decorator';
import { Node, Vec3 } from '../core';
import { EventTarget } from '../core/event';
// eslint-disable-next-line import/named
import { CCSlot } from './CCSlot';
import { ArmatureDisplay } from './ArmatureDisplay';

/**
* @deprecated since v3.5.1, this is an engine private interface that will be removed in the future.
*/
@ccclass('dragonBones.CCArmatureDisplay')
export class CCArmatureDisplay extends DisplayData implements IEventDispatcher {
    get node () { return this; }

    shouldAdvanced = false;
    _ccNode: Node|null = null;
    _ccComponent: ArmatureDisplay |null = null;
    _eventTarget: EventTarget;

    _armature: Armature | null = null;

    constructor () {
        super();
        this._eventTarget = new EventTarget();
    }

    hasEvent (type: string): boolean {
        console.warn('Method not implemented.');
        return false;
    }
    addEvent (type: string, listener: any, thisObject: any): void {
        console.warn('Method not implemented.');
    }
    removeEvent (type: string, listener: any, thisObject: any): void {
        console.warn('Method not implemented.');
    }

    setEventTarget (eventTarget:EventTarget) {
        this._eventTarget = eventTarget;
    }

    getRootDisplay () : CCArmatureDisplay {
        let parentSlot = this._armature!._parent;
        if (!parentSlot) {
            return this;
        }

        let slot: Slot;
        while (parentSlot) {
            slot = parentSlot;
            parentSlot = parentSlot._armature._parent;
        }
        return slot!._armature.display;
    }

    convertToRootSpace (pos: Vec3) {
        const slot = this._armature!._parent as CCSlot;
        if (!slot) {
            return pos;
        }
        slot.updateWorldMatrix();

        const worldMatrix = slot._worldMatrix;
        const newPos = new Vec3(0, 0);
        newPos.x = pos.x * worldMatrix.m00 + pos.y * worldMatrix.m04 + worldMatrix.m12;
        newPos.y = pos.x * worldMatrix.m01 + pos.y * worldMatrix.m05 + worldMatrix.m13;
        return newPos;
    }

    convertToWorldSpace (point: Vec3) {
        const newPos = this.convertToRootSpace(point);
        const ccNode = this.getRootNode();
        return ccNode?._uiProps.uiTransformComp?.convertToWorldSpaceAR(newPos);
    }

    getRootNode () {
        const rootDisplay = this.getRootDisplay();
        return rootDisplay && rootDisplay._ccNode;
    }

    // dragonbones api
    dbInit (armature: Armature | null) {
        this._armature = armature;
    }

    dbClear () {
        this._armature = null;
    }

    dbUpdate () {
        if (this._ccComponent) {
            this._ccComponent.markForUpdateRenderData();
        }
    }

    advanceTimeBySelf (on: boolean | number) {
        this.shouldAdvanced = !!on;
    }

    hasDBEventListener (type) {
        return this._eventTarget.hasEventListener(type);
    }

    addDBEventListener (type: string, listener, target) {
        this._eventTarget.on(type, listener, target);
    }

    removeDBEventListener (type: string, listener, target) {
        this._eventTarget.off(type, listener, target);
    }

    dispatchDBEvent (type: string, eventObject) {
        this._eventTarget.emit(type, eventObject);
    }
}
