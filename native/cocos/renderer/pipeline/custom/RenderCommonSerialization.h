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
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/details/Range.h"
#include "cocos/renderer/pipeline/custom/details/SerializationUtils.h"

namespace cc {

namespace render {

inline void save(OutputArchive& ar, const RasterView& v) {
    save(ar, v.slotName);
    save(ar, v.accessType);
    save(ar, v.attachmentType);
    save(ar, v.loadOp);
    save(ar, v.storeOp);
    save(ar, v.clearFlags);
    save(ar, v.clearColor);
    save(ar, v.slotID);
}

inline void load(InputArchive& ar, RasterView& v) {
    load(ar, v.slotName);
    load(ar, v.accessType);
    load(ar, v.attachmentType);
    load(ar, v.loadOp);
    load(ar, v.storeOp);
    load(ar, v.clearFlags);
    load(ar, v.clearColor);
    load(ar, v.slotID);
}

inline void save(OutputArchive& ar, const ComputeView& v) {
    save(ar, v.name);
    save(ar, v.accessType);
    save(ar, v.clearFlags);
    save(ar, v.clearColor);
    save(ar, v.clearValueType);
}

inline void load(InputArchive& ar, ComputeView& v) {
    load(ar, v.name);
    load(ar, v.accessType);
    load(ar, v.clearFlags);
    load(ar, v.clearColor);
    load(ar, v.clearValueType);
}

inline void save(OutputArchive& ar, const LightInfo& v) {
    // skip, light: IntrusivePtr<scene::Light>
    save(ar, v.level);
}

inline void load(InputArchive& ar, LightInfo& v) {
    // skip, light: IntrusivePtr<scene::Light>
    load(ar, v.level);
}

inline void save(OutputArchive& ar, const Descriptor& v) {
    save(ar, v.type);
    save(ar, v.count);
}

inline void load(InputArchive& ar, Descriptor& v) {
    load(ar, v.type);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const DescriptorBlock& v) {
    save(ar, v.descriptors);
    save(ar, v.uniformBlocks);
    save(ar, v.capacity);
    save(ar, v.count);
}

inline void load(InputArchive& ar, DescriptorBlock& v) {
    load(ar, v.descriptors);
    load(ar, v.uniformBlocks);
    load(ar, v.capacity);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const DescriptorBlockFlattened& v) {
    save(ar, v.descriptorNames);
    save(ar, v.uniformBlockNames);
    save(ar, v.descriptors);
    save(ar, v.uniformBlocks);
    save(ar, v.capacity);
    save(ar, v.count);
}

inline void load(InputArchive& ar, DescriptorBlockFlattened& v) {
    load(ar, v.descriptorNames);
    load(ar, v.uniformBlockNames);
    load(ar, v.descriptors);
    load(ar, v.uniformBlocks);
    load(ar, v.capacity);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const DescriptorBlockIndex& v) {
    save(ar, v.updateFrequency);
    save(ar, v.parameterType);
    save(ar, v.descriptorType);
    save(ar, v.visibility);
}

inline void load(InputArchive& ar, DescriptorBlockIndex& v) {
    load(ar, v.updateFrequency);
    load(ar, v.parameterType);
    load(ar, v.descriptorType);
    load(ar, v.visibility);
}

inline void save(OutputArchive& ar, const CopyPair& v) {
    save(ar, v.source);
    save(ar, v.target);
    save(ar, v.mipLevels);
    save(ar, v.numSlices);
    save(ar, v.sourceMostDetailedMip);
    save(ar, v.sourceFirstSlice);
    save(ar, v.sourcePlaneSlice);
    save(ar, v.targetMostDetailedMip);
    save(ar, v.targetFirstSlice);
    save(ar, v.targetPlaneSlice);
}

inline void load(InputArchive& ar, CopyPair& v) {
    load(ar, v.source);
    load(ar, v.target);
    load(ar, v.mipLevels);
    load(ar, v.numSlices);
    load(ar, v.sourceMostDetailedMip);
    load(ar, v.sourceFirstSlice);
    load(ar, v.sourcePlaneSlice);
    load(ar, v.targetMostDetailedMip);
    load(ar, v.targetFirstSlice);
    load(ar, v.targetPlaneSlice);
}

inline void save(OutputArchive& ar, const MovePair& v) {
    save(ar, v.source);
    save(ar, v.target);
    save(ar, v.mipLevels);
    save(ar, v.numSlices);
    save(ar, v.targetMostDetailedMip);
    save(ar, v.targetFirstSlice);
    save(ar, v.targetPlaneSlice);
}

inline void load(InputArchive& ar, MovePair& v) {
    load(ar, v.source);
    load(ar, v.target);
    load(ar, v.mipLevels);
    load(ar, v.numSlices);
    load(ar, v.targetMostDetailedMip);
    load(ar, v.targetFirstSlice);
    load(ar, v.targetPlaneSlice);
}

inline void save(OutputArchive& ar, const PipelineStatistics& v) {
    save(ar, v.numRenderPasses);
    save(ar, v.numManagedTextures);
    save(ar, v.totalManagedTextures);
    save(ar, v.numUploadBuffers);
    save(ar, v.numUploadBufferViews);
    save(ar, v.numFreeUploadBuffers);
    save(ar, v.numFreeUploadBufferViews);
    save(ar, v.numDescriptorSets);
    save(ar, v.numFreeDescriptorSets);
    save(ar, v.numInstancingBuffers);
    save(ar, v.numInstancingUniformBlocks);
}

inline void load(InputArchive& ar, PipelineStatistics& v) {
    load(ar, v.numRenderPasses);
    load(ar, v.numManagedTextures);
    load(ar, v.totalManagedTextures);
    load(ar, v.numUploadBuffers);
    load(ar, v.numUploadBufferViews);
    load(ar, v.numFreeUploadBuffers);
    load(ar, v.numFreeUploadBufferViews);
    load(ar, v.numDescriptorSets);
    load(ar, v.numFreeDescriptorSets);
    load(ar, v.numInstancingBuffers);
    load(ar, v.numInstancingUniformBlocks);
}

} // namespace render

} // namespace cc
