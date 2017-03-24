/*
 * Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
 *
 * iPhone port by Simon Oliver - http://www.simonoliver.com - http://www.handcircus.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

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
        
        void setTransform(const cocos2d::Vec2& v, float zoom);
        
        void addTarget(cocos2d::Node* target);
        void removeTarget(cocos2d::Node* target);
        
    public:
        void beforeVisit();
        void afterVisit();
        
    protected:
        cocos2d::Mat4 _mat;
        static cocos2d::Mat4 _tempMat;
        std::vector<CameraCommand> _commands;
    };
    
}

#endif
