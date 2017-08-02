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
        _mat.setIdentity();
    }
    
    CameraNode::~CameraNode()
    {
        if (!_commands.empty())
        {
            for (const auto& c : _commands)
            {
                delete c.beforeVisitCommand;
                delete c.afterVisitCommand;
            }
            _commands.clear();
        }
    }
    
    void CameraNode::setTransform(float a, float b, float c, float d, float tx, float ty)
    {
        float* m = _mat.m;
        m[0] = a;
        m[1] = b;
        m[4] = c;
        m[5] = d;
        m[12] = tx;
        m[13] = ty;
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
