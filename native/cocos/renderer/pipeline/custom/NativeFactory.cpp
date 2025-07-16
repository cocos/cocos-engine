/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include <sstream>
#include "BinaryArchive.h"
#include "LayoutGraphSerialization.h"
#include "NativePipelineTypes.h"
#include "RenderInterfaceTypes.h"
#include "RenderingModule.h"
#include "details/GslUtils.h"
#include "pipeline/custom/details/Pmr.h"

namespace cc {

namespace render {

namespace {

NativeRenderingModule* sRenderingModule = nullptr;
NativePipeline* sPipeline = nullptr;

} // namespace

RenderingModule* Factory::init(gfx::Device* deviceIn, const ccstd::vector<unsigned char>& bufferIn) {
    std::shared_ptr<NativeProgramLibrary> ptr(
        allocatePmrUniquePtr<NativeProgramLibrary>(
            boost::container::pmr::get_default_resource()));
    {
        std::string buffer(bufferIn.begin(), bufferIn.end());
        std::istringstream iss(buffer, std::ios::binary);
        BinaryInputArchive ar(iss, boost::container::pmr::get_default_resource());
        load(ar, ptr->layoutGraph);
    }
    ptr->init(deviceIn);

    sRenderingModule = ccnew NativeRenderingModule(std::move(ptr));
    return sRenderingModule;
}

void Factory::destroy(RenderingModule* renderingModule) noexcept {
    auto* ptr = dynamic_cast<NativeRenderingModule*>(renderingModule);
    if (ptr) {
        ptr->programLibrary.reset();
        CC_EXPECTS(sRenderingModule == renderingModule);
        sRenderingModule = nullptr;
        sPipeline = nullptr;
    }
}

Pipeline* Factory::createPipeline() {
    if (sPipeline) {
        return sPipeline;
    }
    sPipeline = ccnew NativePipeline(boost::container::pmr::get_default_resource());
    CC_EXPECTS(sRenderingModule);
    sRenderingModule->programLibrary->pipeline = sPipeline;
    return sPipeline;
}

ProgramLibrary* getProgramLibrary() {
    if (!sRenderingModule) {
        return nullptr;
    }
    return sRenderingModule->programLibrary.get();
}

RenderingModule* getRenderingModule() {
    return sRenderingModule;
}

} // namespace render

} // namespace cc
