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

#include "BaseRenderer.h"
#include <new>
#include "gfx/DeviceGraphics.h"
#include "gfx/Texture2D.h"
#include "ProgramLib.h"
#include "View.h"
#include "Scene.h"
#include "Effect.h"
#include "Light.h"
#include "InputAssembler.h"
#include "Pass.h"
#include "Camera.h"
#include "Model.h"

RENDERER_BEGIN

BaseRenderer::BaseRenderer()
{
    _drawItems = new RecyclePool<DrawItem>([]()mutable->DrawItem*{return new DrawItem();},100);
    _stageInfos = new RecyclePool<StageInfo>([]()mutable->StageInfo*{return new StageInfo();}, 10);
    _views = new RecyclePool<View>([]()mutable->View*{return new View();}, 8);
}

BaseRenderer::~BaseRenderer()
{
    _device->release();
    _device = nullptr;
    
    delete _programLib;
    _programLib = nullptr;
    
    RENDERER_SAFE_RELEASE(_defaultTexture);
    _defaultTexture = nullptr;
    
    delete _drawItems;
    _drawItems = nullptr;
    
    delete _stageInfos;
    _stageInfos = nullptr;
    
    delete _views;
    _views = nullptr;
}

bool BaseRenderer::init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates)
{
    _device = device;
    _device->retain();
    _programLib = new (std::nothrow) ProgramLib(_device, programTemplates);
    return true;
}

bool BaseRenderer::init(DeviceGraphics* device, std::vector<ProgramLib::Template>& programTemplates, Texture2D* defaultTexture)
{
    _device = device;
    _device->retain();
    _defaultTexture = defaultTexture;
    RENDERER_SAFE_RETAIN(_defaultTexture);
    _programLib = new (std::nothrow) ProgramLib(_device, programTemplates);
    return true;
}

void BaseRenderer::registerStage(const std::string& name, const StageCallback& callback)
{
    _stage2fn.emplace(std::make_pair(name, callback));
}

// protected functions

void BaseRenderer::render(const View& view, const Scene* scene)
{
    // setup framebuffer
    _device->setFrameBuffer(view.frameBuffer);
    
    // setup viewport
    _device->setViewport(view.rect.x,
                         view.rect.y,
                         view.rect.w,
                         view.rect.h);
    
    // setup clear
    Color4F clearColor;
    if (ClearFlag::COLOR & view.clearFlags)
        clearColor = view.color;
    _device->clear(view.clearFlags, &clearColor, view.depth, view.stencil);
    
    // get all draw items
    _drawItems->reset();
    int modelMask = -1;
    for (const auto& model : scene->getModels())
    {
        modelMask = model->getCullingMask();
        if (view.cullingByID)
        {
            if ((modelMask & view.cullingMask) == 0)
                continue;
        }
        else
        {
            if (-1 != modelMask)
                continue;
        }
        
        DrawItem* drawItem = _drawItems->add();
        model->extractDrawItem(*drawItem);
    }
    
    // dispatch draw items to different stage
    _stageInfos->reset();
    StageItem stageItem;
    std::vector<StageItem> stageItems;
    for (const auto& stage : view.stages)
    {
        for (int i = 0, len = _drawItems->getLength(); i < len; i++)
        {
            const DrawItem* item = _drawItems->getData(i);
            auto tech = item->effect->getTechnique(stage);
            if (tech)
            {
                stageItem.model = item->model;
                stageItem.ia = item->ia;
                stageItem.effect = item->effect;
                stageItem.defines = item->defines;
                stageItem.technique = tech;
                stageItem.sortKey = -1;

                stageItems.push_back(stageItem);
            }
        }
        StageInfo* stageInfo = _stageInfos->add();
        stageInfo->stage = stage;
        stageInfo->items = &stageItems;
    }
    
    // render stages
    std::unordered_map<std::string, StageCallback>::iterator foundIter;
    for (int i = 0, len = _stageInfos->getLength(); i < len; i++)
    {
        const StageInfo* stageInfo = _stageInfos->getData(i);
        foundIter = _stage2fn.find(stageInfo->stage);
        if (_stage2fn.end() != foundIter)
        {
            auto& fn = foundIter->second;
            fn(view, *stageInfo->items);
        }
    }
}

void BaseRenderer::setProperty (Effect::Property& prop)
{
    Technique::Parameter::Type propType = prop.getType();
    auto& propName = prop.getName();
    if (Effect::Property::Type::UNKNOWN == propType)
    {
        RENDERER_LOGW("Failed to set technique property, type unknown");
        return;
    }
    
    if (nullptr == prop.getValue())
    {
        prop = Effect::Property(propName, propType);
        
        if (Effect::Property::Type::TEXTURE_2D == propType)
        {
            prop.setTexture(_defaultTexture);
        }
    }
    
    if (nullptr == prop.getValue())
    {
        RENDERER_LOGW("Failed to set technique property %s, value not found", propName.c_str());
        return;
    }
    
    if (Effect::Property::Type::TEXTURE_2D == propType ||
        Effect::Property::Type::TEXTURE_CUBE == propType)
    {
        if (1 == prop.getCount())
        {
            _device->setTexture(propName,
                                (renderer::Texture *)(prop.getValue()),
                                allocTextureUnit());
        }
        else if (0 < prop.getCount())
        {
            std::vector<int> slots;
            slots.reserve(10);
            for (int i = 0; i < prop.getCount(); ++i)
            {
                slots.push_back(allocTextureUnit());
            }
            
            _device->setTextureArray(propName,
                                     prop.getTextureArray(),
                                     slots);
        }
    }
    else
    {
        if (0 != prop.getCount())
        {
            if (Technique::Parameter::Type::COLOR3 == propType ||
                Technique::Parameter::Type::INT3 == propType ||
                Technique::Parameter::Type::FLOAT3 == propType ||
                Technique::Parameter::Type::MAT3 == propType)
            {
                RENDERER_LOGW("Uinform array of color3/int3/float3/mat3 can not be supported!");
                return;
            }
            
            uint8_t size = Technique::Parameter::getElements(propType);
            if (size * prop.getCount() > 64)
            {
                RENDERER_LOGW("Uniform array is too long!");
                return;
            }
        }
        
        uint16_t bytes = prop.getBytes();
        if (Effect::Property::Type::INT == propType ||
            Effect::Property::Type::INT2 == propType ||
            Effect::Property::Type::INT4 == propType)
        {
            _device->setUniformiv(propName, bytes / sizeof(int), (const int*)prop.getValue());
        }
        else
        {
            _device->setUniformfv(propName, bytes / sizeof(float), (const float*)prop.getValue());
        }
    }
}

void BaseRenderer::draw(const StageItem& item)
{
    Mat4 worldMatrix = item.model->getWorldMatrix();
    _device->setUniformMat4("cc_matWorld", worldMatrix.m);

    //REFINE: add Mat3
    worldMatrix.inverse();
    worldMatrix.transpose();
    _device->setUniformMat4("cc_mat3WorldIT", worldMatrix.m);
    
    // set technique uniforms
    auto effect = item.effect;
    auto& properties = effect->getProperties();
    for (auto it = properties.begin(); it != properties.end(); it++)
    {
        Effect::Property& prop = const_cast<Effect::Property&>(it->second);
        setProperty(prop);
    }
    
    auto ia = item.ia;
    const int32_t& definesKey = item.effect->getDefinesKey();
    // for each pass
    for (const auto& pass : item.technique->getPasses())
    {
        // set vertex buffer
        _device->setVertexBuffer(0, ia->getVertexBuffer());
        
        // set index buffer
        if (ia->_indexBuffer)
            _device->setIndexBuffer(ia->_indexBuffer);
        
        // set primitive type
        _device->setPrimitiveType(ia->_primitiveType);
        
        // set program
        if(!_program || _programName != pass->_programName || _definesKey != definesKey)
        {
            _programName = pass->_programName;
            _definesKey = definesKey;
            _program = _programLib->getProgram(pass->_programName, *(item.defines), _definesKey);
        }
        _device->setProgram(_program);
        
        // cull mode
        _device->setCullMode(pass->_cullMode);
        
        // blend
        if (pass->_blend)
        {
            _device->enableBlend();
            _device->setBlendFuncSeparate(pass->_blendSrc,
                                          pass->_blendDst,
                                          pass->_blendSrcAlpha,
                                          pass->_blendDstAlpha);
            _device->setBlendEquationSeparate(pass->_blendEq, pass->_blendAlphaEq);
            _device->setBlendColor(pass->_blendColor);
        }
        
        // depth test & write
        if (pass->_depthTest)
        {
            _device->enableDepthTest();
            _device->setDepthFunc(pass->_depthFunc);
        }
        if (pass->_depthWrite)
            _device->enableDepthWrite();
        
        // setencil
        if (pass->_stencilTest)
        {
            _device->enableStencilTest();
            
            // front
            _device->setStencilFuncFront(pass->_stencilFuncFront,
                                         pass->_stencilRefFront,
                                         pass->_stencilMaskFront);
            _device->setStencilOpFront(pass->_stencilFailOpFront,
                                       pass->_stencilZFailOpFront,
                                       pass->_stencilZPassOpFront,
                                       pass->_stencilWriteMaskFront);
            
            // back
            _device->setStencilFuncBack(pass->_stencilFuncBack,
                                        pass->_stencilRefBack,
                                        pass->_stencilMaskBack);
            _device->setStencilOpBack(pass->_stencilFailOpBack,
                                      pass->_stencilZFailOpBack,
                                      pass->_stencilZPassOpBack,
                                      pass->_stencilWriteMaskBack);
        }
        
        // draw pass
        _device->draw(ia->_start, ia->getPrimitiveCount());
        
        resetTextureUint();
    }
}

// private functions

void BaseRenderer::resetTextureUint()
{
    _usedTextureUnits = 0;
}

int BaseRenderer::allocTextureUnit()
{
    int maxTexureUnits = _device->getCapacity().maxTextureUnits;
    if (_usedTextureUnits >= maxTexureUnits)
        RENDERER_LOGW("Trying to use %d texture uints while this GPU only supports %d", _usedTextureUnits, maxTexureUnits);
    
    return _usedTextureUnits++;
}

void BaseRenderer::reset()
{
    _views->reset();
    _stageInfos->reset();
}

View* BaseRenderer::requestView()
{
    return _views->add();
}

RENDERER_END
