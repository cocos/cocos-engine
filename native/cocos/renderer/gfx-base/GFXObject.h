/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GFXDef.h"
#include "base/Object.h"
#include "base/RefCounted.h"

namespace cc {
namespace gfx {

class GFXObject : public Object {
public:
    explicit GFXObject(ObjectType type);
    ~GFXObject() override = default;

    inline ObjectType getObjectType() const { return _objectType; }
    inline uint32_t   getObjectID() const { return _objectID; }
    inline uint32_t   getTypedID() const { return _typedID; }

protected:
    template <typename T>
    static uint32_t generateObjectID() noexcept {
        static uint32_t generator = 1 << 16;
        return ++generator;
    }

    ObjectType _objectType = ObjectType::UNKNOWN;
    uint32_t   _objectID   = 0U;

    uint32_t _typedID = 0U; // inited by sub-classes
};

} // namespace gfx
} // namespace cc
