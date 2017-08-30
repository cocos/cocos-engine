/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2016 Chukong Technologies Inc.

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

#include "2d/CCScene.h"
#include "base/CCDirector.h"
#include "base/ccUTF8.h"
#include "renderer/CCRenderer.h"

NS_CC_BEGIN

Scene::Scene()
{
    _ignoreAnchorPointForPosition = true;
    setAnchorPoint(Vec2::ANCHOR_MIDDLE);
}

Scene::~Scene()
{
}

bool Scene::init()
{
    auto size = Director::getInstance()->getWinSize();
    return initWithSize(size);
}

bool Scene::initWithSize(const Size& size)
{
    setContentSize(size);
    return true;
}

Scene* Scene::create()
{
    Scene *ret = new (std::nothrow) Scene();
    if (ret && ret->init())
    {
        ret->autorelease();
        return ret;
    }
    else
    {
        CC_SAFE_DELETE(ret);
        return nullptr;
    }
}

Scene* Scene::createWithSize(const Size& size)
{
    Scene *ret = new (std::nothrow) Scene();
    if (ret && ret->initWithSize(size))
    {
        ret->autorelease();
        return ret;
    }
    else
    {
        CC_SAFE_DELETE(ret);
        return nullptr;
    }
}

std::string Scene::getDescription() const
{
    return StringUtils::format("<Scene | tag = %d>", _tag);
}


void Scene::render(Renderer* renderer, const Mat4& eyeTransform, const Mat4* eyeProjection)
{
    auto director = Director::getInstance();
    const auto& transform = getNodeToParentTransform();
    
    director->pushMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_PROJECTION);
    
    //visit the scene
    visit(renderer, transform, 0);
    
    renderer->render();
    
    director->popMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_PROJECTION);
    
    // we shouldn't restore the transform matrix since it could be used
    // from "update" or other parts of the game to calculate culling or something else.
    //        camera->setNodeToParentTransform(eyeCopy);
}

void Scene::removeAllChildren()
{
    Node::removeAllChildren();
}

NS_CC_END

