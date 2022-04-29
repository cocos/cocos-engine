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

#include <set>
#include "3d/assets/Morph.h"
#include "scene/Define.h"
#include "scene/Model.h"

namespace cc {

class MorphModel : public scene::Model {
public:
    using Super = scene::Model;

    MorphModel()           = default;
    ~MorphModel() override = default;
    CC_DISALLOW_COPY_MOVE_ASSIGN(MorphModel);

    ccstd::vector<scene::IMacroPatch>  getMacroPatches(index_t subModelIndex) override;
    void                               initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat) override;
    void                               destroy() override;
    void                               setSubModelMaterial(index_t idx, Material *mat) override;

    inline void setMorphRendering(MorphRenderingInstance *morphRendering) { _morphRenderingInstance = morphRendering; }

protected:
    void updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet) override;

private:
    inline Material *launderMaterial(Material *material) { return material; } //NOLINT(readability-convert-member-functions-to-static)

    IntrusivePtr<MorphRenderingInstance> _morphRenderingInstance;
};

} // namespace cc
