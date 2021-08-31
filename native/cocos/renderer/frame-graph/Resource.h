/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "ResourceAllocator.h"

#include "Handle.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXFramebuffer.h"
#include "renderer/gfx-base/GFXRenderPass.h"
#include "renderer/gfx-base/GFXTexture.h"

namespace cc {
namespace framegraph {

template <typename DescriptorType>
struct ResourceDescriptorHasher final {
    inline uint32_t operator()(const DescriptorType & /*desc*/) const {
        return 1;
    }
};

template <typename DeviceResourceType, typename DescriptorType>
struct DeviceResourceCreator final {
    inline DeviceResourceType *operator()(const DescriptorType & /*desc*/) const {
        return nullptr;
    }
};

template <typename DeviceResourceType, typename DescriptorType,
          typename DeviceResourceCreatorType = DeviceResourceCreator<DeviceResourceType, DescriptorType>,
          typename DescriptorHasherType      = ResourceDescriptorHasher<DescriptorType>>
class Resource final {
public:
    using Allocator        = ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>;
    using DescriptorHash   = typename Allocator::DescriptorHash;
    using DeviceResource   = DeviceResourceType;
    using Descriptor       = DescriptorType;
    using DescriptorHasher = DescriptorHasherType;

    Resource() = default;
    explicit Resource(const Descriptor &desc) noexcept;
    ~Resource()                    = default;
    Resource(const Resource &)     = default;
    Resource(Resource &&) noexcept = default;
    Resource &operator=(const Resource &) = default;
    Resource &operator=(Resource &&) noexcept = default;

    void createTransient() noexcept;
    void createPersistent() noexcept;

    void                       destroyTransient() noexcept;
    void                       destroyPersistent() noexcept;
    inline DeviceResourceType *get() const noexcept;
    inline const Descriptor &  getDesc() const noexcept;

private:
    void computeHash() noexcept;

    Descriptor          _desc;
    DescriptorHash      _hash{0};
    DeviceResourceType *_deviceObject{nullptr};
};

//////////////////////////////////////////////////////////////////////////

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::Resource(const Descriptor &desc) noexcept
: _desc(desc) {
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::createTransient() noexcept {
    computeHash();
    _deviceObject = Allocator::getInstance().alloc(_desc, _hash);
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::createPersistent() noexcept {
    computeHash();

    if (!_deviceObject) {
        DeviceResourceCreatorType creator;
        _deviceObject = creator(_desc);
    }
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::destroyTransient() noexcept {
    CC_ASSERT(_hash);
    Allocator::getInstance().free(_desc, _hash, _deviceObject);
    _deviceObject = nullptr;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::destroyPersistent() noexcept {
    if (_deviceObject) {
        delete _deviceObject;
        _deviceObject = nullptr;
    }
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
DeviceResourceType *Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::get() const noexcept {
    return _deviceObject;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
const DescriptorType &Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::getDesc() const noexcept {
    return _desc;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType, typename DescriptorHasherType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType, DescriptorHasherType>::computeHash() noexcept {
    if (!_hash) {
        DescriptorHasher hasher;
        _hash = hasher(_desc);
    }
}

//////////////////////////////////////////////////////////////////////////

#define DEFINE_GFX_RESOURCE(Type)                                         \
    template <>                                                           \
    struct ResourceDescriptorHasher<gfx::Type##Info> final {              \
        inline uint32_t operator()(const gfx::Type##Info &desc) const {   \
            return gfx::Type::computeHash(desc);                          \
        }                                                                 \
    };                                                                    \
                                                                          \
    template <>                                                           \
    struct DeviceResourceCreator<gfx::Type, gfx::Type##Info> final {      \
        inline gfx::Type *operator()(const gfx::Type##Info &desc) const { \
            return gfx::Device::getInstance()->create##Type(desc);        \
        }                                                                 \
    };                                                                    \
    using Type         = Resource<gfx::Type, gfx::Type##Info>;            \
    using Type##Handle = TypedHandle<Type>;

DEFINE_GFX_RESOURCE(Buffer)
DEFINE_GFX_RESOURCE(Framebuffer)
DEFINE_GFX_RESOURCE(RenderPass)
DEFINE_GFX_RESOURCE(Texture)

} // namespace framegraph
} // namespace cc
