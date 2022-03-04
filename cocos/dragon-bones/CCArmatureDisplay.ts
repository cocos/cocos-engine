/* eslint-disable @typescript-eslint/no-unsafe-return */

/**
 * @packageDocumentation
 * @module dragonBones
 */

import { Armature, DisplayData, IEventDispatcher, Slot } from '@cocos/dragonbones-js';
import { ccclass } from '../core/data/class-decorator';
import { Vec2, Node, Vec3 } from '../core';
import { EventTarget } from '../core/event';
// eslint-disable-next-line import/named
import { CCSlot } from './CCSlot';
import { ArmatureDisplay } from './ArmatureDisplay';

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
