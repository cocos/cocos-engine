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

#pragma once

#include "../Macro.h"
#include "../gfx/VertexBuffer.h"
#include "../gfx/IndexBuffer.h"
#include "base/CCVector.h"
#include "./InputAssembler.h"
#include "scripting/js-bindings/jswrapper/Object.hpp"
#include "../scene/MeshBuffer.hpp"
#include "../scene/assembler/RenderData.hpp"
#include "../Types.h"

RENDERER_BEGIN
class Mesh {
public:
    struct MeshData
    {
        VertexBuffer* vb = nullptr;
        IndexBuffer* ib = nullptr;
        RenderData* data = nullptr;
        bool vdirty = false;
        bool idirty = false;
    };
    
    Mesh ();
    ~Mesh ();
    
    void updateMeshData(std::size_t index, VertexFormat* vfm, se_object_ptr vertices, se_object_ptr indices);
    void setVertexData (std::size_t index, VertexFormat* vfm, se_object_ptr vertices);
    void setIndiceData (std::size_t index, se_object_ptr indices);
    MeshData* getMeshData(std::size_t index);
    
    void uploadData();
    void clear();
    
    size_t getMeshCount() const { return _datas.size(); };
    
private:
    std::vector<MeshData> _datas;
};

RENDERER_END
