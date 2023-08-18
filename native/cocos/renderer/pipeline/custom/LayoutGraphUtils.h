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

#pragma once
#include <boost/container/pmr/memory_resource.hpp>
#include <iosfwd>
#include "cocos/core/assets/EffectAsset.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "gfx-base/GFXDevice.h"

namespace cc {

namespace render {

gfx::DescriptorType getGfxDescriptorType(DescriptorTypeOrder type);
DescriptorTypeOrder getDescriptorTypeOrder(gfx::DescriptorType type);

NameLocalID getOrCreateDescriptorID(LayoutGraphData& lg, std::string_view name);

void makeDescriptorSetLayoutData(
    LayoutGraphData& lg,
    UpdateFrequency rate, uint32_t set, const IDescriptorInfo& descriptors,
    DescriptorSetLayoutData& data,
    boost::container::pmr::memory_resource* scratch);

void initializeDescriptorSetLayoutInfo(
    const DescriptorSetLayoutData& layoutData,
    gfx::DescriptorSetLayoutInfo& info);

uint32_t getUniformBlockSize(const ccstd::vector<gfx::Uniform>& blockMembers);

bool isDynamicUniformBlock(std::string_view name);

gfx::DescriptorSet* getOrCreatePerPassDescriptorSet(
    gfx::Device* device,
    LayoutGraphData& lg, LayoutGraphData::vertex_descriptor vertID);

void generateConstantMacros(
    gfx::Device* device,
    ccstd::string& constantMacros);

void printLayoutGraphData(
    const LayoutGraphData& lg, std::ostream& oss,
    boost::container::pmr::memory_resource* scratch);

gfx::TextureType getTextureType(ResourceDimension dimension, uint32_t arraySize);
ResourceDimension getResourceDimension(gfx::TextureType type);


} // namespace render

} // namespace cc
