/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "PipelineSceneData.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"

namespace cc {
namespace pipeline {

void PipelineSceneData::activate(gfx::Device *device, RenderPipeline *pipeline)
{
    _device = device;
    _pipeline = pipeline;
    
    _sphere = CC_NEW(Sphere);
}

void PipelineSceneData::setPipelineSharedSceneData(uint handle)
{
    _sharedSceneData = GET_PIPELINE_SHARED_SCENE_DATA(handle);
}

void PipelineSceneData::destroy()
{
    CC_SAFE_DELETE(_sphere);
    
    for (auto &pair : _shadowFrameBufferMap) {
        pair.second->destroy();
        delete pair.second;
    }
    
    _shadowFrameBufferMap.clear();
}

} // namespace pipeline
} // namespace cc
