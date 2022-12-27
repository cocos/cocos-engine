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
#include "3d/models/MorphModel.h"

namespace cc {

ccstd::vector<scene::IMacroPatch> MorphModel::getMacroPatches(index_t subModelIndex) {
    ccstd::vector<scene::IMacroPatch> superMacroPatches = Super::getMacroPatches(subModelIndex);
    if (_morphRenderingInstance) {
        ccstd::vector<scene::IMacroPatch> morphInstanceMacroPatches = _morphRenderingInstance->requiredPatches(subModelIndex);
        if (!morphInstanceMacroPatches.empty()) {
            if (!superMacroPatches.empty()) {
                morphInstanceMacroPatches.reserve(morphInstanceMacroPatches.size() + superMacroPatches.size());
                morphInstanceMacroPatches.insert(morphInstanceMacroPatches.end(), superMacroPatches.begin(), superMacroPatches.end());
            }
            return morphInstanceMacroPatches;
        }
    }
    return superMacroPatches;
}

void MorphModel::initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat) {
    Super::initSubModel(idx, subMeshData, launderMaterial(mat));
}

void MorphModel::destroy() {
    Super::destroy();
    _morphRenderingInstance = nullptr; //minggo: should delete it?
}

void MorphModel::setSubModelMaterial(index_t idx, Material *mat) {
    Super::setSubModelMaterial(idx, launderMaterial(mat));
}

void MorphModel::updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet) {
    Super::updateLocalDescriptors(subModelIndex, descriptorSet);

    if (_morphRenderingInstance) {
        _morphRenderingInstance->adaptPipelineState(subModelIndex, descriptorSet);
    }
}

} // namespace cc
