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

#include <cmath>
#include <functional>
#include <numeric>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>
#include "cocos/base/Optional.h"
#include "core/Types.h"
#include "core/assets/EffectAsset.h"
#include "renderer/core/PassUtils.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXPipelineLayout.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/RenderPipeline.h"

namespace cc {

struct IDefineRecord : public IDefineInfo {
    std::function<int32_t(const MacroValue &)> map{nullptr};
    int32_t                                    offset{0};
};
struct IMacroInfo {
    std::string name;
    std::string value;
    bool        isDefault{false};
};

struct ITemplateInfo {
    std::vector<gfx::Attribute>                  gfxAttributes;
    gfx::ShaderInfo                              shaderInfo;
    std::vector<int32_t>                         blockSizes;
    Vector<gfx::DescriptorSetLayout *>           setLayouts;
    IntrusivePtr<gfx::PipelineLayout>            pipelineLayout;
    Record<std::string, uint32_t>                handleMap;
    std::vector<gfx::DescriptorSetLayoutBinding> bindings;
    int32_t                                      samplerStartBinding{-1};
};

struct IProgramInfo : public IShaderInfo {
    std::string                effectName;
    std::vector<IDefineRecord> defines;
    std::string                constantMacros;
    bool                       uber{false}; // macro number exceeds default limits, will fallback to string hash

    void copyFrom(const IShaderInfo &o);
};

const char *getDeviceShaderVersion(const gfx::Device *device);

/**
 * @en The global maintainer of all shader resources.
 * @zh 维护 shader 资源实例的全局管理器。
 */
class ProgramLib final {
public:
    static ProgramLib *getInstance();
    static void        destroyInstance();

    void registerEffect(EffectAsset *effect);

    /**
     * @en Register the shader template with the given info
     * @zh 注册 shader 模板。
     */
    IProgramInfo *define(IShaderInfo &shader);

    /**
     * @en Gets the shader template with its name
     * @zh 通过名字获取 Shader 模板
     * @param name Target shader name
     */

    IProgramInfo *getTemplate(const std::string &name);

    /**
     * @en Gets the shader template info with its name
     * @zh 通过名字获取 Shader 模版信息
     * @param name Target shader name
     */

    ITemplateInfo *getTemplateInfo(const std::string &name);

    /**
     * @en Gets the pipeline layout of the shader template given its name
     * @zh 通过名字获取 Shader 模板相关联的管线布局
     * @param name Target shader name
     */
    gfx::DescriptorSetLayout *getDescriptorSetLayout(gfx::Device *device, const std::string &name, bool isLocal = false);

    /**
     * @en
     * Does this library has the specified program
     * @zh
     * 当前是否有已注册的指定名字的 shader
     * @param name Target shader name
     */
    inline bool hasProgram(const std::string &name) const {
        return _templates.count(name) > 0;
    }

    /**
     * @en Gets the shader key with the name and a macro combination
     * @zh 根据 shader 名和预处理宏列表获取 shader key。
     * @param name Target shader name
     * @param defines The combination of preprocess macros
     */
    std::string getKey(const std::string &name, const MacroRecord &defines);

    /**
     * @en Destroy all shader instance match the preprocess macros
     * @zh 销毁所有完全满足指定预处理宏特征的 shader 实例。
     * @param defines The preprocess macros as filter
     */

    void destroyShaderByDefines(const MacroRecord &defines);

    /**
     * @en Gets the shader resource instance with given information
     * @zh 获取指定 shader 的渲染资源实例
     * @param name Shader name
     * @param defines Preprocess macros
     * @param pipeline The [[RenderPipeline]] which owns the render command
     * @param key The shader cache key, if already known
     */
    gfx::Shader *getGFXShader(gfx::Device *device, const std::string &name, MacroRecord &defines,
                              pipeline::RenderPipeline *pipeline, std::string *key = nullptr);

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(ProgramLib);
    ProgramLib()  = default;
    ~ProgramLib() = default;

    static ProgramLib *                            instance;
    Record<std::string, IProgramInfo>              _templates; // per shader
    Record<std::string, IntrusivePtr<gfx::Shader>> _cache;
    Record<uint64_t, ITemplateInfo>                _templateInfos;
};

} // namespace cc
