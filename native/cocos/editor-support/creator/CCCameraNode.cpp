//
//  CCCameraNode.cpp
//  cocos2d_libs
//
//  Created by youyou on 17/3/23.
//
//

#include "CCCameraNode.h"
#include "base/CCDirector.h"
#include "renderer/CCRenderer.h"

using namespace cocos2d;

namespace creator {
    cocos2d::Mat4 CameraNode::_tempMat;
    
    CameraNode::CameraNode()
    {
    }
    
    CameraNode::~CameraNode()
    {
    }
    
    void CameraNode::setTransform(const cocos2d::Vec2& v, float zoom)
    {
        _mat.setIdentity();
        
        float* m = _mat.m;
        m[0] = m[5] = m[10] = zoom;
        m[12] = v.x;
        m[13] = v.y;
    }
    
    void CameraNode::addTarget(Node* target)
    {
        for (auto i = _commands.begin(); i != _commands.end(); i++)
        {
            if (i->target == target)
            {
                return;
            }
        }
        
        CustomCommand* beforeVisitCommand = new CustomCommand();
        CustomCommand* afterVisitCommand = new CustomCommand();
        
        target->setBeforeVisitCallback([this, beforeVisitCommand](Renderer* renderer) {
            beforeVisitCommand->init(_globalZOrder);
            beforeVisitCommand->func = CC_CALLBACK_0(CameraNode::beforeVisit, this);
            renderer->addCommand(beforeVisitCommand);
        });
        target->setAfterVisitCallback([this, afterVisitCommand](Renderer* renderer) {
            afterVisitCommand->init(_globalZOrder);
            afterVisitCommand->func = CC_CALLBACK_0(CameraNode::afterVisit, this);
            renderer->addCommand(afterVisitCommand);
        });
        
        CameraCommand c = {target, beforeVisitCommand, afterVisitCommand};
        _commands.push_back(c);
    }
    
    void CameraNode::removeTarget(Node* target)
    {
        target->setBeforeVisitCallback(nullptr);
        target->setAfterVisitCallback(nullptr);
        
        for (auto i = _commands.begin(); i != _commands.end(); i++)
        {
            if (i->target == target)
            {
                delete i->beforeVisitCommand;
                delete i->afterVisitCommand;
                
                _commands.erase(i);
                break;
            }
        }
    }
    
    void CameraNode::beforeVisit()
    {
        _director->multiplyMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_PROJECTION, _mat);
    }
    
    void CameraNode::afterVisit()
    {
        _director->multiplyMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_PROJECTION, _mat.getInversed());
    }
}
