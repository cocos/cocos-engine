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

template <typename DeviceResourceType, typename DescriptorType>
struct DeviceResourceCreator final {
    inline DeviceResourceType *operator()(const DescriptorType & /*desc*/) const {
        return nullptr;
    }
};

template <typename DescriptorType>
struct ResourceTypeLookupTable final {};

template <typename DeviceResourceType, typename DescriptorType,
          typename DeviceResourceCreatorType = DeviceResourceCreator<DeviceResourceType, DescriptorType>>
class Resource final {
public:
    using Allocator      = ResourceAllocator<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>;
    using DeviceResource = DeviceResourceType;
    using Descriptor     = DescriptorType;

    Resource() = default;
    explicit Resource(const Descriptor &desc);
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
    explicit Resource(DeviceResourceType *external);

    Descriptor          _desc;
    DeviceResourceType *_deviceObject{nullptr};

    friend class FrameGraph;
};

//////////////////////////////////////////////////////////////////////////

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::Resource(const Descriptor &desc)
: _desc(desc) {
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::Resource(DeviceResourceType *external)
: _desc(external->getInfo()), _deviceObject(external) {
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::createTransient() noexcept {
    _deviceObject = Allocator::getInstance().alloc(_desc);
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::createPersistent() noexcept {
    if (!_deviceObject) {
        DeviceResourceCreatorType creator;
        _deviceObject = creator(_desc);
    }
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::destroyTransient() noexcept {
    Allocator::getInstance().free(_deviceObject);
    _deviceObject = nullptr;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
void Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::destroyPersistent() noexcept {
    if (_deviceObject) {
        delete _deviceObject;
        _deviceObject = nullptr;
    }
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
DeviceResourceType *Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::get() const noexcept {
    return _deviceObject;
}

template <typename DeviceResourceType, typename DescriptorType, typename DeviceResourceCreatorType>
const DescriptorType &Resource<DeviceResourceType, DescriptorType, DeviceResourceCreatorType>::getDesc() const noexcept {
    return _desc;
}

//////////////////////////////////////////////////////////////////////////

#define DEFINE_GFX_RESOURCE(Type)                                         \
    template <>                                                           \
    struct DeviceResourceCreator<gfx::Type, gfx::Type##Info> final {      \
        inline gfx::Type *operator()(const gfx::Type##Info &desc) const { \
            return gfx::Device::getInstance()->create##Type(desc);        \
        }                                                                 \
    };                                                                    \
    using Type         = Resource<gfx::Type, gfx::Type##Info>;            \
    using Type##Handle = TypedHandle<Type>;                               \
    template <>                                                           \
    struct ResourceTypeLookupTable<gfx::Type##Info> final {               \
        using Resource = Type;                                            \
    };

// Descriptors must have std::hash specialization and == operators
DEFINE_GFX_RESOURCE(Buffer)
DEFINE_GFX_RESOURCE(Framebuffer)
DEFINE_GFX_RESOURCE(RenderPass)
DEFINE_GFX_RESOURCE(Texture)

} // namespace framegraph
} // namespace cc
