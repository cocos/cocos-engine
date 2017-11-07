/****************************************************************************
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

#ifndef __CREATOR_CCCAMERANODE_H__
#define __CREATOR_CCCAMERANODE_H__

#include "2d/CCNode.h"
#include "renderer/CCCustomCommand.h"


namespace creator {
    struct CameraCommand
    {
        cocos2d::Node* target;
        cocos2d::CustomCommand* beforeVisitCommand;
        cocos2d::CustomCommand* afterVisitCommand;
    };
    
    // This class implements debug drawing callbacks that are invoked
    // inside b2World::Step.
    class CC_DLL CameraNode : public cocos2d::Node
    {
    public:
        CameraNode();
        ~CameraNode();
        
        static CameraNode* getInstance();
        
        void setEnable(bool enable);
        
        void setTransform(float a, float b, float c, float d, float tx, float ty);
        
        bool containsNode(cocos2d::Node* node);
        
        void addTarget(cocos2d::Node* target);
        void removeTarget(cocos2d::Node* target);
        
        const cocos2d::Rect& getVisibleRect();
        
        int visitingIndex;
    public:
        void beforeVisit();
        void afterVisit();
        
    protected:
        cocos2d::Mat4 _mat;
        cocos2d::Mat4 _inverseMat;
        cocos2d::Rect _visibleRect;
        
        std::vector<CameraCommand> _commands;
        std::vector<cocos2d::Node*> _nodes;
    };
    
}

#endif
