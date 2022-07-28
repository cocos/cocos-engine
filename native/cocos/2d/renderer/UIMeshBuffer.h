/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include "base/TypeDef.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "base/Macros.h"

namespace cc {
struct MeshBufferLayout {
    uint32_t byteOffset;
    uint32_t vertexOffset;
    uint32_t indexOffset;
    uint32_t dirtyMark;
    uint32_t floatsPerVertex;
};

class UIMeshBuffer final {
public:
    UIMeshBuffer() = default;
    ~UIMeshBuffer();

    inline float* getVData() const { return _vData; }
    void setVData(float* vData);
    inline uint16_t* getIData() const { return _iData; }
    void setIData(uint16_t* iData);

    void initialize(gfx::Device* device, ccstd::vector<gfx::Attribute*>&& attrs, uint32_t vFloatCount, uint32_t iCount);
    void reset();
    void destroy();
    void setDirty();
    void uploadBuffers();
    void syncSharedBufferToNative(uint32_t* buffer);
    void resetIA();
    void recycleIA(gfx::InputAssembler* ia);
    void parseLayout();

    gfx::InputAssembler* requireFreeIA(gfx::Device* device);
    gfx::InputAssembler* createNewIA(gfx::Device* device);

    inline uint32_t getByteOffset() const { return _meshBufferLayout->byteOffset; }
    void setByteOffset(uint32_t byteOffset);
    inline uint32_t getVertexOffset() const { return _meshBufferLayout->vertexOffset; }
    void setVertexOffset(uint32_t vertexOffset);
    inline uint32_t getIndexOffset() const { return _meshBufferLayout->indexOffset; }
    void setIndexOffset(uint32_t indexOffset);
    inline bool getDirty() const { return _meshBufferLayout->dirtyMark != 0; }
    void setDirty(bool dirty) const;
    inline uint32_t getFloatsPerVertex() const { return _meshBufferLayout->floatsPerVertex; }
    void setFloatsPerVertex(uint32_t floatsPerVertex);
    inline bool getUseLinkData() const { return _useLinkData; }
    inline void setUseLinkData(bool val) { _useLinkData = val;}
    inline const ccstd::vector<gfx::Attribute> &getAttributes() const {
        return _attributes;
    }

protected:
    CC_DISALLOW_COPY_MOVE_ASSIGN(UIMeshBuffer);

private:
    float* _vData{nullptr};
    uint16_t* _iData{nullptr};

    MeshBufferLayout* _meshBufferLayout{nullptr};
    uint32_t* _sharedBuffer{nullptr};
    bool _dirty{false};
    uint32_t _vertexFormatBytes{0};
    uint32_t _initVDataCount{0};
    uint32_t _initIDataCount{0};
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    ccstd::vector<gfx::InputAssembler*> _iaPool{};
    gfx::InputAssemblerInfo _iaInfo;
    uint32_t _nextFreeIAHandle{0};
    bool _needDeleteVData{false};
    bool _useLinkData{false};
};
} // namespace cc
