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

#include "LayoutGraphUtils.h"
#include <tuple>
#include <utility>
#include "cocos/base/std/container/string.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "details/Map.h"

namespace cc {

namespace render {

namespace {

DescriptorBlockData& getDescriptorBlockData(
    PmrTransparentMap<DescriptorBlockIndex, DescriptorBlockData>& map,
    const DescriptorBlockIndex& index) {
    auto iter = map.find(index);
    if (iter != map.end()) {
        return iter->second;
    }
    iter = map.emplace(
                  std::piecewise_construct,
                  std::forward_as_tuple(index),
                  std::forward_as_tuple())
               .first;

    return iter->second;
}

} // namespace

NameLocalID getOrCreateDescriptorID(LayoutGraphData& lg, std::string_view name) {
    auto iter = lg.attributeIndex.find(name);
    if (iter != lg.attributeIndex.end()) {
        return iter->second;
    }
    const auto id = static_cast<uint32_t>(lg.valueNames.size());
    lg.attributeIndex.emplace(name, NameLocalID{id});
    lg.valueNames.emplace_back(name);
    return NameLocalID{id};
}

void makeDescriptorSetLayoutData(
    LayoutGraphData& lg, UpdateFrequency rate, uint32_t set,
    const IDescriptorInfo& descriptors, DescriptorSetLayoutData& data,
    boost::container::pmr::memory_resource* scratch) {
    PmrTransparentMap<DescriptorBlockIndex, DescriptorBlockData> map(scratch);
    PmrMap<NameLocalID, gfx::UniformBlock> uniformBlocks(scratch);
    for (const auto& cb : descriptors.blocks) {
        auto& block = getDescriptorBlockData(
            map, DescriptorBlockIndex{
                     rate, ParameterType::TABLE,
                     DescriptorTypeOrder::UNIFORM_BUFFER, cb.stageFlags});

        const auto nameID = getOrCreateDescriptorID(lg, cb.name);
        block.descriptors.emplace_back(nameID, gfx::Type::UNKNOWN, 1);
        // add uniform buffer
        uniformBlocks.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(nameID),
            std::forward_as_tuple(gfx::UniformBlock{set, 0xFFFFFFFF, cb.name, cb.members, 1}));
    }
}

} // namespace render

} // namespace cc
