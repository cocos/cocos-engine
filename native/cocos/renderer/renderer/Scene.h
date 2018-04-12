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

#pragma once

#include <stdint.h>
#include "base/CCVector.h"
#include "../Macro.h"

RENDERER_BEGIN

class Camera;
class Light;
class Model;
class View;

class Scene
{
public:
    Scene();
    
    void reset();
    void setDebugCamera(Camera* debugCamera);
    
    // camera
    inline uint32_t getCameraCount() const { return (uint32_t)_cameras.size(); }
    Camera* getCamera(uint32_t index) const;
    void addCamera(Camera* camera);
    void removeCamera(Camera* camera);
    inline const Vector<Camera*>& getCameras() const { return _cameras; }
    
    // model
    inline uint32_t getModelCount() const { return (uint32_t)_models.size(); }
    Model* getModel(uint32_t index);
    void addModel(Model* model);
    void removeModel(Model* model);
    void removeModels();
    inline const std::vector<Model*>& getModels() const { return _models; }
    
    // light
    inline uint32_t getLightCount() const { return (uint32_t)_lights.size(); }
    Light* getLight(uint32_t index);
    void addLight(Light* light);
    void removeLight(Light* light);
    
    // view
    void addView(View* view);
    void removeView(View* view);
    
private:
    //TODO: optimize speed.
    Vector<Camera*> _cameras;
    Vector<Light*> _lights;
    std::vector<Model*> _models;
    Vector<View*> _views;
    Camera* _debugCamera = nullptr;
};

RENDERER_END
