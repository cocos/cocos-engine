/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#include "ForwardRenderer.h"

#include "gfx/DeviceGraphics.h"
#include "gfx/Texture2D.h"
#include "gfx/VertexBuffer.h"
#include "gfx/IndexBuffer.h"
#include "ProgramLib.h"
#include "View.h"
#include "Scene.h"
#include "Effect.h"
#include "InputAssembler.h"
#include "Pass.h"
#include "Camera.h"


RENDERER_BEGIN

ForwardRenderer::ForwardRenderer()
{
}

bool ForwardRenderer::init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates, Texture2D* defaultTexture, int width, int height)
{
    BaseRenderer::init(device, programTemplates, defaultTexture);
    _width = width;
    _height = height;
    registerStage("transparent", std::bind(&ForwardRenderer::transparentStage, this, std::placeholders::_1, std::placeholders::_2));
    return true;
}

void ForwardRenderer::render(Scene* scene)
{
//    reset();

    const auto& cameras = scene->getCameras();
    for (auto camera : cameras)
        BaseRenderer::render(camera->extractView(_width, _height), scene);
    
    scene->removeModels();
}

void ForwardRenderer::transparentStage(const View& view, const std::vector<StageItem>& items)
{
    // update uniforms
    _device->setUniformMat4("view", view.matView);
    _device->setUniformMat4("proj", view.matProj);
    _device->setUniformMat4("viewProj", view.matViewProj);

//    RENDERER_LOGD("StageItem count: %d", (int)items.size());
    // draw it
    for (const auto& item : items)
        draw(item);
}

RENDERER_END
