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

#include "DebugUtils.h"
#include "GslUtils.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphNames.h"
#include "LayoutGraphTypes.h"
#include "NativePipelineGraphs.h"
#include "Pmr.h"
#include "Range.h"
#include "RenderCommonNames.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"


namespace cc {

namespace render {

void NativeLayoutGraphBuilder::clear() {
    *data = LayoutGraphData(data->get_allocator());
}

uint32_t NativeLayoutGraphBuilder::addRenderStage(const ccstd::string &name) {
    return add_vertex(*data, RenderStageTag{}, name.c_str());
}

uint32_t NativeLayoutGraphBuilder::addRenderPhase(const ccstd::string &name, uint32_t parentID) {
    return add_vertex(*data, RenderPhaseTag{}, name.c_str(), parentID);
}

void NativeLayoutGraphBuilder::addShader(const ccstd::string &name, uint32_t parentPhaseID) {
    auto res = data->shaderLayoutIndex.emplace(name.c_str(), parentPhaseID);
    CC_ENSURES(res.second);
}

void NativeLayoutGraphBuilder::addDescriptorBlock(
    uint32_t nodeID,
    const DescriptorBlockIndex &index, const DescriptorBlockFlattened &b) {
    auto &g = *data;
    auto &ppl = get(LayoutGraphData::Layout, g, nodeID);

    CC_EXPECTS(b.descriptorNames.size() == b.descriptors.size());
    CC_EXPECTS(b.uniformBlockNames.size() == b.uniformBlocks.size());
    DescriptorBlock block;
    for (uint32_t i = 0; i != b.descriptorNames.size(); ++i) {
        block.descriptors.emplace(b.descriptorNames[i], b.descriptors[i]);
    }
    for (uint32_t i = 0; i != b.uniformBlockNames.size(); ++i) {
        block.uniformBlocks.emplace(b.uniformBlockNames[i], b.uniformBlocks[i]);
    }
    block.capacity = b.capacity;
    block.count = b.count;

    CC_ASSERT(block.capacity);
    auto &layout = ppl.descriptorSets[index.updateFrequency].descriptorSetLayoutData;

    // add block
    layout.descriptorBlocks.emplace_back(
        index.descriptorType, index.visibility, block.capacity);

    auto &dstBlock = layout.descriptorBlocks.back();
    dstBlock.offset = layout.capacity;
    dstBlock.capacity = block.capacity;
    for (const auto &pairD : block.descriptors) {
        const auto &name = pairD.first;
        const auto &d = pairD.second;
        auto iter = g.attributeIndex.find(std::string_view(name));
        if (iter == g.attributeIndex.end()) {
            auto attrID = gsl::narrow_cast<uint32_t>(g.valueNames.size());
            g.valueNames.emplace_back(name);
            bool added = false;
            std::tie(iter, added) = g.attributeIndex.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(name),
                std::forward_as_tuple(NameLocalID{attrID}));
            CC_ENSURES(added);
        }
        const auto &nameID = iter->second;
        dstBlock.descriptors.emplace_back(nameID, gfx::Type::UNKNOWN, d.count);
    }
    // update layout
    layout.capacity += block.capacity;
}

void NativeLayoutGraphBuilder::addUniformBlock(uint32_t nodeID, const DescriptorBlockIndex &index, const ccstd::string &name, const gfx::UniformBlock &uniformBlock) {
    auto &g = *data;
    auto &ppl = get(LayoutGraphData::Layout, g, nodeID);
    auto &layout = ppl.descriptorSets[index.updateFrequency].descriptorSetLayoutData;
    auto iter = g.attributeIndex.find(std::string_view(name));
    if (iter == g.attributeIndex.end()) {
        auto attrID = gsl::narrow_cast<uint32_t>(g.valueNames.size());
        g.valueNames.emplace_back(name);
        bool added = false;
        std::tie(iter, added) = g.attributeIndex.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name),
            std::forward_as_tuple(NameLocalID{attrID}));
        CC_ENSURES(added);
    }
    const auto &nameID = iter->second;
    layout.uniformBlocks.emplace(nameID, uniformBlock);
}

namespace {

gfx::DescriptorType getGfxType(DescriptorTypeOrder type) {
    switch (type) {
        case DescriptorTypeOrder::UNIFORM_BUFFER:
            return gfx::DescriptorType::UNIFORM_BUFFER;
        case DescriptorTypeOrder::DYNAMIC_UNIFORM_BUFFER:
            return gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER;
        case DescriptorTypeOrder::SAMPLER_TEXTURE:
            return gfx::DescriptorType::SAMPLER_TEXTURE;
        case DescriptorTypeOrder::SAMPLER:
            return gfx::DescriptorType::SAMPLER;
        case DescriptorTypeOrder::TEXTURE:
            return gfx::DescriptorType::TEXTURE;
        case DescriptorTypeOrder::STORAGE_BUFFER:
            return gfx::DescriptorType::STORAGE_BUFFER;
        case DescriptorTypeOrder::DYNAMIC_STORAGE_BUFFER:
            return gfx::DescriptorType::DYNAMIC_STORAGE_BUFFER;
        case DescriptorTypeOrder::STORAGE_IMAGE:
            return gfx::DescriptorType::STORAGE_IMAGE;
        case DescriptorTypeOrder::INPUT_ATTACHMENT:
            return gfx::DescriptorType::INPUT_ATTACHMENT;
    }
    throw std::invalid_argument("DescriptorType not found");
}

IntrusivePtr<gfx::DescriptorSetLayout> createDescriptorSetLayout(
    gfx::Device *device, const DescriptorSetLayoutData &layoutData) {
    gfx::DescriptorSetLayoutInfo info;

    for (const auto &block : layoutData.descriptorBlocks) {
        uint32_t slot = block.offset;
        for (const auto &d : block.descriptors) {
            gfx::DescriptorSetLayoutBinding binding;
            binding.binding = slot;
            binding.descriptorType = getGfxType(block.type);
            binding.count = d.count;
            binding.stageFlags = block.visibility;
            binding.immutableSamplers = {};
            info.bindings.emplace_back(std::move(binding));
            slot += d.count;
        }
    }

    return {device->createDescriptorSetLayout(info)};
}

} // namespace

void NativeLayoutGraphBuilder::reserveDescriptorBlock(
    uint32_t nodeID,
    const DescriptorBlockIndex &index, const DescriptorBlockFlattened &block) {
    auto &g = *data;
    auto &ppl = get(LayoutGraphData::Layout, g, nodeID);

    CC_ASSERT(block.capacity);
    auto &layout = ppl.descriptorSets[index.updateFrequency].descriptorSetLayoutData;

    // add block
    layout.descriptorBlocks.emplace_back(
        index.descriptorType, index.visibility, block.capacity);

    auto &dstBlock = layout.descriptorBlocks.back();
    dstBlock.offset = layout.capacity;
    dstBlock.capacity = block.capacity;

    // update layout
    layout.capacity += block.capacity;
}

int NativeLayoutGraphBuilder::compile() {
    auto &g = *data;
    // create descriptor sets
    for (const auto v : makeRange(vertices(g))) {
        auto &ppl = get(LayoutGraphData::Layout, g, v);
        for (auto &levelPair : ppl.descriptorSets) {
            auto &level = levelPair.second;
            const auto &layoutData = level.descriptorSetLayoutData;
            level.descriptorSetLayout = createDescriptorSetLayout(device, layoutData);
            level.descriptorSet = device->createDescriptorSet(
                gfx::DescriptorSetInfo{level.descriptorSetLayout.get()});
        }
    }

#ifdef _DEBUG
    CC_LOG_DEBUG(print().c_str());
#endif // _DEBUG

    return 0;
}

namespace {

ccstd::string getName(gfx::ShaderStageFlagBit stage) {
    std::ostringstream oss;
    int count = 0;
    if (hasFlag(stage, gfx::ShaderStageFlagBit::VERTEX)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Vertex";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::CONTROL)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Control";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::EVALUATION)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Evaluation";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::GEOMETRY)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Geometry";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::FRAGMENT)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Fragment";
    }
    if (hasFlag(stage, gfx::ShaderStageFlagBit::COMPUTE)) {
        if (count++) {
            oss << " | ";
        }
        oss << "Compute";
    }
    if (hasAllFlags(stage, gfx::ShaderStageFlagBit::ALL)) {
        if (count++) {
            oss << " | ";
        }
        oss << "All";
    }
    return oss.str();
}

} // namespace

ccstd::string NativeLayoutGraphBuilder::print() const {
    std::ostringstream oss;
    boost::container::pmr::unsynchronized_pool_resource pool(
        boost::container::pmr::get_default_resource());
    ccstd::pmr::string space(&pool);

    oss << "\n";

    auto &g = *data;
    for (const auto v : makeRange(vertices(g))) {
        if (parent(v, g) != LayoutGraphData::null_vertex()) {
            continue;
        }
        const auto &name = get(LayoutGraphData::Name, g, v);
        const auto &freq = get(LayoutGraphData::Update, g, v);
        OSS << "\"" << name << "\": ";

        visit(
            [&](auto tag) {
                oss << getName(tag);
            },
            tag(v, g));

        oss << "<" << getName(freq) << "> {\n";
        INDENT_BEG();
        const auto &info = get(LayoutGraphData::Layout, g, v);
        for (const auto &set : info.descriptorSets) {
            OSS << "Set<" << getName(set.first) << "> {\n";
            {
                INDENT();
                for (const auto &block : set.second.descriptorSetLayoutData.descriptorBlocks) {
                    OSS << "Block<" << getName(block.type) << ", " << getName(block.visibility) << "> {\n";
                    {
                        INDENT();
                        OSS << "capacity: " << block.capacity << ",\n";
                        OSS << "count: " << block.descriptors.size() << ",\n";
                        if (!block.descriptors.empty()) {
                            OSS << "Descriptors{ ";
                            int count = 0;
                            for (const auto &d : block.descriptors) {
                                if (count++) {
                                    oss << ", ";
                                }
                                const auto &name = g.valueNames.at(d.descriptorID.value);
                                oss << "\"" << name;
                                if (d.count != 1) {
                                    oss << "[" << d.count << "]";
                                }
                                oss << "\"";
                            }
                            oss << " }\n";
                        }
                    }
                    OSS << "}\n";
                }
            }
            OSS << "}\n";
        }
        INDENT_END();
        OSS << "}\n";
    }
    return oss.str();
}

} // namespace render

} // namespace cc
