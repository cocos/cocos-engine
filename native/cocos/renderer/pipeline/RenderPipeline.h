/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "Define.h"
#include "GlobalDescriptorSetManager.h"
#include "PipelineSceneData.h"
#include "PipelineUBO.h"
#include "base/CoreStd.h"
#include "helper/DefineMap.h"
#include "scene/Camera.h"
#include "scene/Model.h"

namespace cc {
namespace gfx {
class CommandBuffer;
class DescriptorSet;
class DescriptorSetLayout;
} // namespace gfx
namespace pipeline {
class DefineMap;
class GlobalDSManager;
class RenderStage;

struct CC_DLL RenderPipelineInfo {
    uint           tag = 0;
    RenderFlowList flows;
};

class CC_DLL RenderPipeline : public Object {
public:
    static RenderPipeline *getInstance();

    RenderPipeline();
    ~RenderPipeline() override;

    virtual bool activate(gfx::Swapchain *swapchain);
    virtual void destroy();
    virtual bool initialize(const RenderPipelineInfo &info);
    virtual void render(const vector<scene::Camera *> &cameras);
    virtual void resize(uint width, uint height){};

    void setPipelineSharedSceneData(scene::PipelineSharedSceneData *data);

    inline const RenderFlowList &                  getFlows() const { return _flows; }
    inline uint                                    getTag() const { return _tag; }
    inline const map<String, InternalBindingInst> &getGlobalBindings() const { return _globalBindings; }
    inline const DefineMap &                       getMacros() const { return _macros; }
    inline void                                    setValue(const String &name, bool value) { _macros.setValue(name, value); }
    inline GlobalDSManager *                       getGlobalDSManager() const { return _globalDSManager; }
    inline gfx::DescriptorSet *                    getDescriptorSet() const { return _descriptorSet; }
    inline gfx::DescriptorSetLayout *              getDescriptorSetLayout() const { return _globalDSManager->getDescriptorSetLayout(); }
    inline gfx::Texture *                          getDefaultTexture() const { return _defaultTexture; }
    inline PipelineSceneData *                     getPipelineSceneData() const { return _pipelineSceneData; }
    inline const gfx::CommandBufferList &          getCommandBuffers() const { return _commandBuffers; }
    inline PipelineUBO *                           getPipelineUBO() const { return _pipelineUBO; }
    inline const String &                          getConstantMacros() { return _constantMacros; }
    inline gfx::Device *                           getDevice() { return _device; }
    RenderStage *                                  getRenderstageByName(const String &name) const;

    inline scene::Model *getProfiler() const { return _profiler; }
    inline void          setProfiler(scene::Model *value) { _profiler = value; }

protected:
    static RenderPipeline *instance;

    void generateConstantMacros();

    gfx::CommandBufferList           _commandBuffers;
    RenderFlowList                   _flows;
    map<String, InternalBindingInst> _globalBindings;
    DefineMap                        _macros;
    uint                             _tag = 0;
    String                           _constantMacros;

    gfx::Device *       _device            = nullptr;
    GlobalDSManager *   _globalDSManager   = nullptr;
    gfx::DescriptorSet *_descriptorSet     = nullptr;
    PipelineUBO *       _pipelineUBO       = nullptr;
    PipelineSceneData * _pipelineSceneData = nullptr;
    scene::Model *      _profiler          = nullptr;
    // has not initBuiltinRes,
    // create temporary default Texture to binding sampler2d
    gfx::Texture *_defaultTexture = nullptr;
};

} // namespace pipeline
} // namespace cc
