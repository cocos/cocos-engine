/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

namespace se {

#define CAST_POOL_TYPE(type) static_cast<uint>(type)

#define BUFFER_POOL_BEGIN CAST_POOL_TYPE(se::PoolType::PASS)
#define ARRAY_POOL_BEGIN  CAST_POOL_TYPE(se::PoolType::SUB_MODEL_ARRAY)
#define RAW_BUFFER_BEGIN  CAST_POOL_TYPE(se::PoolType::RAW_BUFFER)
#define RAW_OBJECT_BEGIN  CAST_POOL_TYPE(se::PoolType::RAW_OBJECT)

#define OBJECTS_SIZE          CAST_POOL_TYPE(se::PoolType::FRAMEBUFFER) + 1
#define BUFFER_POOL_SIZE      CAST_POOL_TYPE(se::PoolType::PIPELINE_SHARED_SCENE_DATA) - BUFFER_POOL_BEGIN + 1
#define ARRAY_POOL_SIZE       CAST_POOL_TYPE(se::PoolType::UI_BATCH_ARRAY) - ARRAY_POOL_BEGIN + 1
#define RAW_BUFFER_SIZE       CAST_POOL_TYPE(se::PoolType::RAW_BUFFER) - CAST_POOL_TYPE(se::PoolType::RAW_BUFFER) + 1
#define RAW_OBJECT_SIZE       CAST_POOL_TYPE(se::PoolType::RAW_OBJECT) - CAST_POOL_TYPE(se::PoolType::RAW_OBJECT) + 1
#define BUFFER_ALLOCATOR_SIZE (ARRAY_POOL_SIZE + RAW_BUFFER_SIZE)
#define OBJECT_POOL_SIZE      (OBJECTS_SIZE + RAW_OBJECT_SIZE)

#define GET_OBJECT_POOL_ID(type)       CAST_POOL_TYPE(type) >= CAST_POOL_TYPE(se::PoolType::RAW_OBJECT) ? (CAST_POOL_TYPE(type) - RAW_OBJECT_BEGIN + OBJECTS_SIZE) : CAST_POOL_TYPE(type)
#define GET_BUFFER_POOL_ID(type)       CAST_POOL_TYPE(type) - BUFFER_POOL_BEGIN
#define GET_ARRAY_POOL_ID(type)        CAST_POOL_TYPE(type) >= RAW_BUFFER_BEGIN ? (CAST_POOL_TYPE(type) - RAW_BUFFER_BEGIN + ARRAY_POOL_SIZE) : CAST_POOL_TYPE(type) - ARRAY_POOL_BEGIN
#define IS_BUFFER_ALLOCATOR_TYPE(type) CAST_POOL_TYPE(type) >= ARRAY_POOL_BEGIN

enum class PoolType {
    // objects
    ATTRIBUTE,
    DESCRIPTOR_SETS,
    SHADER,
    INPUT_ASSEMBLER,
    PIPELINE_LAYOUT,
    FRAMEBUFFER,

    // buffers
    PASS = 100,
    SUB_MODEL,
    MODEL,
    SCENE,
    CAMERA,
    NODE,
    ROOT,
    AABB,
    RENDER_WINDOW,
    FRUSTUM,
    AMBIENT,
    FOG,
    SKYBOX,
    SHADOW,
    LIGHT,
    SPHERE,
    INSTANCED_ATTRIBUTE,
    FLAT_BUFFER,
    SUB_MESH,
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_TARGET,
    BLEND_STATE,
    UI_BATCH,
    PIPELINE_SHARED_SCENE_DATA,

    // array
    SUB_MODEL_ARRAY = 200,
    MODEL_ARRAY,
    ATTRIBUTE_ARRAY,
    FLAT_BUFFER_ARRAY,
    INSTANCED_ATTRIBUTE_ARRAY,
    LIGHT_ARRAY,
    BLEND_TARGET_ARRAY,
    UI_BATCH_ARRAY,

    // raw buffer
    RAW_BUFFER = 300,
    // raw Object
    RAW_OBJECT = 400,
    UNKNOWN
};
} // namespace se
