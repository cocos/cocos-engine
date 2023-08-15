/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once
#include "scene/gpu-scene/Const.h"
#include "base/std/container/vector.h"
#include "base/std/container/list.h"
#include "base/RefCounted.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "math/Vec4.h"
#include "math/Mat4.h"

namespace cc {

namespace gfx {
class Buffer;
}

namespace scene {
class GPUScene;
class Model;

struct ObjectData {
    Mat4 matWorld;
    Mat4 matWorldIT;
    Vec4 sphere;
    Vec4 halfExtents;
    Vec4 lightingMapUVParam;
    Vec4 localShadowBias;
};

class CC_DLL GPUObjectPool final : public RefCounted {
public:
    GPUObjectPool() = default;
    ~GPUObjectPool() override = default;

    void activate(GPUScene* scene);
    void destroy();
    void update(uint32_t stamp);

    void addModel(const Model* model);
    void removeModel(const Model* model);
    void removeAllModels();

    inline gfx::Buffer* getObjectBuffer() { return _objectBuffer.get(); }

private:
    void createBuffer();
    void updateBuffer();

    GPUScene* _gpuScene{nullptr};
    ccstd::vector<ObjectData> _objects;
    ccstd::list<uint32_t> _freeSlots;
    bool _dirty{false};

    IntrusivePtr<gfx::Buffer> _objectBuffer;
    uint32_t _objectCapacity{GPU_OBJECT_COUNT_INIT};
};

} // namespace scene
} // namespace cc
