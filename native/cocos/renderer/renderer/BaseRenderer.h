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

#include <vector>
#include <unordered_map>
#include <string>
#include <functional>
#include "../Macro.h"
#include "ProgramLib.h"
#include "Model.h"

RENDERER_BEGIN

class DeviceGraphics;
class View;
class Scene;
class ProgramLib;
class Model;
class InputAssembler;
class Effect;
class Technique;
class Texture2D;

class BaseRenderer : public Ref
{
public:
    struct StageItem
    {
        Model* model = nullptr;
        INode* node = nullptr;
        InputAssembler *ia = nullptr;
        Effect* effect = nullptr;
        ValueMap* defines = nullptr;
        Technique* technique = nullptr;
        int sortKey = -1;
    };
    typedef std::function<void(const View&, const std::vector<StageItem>&)> StageCallback;

    BaseRenderer();
    
    bool init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates);
    bool init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates, Texture2D* defaultTexture);
    virtual ~BaseRenderer();
    
    void registerStage(const std::string& name, const StageCallback& callback);
    ProgramLib* getProgramLib() const { return _programLib; }
    
protected:
    void render(const View&, const Scene* scene);
    void draw(const StageItem& item);
    
    struct StageInfo
    {
        std::vector<StageItem>* items;
        std::string stage = "";
    };
    
    void resetTextureUint();
    int allocTextureUnit();
    void reset();
    View* requestView();
    
    int _usedTextureUnits = 0;
    DeviceGraphics* _device = nullptr;
    ProgramLib* _programLib = nullptr;
    Texture2D* _defaultTexture = nullptr;
    std::unordered_map<std::string, StageCallback> _stage2fn;
    std::vector<DrawItem> _drawItems;
    std::vector<StageInfo> _stageInfos;

    CC_DISALLOW_COPY_ASSIGN_AND_MOVE(BaseRenderer);
};

RENDERER_END
