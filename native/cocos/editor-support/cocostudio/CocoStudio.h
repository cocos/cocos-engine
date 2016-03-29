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

#ifndef __EDITOR_SUPPORT_COCOSTUDIO_H__
#define __EDITOR_SUPPORT_COCOSTUDIO_H__

#include "cocostudio/CCActionFrame.h"
#include "cocostudio/CCActionFrameEasing.h"
#include "cocostudio/CCActionManagerEx.h"
#include "cocostudio/CCActionNode.h"
#include "cocostudio/CCActionObject.h"
#include "Armature/CCArmature.h"
#include "Armature/CCBone.h"
#include "Armature/CCArmatureAnimation.h"
#include "Armature/CCProcessBase.h"
#include "Armature/CCTween.h"
#include "Armature/CCDatas.h"
#include "Armature/CCBatchNode.h"
#include "Armature/CCDecorativeDisplay.h"
#include "Armature/CCDisplayFactory.h"
#include "Armature/CCDisplayManager.h"
#include "Armature/CCSkin.h"
#include "Armature/CCColliderDetector.h"
#include "Armature/CCArmatureDataManager.h"
#include "Armature/CCArmatureDefine.h"
#include "Armature/CCDataReaderHelper.h"
#include "Armature/CCTransformHelp.h"
#include "Armature/CCUtilMath.h"
#include "cocostudio/CCComBase.h"
#include "cocostudio/CCComAttribute.h"
#include "cocostudio/CCComAudio.h"
#include "cocostudio/CCComController.h"
#include "cocostudio/CCComRender.h"
#include "cocostudio/CCInputDelegate.h"
#include "cocostudio/DictionaryHelper.h"
#include "cocostudio/ActionTimeline/CCFrame.h"
#include "cocostudio/ActionTimeline/CCTimeLine.h"
#include "cocostudio/ActionTimeline/CCActionTimeline.h"
#include "cocostudio/ActionTimeline/CCActionTimelineNode.h"
#include "cocostudio/ActionTimeline/CCBoneNode.h"
#include "cocostudio/ActionTimeline/CCSkeletonNode.h"
#include "cocostudio/CocosStudioExport.h"

#include "cocostudio/CocosStudioExport.h"

namespace cocostudio
{
    void CC_STUDIO_DLL destroyCocosStudio();
}

#endif
