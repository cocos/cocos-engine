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

#include "BaseRenderer.h"
#include "Camera.h"
#include "../memop/RecyclePool.hpp"

RENDERER_BEGIN

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief A builtin forward renderer implementation
 */
class ForwardRenderer final : public BaseRenderer
{
public:
    /**
     *  @brief The default constructor.
     */
    ForwardRenderer();
    ~ForwardRenderer();
    /**
     *  @brief Initializes the forward renderer.
     *  @param[in] device DeviceGraphics pointer.
     *  @param[in] programTemplates All linked programs.
     *  @param[in] defaultTexture Default texture pointer.
     *  @param[in] width.
     *  @param[in] height.
     */
    bool init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates, Texture2D* defaultTexture, int width, int height);
    /**
     *  @brief Renders the given render scene.
     */
    void render(Scene* scene);
    /**
     *  @brief Renders the given render scene with a given camera setting.
     */
    void renderCamera(Camera* camera, Scene* scene);
private:
    void updateLights(Scene* scene);
    void updateDefines();
    void submitLightsUniforms();
    void submitShadowStageUniforms(const View& view);
    void submitOtherStagesUniforms();
    void updateShaderDefines(StageItem& item);
    void sortItems(std::vector<StageItem>& items);
    void drawItems(const std::vector<StageItem>& items);
    void opaqueStage(const View& view, const std::vector<StageItem>& items);
    void shadowStage(const View& view, const std::vector<StageItem>& items);
    void transparentStage(const View& view, const std::vector<StageItem>& items);
    void resetData();
    static bool compareItems(const StageItem& a, const StageItem& b);
    
    Vector<Light*> _directionalLights;
    Vector<Light*> _pointLights;
    Vector<Light*> _spotLights;
    Vector<Light*> _shadowLights;
    Vector<Light*> _ambientLights;
    
    RecyclePool<float>* _arrayPool = nullptr;
    ValueMap* _defines = nullptr;
    
    int _width = 0;
    int _height = 0;
    std::size_t _numLights = 0;
};

// end of renderer group
/// @}

RENDERER_END
