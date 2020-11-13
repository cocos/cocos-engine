/* eslint-disable @typescript-eslint/no-unsafe-return */

import { ccclass } from '../core/data/class-decorator.js';
import { Vec2, EventTarget } from '../core';
import dragonBones from './lib/dragonBones.js';
import { CCSlot } from './CCSlot.js';

@ccclass('dragonBones.CCArmatureDisplay')
export class CCArmatureDisplay {
    get node () { return this; }

    shouldAdvanced = false;

    protected _eventTarget: EventTarget;

    protected _armature: dragonBones.Armature | null = null;

    constructor () {
        this._eventTarget = new EventTarget();
    }

    setEventTarget (eventTarget) {
        this._eventTarget = eventTarget;
    }

    getRootDisplay () {
        let parentSlot = this._armature!._parent;
        if (!parentSlot) {
            return this;
        }

        let slot: dragonBones.Slot;
        while (parentSlot) {
            slot = parentSlot;
            parentSlot = parentSlot._armature._parent;
        }
        return slot!._armature.display;
    }

    convertToRootSpace (pos: Vec2) {
        const slot = this._armature!._parent as CCSlot;
        if (!slot) {
            return pos;
        }
        slot.updateWorldMatrix();

        const worldMatrix = slot._worldMatrix;
        const newPos = new Vec2(0, 0);
        newPos.x = pos.x * worldMatrix.m00 + pos.y * worldMatrix.m04 + worldMatrix.m12;
        newPos.y = pos.x * worldMatrix.m01 + pos.y * worldMatrix.m05 + worldMatrix.m13;
        return newPos;
    }

    convertToWorldSpace (point: Vec2) {
        const newPos = this.convertToRootSpace(point);
        const ccNode = this.getRootNode();
        const finalPos = ccNode.convertToWorldSpaceAR(newPos);
        return finalPos;
    }

    getRootNode () {
        const rootDisplay = this.getRootDisplay();
        return rootDisplay && rootDisplay._ccNode;
    }

    // dragonbones api
    dbInit (armature: dragonBones.Armature | null) {
        this._armature = armature;
    }

    dbClear () {
        this._armature = null;
    }

    dbUpdate () {

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
