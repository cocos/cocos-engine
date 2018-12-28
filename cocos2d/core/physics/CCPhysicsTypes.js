/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/


var ContactType = {
    BEGIN_CONTACT: 'begin-contact',
    END_CONTACT: 'end-contact',
    PRE_SOLVE: 'pre-solve',
    POST_SOLVE: 'post-solve'
};

/**
 * !#en Enum for RigidBodyType.
 * !#zh 刚体类型
 * @enum RigidBodyType
 */
var BodyType = cc.Enum({
    /**
     * !#en 
     * zero mass, zero velocity, may be manually moved.
     * !#zh 
     * 零质量，零速度，可以手动移动。
     * @property {Number} Static
     */
    Static: 0,
    /**
     * !#en 
     * zero mass, non-zero velocity set by user.
     * !#zh 
     * 零质量，可以被设置速度。
     * @property {Number} Kinematic
     */
    Kinematic: 1,
    /**
     * !#en 
     * positive mass, non-zero velocity determined by forces.
     * !#zh 
     * 有质量，可以设置速度，力等。
     * @property {Number} Dynamic
     */
    Dynamic: 2,
    /**
     * !#en 
     * An extension of Kinematic type, can be animated by Animation.
     * !#zh
     * Kinematic 类型的扩展，可以被动画控制动画效果。
     * @property {Number} Animated
     */
    Animated: 3
});
cc.RigidBodyType = BodyType;

/**
 * !#en Enum for RayCastType.
 * !#zh 射线检测类型
 * @enum RayCastType
 */
var RayCastType = cc.Enum({
    /**
     * !#en 
     * Detects closest collider on the raycast path.
     * !#zh 
     * 检测射线路径上最近的碰撞体
     * @property {Number} Closest
     */
    Closest: 0,
    /**
     * !#en 
     * Detects any collider on the raycast path.
     * Once detects a collider, will stop the searching process.
     * !#zh 
     * 检测射线路径上任意的碰撞体。
     * 一旦检测到任何碰撞体，将立刻结束检测其他的碰撞体。
     * @property {Number} Any
     */
    Any: 1,
    /**
     * !#en 
     * Detects all colliders on the raycast path.
     * One collider may return several collision points(because one collider may have several fixtures, 
     * one fixture will return one point, the point may inside collider), AllClosest will return the closest one.
     * !#zh 
     * 检测射线路径上所有的碰撞体。
     * 同一个碰撞体上有可能会返回多个碰撞点(因为一个碰撞体可能由多个夹具组成，每一个夹具会返回一个碰撞点，碰撞点有可能在碰撞体内部)，AllClosest 删选同一个碰撞体上最近的哪一个碰撞点。
     * @property {Number} AllClosest
     */
    AllClosest: 2,

    /**
     * !#en 
     * Detects all colliders on the raycast path.
     * One collider may return several collision points, All will return all these points.
     * !#zh 
     * 检测射线路径上所有的碰撞体。
     * 同一个碰撞体上有可能会返回多个碰撞点，All 将返回所有这些碰撞点。
     * @property {Number} All
     */
    All: 3
});
cc.RayCastType = RayCastType;

module.exports = {
    BodyType: BodyType,
    ContactType: ContactType,
    RayCastType: RayCastType,
    
    DrawBits: b2.DrawFlags,

    PTM_RATIO: 32,
    ANGLE_TO_PHYSICS_ANGLE: -Math.PI / 180,
    PHYSICS_ANGLE_TO_ANGLE: -180 / Math.PI,
};
