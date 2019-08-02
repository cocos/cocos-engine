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
#include "base/ccCArray.h"
#include "../Macro.h"

RENDERER_BEGIN

class Camera;
class Light;
class Model;
class View;

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief Render scene.
 */
class Scene
{
public:
    /**
     *  @brief The default constructor.
     */
    Scene();
    
    /**
     *  @brief Resets all model culling mask.
     */
    void reset();
    /**
     *  @brief Sets debug camera.
     *  @param[in] debugCamera Debug camera pointer.
     */
    void setDebugCamera(Camera* debugCamera);
    
    /**
     *  @brief Gets cameras count.
     *  @return Cameras count.
     */
    inline uint32_t getCameraCount() const { return (uint32_t)_cameras.size(); }
    
    /**
     *  @brief Gets camera by index.
     *  @return camera pointer.
     */
    Camera* getCamera(uint32_t index) const;
    /**
     *  @brief Adds camera.
     *  @param[in] camera Camera pointer.
     */
    void addCamera(Camera* camera);
    /**
     *  @brief Removes camera.
     *  @param[in] camera Camera pointer.
     */
    void removeCamera(Camera* camera);
    /**
     *  @brief Gets all cameras.
     *  @return All Cameras container.
     */
    inline const Vector<Camera*>& getCameras() const { return _cameras; }
    /**
     *  @brief Sorts all cameras.
     */
    void sortCameras();
    
    /**
     *  @brief Gets all models count.
     *  @return All models count.
     */
    inline uint32_t getModelCount() const { return (uint32_t)_models.size(); }
    /**
     *  @brief Gets model by index.
     *  @param[in] index Model index.
     *  @return Model pointer.
     */
    Model* getModel(uint32_t index);
    /**
     *  @brief Adds model.
     *  @param[in] model Model pointer.
     */
    void addModel(Model* model);
    /**
     *  @brief Removes model.
     *  @param[in] model Model pointer.
     */
    void removeModel(Model* model);
    /**
     *  @brief Removes all models.
     */
    void removeModels();
    /**
     *  @brief Gets all models.
     *  @return Models container.
     */
    inline const std::vector<Model*>& getModels() const { return _models; }
    
    /**
     *  @brief Gets light count.
     *  @return Lights count.
     */
    inline uint32_t getLightCount() const { return (uint32_t)_lights.size(); }
    /**
     *  @brief Gets light by index.
     *  @param[in] index Light index.
     *  @return Light pointer.
     */
    Light* getLight(uint32_t index);
    /**
     *  @brief Adds light.
     *  @param[in] light Light pointer.
     */
    void addLight(Light* light);
    /**
     *  @brief Removes light.
     *  @param[in] light Light pointer.
     */
    void removeLight(Light* light);
    
    /**
     *  @brief Adds view.
     *  @param[in] view View pointer.
     */
    void addView(View* view);
    /**
     *  @brief Removes view.
     *  @param[in] view View pointer.
     */
    void removeView(View* view);
    /**
     *  @brief Gets all lights.
     *  @return Lights container.
     */
    inline const Vector<Light*> getLights() const { return _lights; };
private:
    //REFINE: optimize speed.
    Vector<Camera*> _cameras;
    Vector<Light*> _lights;
    std::vector<Model*> _models;
    Vector<View*> _views;
    Camera* _debugCamera = nullptr;
};

// end of renderer group
/// @}

RENDERER_END
