import { UITransformComponent } from '../3d/ui/components/ui-transfrom-component';
import { ccclass, mixins, property } from '../core/data/class-decorator';
import { DefaultEventTarget, EventTarget } from '../core/event/event-target-base';
import { Enum, Mat4, Quat, Vec3 } from '../core/value-types';
import Size from '../core/value-types/size';
import Vec2 from '../core/value-types/vec2';
import { mat4, quat, vec3 } from '../core/vmath';
import { BaseNode } from './base-node';
import { Layers } from './layers';
import { WidgetComponent } from '../3d/ui/components/widget-component';

const v3_a = new Vec3();
const q_a = new Quat();
const array_a = new Array(10);
const _cachedArray = new Array(16);
_cachedArray.length = 0;

const EventType = Enum({
    TRANSFORM_CHANGED: 'transform-changed',
    POSITION_PART: 1,
    ROTATION_PART: 2,
    SCALE_PART: 4,
    TOUCH_START: 'touch-start',
    TOUCH_MOVE: 'touch-move',
    TOUCH_END: 'touch-end',
    TOUCH_CANCEL: 'touch-cancel',
    MOUSE_DOWN: 'mouse-down',
    MOUSE_ENTER: 'mouse-enter',
    MOUSE_MOVE: 'mouse-move',
    MOUSE_LEAVE: 'mouse-leave',
    MOUSE_UP: 'mouse-up',
    MOUSE_WHEEL: 'mouse-wheel',
});

const _touchEvents = [
    EventType.TOUCH_START,
    EventType.TOUCH_MOVE,
    EventType.TOUCH_END,
    EventType.TOUCH_CANCEL,
];
const _mouseEvents = [
    EventType.MOUSE_DOWN,
    EventType.MOUSE_ENTER,
    EventType.MOUSE_MOVE,
    EventType.MOUSE_LEAVE,
    EventType.MOUSE_UP,
    EventType.MOUSE_WHEEL,
];

const _touchStartHandler = function (touch, event) {
    const pos = touch.getLocation();
    const node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.TOUCH_START;
        event.touch = touch;
        event.bubbles = true;
        node.dispatchEvent(event);
        return true;
    }
    return false;
};
const _touchMoveHandler = function (touch, event) {
    const node = this.owner;
    event.type = EventType.TOUCH_MOVE;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
};
const _touchEndHandler = function (touch, event) {
    const pos = touch.getLocation();
    const node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.TOUCH_END;
    } else {
        event.type = EventType.TOUCH_CANCEL;
    }
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
};
const _touchCancelHandler = function (touch, event) {
    const node = this.owner;

    event.type = EventType.TOUCH_CANCEL;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
};

const _mouseDownHandler = function (event) {
    const pos = event.getLocation();
    const node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_DOWN;
        event.bubbles = true;
        node.dispatchEvent(event);
    }
};
const _mouseMoveHandler = function (event) {
    const pos = event.getLocation();
    const node = this.owner;
    const hit = node._hitTest(pos, this);
    if (hit) {
        if (!this._previousIn) {
            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
            if (_currentHovered && _currentHovered._mouseListener) {
                event.type = EventType.MOUSE_LEAVE;
                _currentHovered.dispatchEvent(event);
                _currentHovered._mouseListener._previousIn = false;
            }
            _currentHovered = this.owner;
            event.type = EventType.MOUSE_ENTER;
            node.dispatchEvent(event);
            this._previousIn = true;
        }
        event.type = EventType.MOUSE_MOVE;
        event.bubbles = true;
        node.dispatchEvent(event);
    } else if (this._previousIn) {
        event.type = EventType.MOUSE_LEAVE;
        node.dispatchEvent(event);
        this._previousIn = false;
        _currentHovered = null;
    } else {
        // continue dispatching
        return;
    }

    // Event processed, cleanup
    event.stopPropagation();
};
const _mouseUpHandler = function (event) {
    const pos = event.getLocation();
    const node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_UP;
        event.bubbles = true;
        node.dispatchEvent(event);
        event.stopPropagation();
    }
};
const _mouseWheelHandler = function (event) {
    const pos = event.getLocation();
    const node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_WHEEL;
        event.bubbles = true;
        node.dispatchEvent(event);
        event.stopPropagation();
    }
};

function _doDispatchEvent (owner, event) {
    let target, i;
    event.target = owner;

    // Event.CAPTURING_PHASE
    _cachedArray.length = 0;
    owner._getCapturingTargets(event.type, _cachedArray);
    // capturing
    event.eventPhase = 1;
    for (i = _cachedArray.length - 1; i >= 0; --i) {
        target = _cachedArray[i];
        if (target._capturingListeners) {
            event.currentTarget = target;
            // fire event
            target._capturingListeners.emit(event.type, event, _cachedArray);
            // check if propagation stopped
            if (event._propagationStopped) {
                _cachedArray.length = 0;
                return;
            }
        }
    }
    _cachedArray.length = 0;

    // Event.AT_TARGET
    // checks if destroyed in capturing callbacks
    event.eventPhase = 2;
    event.currentTarget = owner;
    if (owner._capturingListeners) {
        owner._capturingListeners.emit(event.type, event);
    }
    if (!event._propagationImmediateStopped && owner._bubblingListeners) {
        owner._bubblingListeners.emit(event.type, event);
    }

    if (!event._propagationStopped && event.bubbles) {
        // Event.BUBBLING_PHASE
        owner._getBubblingTargets(event.type, _cachedArray);
        // propagate
        event.eventPhase = 3;
        for (i = 0; i < _cachedArray.length; ++i) {
            target = _cachedArray[i];
            if (target._bubblingListeners) {
                event.currentTarget = target;
                // fire event
                target._bubblingListeners.emit(event.type, event);
                // check if propagation stopped
                if (event._propagationStopped) {
                    _cachedArray.length = 0;
                    return;
                }
            }
        }
    }
    _cachedArray.length = 0;
}

enum NodeSpace {
    LOCAL,
    WORLD,
}

@ccclass('cc.Node')
@mixins(EventTarget)
class Node extends EventTarget(BaseNode) {
    public static EventType = EventType;
    public static NodeSpace = NodeSpace;

    // is node but not scene
    public static isNode (obj: object) {
        return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
    }
    public uiTransfromComp: UITransformComponent | null = null;
    public uiWidgetComp: WidgetComponent | null = null;

    // local transform
    @property
    protected _lpos = new Vec3();
    @property
    protected _lrot = new Quat();
    @property
    protected _lscale = new Vec3(1, 1, 1);
    @property
    protected _layer = Layers.Default; // the layer this node belongs to

    // local rotation in euler angles, maintained here so that rotation angles could be greater than 360 degree.
    @property
    protected _euler = new Vec3();

    // world transform
    protected _pos = new Vec3();
    protected _rot = new Quat();
    protected _scale = new Vec3(1, 1, 1);
    protected _mat = new Mat4();

    protected _dirty = false; // does the world transform need to update?
    protected _hasChanged = false; // has the transform changed in this frame?

    protected _matDirty = false;
    protected _eulerDirty = false;

    protected _bubblingListeners: EventTarget|null = null;
    protected _capturingListeners: EventTarget | null = null;

    @property({
        type: Vec3,
    })
    set eulerAngles (val) {
        this.setRotationFromEuler(val.x, val.y, val.z);
    }
    get eulerAngles () {
        if (this._eulerDirty) {
            quat.toEuler(this._euler, this._lrot);
            this._eulerDirty = false;
        }
        return this._euler;
    }

    get hasChanged () {
        return this._hasChanged;
    }

    set layer (l) {
        this._layer = l;
    }

    get layer () {
        return this._layer;
    }

    get width () {
        if (!this.uiTransfromComp) {
            return;
        }

        return this.uiTransfromComp.width;
    }

    set width (value) {
        if (!this.uiTransfromComp) {
            return;
        }

        this.uiTransfromComp.width = value;
    }

    get height () {
        if (!this.uiTransfromComp) {
            return;
        }

        return this.uiTransfromComp.height;
    }

    set height (value) {
        if (!this.uiTransfromComp) {
            return;
        }
        this.uiTransfromComp.height = value;
    }

    get anchorX () {
        if (!this.uiTransfromComp) {
            return;
        }

        return this.uiTransfromComp.anchorX;
    }

    set anchorX (value) {
        if (!this.uiTransfromComp) {
            return;
        }

        this.uiTransfromComp.anchorX = value;
    }

    get anchorY () {
        if (!this.uiTransfromComp) {
            return;
        }

        return this.uiTransfromComp.anchorY;
    }

    set anchorY (value) {
        if (!this.uiTransfromComp) {
            return;
        }

        this.uiTransfromComp.anchorY = value;
    }

    constructor (name: string) {
        super(name);
        // EventTarget.call(this);
    }

    // ===============================
    // hierarchy
    // ===============================

    /**
     * invalidate all children after relevant events
     */
    public onRestore () {
        super.onRestore();
        this.invalidateChildren();
    }

    public _onSetParent (oldParent: this) {
        super._onSetParent(oldParent);
        this.invalidateChildren();
    }

    public _onPostActivated () {
        this.invalidateChildren();
    }

    // ===============================
    // transform helper, convenient but not the most efficient
    // ===============================

    /**
     * Rotate the node
     * @param rot - rotation to apply
     * @param ns - the operating space
     */
    public rotate (rot: Quat, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            this.getRotation(q_a);
            this.setRotation(quat.multiply(q_a, q_a, rot));
        } else if (space === NodeSpace.WORLD) {
            this.getWorldRotation(q_a);
            this.setWorldRotation(quat.multiply(q_a, rot, q_a));
        }
    }

    /**
     * rotate the node around X axis
     * @param rad - rotating angle
     * @param ns - the operating space
     */
    public pitch (rad: number, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            this.getWorldRotation(q_a);
            quat.toAxisX(v3_a, q_a);
            quat.fromAxisAngle(q_a, v3_a, rad);
            this.rotate(q_a, ns);
        } else if (space === NodeSpace.WORLD) {
            quat.fromAxisAngle(q_a, vec3.UNIT_X, rad);
            this.rotate(q_a, ns);
        }
    }

    /**
     * rotate the node around Y axis
     * @param rad - rotating angle
     * @param ns - the operating space
     */
    public yaw (rad: number, ns?: NodeSpace) {
        const space = ns || NodeSpace.LOCAL;
        if (space === NodeSpace.LOCAL) {
            this.getWorldRotation(q_a);
            quat.toAxisY(v3_a, q_a);
            quat.fromAxisAngle(q_a, v3_a, rad);
            this.rotate(q_a, ns);
        } else if (space === NodeSpace.WORLD) {
            quat.fromAxisAngle(q_a, vec3.UNIT_Y, rad);
            this.rotate(q_a, ns);
        }
    }

    /**
     * rotate the node around Z axis
     * @param rad - rotating angle
     * @param ns - the operating space
     */
    public roll (rad: number, ns?: NodeSpace) {
        const space = (ns !== undefined ? ns : NodeSpace.LOCAL);
        if (space === NodeSpace.LOCAL) {
            this.getWorldRotation(q_a);
            quat.toAxisZ(v3_a, q_a);
            quat.fromAxisAngle(q_a, v3_a, rad);
            this.rotate(q_a, ns);
        } else if (space === NodeSpace.WORLD) {
            quat.fromAxisAngle(q_a, vec3.UNIT_Z, rad);
            this.rotate(q_a, ns);
        }
    }

    public get direction (): Vec3 {
        this.getRotation(q_a);
        return vec3.transformQuat(new Vec3(), vec3.UNIT_Z, q_a);
    }

    public set direction (dir: Vec3) {
        quat.rotationTo(q_a, vec3.UNIT_Z, dir);
        this.setRotation(q_a);
    }

    /**
     * Set rotation by lookAt target point
     * @param pos - target position
     * @param up - the up vector, default to (0,1,0)
     */
    public lookAt (pos: Vec3, up: Vec3) {
        this.getWorldPosition(v3_a);
        vec3.sub(v3_a, v3_a, pos); // NOTE: we use -z for view-dir
        vec3.normalize(v3_a, v3_a);
        quat.fromViewUp(q_a, v3_a, up);

        this.setWorldRotation(q_a);
    }

    // ===============================
    // transform maintainer
    // ===============================

    /**
     * Reset the `hasChanged` flag recursively
     */
    public resetHasChanged () {
        this._hasChanged = false;
        const len = this._children.length;
        for (let i = 0; i < len; ++i) {
            this._children[i].resetHasChanged();
        }
    }

    /**
     * invalidate the world transform information
     * for this node and all its children recursively
     */
    public invalidateChildren () {
        if (this._dirty && this._hasChanged) { return; }
        this._dirty = this._hasChanged = true;
        for (const child of this._children) {
            child.invalidateChildren();
        }
    }

    /**
     * update the world transform information if outdated
     * here we assume all nodes are children of a scene node,
     * which is always not dirty, has an identity transform and no parent.
     */
    public updateWorldTransform () {
        if (!this._dirty) { return; }
        let cur: this | null = this;
        let i = 0;
        while (cur._dirty) {
            // top level node
            array_a[i++] = cur;
            cur = cur._parent;
            if (!cur || !cur._parent) {
                cur = null;
                break;
            }
        }
        let child: this;
        while (i) {
            child = array_a[--i];
            if (cur) {
                vec3.mul(child._pos, child._lpos, cur._scale);
                vec3.transformQuat(child._pos, child._pos, cur._rot);
                vec3.add(child._pos, child._pos, cur._pos);
                quat.mul(child._rot, cur._rot, child._lrot);
                vec3.mul(child._scale, cur._scale, child._lscale);
            }
            child._matDirty = true; // further deferred eval
            child._dirty = false;
            cur = child;
        }
    }

    public updateWorldTransformFull () {
        this.updateWorldTransform();
        if (!this._matDirty) { return; }
        mat4.fromRTS(this._mat, this._rot, this._pos, this._scale);
        this._matDirty = false;
    }

    // ===============================
    // transform
    // ===============================

    /**
     * Sets local position.
     * @param position - The new local position.
     */
    public setPosition (position: Vec3): void;

    /**
     * Sets local position.
     * @param x - The x component of the new local position.
     * @param y - The y component of the new local position.
     * @param z - The z component of the new local position.
     * @param w - The w component of the new local position.
     */
    public setPosition (x: number, y: number, z: number): void;

    /**
     * set local position
     * @param val - the new local position, or the x component of it
     * @param y - the y component of the new local position
     * @param z - the z component of the new local position
     */
    public setPosition (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._lpos, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._lpos, val as number, y, z);
        }
        vec3.copy(this._pos, this._lpos);

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
    }

    /**
     * get local position
     * @param out the receiving vector
     * @returns the resulting vector
     */
    public getPosition (out?: Vec3): Vec3 {
        if (out) {
            return vec3.set(out, this._lpos.x, this._lpos.y, this._lpos.z);
        } else {
            return vec3.copy(new Vec3(), this._lpos);
        }
    }

    /**
     * Sets local rotation.
     * @param rotation - The new local rotation.
     */
    public setRotation (rotation: Quat): void;

    /**
     * Sets local rotation.
     * @param x - The x component of the new local rotation.
     * @param y - The y component of the new local rotation.
     * @param z - The z component of the new local rotation.
     * @param w - The w component of the new local rotation.
     */
    public setRotation (x: number, y: number, z: number, w: number): void;

    public setRotation (val: Quat | number, y?: number, z?: number, w?: number) {
        if (y === undefined || z === undefined || w === undefined) {
            quat.copy(this._lrot, val as Quat);
        } else if (arguments.length === 4) {
            quat.set(this._lrot, val as number, y, z, w);
        }
        quat.copy(this._rot, this._lrot);
        this._eulerDirty = true;

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * set local rotation from euler angles
     * @param x - Angle to rotate around X axis in degrees.
     * @param y - Angle to rotate around Y axis in degrees.
     * @param z - Angle to rotate around Z axis in degrees.
     */
    public setRotationFromEuler (x: number, y: number, z: number) {
        vec3.set(this._euler, x, y, z);
        this._eulerDirty = false;
        quat.fromEuler(this._lrot, x, y, z);
        quat.copy(this._rot, this._lrot);

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * get local rotation
     * @param out - the receiving quaternion
     * @returns the resulting quaternion
     */
    public getRotation (out?: Quat): Quat {
        if (out) {
            return quat.set(out, this._lrot.x, this._lrot.y, this._lrot.z, this._lrot.w);
        } else {
            return quat.copy(new Quat(), this._lrot);
        }
    }

    /**
     * Sets local scale.
     * @param scale - The new local scale.
     */
    public setScale (scale: Vec3): void;

    /**
     * Sets local scale.
     * @param x - The x component of the new local scale.
     * @param y - The y component of the new local scale.
     * @param z - The z component of the new local scale.
     */
    public setScale (x: number, y: number, z: number): void;

    /**
     * set local scale
     * @param val - the new local scale, or the x component of it
     * @param y - the y component of the new local scale
     * @param z - the z component of the new local scale
     */
    public setScale (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._lscale, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._lscale, val as number, y, z);
        }
        vec3.copy(this._scale, this._lscale);

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.SCALE_PART);
    }

    /**
     * get local scale
     * @param out - the receiving vector
     * @returns the resulting vector
     */
    public getScale (out?: Vec3): Vec3 {
        if (out) {
            return vec3.set(out, this._lscale.x, this._lscale.y, this._lscale.z);
        } else {
            return vec3.copy(new Vec3(), this._lscale);
        }
    }

    /**
     * Sets world position.
     * @param position - The new world position.
     */
    public setWorldPosition (position: Vec3): void;

    /**
     * Sets world position.
     * @param x - The x component of the new world position.
     * @param y - The y component of the new world position.
     * @param z - The z component of the new world position.
     */
    public setWorldPosition (x: number, y: number, z: number): void;

    /**
     * set world position
     * @param val - the new world position, or the x component of it
     * @param y - the y component of the new world position
     * @param z - the z component of the new world position
     */
    public setWorldPosition (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._pos, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._pos, val as number, y, z);
        }
        const parent = this._parent;
        const local = this._lpos;
        if (parent) {
            parent.updateWorldTransform();
            vec3.sub(local, this._pos, parent._pos);
            vec3.transformQuat(local, local, quat.conjugate(q_a, parent._rot));
            vec3.div(local, local, parent._scale);
        } else {
            vec3.copy(this._lpos, this._pos);
        }

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.POSITION_PART);
    }

    /**
     * get world position
     * @param out - the receiving vector
     * @returns the resulting vector
     */
    public getWorldPosition (out?: Vec3): Vec3 {
        this.updateWorldTransform();
        if (out) {
            return vec3.copy(out, this._pos);
        } else {
            return vec3.copy(new Vec3(), this._pos);
        }
    }

    /**
     * Sets world rotation.
     * @param rotation - The new world rotation.
     */
    public setWorldRotation (rotation: Quat): void;

    /**
     * Sets world rotation.
     * @param x - The x component of the new world rotation.
     * @param y - The y component of the new world rotation.
     * @param z - The z component of the new world rotation.
     * @param w - The w component of the new world rotation.
     */
    public setWorldRotation (x: number, y: number, z: number, w: number): void;

    /**
     * set world rotation
     * @param val - the new world rotation, or the x component of it
     * @param y - the y component of the new world rotation
     * @param z - the z component of the new world rotation
     * @param w - the w component of the new world rotation
     */
    public setWorldRotation (val: Quat | number, y?: number, z?: number, w?: number) {
        if (y === undefined || z === undefined || w === undefined) {
            quat.copy(this._rot, val as Quat);
        } else if (arguments.length === 4) {
            quat.set(this._rot, val as number, y, z, w);
        }
        if (this._parent) {
            this._parent.getWorldRotation(q_a);
            quat.mul(this._lrot, quat.conjugate(q_a, q_a), this._rot);
        } else {
            quat.copy(this._lrot, this._rot);
        }
        this._eulerDirty = true;

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * set world rotation from euler angles
     * @param x - Angle to rotate around X axis in degrees.
     * @param y - Angle to rotate around Y axis in degrees.
     * @param z - Angle to rotate around Z axis in degrees.
     */
    public setWorldRotationFromEuler (x: number, y: number, z: number) {
        vec3.set(this._euler, x, y, z);
        this._eulerDirty = false;
        quat.fromEuler(this._rot, x, y, z);
        if (this._parent) {
            this._parent.getWorldRotation(q_a);
            quat.mul(this._lrot, this._rot, quat.conjugate(q_a, q_a));
        } else {
            quat.copy(this._lrot, this._rot);
        }

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.ROTATION_PART);
    }

    /**
     * get world rotation
     * @param out - the receiving quaternion
     * @returns the resulting quaternion
     */
    public getWorldRotation (out?: Quat): Quat {
        this.updateWorldTransform();
        if (out) {
            return quat.copy(out, this._rot);
        } else {
            return quat.copy(new Quat(), this._rot);
        }
    }

    /**
     * Sets world scale.
     * @param scale - The new world scale.
     */
    public setWorldScale (scale: Vec3): void;

    /**
     * Sets world scale.
     * @param x - The x component of the new world scale.
     * @param y - The y component of the new world scale.
     * @param z - The z component of the new world scale.
     */
    public setWorldScale (x: number, y: number, z: number): void;

    /**
     * set world scale
     * @param val - the new world scale, or the x component of it
     * @param y - the y component of the new world scale
     * @param z - the z component of the new world scale
     */
    public setWorldScale (val: Vec3 | number, y?: number, z?: number) {
        if (y === undefined || z === undefined) {
            vec3.copy(this._scale, val as Vec3);
        } else if (arguments.length === 3) {
            vec3.set(this._scale, val as number, y, z);
        }
        if (this._parent) {
            this._parent.getWorldScale(v3_a);
            vec3.div(this._lscale, this._scale, v3_a);
        } else {
            vec3.copy(this._lscale, this._scale);
        }

        this.invalidateChildren();
        this.emit(EventType.TRANSFORM_CHANGED, EventType.SCALE_PART);
    }

    /**
     * get world scale
     * @param out - the receiving vector
     * @returns the resulting vector
     */
    public getWorldScale (out?: Vec3): Vec3 {
        this.updateWorldTransform();
        if (out) {
            return vec3.copy(out, this._scale);
        } else {
            return vec3.copy(new Vec3(), this._scale);
        }
    }

    /**
     * get the matrix that transforms a point from local space into world space
     * @param out - the receiving matrix
     * @returns the - resulting matrix
     */
    public getWorldMatrix (out?: Mat4): Mat4 {
        this.updateWorldTransformFull();
        if (out) {
            return mat4.copy(out, this._mat);
        } else {
            return mat4.copy(new Mat4(), this._mat);
        }
    }

    /**
     * get world transform matrix (with only rotation and scale)
     * @param out - the receiving matrix
     * @returns the - resulting matrix
     */
    public getWorldRS (out?: Mat4): Mat4 {
        this.updateWorldTransformFull();
        if (out === undefined) { out = new Mat4(); }
        mat4.copy(out, this._mat);
        out.m12 = 0; out.m13 = 0; out.m14 = 0;
        return out;
    }

    /**
     * get world transform matrix (with only rotation and translation)
     * @param out - the receiving matrix
     * @returns the - resulting matrix
     */
    public getWorldRT (out?: Mat4): Mat4 {
        this.updateWorldTransform();
        if (!out) {
            out = new Mat4();
        }
        return mat4.fromRT(out, this._rot, this._pos);
    }

    public getAnchorPoint () {
        if (!this.uiTransfromComp) {
            return;
        }

        return this.uiTransfromComp.anchorPoint;
    }

    public setAnchorPoint (point: Vec2, y: number) {
        if (!this.uiTransfromComp) {
            return;
        }

        this.uiTransfromComp.setAnchorPoint(point, y);
    }

    public getContentSize () {
        if (!this.uiTransfromComp) {
            return;
        }

        return this.uiTransfromComp.contentSize;
    }

    public setContentSize (size: Size, height?: number) {
        if (!this.uiTransfromComp) {
            return;
        }

        this.uiTransfromComp.setContentSize(size, height);
    }

    // EVENT TARGET

    public _checknSetupSysEvent (type) {
        let newAdded = false;
        let forDispatch = false;
        if (_touchEvents.indexOf(type) !== -1) {
            if (!this._touchListener) {
                this._touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    owner: this,
                    mask: _searchMaskInParent(this),
                    onTouchBegan: _touchStartHandler,
                    onTouchMoved: _touchMoveHandler,
                    onTouchEnded: _touchEndHandler,
                    onTouchCancelled: _touchCancelHandler,
                });
                eventManager.addListener(this._touchListener, this);
                newAdded = true;
            }
            forDispatch = true;
        } else if (_mouseEvents.indexOf(type) !== -1) {
            if (!this._mouseListener) {
                this._mouseListener = cc.EventListener.create({
                    event: cc.EventListener.MOUSE,
                    _previousIn: false,
                    owner: this,
                    mask: _searchMaskInParent(this),
                    onMouseDown: _mouseDownHandler,
                    onMouseMove: _mouseMoveHandler,
                    onMouseUp: _mouseUpHandler,
                    onMouseScroll: _mouseWheelHandler,
                });
                eventManager.addListener(this._mouseListener, this);
                newAdded = true;
            }
            forDispatch = true;
        }
        if (newAdded && !this._activeInHierarchy) {
            cc.director.getScheduler().schedule(function () {
                if (!this._activeInHierarchy) {
                    eventManager.pauseTarget(this);
                }
            }, this, 0, 0, 0, false);
        }
        return forDispatch;
    }

    /**
     * !#en
     * Register a callback of a specific event type on Node.<br/>
     * Use this method to register touch or mouse event permit propagation based on scene graph,<br/>
     * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:<br/>
     * 1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target<br/>
     * 2. At target phase: dispatch to the listeners of the real target<br/>
     * 3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root<br/>
     * In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmidiate()`.<br/>
     * It's the recommended way to register touch/mouse event for Node,<br/>
     * please do not use cc.eventManager directly for Node.<br/>
     * You can also register custom event and use `emit` to trigger custom event on Node.<br/>
     * For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.<br/>
     * You can also pass event callback parameters with `emit` by passing parameters after `type`.
     * !#zh
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
     * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
     * 1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
     * 2. 目标阶段：派发给目标节点的监听器。<br/>
     * 3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发知道根节点。<br/>
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
     * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。<br/>
     * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器<br/>
     * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
     * @method on
     * @param {String|Node.EventType} type - A string representing the event type to listen for.<br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched. The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event|any} [callback.event] event or first argument when emit
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     * @example
     * this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
     * node.on(cc.Node.EventType.TOUCH_START, callback, this);
     * node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
     * node.on(cc.Node.EventType.TOUCH_END, callback, this);
     * node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this);
     * node.on(cc.Node.EventType.ANCHOR_CHANGED, callback);
     */
    public on (type, callback, target, useCapture?: number) {
        const forDispatch = this._checknSetupSysEvent(type);
        if (forDispatch) {
            return this._onDispatch(type, callback, target, useCapture);
        } else {
            // switch (type) {
            //     case EventType.POSITION_CHANGED:
            //         this._eventMask |= POSITION_ON;
            //         break;
            //     case EventType.SCALE_CHANGED:
            //         this._eventMask |= SCALE_ON;
            //         break;
            //     case EventType.ROTATION_CHANGED:
            //         this._eventMask |= ROTATION_ON;
            //         break;
            //     case EventType.SIZE_CHANGED:
            //         this._eventMask |= SIZE_ON;
            //         break;
            //     case EventType.ANCHOR_CHANGED:
            //         this._eventMask |= ANCHOR_ON;
            //         break;
            // }
            if (!this._bubblingListeners) {
                this._bubblingListeners = new DefaultEventTarget();
            }
            return this._bubblingListeners.on(type, callback, target);
        }
    }

    // /**
    //  * !#en
    //  * Register an callback of a specific event type on the Node,
    //  * the callback will remove itself after the first time it is triggered.
    //  * !#zh
    //  * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
    //  *
    //  * @method once
    //  * @param {String} type - A string representing the event type to listen for.
    //  * @param {Function} callback - The callback that will be invoked when the event is dispatched.
    //  *                              The callback is ignored if it is a duplicate (the callbacks are unique).
    //  * @param {Event|any} [callback.event] event or first argument when emit
    //  * @param {any} [callback.arg2] arg2
    //  * @param {any} [callback.arg3] arg3
    //  * @param {any} [callback.arg4] arg4
    //  * @param {any} [callback.arg5] arg5
    //  * @param {Object} [target] - The target (this object) to invoke the callback, can be null
    //  * @typescript
    //  * once<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
    //  * @example
    //  * node.once(cc.Node.EventType.ANCHOR_CHANGED, callback);
    //  */
    // once(type, callback, target, useCapture) {
    //     let forDispatch = this._checknSetupSysEvent(type);
    //     let eventType_hasOnceListener = '__ONCE_FLAG:' + type;

    //     let listeners = null;
    //     if (forDispatch && useCapture) {
    //         listeners = this._capturingListeners = this._capturingListeners || new DefaultEventTarget();
    //     }
    //     else {
    //         listeners = this._bubblingListeners = this._bubblingListeners || new DefaultEventTarget();
    //     }

    //     let hasOnceListener = listeners.hasEventListener(eventType_hasOnceListener, callback, target);
    //     if (!hasOnceListener) {
    //         let self = this;
    //         let onceWrapper = function (arg1, arg2, arg3, arg4, arg5) {
    //             self.off(type, onceWrapper, target);
    //             listeners.remove(eventType_hasOnceListener, callback, target);
    //             callback.call(this, arg1, arg2, arg3, arg4, arg5);
    //         };
    //         this.on(type, onceWrapper, target);
    //         listeners.add(eventType_hasOnceListener, callback, target);
    //     }
    // }

    public _onDispatch (type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        } else { useCapture = !!useCapture; }
        if (!callback) {
            cc.errorID(6800);
            return;
        }

        let listeners = null;
        if (useCapture) {
            listeners = this._capturingListeners = this._capturingListeners || new DefaultEventTarget();
        } else {
            listeners = this._bubblingListeners = this._bubblingListeners || new DefaultEventTarget();
        }

        if (!listeners.hasEventListener(type, callback, target)) {
            listeners.add(type, callback, target);

            if (target && target.__eventTargets) {
                target.__eventTargets.push(this);
            }
        }

        return callback;
    }

    /**
     * !#en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} [callback] - The callback to remove.
     * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
     * @example
     * this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
     * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
     */
    public off (type, callback, target, useCapture?: number) {
        const touchEvent = _touchEvents.indexOf(type) !== -1;
        const mouseEvent = !touchEvent && _mouseEvents.indexOf(type) !== -1;
        if (touchEvent || mouseEvent) {
            this._offDispatch(type, callback, target, useCapture);

            if (touchEvent) {
                if (this._touchListener && !_checkListeners(this, _touchEvents)) {
                    eventManager.removeListener(this._touchListener);
                    this._touchListener = null;
                }
            } else if (mouseEvent) {
                if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
                    eventManager.removeListener(this._mouseListener);
                    this._mouseListener = null;
                }
            }
        } else if (this._bubblingListeners) {
            this._bubblingListeners.off(type, callback, target);

            const hasListeners = this._bubblingListeners.hasEventListener(type);
            // All listener removed
            // if (!hasListeners) {
            //     switch (type) {
            //         case EventType.POSITION_CHANGED:
            //             this._eventMask &= ~POSITION_ON;
            //             break;
            //         case EventType.SCALE_CHANGED:
            //             this._eventMask &= ~SCALE_ON;
            //             break;
            //         case EventType.ROTATION_CHANGED:
            //             this._eventMask &= ~ROTATION_ON;
            //             break;
            //         case EventType.SIZE_CHANGED:
            //             this._eventMask &= ~SIZE_ON;
            //             break;
            //         case EventType.ANCHOR_CHANGED:
            //             this._eventMask &= ~ANCHOR_ON;
            //             break;
            //     }
            // }
        }
    }

    public _offDispatch (type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        } else { useCapture = !!useCapture; }
        if (!callback) {
            this._capturingListeners && this._capturingListeners.removeAll(type);
            this._bubblingListeners && this._bubblingListeners.removeAll(type);
        } else {
            const listeners = useCapture ? this._capturingListeners : this._bubblingListeners;
            if (listeners) {
                listeners.remove(type, callback, target);

                if (target && target.__eventTargets) {
                    js.array.fastRemove(target.__eventTargets, this);
                }
            }

        }
    }

    /**
     * !#en
     * Trigger an event directly with the event name and necessary arguments.
     * !#zh
     * 通过事件名发送自定义事件
     *
     * @method emit
     * @param {String} type - event type
     * @param {*} [arg1] - First argument in callback
     * @param {*} [arg2] - Second argument in callback
     * @param {*} [arg3] - Third argument in callback
     * @param {*} [arg4] - Fourth argument in callback
     * @param {*} [arg5] - Fifth argument in callback
     * @example
     *
     * eventTarget.emit('fire', event);
     * eventTarget.emit('fire', message, emitter);
     */
    public emit (type, ...args: any[]) {
        if (this._bubblingListeners) {
            this._bubblingListeners.emit(type, ...args);
        }
    }

    /**
     * !#en
     * Dispatches an event into the event flow.
     * The event target is the EventTarget object upon which the dispatchEvent() method is called.
     * !#zh 分发事件到事件流中。
     *
     * @method dispatchEvent
     * @param {Event} event - The Event object that is dispatched into the event flow
     */
    public dispatchEvent (event) {
        _doDispatchEvent(this, event);
        _cachedArray.length = 0;
    }
}

if (CC_EDITOR) {
    const repeat = (t: number, l: number) => t - Math.floor(t / l) * l;
    Object.defineProperty(Node.prototype, 'eulerAngles', {
        set (val: Vec3) {
            this.setRotationFromEuler(val.x, val.y, val.z);
        },
        get () {
            if (this._eulerDirty) {
                const eu = this._euler;
                quat.toEuler(v3_a, this._lrot);
                eu.x = repeat(v3_a.x - eu.x + 180, 360) + eu.x - 180;
                eu.y = repeat(v3_a.y - eu.y + 180, 360) + eu.y - 180;
                eu.z = repeat(v3_a.z - eu.z + 180, 360) + eu.z - 180;
                this._eulerDirty = false;
            }
            return this._euler;
        },
    });
}

cc.Node = Node;
export { Node };
