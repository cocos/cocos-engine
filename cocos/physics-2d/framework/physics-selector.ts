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

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { EDITOR, DEBUG, TEST, EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { IRigidBody2D } from '../spec/i-rigid-body';
import { IBoxShape, ICircleShape, IPolygonShape, IBaseShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { errorID, log } from '../../core';
import { ECollider2DType, EJoint2DType  } from './physics-types';
import { IJoint2D, IDistanceJoint, ISpringJoint, IFixedJoint, IMouseJoint,
    IRelativeJoint, ISliderJoint, IWheelJoint, IHingeJoint } from '../spec/i-physics-joint';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type IPhysicsEngineId = 'builtin' | 'box2d' | 'box2d-wasm'| string;

interface IPhysicsWrapperObject {
    PhysicsWorld: any,
    RigidBody?: any,

    BoxShape?: any,
    CircleShape?: any,
    PolygonShape?: any,

    DistanceJoint?: any,
    FixedJoint?: any,
    MouseJoint?: any,
    SpringJoint?: any,
    RelativeJoint?: any,
    SliderJoint?: any,
    WheelJoint?: any,
    HingeJoint?: any,
}

interface IPhysicsBackend { [key: string]: IPhysicsWrapperObject; }

export interface IPhysicsSelector {
    /**
     * @en
     * The id of the physics engine being used by the physics system.
     * @zh
     * 物理系统正在使用的物理引擎的唯一标志。
     */
    readonly id: IPhysicsEngineId,

    /**
     * @en
     * The wrapper of the physics engine being used by the physics system.
     * @zh
     * 物理系统使用的物理引擎的封装层。
     */
    readonly wrapper: IPhysicsWrapperObject,

    /**
     * @en
     * All physics engine backends that the physics module has registered.
     * @zh
     * 物理模块已注册的所有物理引擎后端。
     */
    readonly backend: IPhysicsBackend,

    /**
     * @en
     * An instance of the physical world through which you can access the lowlevel objects.
     * @zh
     * 物理世界实例，通过它可以访问到底层对象。
     */
    readonly physicsWorld: IPhysicsWorld | null;

    /**
     * @en
     * To register the backend, the system will use the last backend registered before initialization,
     * and the registration after that needs to be switched manually.
     * @zh
     * 注册后端，系统将使用在初始化前注册的最后一个后端，此后注册的需要手动切换。
     */
    register: (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) => void,

    /**
     * @en
     * Switch to the physics backend corresponding to the id in the registry.
     * @zh
     * 切换为注册表里对应 id 的物理后端。
     */
    switchTo: (id: IPhysicsEngineId) => void,

    // polyfill
    [x: string]: any,
}

function register (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject): void {
    if (!EDITOR && !TEST) log(`[PHYSICS2D]: register ${id}.`);
    selector.backend[id] = wrapper;
    if (!selector.physicsWorld || selector.id === id) {
        const mutableSelector = selector as Mutable<IPhysicsSelector>;
        mutableSelector.id = id;
        mutableSelector.wrapper = wrapper;
    }
}

function switchTo (id: IPhysicsEngineId): void {
    //if (!selector.runInEditor) return;
    const mutableSelector = selector as Mutable<IPhysicsSelector>;
    if (selector.physicsWorld && id !== selector.id && selector.backend[id] != null) {
        //selector.physicsWorld.destroy();//todo
        if (!TEST) log(`[PHYSICS2D]: switch from ${selector.id} to ${id}.`);
        mutableSelector.id = id;
        mutableSelector.wrapper = selector.backend[id];
        mutableSelector.physicsWorld = createPhysicsWorld();
    } else {
        if (!EDITOR && !TEST) log(`[PHYSICS2D]: using ${mutableSelector.id}.`);
        mutableSelector.physicsWorld = createPhysicsWorld();
    }
}

/**
 * @en
 * The physics selector is used to register and switch the physics engine backend.
 * @zh
 * 物理选择器用于注册和切换物理引擎后端。
 */
export const selector: IPhysicsSelector = {
    id: '',
    switchTo,
    register,
    wrapper: {} as any,
    backend: {} as any,
    physicsWorld: null as any,

    /// hide for now ///
    runInEditor: !EDITOR,
};

const FUNC = (...v: any): any => 0 as any;
const ENTIRE_WORLD: IPhysicsWorld = {
    impl: null,
    debugDrawFlags: 0,
    setGravity: FUNC,
    setAllowSleep: FUNC,
    step: FUNC,
    syncPhysicsToScene: FUNC,
    syncSceneToPhysics: FUNC,
    raycast: FUNC,
    testPoint: FUNC,
    testAABB: FUNC,
    drawDebug: FUNC,
};

export function checkPhysicsModule (obj: any): boolean {
    if (DEBUG && !TEST && !EDITOR_NOT_IN_PREVIEW && obj == null) {
        errorID(9600);
        return true;
    }
    return false;
}

export function createPhysicsWorld (): IPhysicsWorld {
    if (DEBUG && checkPhysicsModule(selector.wrapper.PhysicsWorld)) { return ENTIRE_WORLD; }
    return new selector.wrapper.PhysicsWorld();
}

const EntireBody: IRigidBody2D = {
    impl: null as any,
    rigidBody: null as any,
    isAwake: false,
    isSleeping: false,

    initialize: FUNC,

    setType: FUNC,

    setLinearDamping: FUNC,
    setAngularDamping: FUNC,
    setGravityScale: FUNC,
    setFixedRotation: FUNC,
    setAllowSleep: FUNC,

    isActive: FUNC,
    setActive: FUNC,

    wakeUp: FUNC,
    sleep: FUNC,

    getMass: FUNC,
    getInertia: FUNC,

    getLinearVelocity: FUNC,
    setLinearVelocity: FUNC,
    getLinearVelocityFromWorldPoint: FUNC,
    getAngularVelocity: FUNC,
    setAngularVelocity: FUNC,

    getLocalVector: FUNC,
    getWorldVector: FUNC,
    getLocalPoint: FUNC,
    getWorldPoint: FUNC,

    getLocalCenter: FUNC,
    getWorldCenter: FUNC,

    applyForce: FUNC,
    applyForceToCenter: FUNC,
    applyTorque: FUNC,
    applyLinearImpulse: FUNC,
    applyLinearImpulseToCenter: FUNC,
    applyAngularImpulse: FUNC,

    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
};

export function createRigidBody (): IRigidBody2D {
    const PHYSICS_2D_BUILTIN = selector.id === 'builtin';

    if (PHYSICS_2D_BUILTIN) {
        return EntireBody;
    } else {
        if (DEBUG && checkPhysicsModule(selector.wrapper.RigidBody)) { return EntireBody; }
        return new selector.wrapper.RigidBody();
    }
}

// shapes
const CREATE_COLLIDER_PROXY = { INITED: false };

interface IEntireShape extends IBoxShape, ICircleShape, IPolygonShape { }
const ENTIRE_SHAPE: IEntireShape = {
    impl: null,
    collider: null as unknown as any,
    worldAABB: null as unknown as any,
    worldPoints: null as unknown as any,
    worldPosition: null as unknown as any,
    worldRadius: null as unknown as any,

    initialize: FUNC,
    apply: FUNC,

    onLoad: FUNC,
    onEnable: FUNC,
    onDisable: FUNC,
    onDestroy: FUNC,
    onGroupChanged: FUNC,
};

export function createShape (type: ECollider2DType): IBaseShape {
    initColliderProxy();
    return CREATE_COLLIDER_PROXY[type]();
}

function initColliderProxy (): void {
    if (CREATE_COLLIDER_PROXY.INITED) return;
    CREATE_COLLIDER_PROXY.INITED = true;

    CREATE_COLLIDER_PROXY[ECollider2DType.BOX] = function createBoxShape (): IBoxShape {
        if (DEBUG && checkPhysicsModule(selector.wrapper.BoxShape)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.BoxShape();
    };

    CREATE_COLLIDER_PROXY[ECollider2DType.CIRCLE] = function createCircleShape (): ICircleShape {
        if (DEBUG && checkPhysicsModule(selector.wrapper.CircleShape)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.CircleShape();
    };

    CREATE_COLLIDER_PROXY[ECollider2DType.POLYGON] = function createPolygonShape (): IPolygonShape {
        if (DEBUG && checkPhysicsModule(selector.wrapper.PolygonShape)) { return ENTIRE_SHAPE; }
        return new selector.wrapper.PolygonShape();
    };
}

// joints
const CREATE_JOINT_PROXY = { INITED: false };

interface IEntireJoint extends IDistanceJoint, IFixedJoint, IMouseJoint, ISpringJoint, IRelativeJoint, ISliderJoint, IWheelJoint, IHingeJoint { }
const ENTIRE_JOINT: IEntireJoint = {
    impl: null,

    initialize: FUNC,
    apply: FUNC,

    setDampingRatio: FUNC,
    setFrequency: FUNC,
    setMaxForce: FUNC,
    setTarget: FUNC,
    setDistance: FUNC,
    setAngularOffset: FUNC,
    setCorrectionFactor: FUNC,
    setLinearOffset: FUNC,
    setMaxLength: FUNC,
    setMaxTorque: FUNC,
    setLowerLimit: FUNC,
    setUpperLimit: FUNC,
    setMaxMotorForce: FUNC,
    setMaxMotorTorque: FUNC,
    setMotorSpeed: FUNC,
    enableLimit: FUNC,
    enableMotor: FUNC,
    setLowerAngle: FUNC,
    setUpperAngle: FUNC,
};

export function createJoint (type: EJoint2DType): IJoint2D {
    initJointProxy();
    return CREATE_JOINT_PROXY[type]();
}

function initJointProxy (): void {
    if (CREATE_JOINT_PROXY.INITED) return;
    CREATE_JOINT_PROXY.INITED = true;

    const PHYSICS_2D_BUILTIN = selector.id === 'builtin';

    CREATE_JOINT_PROXY[EJoint2DType.SPRING] = function createSpringJoint (): ISpringJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.SpringJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.SpringJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.DISTANCE] = function createDistanceJoint (): IDistanceJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.DistanceJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.DistanceJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.FIXED] = function createFixedJoint (): IFixedJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.FixedJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.FixedJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.MOUSE] = function createMouseJoint (): IMouseJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.MouseJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.MouseJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.RELATIVE] = function createRelativeJoint (): IRelativeJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.RelativeJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.RelativeJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.SLIDER] = function createSliderJoint (): ISliderJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.SliderJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.SliderJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.WHEEL] = function createWheelJoint (): IWheelJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.WheelJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.WheelJoint();
        }
    };

    CREATE_JOINT_PROXY[EJoint2DType.HINGE] = function createHingeJoint (): IHingeJoint {
        if (PHYSICS_2D_BUILTIN) {
            return ENTIRE_JOINT;
        } else {
            if (DEBUG && checkPhysicsModule(selector.wrapper.HingeJoint)) { return ENTIRE_JOINT; }
            return new selector.wrapper.HingeJoint();
        }
    };
}
