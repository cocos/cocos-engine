/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#pragma once

#include "middleware-adapter.h"
#include "spine-creator-support/SkeletonAnimation.h"
#include "spine-creator-support/SkeletonCacheAnimation.h"
#include "spine-creator-support/SkeletonCacheMgr.h"
#include "spine-creator-support/SkeletonDataMgr.h"
#include "spine-creator-support/SkeletonRenderer.h"
#include "spine/spine.h"

namespace spine {
typedef cc::middleware::Texture2D *(*CustomTextureLoader)(const char *path);
// set custom texture loader for _spAtlasPage_createTexture
void spAtlasPage_setCustomTextureLoader(CustomTextureLoader texLoader);

class Cocos2dAtlasAttachmentLoader : public AtlasAttachmentLoader {
public:
    Cocos2dAtlasAttachmentLoader(Atlas *atlas);
    virtual ~Cocos2dAtlasAttachmentLoader();
    virtual void configureAttachment(Attachment *attachment);
};

class Cocos2dTextureLoader : public TextureLoader {
public:
    Cocos2dTextureLoader();

    virtual ~Cocos2dTextureLoader();

    virtual void load(AtlasPage &page, const String &path);

    virtual void unload(void *texture);
};

class Cocos2dExtension : public DefaultSpineExtension {
public:
    Cocos2dExtension();

    virtual ~Cocos2dExtension();

    virtual void _free(void *mem, const char *file, int line);

protected:
    virtual char *_readFile(const String &path, int *length);
};

typedef void (*SpineObjectDisposeCallback)(void *);
void setSpineObjectDisposeCallback(SpineObjectDisposeCallback callback);
} // namespace spine
