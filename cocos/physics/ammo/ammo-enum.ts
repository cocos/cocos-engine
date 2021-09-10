/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @hidden
 */

export enum EBtSharedBodyDirty {
    BODY_RE_ADD = 1,
    GHOST_RE_ADD = 2,
}

export enum btCollisionFlags {
    CF_STATIC_OBJECT = 1,
    CF_KINEMATIC_OBJECT = 2,
    CF_NO_CONTACT_RESPONSE = 4,
    CF_CUSTOM_MATERIAL_CALLBACK = 8, // this allows per-triangle material (friction/restitution)
    CF_CHARACTER_OBJECT = 16,
    CF_DISABLE_VISUALIZE_OBJECT = 32, // disable debug drawing
    CF_DISABLE_SPU_COLLISION_PROCESSING = 64// disable parallel/SPU processing
}

export enum btCollisionObjectTypes {
    CO_COLLISION_OBJECT = 1,
    CO_RIGID_BODY = 2,
    /// CO_GHOST_OBJECT keeps track of all objects overlapping its AABB and that pass its collision filter
    /// It is useful for collision sensors, explosion objects, character controller etc.
    CO_GHOST_OBJECT = 4,
    CO_SOFT_BODY = 8,
    CO_HF_FLUID = 16,
    CO_USER_TYPE = 32,
    CO_FEATHERSTONE_LINK = 64
}

export enum btCollisionObjectStates {
    ACTIVE_TAG = 1,
    ISLAND_SLEEPING = 2,
    WANTS_DEACTIVATION = 3,
    // 静止休眠
    DISABLE_DEACTIVATION = 4,
    DISABLE_SIMULATION = 5,
}

export enum btRigidBodyFlags {
    BT_DISABLE_WORLD_GRAVITY = 1,
    /// The BT_ENABLE_GYROPSCOPIC_FORCE can easily introduce instability
    /// So generally it is best to not enable it.
    /// If really needed, run at a high frequency like 1000 Hertz:
    /// See Demos/GyroscopicDemo for an example use
    BT_ENABLE_GYROPSCOPIC_FORCE = 2
}

/// btDispatcher uses these types
/// IMPORTANT NOTE:The types are ordered polyhedral, implicit convex and concave
/// to facilitate type checking
/// CUSTOM_POLYHEDRAL_SHAPE_TYPE,CUSTOM_CONVEX_SHAPE_TYPE and CUSTOM_CONCAVE_SHAPE_TYPE can be used to extend Bullet without modifying source code
export enum btBroadphaseNativeTypes {
    // polyhedral convex shapes
    BOX_SHAPE_PROXYTYPE,
    TRIANGLE_SHAPE_PROXYTYPE,
    TETRAHEDRAL_SHAPE_PROXYTYPE,
    CONVEX_TRIANGLEMESH_SHAPE_PROXYTYPE,
    CONVEX_HULL_SHAPE_PROXYTYPE,
    CONVEX_POINT_CLOUD_SHAPE_PROXYTYPE,
    CUSTOM_POLYHEDRAL_SHAPE_TYPE,
    // implicit convex shapes
    IMPLICIT_CONVEX_SHAPES_START_HERE,
    SPHERE_SHAPE_PROXYTYPE,
    MULTI_SPHERE_SHAPE_PROXYTYPE,
    CAPSULE_SHAPE_PROXYTYPE,
    CONE_SHAPE_PROXYTYPE,
    CONVEX_SHAPE_PROXYTYPE,
    CYLINDER_SHAPE_PROXYTYPE,
    UNIFORM_SCALING_SHAPE_PROXYTYPE,
    MINKOWSKI_SUM_SHAPE_PROXYTYPE,
    MINKOWSKI_DIFFERENCE_SHAPE_PROXYTYPE,
    BOX_2D_SHAPE_PROXYTYPE,
    CONVEX_2D_SHAPE_PROXYTYPE,
    CUSTOM_CONVEX_SHAPE_TYPE,
    // concave shapes
    CONCAVE_SHAPES_START_HERE,
    // keep all the convex shapetype below here, for the check IsConvexShape in broadphase proxy!
    TRIANGLE_MESH_SHAPE_PROXYTYPE,
    SCALED_TRIANGLE_MESH_SHAPE_PROXYTYPE,
    /// used for demo integration FAST/Swift collision library and Bullet
    FAST_CONCAVE_MESH_PROXYTYPE,
    // terrain
    TERRAIN_SHAPE_PROXYTYPE,
    /// Used for GIMPACT Trimesh integration
    GIMPACT_SHAPE_PROXYTYPE,
    /// Multimaterial mesh
    MULTIMATERIAL_TRIANGLE_MESH_PROXYTYPE,

    EMPTY_SHAPE_PROXYTYPE,
    STATIC_PLANE_PROXYTYPE,
    CUSTOM_CONCAVE_SHAPE_TYPE,
    CONCAVE_SHAPES_END_HERE,

    COMPOUND_SHAPE_PROXYTYPE,

    SOFTBODY_SHAPE_PROXYTYPE,
    HFFLUID_SHAPE_PROXYTYPE,
    HFFLUID_BUOYANT_CONVEX_SHAPE_PROXYTYPE,
    INVALID_SHAPE_PROXYTYPE,

    MAX_BROADPHASE_COLLISION_TYPES
}
