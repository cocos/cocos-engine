/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
#pragma once
#include "cocos/renderer/pipeline/custom/ArchiveTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCommonSerialization.h"
#include "cocos/renderer/pipeline/custom/details/Range.h"
#include "cocos/renderer/pipeline/custom/details/SerializationUtils.h"

namespace cc {

namespace render {

inline void save(OutputArchive& ar, const DescriptorDB& v) {
    save(ar, v.blocks);
}

inline void load(InputArchive& ar, DescriptorDB& v) {
    load(ar, v.blocks);
}

inline void save(OutputArchive& ar, const RenderPhase& v) {
    save(ar, v.shaders);
}

inline void load(InputArchive& ar, RenderPhase& v) {
    load(ar, v.shaders);
}

inline void save(OutputArchive& ar, const LayoutGraph& g) {
    using Graph = LayoutGraph;
    using VertexT = Graph::vertex_descriptor;
    using SizeT = Graph::vertices_size_type;
    static_assert(std::is_same_v<SizeT, VertexT>);

    const auto numVertices = num_vertices(g);
    const auto numEdges = num_edges(g);
    save(ar, numVertices);
    save(ar, numEdges);

    save(ar, static_cast<SizeT>(g.stages.size()));
    save(ar, static_cast<SizeT>(g.phases.size()));

    const auto nameMap = get(Graph::NameTag{}, g);
    const auto descriptorsMap = get(Graph::DescriptorsTag{}, g);
    for (const auto& v : makeRange(vertices(g))) {
        const auto typeID = static_cast<SizeT>(tag(v, g).index());
        static_assert(std::is_same_v<decltype(typeID), const SizeT>);
        save(ar, typeID);
        save(ar, parent(v, g));
        save(ar, get(nameMap, v));
        save(ar, get(descriptorsMap, v));
        visitObject(
            v, g,
            overload(
                [&](const auto& object) {
                    save(ar, object);
                }));
    }
}

inline void load(InputArchive& ar, LayoutGraph& g) {
    using Graph = LayoutGraph;
    using VertexT = Graph::vertex_descriptor;
    using SizeT = Graph::vertices_size_type;
    static_assert(std::is_same_v<SizeT, VertexT>);

    SizeT numVertices = 0;
    SizeT numEdges = 0;
    load(ar, numVertices);
    load(ar, numEdges);
    g.reserve(numVertices);

    SizeT stages = 0;
    SizeT phases = 0;
    load(ar, stages);
    load(ar, phases);
    g.stages.reserve(stages);
    g.phases.reserve(phases);

    const auto nameMap = get(Graph::NameTag{}, g);
    const auto descriptorsMap = get(Graph::DescriptorsTag{}, g);
    for (SizeT v = 0; v != numVertices; ++v) {
        SizeT id = std::numeric_limits<SizeT>::max();
        VertexT u = Graph::null_vertex();
        ccstd::pmr::string name(g.get_allocator());
        DescriptorDB descriptors(g.get_allocator());
        load(ar, id);
        load(ar, u);
        load(ar, name);
        load(ar, descriptors);
        switch (id) {
            case 0: {
                uint32_t val;
                load(ar, val);
                addVertex(std::move(name), std::move(descriptors), val, g, u);
                break;
            }
            case 1: {
                RenderPhase val(g.get_allocator());
                load(ar, val);
                addVertex(std::move(name), std::move(descriptors), std::move(val), g, u);
                break;
            }
            default:
                throw std::runtime_error("load graph failed");
        }
    }
}

inline void save(OutputArchive& ar, const UniformData& v) {
    save(ar, v.uniformID);
    save(ar, v.uniformType);
    save(ar, v.offset);
    save(ar, v.size);
}

inline void load(InputArchive& ar, UniformData& v) {
    load(ar, v.uniformID);
    load(ar, v.uniformType);
    load(ar, v.offset);
    load(ar, v.size);
}

inline void save(OutputArchive& ar, const UniformBlockData& v) {
    save(ar, v.bufferSize);
    save(ar, v.uniforms);
}

inline void load(InputArchive& ar, UniformBlockData& v) {
    load(ar, v.bufferSize);
    load(ar, v.uniforms);
}

inline void save(OutputArchive& ar, const NameLocalID& v) {
    save(ar, v.value);
}

inline void load(InputArchive& ar, NameLocalID& v) {
    load(ar, v.value);
}

inline void save(OutputArchive& ar, const DescriptorData& v) {
    save(ar, v.descriptorID);
    save(ar, v.type);
    save(ar, v.count);
}

inline void load(InputArchive& ar, DescriptorData& v) {
    load(ar, v.descriptorID);
    load(ar, v.type);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const DescriptorBlockData& v) {
    save(ar, v.type);
    save(ar, v.visibility);
    save(ar, v.offset);
    save(ar, v.capacity);
    save(ar, v.descriptors);
}

inline void load(InputArchive& ar, DescriptorBlockData& v) {
    load(ar, v.type);
    load(ar, v.visibility);
    load(ar, v.offset);
    load(ar, v.capacity);
    load(ar, v.descriptors);
}

inline void save(OutputArchive& ar, const DescriptorSetLayoutData& v) {
    save(ar, v.slot);
    save(ar, v.capacity);
    save(ar, v.uniformBlockCapacity);
    save(ar, v.samplerTextureCapacity);
    save(ar, v.descriptorBlocks);
    save(ar, v.uniformBlocks);
    save(ar, v.bindingMap);
}

inline void load(InputArchive& ar, DescriptorSetLayoutData& v) {
    load(ar, v.slot);
    load(ar, v.capacity);
    load(ar, v.uniformBlockCapacity);
    load(ar, v.samplerTextureCapacity);
    load(ar, v.descriptorBlocks);
    load(ar, v.uniformBlocks);
    load(ar, v.bindingMap);
}

inline void save(OutputArchive& ar, const DescriptorSetData& v) {
    save(ar, v.descriptorSetLayoutData);
    save(ar, v.descriptorSetLayoutInfo);
    // skip, descriptorSetLayout: IntrusivePtr<gfx::DescriptorSetLayout>
    // skip, descriptorSet: IntrusivePtr<gfx::DescriptorSet>
}

inline void load(InputArchive& ar, DescriptorSetData& v) {
    load(ar, v.descriptorSetLayoutData);
    load(ar, v.descriptorSetLayoutInfo);
    // skip, descriptorSetLayout: IntrusivePtr<gfx::DescriptorSetLayout>
    // skip, descriptorSet: IntrusivePtr<gfx::DescriptorSet>
}

inline void save(OutputArchive& ar, const PipelineLayoutData& v) {
    save(ar, v.descriptorSets);
}

inline void load(InputArchive& ar, PipelineLayoutData& v) {
    load(ar, v.descriptorSets);
}

inline void save(OutputArchive& ar, const ShaderBindingData& v) {
    save(ar, v.descriptorBindings);
}

inline void load(InputArchive& ar, ShaderBindingData& v) {
    load(ar, v.descriptorBindings);
}

inline void save(OutputArchive& ar, const ShaderLayoutData& v) {
    save(ar, v.layoutData);
    save(ar, v.bindingData);
}

inline void load(InputArchive& ar, ShaderLayoutData& v) {
    load(ar, v.layoutData);
    load(ar, v.bindingData);
}

inline void save(OutputArchive& ar, const TechniqueData& v) {
    save(ar, v.passes);
}

inline void load(InputArchive& ar, TechniqueData& v) {
    load(ar, v.passes);
}

inline void save(OutputArchive& ar, const EffectData& v) {
    save(ar, v.techniques);
}

inline void load(InputArchive& ar, EffectData& v) {
    load(ar, v.techniques);
}

inline void save(OutputArchive& ar, const ShaderProgramData& v) {
    save(ar, v.layout);
    // skip, pipelineLayout: IntrusivePtr<gfx::PipelineLayout>
}

inline void load(InputArchive& ar, ShaderProgramData& v) {
    load(ar, v.layout);
    // skip, pipelineLayout: IntrusivePtr<gfx::PipelineLayout>
}

inline void save(OutputArchive& ar, const RenderStageData& v) {
    save(ar, v.descriptorVisibility);
}

inline void load(InputArchive& ar, RenderStageData& v) {
    load(ar, v.descriptorVisibility);
}

inline void save(OutputArchive& ar, const RenderPhaseData& v) {
    save(ar, v.rootSignature);
    save(ar, v.shaderPrograms);
    save(ar, v.shaderIndex);
    // skip, pipelineLayout: IntrusivePtr<gfx::PipelineLayout>
}

inline void load(InputArchive& ar, RenderPhaseData& v) {
    load(ar, v.rootSignature);
    load(ar, v.shaderPrograms);
    load(ar, v.shaderIndex);
    // skip, pipelineLayout: IntrusivePtr<gfx::PipelineLayout>
}

inline void save(OutputArchive& ar, const LayoutGraphData& g) {
    using Graph = LayoutGraphData;
    using VertexT = Graph::vertex_descriptor;
    using SizeT = Graph::vertices_size_type;
    static_assert(std::is_same_v<SizeT, VertexT>);

    const auto numVertices = num_vertices(g);
    const auto numEdges = num_edges(g);
    save(ar, numVertices);
    save(ar, numEdges);

    save(ar, static_cast<SizeT>(g.stages.size()));
    save(ar, static_cast<SizeT>(g.phases.size()));

    const auto nameMap = get(Graph::NameTag{}, g);
    const auto updateMap = get(Graph::UpdateTag{}, g);
    const auto layoutMap = get(Graph::LayoutTag{}, g);
    for (const auto& v : makeRange(vertices(g))) {
        const auto typeID = static_cast<SizeT>(tag(v, g).index());
        static_assert(std::is_same_v<decltype(typeID), const SizeT>);
        save(ar, typeID);
        save(ar, parent(v, g));
        save(ar, get(nameMap, v));
        save(ar, get(updateMap, v));
        save(ar, get(layoutMap, v));
        visitObject(
            v, g,
            overload(
                [&](const auto& object) {
                    save(ar, object);
                }));
    }
    save(ar, g.valueNames);
    save(ar, g.attributeIndex);
    save(ar, g.constantIndex);
    save(ar, g.shaderLayoutIndex);
    save(ar, g.effects);
}

inline void load(InputArchive& ar, LayoutGraphData& g) {
    using Graph = LayoutGraphData;
    using VertexT = Graph::vertex_descriptor;
    using SizeT = Graph::vertices_size_type;
    static_assert(std::is_same_v<SizeT, VertexT>);

    SizeT numVertices = 0;
    SizeT numEdges = 0;
    load(ar, numVertices);
    load(ar, numEdges);
    g.reserve(numVertices);

    SizeT stages = 0;
    SizeT phases = 0;
    load(ar, stages);
    load(ar, phases);
    g.stages.reserve(stages);
    g.phases.reserve(phases);

    const auto nameMap = get(Graph::NameTag{}, g);
    const auto updateMap = get(Graph::UpdateTag{}, g);
    const auto layoutMap = get(Graph::LayoutTag{}, g);
    for (SizeT v = 0; v != numVertices; ++v) {
        SizeT id = std::numeric_limits<SizeT>::max();
        VertexT u = Graph::null_vertex();
        ccstd::pmr::string name(g.get_allocator());
        UpdateFrequency update{};
        PipelineLayoutData layout(g.get_allocator());
        load(ar, id);
        load(ar, u);
        load(ar, name);
        load(ar, update);
        load(ar, layout);
        switch (id) {
            case 0: {
                RenderStageData val(g.get_allocator());
                load(ar, val);
                addVertex(std::move(name), update, std::move(layout), std::move(val), g, u);
                break;
            }
            case 1: {
                RenderPhaseData val(g.get_allocator());
                load(ar, val);
                addVertex(std::move(name), update, std::move(layout), std::move(val), g, u);
                break;
            }
            default:
                throw std::runtime_error("load graph failed");
        }
    }
    load(ar, g.valueNames);
    load(ar, g.attributeIndex);
    load(ar, g.constantIndex);
    load(ar, g.shaderLayoutIndex);
    load(ar, g.effects);
}

} // namespace render

} // namespace cc
