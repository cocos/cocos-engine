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

#include "Scene.h"
#include "Camera.h"
#include "Light.h"
#include "Model.h"
#include "View.h"
#include "InputAssembler.h"
#include "Effect.h"

RENDERER_BEGIN

Scene::Scene()
{
    _models.reserve(500);
}

void Scene::reset()
{
    for (auto& model : _models)
        model->setCullingMask(-1);
}

void Scene::setDebugCamera(Camera* debugCamera)
{
    if (_debugCamera == debugCamera)
        return;
    
    RENDERER_SAFE_RELEASE(_debugCamera);
    RENDERER_SAFE_RETAIN(debugCamera);
    _debugCamera = debugCamera;
}

Camera* Scene::getCamera(uint32_t index) const
{
    return _cameras.at(index);
}

void Scene::sortCameras()
{
    std::sort(_cameras.begin(), _cameras.end(), [=](const Camera* a, const Camera* b){
        return a->getPriority() < b->getPriority();
    });
}

void Scene::addCamera(Camera* camera)
{
    _cameras.pushBack(camera);
}

void Scene::removeCamera(Camera* camera)
{
    _cameras.eraseObject(camera);
}

Model* Scene::getModel(uint32_t index)
{
    return _models.at(index);
}

void Scene::addModel(Model* model)
{
    _models.push_back(model);
}

void Scene::removeModel(Model* model)
{
    auto iter = std::find(_models.begin(), _models.end(), model);
    if (_models.end() != iter)
    {
        _models.erase(iter);
    }
}

void Scene::removeModels()
{
    _models.clear();
}

Light* Scene::getLight(uint32_t index)
{
    return _lights.at(index);
}

void Scene::addLight(Light* light)
{
    _lights.pushBack(light);
}

void Scene::removeLight(Light* light)
{
    _lights.eraseObject(light);
}

void Scene::addView(View* view)
{
    _views.pushBack(view);
}

void Scene::removeView(View* view)
{
    _views.eraseObject(view);
}

RENDERER_END
