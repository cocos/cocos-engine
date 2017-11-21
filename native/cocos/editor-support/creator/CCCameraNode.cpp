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
    static CameraNode* _cameraInstance = nullptr;
    
    
    CameraNode::CameraNode()
    {
        _mat.setIdentity();
        visitingIndex = 0;
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
    
    void CameraNode::setEnable(bool enable)
    {
        if (enable) {
            _cameraInstance = this;
        }
        else {
            _cameraInstance = nullptr;
        }
    }
    
    CameraNode* CameraNode::getInstance() {
        return _cameraInstance;
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
        
        _inverseMat = _mat;
        _inverseMat.inverse();
        
        _visibleRect.origin = Director::getInstance()->getVisibleOrigin();
        _visibleRect.size = Director::getInstance()->getVisibleSize();
        
        _visibleRect = RectApplyTransform(_visibleRect, _inverseMat);
    }
    
    const cocos2d::Rect& CameraNode::getVisibleRect()
    {
        return _visibleRect;
    }
    
    bool CameraNode::containsNode(cocos2d::Node* node)
    {
        while (node) {
            if (std::find(_nodes.begin(), _nodes.end(), node) !=_nodes.end()) {
                return true;
            }
            node = node->getParent();
        }
        
        return false;
    }
    
    void CameraNode::addTarget(Node* target)
    {
        if (std::find(_nodes.begin(), _nodes.end(), target) !=_nodes.end()) {
            return;
        }
        
        _nodes.push_back(target);
        target->setCameraMask(1, false);
        
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
        target->setCameraMask(0, false);
        
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
        
        for (auto i = _nodes.begin(); i != _nodes.end(); i++) {
            if (*i == target) {
                _nodes.erase(i);
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
