/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "core/data/deserializer/AssetDeserializerFactory.h"
#include "core/data/deserializer/EffectAssetDeserializer.h"
//#include "core/data/deserializer/MaterialDeserializer.h"
//#include "core/data/deserializer/MeshDeserializer.h"
//#include "core/data/deserializer/TerrainAssetDeserializer.h"
//#include "core/data/deserializer/Texture2DDeserializer.h"
//#include "core/data/deserializer/TextureBaseDeserializer.h"

namespace cc {

/*static*/
std::shared_ptr<IAssetDeserializer> AssetDeserializerFactory::createAssetDeserializer(DeserializeAssetType type) {
    std::shared_ptr<IAssetDeserializer> deserializer;
    switch (type) {
        case DeserializeAssetType::EFFECT:
            deserializer = std::make_shared<EffectAssetDeserializer>();
            break;
            //        case DeserializeAssetType::MESH:
            //            deserializer = std::make_shared<MeshDeserializer>();
            //            break;
            //        case DeserializeAssetType::MATERIAL:
            //            deserializer = std::make_shared<MaterialDeserializer>();
            //            break;
            //        case DeserializeAssetType::TEXTUREBASE:
            //            deserializer = std::make_shared<TextureBaseDeserializer>();
            //            break;
            //        case DeserializeAssetType::TEXTURE2D:
            //            deserializer = std::make_shared<Texture2DDeserializer>();
            //            break;
            //        case DeserializeAssetType::TERRAIN:
            //            deserializer = std::make_shared<TerrainAssetDeserializer>();
            //            break;
        default:
            break;
    }

    return deserializer;
}

} // namespace cc
